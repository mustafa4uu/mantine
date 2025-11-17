// API configuration
const BASE_URL = "https://cclm-poc.fermion.in";

// Helper function to handle responses
const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to handle errors
const handleError = (error: any, context: string): never => {
  console.error(`Error ${context}:`, error);
  throw error;
};

export const fetchPaginatedData = async (
  endpoint: string, 
  searchTerm: string, 
  offset: number, 
  pageSize: number
): Promise<any[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}${endpoint}?search=${encodeURIComponent(searchTerm)}&offset=${offset}&limit=${pageSize}`
    );
    const data = await handleResponse(response);
    return data || [];
  } catch (error) {
    console.error("Error fetching paginated data:", error);
    return [];
  }
};

export const fetchFormData = async (endpoint: string): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await handleResponse(response);
    return data?.data?.data || data?.data || data || [];
  } catch (error) {
    console.error("Error fetching form data:", error);
    return [];
  }
};

export const createNewRecord = async (endpoint: string, data: any): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await handleResponse(response);
    return responseData?.data ?? responseData ?? null;
  } catch (error: any) {
    console.error('Error creating record:', error?.message || error);
    throw error;
  }
};

export const updateFormRecord = async (endpoint: string, data: any): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await handleResponse(response);
    return responseData?.data?.data || responseData?.data || responseData || null;
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
};

export const fetchMasterData = async (endpoint: string): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    const data = await handleResponse(response);
    return data?.data?.data || data?.data || data || [];
  } catch (error) {
    console.error("Error fetching master data:", error);
    return [];
  }
};

export const fetchAutoData = async (endpoint: string, searchTerm: string): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}${encodeURIComponent(searchTerm)}`);
    const data = await handleResponse(response);
    return data || [];
  } catch (error) {
    console.error("Error fetching auto data:", error);
    return [];
  }
};