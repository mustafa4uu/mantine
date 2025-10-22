import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

// Axios instance
const api: AxiosInstance = axios.create({
  baseURL: "https://cclm-poc.fermion.in",
});

export const fetchPaginatedData = async (endpoint: string, searchTerm: string, offset: number, pageSize:number): Promise<any[]> => {
  try {
    const res: AxiosResponse<any> = await api.get(
      `${endpoint}?search=${searchTerm}&offset=${offset}&limit=${pageSize}`
    );
    return res.status === 200 ?  res.data || [] : [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchFormData = async (endpoint: string): Promise<any[]> => {
  try {
    const res: AxiosResponse<any> = await api.get(
      `${endpoint}`
    );
    return res.status === 200 ? res.data?.data?.data || res.data?.data || res.data || [] : [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};


export const createNewRecord = async (endpoint: string, data: any): Promise<any> => {
  try {
    const res = await api.post(endpoint, data);

    return res.data?.data ?? res.data ?? null;
  } catch (error: any) {
    console.error('Error creating record:', error?.response?.data || error.message || error);
    throw error;
  }
};

export const updateFormRecord = async (endpoint: string, data: any): Promise<any> => {
  try {
    const res: AxiosResponse<any> = await api.put(
      `${endpoint}`,
      data
    );
    return res.status === 200 ? res.data?.data?.data || res.data?.data || res.data || null : null;
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
};

export const fetchMasterData = async (endpoint: string): Promise<any[]> => {
  try {
    const res: AxiosResponse<any> = await api.get(
      `${endpoint}`
    );
    return res.status === 200 ? res.data?.data?.data || res.data?.data || res.data || [] : [];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};