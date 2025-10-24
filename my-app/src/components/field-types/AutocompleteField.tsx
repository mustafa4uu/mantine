import React, { useState, useEffect, useCallback } from 'react';
import { Select, Loader } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAutoData } from '../../api/api'; // Adjust path as needed
import { CUSTOMER_NAME_API } from '../../constants'; // Adjust path as needed


interface AutocompleteFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string; // now only the "value" (ID) - string after transform
  onChange?: (value: string | null) => void; // return only ID
  error?: string;
  mode?: string;
  maxLength?: number;
}

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  name,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  error,
  mode = "edit",
  maxLength,
  ...rest
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [initialValueLoaded, setInitialValueLoaded] = useState(false);
  const queryClient = useQueryClient();

  const disabled = mode === "view";

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Main query for search options
  const { data: searchResponse, isLoading: isLoadingOptions } = useQuery({
    queryKey: ['customerNames', debouncedSearchTerm],
    queryFn: () => fetchAutoData(CUSTOMER_NAME_API,debouncedSearchTerm),
    enabled: !!debouncedSearchTerm && debouncedSearchTerm.length > 0,
    //staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const rawOptions = (searchResponse as any)?.data || [];

  // Transform raw options to {label, value}
  const options = useCallback(() => {
    if (!Array.isArray(rawOptions)) {
      return [];
    }
    const uniqueOptions = rawOptions
      .map((item: any) => ({
        label: item.name || item.label || String(item),
        value: String(item.id || item.value || item),
      }))
      .filter(
        (option: any, index: number, self: any[]) =>
          index === self.findIndex((o) => o.value === option.value)
      );
    return uniqueOptions;
  }, [rawOptions]);

  // Separate query for initial value (fetch with empty search to find matching item)
  const { data: initialResponse } = useQuery({
    queryKey: ['customerNamesInitial', value],
    queryFn: () => fetchAutoData(CUSTOMER_NAME_API,''), // Empty search to get potential matches
    enabled: !!value && !initialValueLoaded,
    //staleTime: 5 * 60 * 1000,
  });

  const initialData = (initialResponse as any)?.data || [];

  // Load initial value label
  useEffect(() => {
    if (value && !initialValueLoaded && initialData.length > 0) {
      const item = initialData.find((item: any) => 
        String(item.id || item.value) === value
      );
      if (item) {
        const option = {
          label: item.name || item.label || String(item),
          value: String(item.id || item.value),
        };
        setSearchValue(option.label); // Set the display label
        setInitialValueLoaded(true);
      } else {
        console.warn(`Initial value ${value} not found in default fetch. Consider implementing a fetch by ID endpoint.`);
        setSearchValue(`Customer ID: ${value}`); // Fallback display
        setInitialValueLoaded(true);
      }
    }
  }, [value, initialValueLoaded, initialData]);

  // Handle search change
  const handleSearchChange = useCallback((searchTerm: string) => {
    setSearchValue(searchTerm);
    if (!searchTerm) {
      setDebouncedSearchTerm('');
      queryClient.removeQueries({ queryKey: ['customerNames'] });
    }
  }, [queryClient]);

  // Handle selection change
  const handleChange = useCallback((val: string | null) => {
    if (val === null || val === '') {
      setSearchValue('');
      setDebouncedSearchTerm('');
      queryClient.removeQueries({ queryKey: ['customerNames'] });
      onChange?.(null);
      return;
    }
    const selected = options().find(opt => opt.value === val);
    if (selected) {
      setSearchValue(selected.label);
    } else {
      setSearchValue(val);
    }
    onChange?.(val);
  }, [options, onChange, queryClient]);

  // Update searchValue when options change and a value is selected
  useEffect(() => {
    if (value) {
      const selected = options().find(opt => opt.value === value);
      if (selected && searchValue !== selected.label) {
        setSearchValue(selected.label);
      }
    }
  }, [options, value, searchValue]);

  const isLoading = isLoadingOptions;

  return (
    <Select
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || `Search ${label}`}
      data={options()}
      value={value || ''}
      onChange={handleChange}
      onSearchChange={handleSearchChange}
      searchValue={searchValue}
      searchable
      clearable
      error={error}
      disabled={disabled || isLoading}
      withAsterisk={required}
      nothingFoundMessage={isLoading ? "Loading..." : "No options found"}
      rightSection={isLoading ? <Loader size="xs" /> : undefined}
      {...rest}
    />
  );
};

export default AutocompleteField;