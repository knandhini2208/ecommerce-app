const API_BASE = 'https://ecommerce-backend-4lf3.onrender.com/api';
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  register: (data) => fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleResponse),
  login: (data) => fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(handleResponse),
  getProfile: () => fetch(`${API_BASE}/auth/profile`, { headers: getAuthHeader() }).then(handleResponse),
  getProducts: (params) => fetch(`${API_BASE}/products${params || ''}`).then(handleResponse),
  getProduct: (id) => fetch(`${API_BASE}/products/${id}`).then(handleResponse),
  createProduct: (data) => fetch(`${API_BASE}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(data) }).then(handleResponse),
  updateProduct: (id, data) => fetch(`${API_BASE}/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(data) }).then(handleResponse),
  deleteProduct: (id) => fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: getAuthHeader() }).then(handleResponse),
  createOrder: (data) => fetch(`${API_BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify(data) }).then(handleResponse),
  getMyOrders: () => fetch(`${API_BASE}/orders/my`, { headers: getAuthHeader() }).then(handleResponse),
  getAllOrders: () => fetch(`${API_BASE}/orders/all`, { headers: getAuthHeader() }).then(handleResponse),
  updateOrderStatus: (id, status) => fetch(`${API_BASE}/orders/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ status }) }).then(handleResponse),
};
