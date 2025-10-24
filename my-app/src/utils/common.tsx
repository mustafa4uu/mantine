import { fetchMasterData } from '../api/api';

export const fetchBranches = () => fetchMasterData('/api/v1/masters/branches');

export const fetchCountries = () => fetchMasterData('/api/v1/masters/countries');

export const fetchAddressTypes = () => fetchMasterData('/api/v1/masters/addresstypes');



export const fetchCustomerNames = async (searchTerm: string) => {
  const res = await fetch(
    `https://cclm-poc.fermion.in/api/v1/customers/customer-name?name=${encodeURIComponent(searchTerm)}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch customer names: ${res.statusText}`);
  }
  const result = await res.json();
  if (result.status !== "OK" || !Array.isArray(result.data)) {
    throw new Error('Invalid response from customer names API');
  }
  return result.data;
};