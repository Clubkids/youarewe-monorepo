import axios from 'axios';

export const strapiClient = {
  async get(path: string, config?: any) {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${path}`, config);
    return response.data;
  },
  
  async post(path: string, data?: any, config?: any) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${path}`, data, config);
    return response.data;
  },
  
  async put(path: string, data?: any, config?: any) {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${path}`, data, config);
    return response.data;
  },
  
  async delete(path: string, config?: any) {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${path}`, config);
    return response.data;
  }
};
