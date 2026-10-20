
"""AWS Lambda HTTP API inventory handler.

Supports:
- CORS preflight requests
- Product management
- Sales and restocking
- Transaction history
- Inventory summary
"""

import json
import os
import uuid
from datetime import datetime, timezone
from decimal import Decimal

import boto3
from botocore.exceptions import ClientError


ALLOWED_ORIGIN = "https://d3o4qscaqsb1x3.cloudfront.net"


def response(status, payload):
    return {
        "statusCode": status,
        "headers": {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
            "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "authorization,content-type",
        },
        "body": json.dumps(
            payload,
            default=lambda x: int(x) if isinstance(x, Decimal) else str(x),
        ),
    }


def cors_response():
    """Handle browser preflight requests."""
    return {
        "statusCode": 204,
        "headers": {
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
            "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "authorization,content-type",
            "Access-Control-Max-Age": "300",
        },
        "body": "",
    }


def integer(value, name, minimum=0):
    if isinstance(value, bool) or not isinstance(value, int) or value < minimum:
        raise ValueError(f"{name} must be an integer >= {minimum}")
    return value


def required_string(value, name, limit=120):
    if (
        not isinstance(value, str)
        or not value.strip()
        or len(value.strip()) > limit
    ):
        raise ValueError(
            f"{name} must be nonempty and at most {limit} characters"
        )
    return value.strip()


def handler(event, context):
    try:
        # 1. Read HTTP method and path
        http = event.get("requestContext", {}).get("http", {})
        method = http.get("method", "")
        path = event.get("rawPath", "/").rstrip("/") or "/"

        # 2. Handle OPTIONS before database operations
        if method == "OPTIONS":
            return cors_response()

        # 3. Normalize stage prefix if present
        stage = event.get("requestContext", {}).get("stage", "")

        if stage and stage != "$default":
            prefix = "/" + stage

            if path == prefix:
                path = "/"
            elif path.startswith(prefix + "/"):
                path = path[len(prefix):]

        # 4. Parse JSON request body
        body = json.loads(event.get("body") or "{}")

        if not isinstance(body, dict):
            raise ValueError("JSON body must be an object")

        # 5. Connect to DynamoDB
        db = boto3.resource("dynamodb")
        client = boto3.client("dynamodb")

        products = db.Table(os.environ["PRODUCTS_TABLE"])
        txns = db.Table(os.environ["TRANSACTIONS_TABLE"])

        # Health check
        if method == "GET" and path == "/health":
            return response(200, {"status": "ok"})

        # List products
        if method == "GET" and path == "/products":
            items = scan_all(products)
            return response(200, {"items": items})

        # Add product
        if method == "POST" and path == "/products":
            name = required_string(body.get("name"), "name")
            sku = required_string(body.get("sku"), "sku", 60)
            price = integer(body.get("priceCents"), "priceCents")
            quantity = integer(body.get("quantity", 0), "quantity")
            threshold = integer(
                body.get("lowStockThreshold", 5),
                "lowStockThreshold",
            )

            product_id = str(uuid.uuid4())

            item = {
                "productId": product_id,
                "name": name,
                "sku": sku,
                "priceCents": price,
                "quantity": quantity,
                "lowStockThreshold": threshold,
            }

            products.put_item(
                Item=item,
                ConditionExpression="attribute_not_exists(productId)",
            )

            return response(201, item)

        # Edit or delete product
        if path.startswith("/products/"):
            product_id = required_string(
                path.split("/")[-1],
                "productId",
            )

            if method == "PUT":
                name = required_string(body.get("name"), "name")
                sku = required_string(body.get("sku"), "sku", 60)
                price = integer(body.get("priceCents"), "priceCents")
                threshold = integer(
                    body.get("lowStockThreshold"),
                    "lowStockThreshold",
                )

                result = products.update_item(
                    Key={"productId": product_id},
                    UpdateExpression=(
                        "SET #n=:n, sku=:s, "
                        "priceCents=:p, lowStockThreshold=:t"
                    ),
                    ConditionExpression="attribute_exists(productId)",
                    ExpressionAttributeNames={"#n": "name"},
                    ExpressionAttributeValues={
                        ":n": name,
                        ":s": sku,
                        ":p": price,
                        ":t": threshold,
                    },
                    ReturnValues="ALL_NEW",
                )

                return response(200, result["Attributes"])

            if method == "DELETE":
                products.delete_item(
                    Key={"productId": product_id},
                    ConditionExpression=(
                        "attribute_exists(productId) "
                        "AND quantity = :zero"
                    ),
                    ExpressionAttributeValues={":zero": 0},
                )

                return response(200, {"deleted": True})

        # Sales and restocking
        if method == "POST" and path in ("/sales", "/restock"):
            product_id = required_string(
                body.get("productId"),
                "productId",
            )

            qty = integer(
                body.get("quantity"),
                "quantity",
                1,
            )

            transaction_id = required_string(
                body.get("transactionId"),
                "transactionId",
                100,
            )

            kind = "SALE" if path == "/sales" else "RESTOCK"

            product = products.get_item(
                Key={"productId": product_id},
                ConsistentRead=True,
            ).get("Item")

            if not product:
                return response(404, {"error": "Product not found"})

            txn = {
                "transactionId": {"S": transaction_id},
                "productId": {"S": product_id},
                "quantity": {"N": str(qty)},
                "type": {"S": kind},
                "unitPriceCents": {
                    "N": str(product["priceCents"])
                },
                "createdAt": {
                    "S": datetime.now(timezone.utc).isoformat()
                },
            }

            if kind == "SALE":
                expr = "SET quantity = quantity - :q"
                cond = (
                    "attribute_exists(productId) "
                    "AND quantity >= :q"
                )
            else:
                expr = "SET quantity = quantity + :q"
                cond = "attribute_exists(productId)"

            client.transact_write_items(
                TransactItems=[
                    {
                        "Update": {
                            "TableName": os.environ["PRODUCTS_TABLE"],
                            "Key": {
                                "productId": {"S": product_id}
                            },
                            "UpdateExpression": expr,
                            "ConditionExpression": cond,
                            "ExpressionAttributeValues": {
                                ":q": {"N": str(qty)}
                            },
                        }
                    },
                    {
                        "Put": {
                            "TableName": os.environ["TRANSACTIONS_TABLE"],
                            "Item": txn,
                            "ConditionExpression": (
                                "attribute_not_exists(transactionId)"
                            ),
                        }
                    },
                ]
            )

            return response(
                201,
                {
                    "transactionId": transaction_id,
                    "type": kind,
                },
            )

        # Transaction history
        if method == "GET" and path == "/transactions":
            items = scan_all(txns)

            items.sort(
                key=lambda t: t.get("createdAt", ""),
                reverse=True,
            )

            return response(200, {"items": items})

        # Inventory summary
        if method == "GET" and path == "/summary":
            p = scan_all(products)
            t = scan_all(txns)

            sales = [
                x for x in t
                if x["type"] == "SALE"
            ]

            return response(
                200,
                {
                    "products": len(p),
                    "unitsInStock": sum(
                        int(x["quantity"]) for x in p
                    ),
                    "lowStockProducts": sum(
                        int(x["quantity"])
                        <= int(x["lowStockThreshold"])
                        for x in p
                    ),
                    "salesCount": len(sales),
                    "revenueCents": sum(
                        int(x["quantity"])
                        * int(x["unitPriceCents"])
                        for x in sales
                    ),
                },
            )

        return response(404, {"error": "Route not found"})

    except (ValueError, json.JSONDecodeError) as exc:
        return response(400, {"error": str(exc)})

    except ClientError as exc:
        code = exc.response.get("Error", {}).get("Code", "")

        if code in (
            "ConditionalCheckFailedException",
            "TransactionCanceledException",
        ):
            return response(
                409,
                {
                    "error": (
                        "Conflict: stock unavailable, "
                        "product not editable/deletable, "
                        "or duplicate transaction ID"
                    )
                },
            )

        print("AWS error:", code)
        return response(500, {"error": "Database error"})

    except Exception as exc:
        print("Unhandled error:", type(exc).__name__)
        return response(
            500,
            {"error": "Internal server error"},
        )


def scan_all(table):
    items = []
    params = {}

    while True:
        result = table.scan(**params)
        items.extend(result.get("Items", []))

        if "LastEvaluatedKey" not in result:
            return items

        params["ExclusiveStartKey"] = result["LastEvaluatedKey"]
