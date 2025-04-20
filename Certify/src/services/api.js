import axios from "axios";

export const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json'}
})

export const getUsers = () => api.get('/users')
export const getUserById = (id) => api.get(`/users/${id}`)
//export const updateUser = (id, userData) => api.put(`/users/${id}`, userData)

export const updateUser = async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response;
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      throw error;
    }
  };
export const createUser = (userData) => api.post('/users', userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const uploadUserPhoto = (id, formData) =>
    api.post(`/users/${id}/upload-photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

export const getProducts = () => api.get('/products')
export const getProductsById = (id) => api.get(`/products/${id}`)
export const getOrders = () => api.get('/orders')
export const getCarts = (userId) => api.get(`/carts?userId=${userId}`)
export const getFavorites = (userId) => api.get(`/favorites?userId=${userId}`)
export const updateCart = (id, cartData) => api.patch(`/carts/${id}`, cartData);
export const getReviews = () => api.get('/reviews')
export const createReview = (reviewData) => api.post('/reviews', reviewData)


