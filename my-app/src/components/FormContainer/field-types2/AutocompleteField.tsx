// components/FormComponent/field-types/AutocompleteField.tsx
import React, { useState, useCallback } from 'react';
import { Select } from '@mantine/core';
import { useDebounce } from '../hooks/useDebounce';

interface AutocompleteFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: any;
  onChange?: (value: any) => void;
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
}) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const disabled = mode === "view";

  // Fetch autocomplete options
  const fetchAutocompleteOptions = useCallback(async (searchTerm: string) => {
    try {
      const res = await fetch(
        `https://cclm-poc.fermion.in/api/v1/customers/customer-name?name=${encodeURIComponent(searchTerm)}`
      );
      const result = await res.json();
      if (result.status === "OK" && Array.isArray(result.data)) {
        // Remove duplicate options
        const uniqueOptions = result.data
          .map((item: any) => ({
            label: item.name || item.label || String(item),
            value: String(item.id || item.value || item),
          }))
          .filter((option: any, index: number, self: any[]) => 
            index === self.findIndex((o) => o.value === option.value)
          );
        setOptions(uniqueOptions);
      } else {
        setOptions([]);
      }
    } catch (err) {
      console.error("Autocomplete fetch error:", err);
      setOptions([]);
    }
  }, []);

  const debouncedFetch = useDebounce(fetchAutocompleteOptions, 300);

  // Handle search change
  const handleSearchChange = useCallback((searchTerm: string) => {
    setSearchValue(searchTerm);
    if (searchTerm) {
      debouncedFetch(searchTerm);
    } else {
      setOptions([]);
    }
  }, [debouncedFetch]);

  return (
    <Select
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || `Search ${label}`}
      data={options}
      value={value || ''}
      onChange={(val) => onChange?.(val)}
      onSearchChange={handleSearchChange}
      searchValue={searchValue}
      searchable
      clearable
      error={error}
      disabled={disabled}
      withAsterisk={required}
      nothingFoundMessage="No options found"
    />
  );
};

export default AutocompleteField;