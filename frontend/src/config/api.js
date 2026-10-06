const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API_URLS = {
  menus: `${API_BASE_URL}/api/menus`,
  menu: (id) => `${API_BASE_URL}/api/menus/${id}`,
  shops: `${API_BASE_URL}/api/shops`,
};