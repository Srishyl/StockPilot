import './style.css';
import { Amplify } from 'aws-amplify';
import { signIn, signOut, getCurrentUser, fetchAuthSession, confirmSignIn } from 'aws-amplify/auth';

Amplify.configure({ Auth: { Cognito: { userPoolId: import.meta.env.VITE_USER_POOL_ID, userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID } } });
const app = document.querySelector('#app');
const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const money = cents => (Number(cents || 0) / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icons = {
  dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  products: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
  transactions: '<path d="M7 7h14l-4-4m4 4-4 4M17 17H3l4-4m-4 4 4 4"/>',
  alert: '<path d="m10.3 3.9-8.1 14A2 2 0 0 0 3.9 21h16.2a2 2 0 0 0 1.7-3.1l-8.1-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 3v12m-4-4 4 4 4-4M5 17v3h14v-3"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5m5 5H9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8m-6 0h6v6"/>',
  chart: '<path d="M4 20V10m6 10V4m6 16v-7m4 7V8"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 12-2L20 12M4 12l2.4 5a7 7 0 0 0 12-2"/>'
};
const icon = (name, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ''}</svg>`;
let products = [], transactions = [], summary = {}, page = 'dashboard', search = '', stockFilter = 'all', currentEmail = 'Staff', busy = false;

async function api(path, method = 'GET', data) {
  const session = await fetchAuthSession();
  // Cognito JWT authorizers commonly accept the access token; ensure API audience/scopes match your setup.
  const token = session.tokens?.accessToken?.toString();
  if (!token) throw Error('Your session expired. Please sign in again.');
  const response = await fetch(apiBase + path, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: data === undefined ? undefined : JSON.stringify(data) });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw Error(json.error || json.message || `Request failed (${response.status})`);
  return json;
}
function notice(message, type = 'error') {
  const target = document.querySelector('#notice');
  if (!target) return;
  target.className = `notice ${type}`;
  target.textContent = message;
  target.hidden = !message;
}
function loginScreen() {
  app.innerHTML = `<div class="auth-layout"><div class="auth-hero"><div class="brand auth-brand"><span class="brand-icon">${icon('products', 24)}</span><span>StockPilot<span class="brand-dot">.</span></span></div><div class="auth-message"><span class="eyebrow light">SMART INVENTORY WORKSPACE</span><h1>Everything in stock.<br/><span>Everything in control.</span></h1><p>Manage products, track sales, and keep your stationery business running smoothly from one secure dashboard.</p><div class="auth-features"><span>${icon('check', 16)} Live stock overview</span><span>${icon('check', 16)} Secure cloud access</span><span>${icon('check', 16)} Simple reporting</span></div></div><div class="auth-footer">Powered by AWS Cloud</div></div><div class="auth-form-wrap"><form class="auth-card" id="login"><div class="mobile-brand brand"><span class="brand-icon">${icon('products', 22)}</span> StockPilot.</div><span class="eyebrow">WELCOME BACK</span><h2>Sign in to your workspace</h2><p>Enter your staff credentials to continue.</p><label>Email address<input id="email" type="email" placeholder="you@company.com" autocomplete="username" required/></label><label>Password<input id="password" type="password" placeholder="Enter your password" autocomplete="current-password" required/></label><button class="btn primary full" id="loginButton" type="submit">Sign in to dashboard <span>→</span></button><div id="notice" class="notice" hidden role="alert"></div><small>Protected with Amazon Cognito authentication</small></form></div></div>`;
  document.querySelector('#login').onsubmit = async e => {
    e.preventDefault(); const button = document.querySelector('#loginButton'); button.disabled = true; button.textContent = 'Signing in…';
    try {
      const result = await signIn({ username: document.querySelector('#email').value, password: document.querySelector('#password').value });
      if (result.isSignedIn) return startDashboard();
      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        const password = prompt('Create a new password (minimum 8 characters, upper/lowercase and number):');
        if (!password) throw Error('Password setup cancelled');
        const confirmed = await confirmSignIn({ challengeResponse: password });
        if (confirmed.isSignedIn) return startDashboard();
      }
      throw Error('Additional sign-in step required. Check your Cognito user settings.');
    } catch (error) { notice(error.message); button.disabled = false; button.textContent = 'Sign in to dashboard →'; }
  };
}
const navItem = (id, name, symbol) => `<button class="nav-item ${page === id ? 'active' : ''}" data-page="${id}">${icon(symbol, 19)}<span>${name}</span>${id === 'alerts' && products.filter(p => Number(p.quantity) <= Number(p.lowStockThreshold)).length ? `<b class="nav-count">${products.filter(p => Number(p.quantity) <= Number(p.lowStockThreshold)).length}</b>` : ''}</button>`;
function shell() {
  app.innerHTML = `<div class="workspace"><aside class="sidebar" id="sidebar"><div class="brand"><span class="brand-icon">${icon('products', 23)}</span><span>StockPilot<span class="brand-dot">.</span></span></div><div class="workspace-tag">WORKSPACE</div><nav aria-label="Main navigation">${navItem('dashboard', 'Overview', 'dashboard')}${navItem('products', 'Products', 'products')}${navItem('transactions', 'Transactions', 'transactions')}${navItem('alerts', 'Low stock alerts', 'alert')}</nav><div class="sidebar-bottom"><div class="cloud-status"><span class="status-dot"></span><div><strong>Cloud connected</strong><small>AWS Inventory System</small></div></div><button class="nav-item signout" id="logout">${icon('logout', 19)}<span>Sign out</span></button></div></aside><div class="sidebar-backdrop" id="backdrop"></div><div class="content-shell"><header class="topbar"><div class="topbar-left"><button class="icon-button mobile-menu" id="menu" aria-label="Open menu">${icon('menu')}</button><span class="breadcrumb">Workspace <span>/</span> <strong id="breadcrumb">Overview</strong></span></div><div class="topbar-right"><span class="live-badge"><i></i> Live dashboard</span><span class="user-avatar">${esc(currentEmail.charAt(0).toUpperCase())}</span><span class="user-label">${esc(currentEmail)}</span></div></header><main class="main"><div id="notice" class="notice" hidden role="alert"></div><div id="pageContent"></div></main></div></div>`;
  document.querySelectorAll('[data-page]').forEach(el => el.onclick = () => { page = el.dataset.page; search = ''; stockFilter = 'all'; render(); document.querySelector('#sidebar').classList.remove('open'); document.querySelector('#backdrop').classList.remove('show'); });
  document.querySelector('#logout').onclick = async () => { try { await signOut(); } finally { loginScreen(); } };
  document.querySelector('#menu').onclick = () => { document.querySelector('#sidebar').classList.add('open'); document.querySelector('#backdrop').classList.add('show'); };
  document.querySelector('#backdrop').onclick = () => { document.querySelector('#sidebar').classList.remove('open'); document.querySelector('#backdrop').classList.remove('show'); };
}
const metric = (label, value, symbol, foot, color = 'blue') => `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon ${color}">${icon(symbol, 21)}</span></div><strong>${value}</strong><small>${foot}</small></article>`;
const low = p => Number(p.quantity) <= Number(p.lowStockThreshold);
function header(title, description, actions = '') { return `<div class="page-heading"><div><span class="eyebrow">INVENTORY WORKSPACE</span><h1>${title}</h1><p>${description}</p></div><div class="heading-actions">${actions}</div></div>`; }
function tableProducts(items) {
  if (!items.length) return `<div class="empty">${icon('products', 34)}<h3>No products found</h3><p>Add a product or adjust your search to see results.</p></div>`;
  return `<div class="table-scroll"><table><thead><tr><th>PRODUCT</th><th>SKU</th><th>UNIT PRICE</th><th>STOCK</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>${items.map(p => `<tr><td><div class="product-cell"><span class="product-icon">${icon('products', 18)}</span><div><strong>${esc(p.name)}</strong><small>Threshold: ${Number(p.lowStockThreshold)}</small></div></div></td><td class="mono">${esc(p.sku)}</td><td>${money(p.priceCents)}</td><td><strong>${Number(p.quantity)}</strong> units</td><td><span class="pill ${low(p) ? 'danger' : 'success'}"><i></i>${low(p) ? 'Low stock' : 'In stock'}</span></td><td><button class="action-btn" data-edit="${esc(p.productId)}">${icon('edit', 15)} Edit</button></td></tr>`).join('')}</tbody></table></div>`;
}
function tableTransactions(items) {
  if (!items.length) return `<div class="empty">${icon('transactions', 34)}<h3>No transactions yet</h3><p>Sales and restocks will appear here.</p></div>`;
  return `<div class="table-scroll"><table><thead><tr><th>TYPE</th><th>PRODUCT</th><th>QUANTITY</th><th>DATE</th></tr></thead><tbody>${items.map(t => { const p = products.find(p => p.productId === t.productId); const sale = t.type === 'SALE'; return `<tr><td><span class="pill ${sale ? 'neutral' : 'success'}">${sale ? 'Sale' : 'Restock'}</span></td><td><strong>${esc(p?.name || 'Product')}</strong><small class="block mono">${esc(String(t.productId || '').slice(0, 8))}…</small></td><td class="${sale ? 'negative' : 'positive'}">${sale ? '−' : '+'}${Number(t.quantity)}</td><td>${esc(t.createdAt ? new Date(t.createdAt).toLocaleString('en-IN') : '—')}</td></tr>`; }).join('')}</tbody></table></div>`;
}
function addProductForm() { return `<form id="addProduct" class="form-grid"><label>Product name<input name="name" placeholder="e.g. A4 Notebook" maxlength="120" required/></label><label>SKU / Product code<input name="sku" placeholder="e.g. NOTE-001" maxlength="60" required/></label><label>Unit price (₹)<input name="price" type="number" min="0" step="0.01" placeholder="0.00" required/></label><label>Initial stock<input name="quantity" type="number" min="0" step="1" value="0" required/></label><label>Low-stock alert at<input name="threshold" type="number" min="0" step="1" value="5" required/></label><div class="form-action"><button class="btn primary" type="submit">${icon('plus', 17)} Add product</button></div></form>`; }
function transactionForm() { return `<form id="addTransaction" class="form-grid"><label>Choose product<select name="productId" required ${products.length ? '' : 'disabled'}>${products.length ? products.map(p => `<option value="${esc(p.productId)}">${esc(p.name)} (${Number(p.quantity)} available)</option>`).join('') : '<option value="">No products available</option>'}</select></label><label>Transaction type<select name="kind"><option value="sales">Sale / Stock out</option><option value="restock">Restock / Stock in</option></select></label><label>Quantity<input name="quantity" type="number" min="1" step="1" value="1" required/></label><div class="form-action"><button class="btn primary" type="submit" ${products.length ? '' : 'disabled'}>Save transaction →</button></div></form>`; }
function dashboardView() {
  const lowCount = products.filter(low).length;
  return `${header('Overview', 'A real-time snapshot of your inventory performance.', `<button class="btn secondary" id="refresh">${icon('refresh', 17)} Refresh</button><button class="btn primary" data-go="products">${icon('plus', 17)} Manage products</button>`)}<div class="metrics">${metric('Total products', Number(summary.products ?? products.length).toLocaleString('en-IN'), 'products', 'Items in your catalog')}${metric('Units in stock', Number(summary.unitsInStock ?? 0).toLocaleString('en-IN'), 'chart', 'Across all products', 'purple')}${metric('Low stock items', Number(summary.lowStockProducts ?? lowCount).toLocaleString('en-IN'), 'alert', 'Need your attention', 'orange')}${metric('Total sales revenue', money(summary.revenueCents), 'trend', `${Number(summary.salesCount ?? 0)} sales recorded`, 'green')}</div><div class="section-grid"><section class="panel"><div class="panel-heading"><div><h2>Quick add product</h2><p>Create a new item in your catalog</p></div><span class="panel-icon">${icon('plus', 19)}</span></div>${addProductForm()}</section><section class="panel"><div class="panel-heading"><div><h2>Record stock movement</h2><p>Track sales and incoming stock</p></div><span class="panel-icon">${icon('transactions', 19)}</span></div>${transactionForm()}<div class="tip">${icon('alert', 17)} Stock quantities are validated by the backend to prevent overselling.</div></section></div><section class="panel full-panel"><div class="panel-heading"><div><h2>Recent products</h2><p>Your latest inventory items</p></div><button class="text-link" data-go="products">View all →</button></div>${tableProducts(products.slice(0, 6))}</section><section class="panel full-panel"><div class="panel-heading"><div><h2>Recent transactions</h2><p>Latest sales and restocks</p></div><button class="text-link" data-go="transactions">View all →</button></div>${tableTransactions(transactions.slice(0, 5))}</section>`;
}
function productsView(onlyLow = false) {
  const filtered = products.filter(p => (!onlyLow || low(p)) && (stockFilter !== 'low' || low(p)) && (`${p.name} ${p.sku}`).toLowerCase().includes(search.toLowerCase()));
  return `${header(onlyLow ? 'Low stock alerts' : 'Product inventory', onlyLow ? 'Items at or below their reorder threshold.' : 'Browse, search, and update your product catalog.', `<button class="btn secondary" id="export">${icon('download', 17)} Export CSV</button>`)}<section class="panel full-panel"><div class="panel-heading"><div><h2>${onlyLow ? 'Products needing attention' : 'All products'} <span class="count-tag">${filtered.length}</span></h2><p>${onlyLow ? 'Consider restocking these items soon.' : 'Manage prices, SKUs, and stock thresholds.'}</p></div></div><div class="toolbar"><div class="search-field">${icon('search', 18)}<input id="search" value="${esc(search)}" placeholder="Search by product name or SKU…" aria-label="Search products"/></div>${onlyLow ? '' : `<select id="stockFilter" aria-label="Filter by stock"><option value="all" ${stockFilter === 'all' ? 'selected' : ''}>All stock levels</option><option value="low" ${stockFilter === 'low' ? 'selected' : ''}>Low stock only</option></select>`}</div><div id="productTable">${tableProducts(filtered)}</div></section><section class="panel full-panel narrow-panel"><div class="panel-heading"><div><h2>Add a new product</h2><p>New items are saved directly to DynamoDB</p></div></div>${addProductForm()}</section>`;
}
function transactionsView() { return `${header('Transactions', 'A complete record of inventory movement.')}<section class="panel full-panel"><div class="panel-heading"><div><h2>Record transaction</h2><p>Add a sale or restock to your history</p></div></div>${transactionForm()}</section><section class="panel full-panel"><div class="panel-heading"><div><h2>Transaction history <span class="count-tag">${transactions.length}</span></h2><p>Most recent transactions appear first.</p></div></div>${tableTransactions(transactions)}</section>`; }
function render() {
  shell();
  document.querySelector('#breadcrumb').textContent = ({ dashboard: 'Overview', products: 'Products', transactions: 'Transactions', alerts: 'Low stock alerts' })[page];
  document.querySelector('#pageContent').innerHTML = page === 'dashboard' ? dashboardView() : page === 'products' ? productsView() : page === 'alerts' ? productsView(true) : transactionsView();
  document.querySelectorAll('[data-go]').forEach(el => el.onclick = () => { page = el.dataset.go; render(); });
  document.querySelectorAll('[data-edit]').forEach(el => el.onclick = () => editProduct(el.dataset.edit));
  document.querySelector('#addProduct')?.addEventListener('submit', addProduct);
  document.querySelector('#addTransaction')?.addEventListener('submit', addTransaction);
  document.querySelector('#refresh')?.addEventListener('click', refresh);
  document.querySelector('#export')?.addEventListener('click', exportCsv);
  document.querySelector('#search')?.addEventListener('input', e => { search = e.target.value; const focused = e.target; const cursor = focused.selectionStart; document.querySelector('#productTable').innerHTML = tableProducts(products.filter(p => (page !== 'alerts' || low(p)) && (stockFilter !== 'low' || low(p)) && `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase()))); document.querySelectorAll('[data-edit]').forEach(el => el.onclick = () => editProduct(el.dataset.edit)); focused.setSelectionRange(cursor, cursor); });
  document.querySelector('#stockFilter')?.addEventListener('change', e => { stockFilter = e.target.value; render(); document.querySelector('#search')?.focus(); });
}
async function refresh() {
  try {
    notice('');
    const [p, s, t] = await Promise.all([api('/products'), api('/summary'), api('/transactions')]);
    products = Array.isArray(p.items) ? p.items : [];
    summary = s || {};
    transactions = Array.isArray(t.items) ? t.items : [];
    transactions.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    render();
  } catch (error) { notice(error.message); }
}
async function addProduct(e) {
  e.preventDefault(); if (busy) return; busy = true;
  const button = e.target.querySelector('[type="submit"]'); button.disabled = true;
  const f = new FormData(e.target);
  try {
    await api('/products', 'POST', { name: f.get('name'), sku: f.get('sku'), priceCents: Math.round(Number(f.get('price')) * 100), quantity: Number(f.get('quantity')), lowStockThreshold: Number(f.get('threshold')) });
    await refresh(); notice('Product added successfully.', 'success');
  } catch (error) { notice(error.message); button.disabled = false; } finally { busy = false; }
}
async function addTransaction(e) {
  e.preventDefault(); if (busy) return; busy = true;
  const button = e.target.querySelector('[type="submit"]'); button.disabled = true;
  const f = new FormData(e.target);
  try {
    await api('/' + f.get('kind'), 'POST', { productId: f.get('productId'), quantity: Number(f.get('quantity')), transactionId: crypto.randomUUID() });
    await refresh(); notice('Transaction saved successfully.', 'success');
  } catch (error) { notice(error.message); button.disabled = false; } finally { busy = false; }
}
async function editProduct(id) {
  const product = products.find(p => p.productId === id); if (!product) return;
  const name = prompt('Product name', product.name); if (name === null) return;
  const sku = prompt('SKU', product.sku); if (sku === null) return;
  const price = prompt('Unit price in ₹', (Number(product.priceCents) / 100).toFixed(2)); if (price === null) return;
  const threshold = prompt('Low stock threshold', product.lowStockThreshold); if (threshold === null) return;
  const amount = Number(price), level = Number(threshold);
  if (!name.trim() || !sku.trim() || !Number.isFinite(amount) || amount < 0 || !Number.isInteger(level) || level < 0) { notice('Enter valid product details.'); return; }
  try { await api('/products/' + encodeURIComponent(id), 'PUT', { name: name.trim(), sku: sku.trim(), priceCents: Math.round(amount * 100), lowStockThreshold: level }); await refresh(); notice('Product updated successfully.', 'success'); } catch (error) { notice(error.message); }
}
function exportCsv() {
  const rows = [['Name', 'SKU', 'Price INR', 'Quantity', 'Threshold'], ...products.map(p => [p.name, p.sku, (Number(p.priceCents) / 100).toFixed(2), p.quantity, p.lowStockThreshold])];
  const csv = rows.map(row => row.map(v => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(',')).join('\r\n');
  const link = document.createElement('a'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); link.href = url; link.download = 'inventory-products.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function startDashboard() {
  try { const user = await getCurrentUser(); currentEmail = user.signInDetails?.loginId || user.username || 'Staff'; } catch { currentEmail = 'Staff'; }
  render(); await refresh();
}
getCurrentUser().then(startDashboard).catch(loginScreen);
