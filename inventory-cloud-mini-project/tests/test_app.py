import os
import unittest
from unittest.mock import patch, MagicMock
os.environ['PRODUCTS_TABLE'] = 'ProductsTest'
os.environ['TRANSACTIONS_TABLE'] = 'TransactionsTest'
from backend.app import integer, required_string, handler

class InventoryTests(unittest.TestCase):
    def test_invalid_quantities(self):
        for value in (-1, 1.5, True, '2'):
            with self.assertRaises(ValueError): integer(value, 'quantity')
    def test_required_name(self):
        with self.assertRaises(ValueError): required_string('  ', 'name')
    @patch('backend.app.boto3')
    def test_health(self, boto):
        out=handler({'requestContext':{'http':{'method':'GET'}},'rawPath':'/health'},None)
        self.assertEqual(out['statusCode'],200)
    @patch('backend.app.boto3')
    def test_add_product(self, boto):
        table=MagicMock();boto.resource.return_value.Table.return_value=table
        out=handler({'requestContext':{'http':{'method':'POST'}},'rawPath':'/products',
           'body':'{"name":"Notebook","sku":"NB01","priceCents":4500,"quantity":10}'},None)
        self.assertEqual(out['statusCode'],201)
        table.put_item.assert_called_once()
    @patch('backend.app.boto3')
    def test_sale_uses_atomic_transaction(self,boto):
        table=MagicMock();table.get_item.return_value={'Item':{'priceCents':1000}}
        boto.resource.return_value.Table.return_value=table
        out=handler({'requestContext':{'http':{'method':'POST'}},'rawPath':'/sales',
           'body':'{"productId":"p1","quantity":2,"transactionId":"t1"}'},None)
        self.assertEqual(out['statusCode'],201)
        ops=boto.client.return_value.transact_write_items.call_args.kwargs['TransactItems']
        self.assertEqual(len(ops),2)
        self.assertIn('quantity >= :q',ops[0]['Update']['ConditionExpression'])
        self.assertIn('attribute_not_exists',ops[1]['Put']['ConditionExpression'])
if __name__=='__main__': unittest.main()
