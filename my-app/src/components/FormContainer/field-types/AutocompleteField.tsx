// components/FormComponent/field-types/AutocompleteField.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Select } from '@mantine/core';
import { useDebounce } from '../hooks/useDebounce';

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
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [initialValueLoaded, setInitialValueLoaded] = useState(false);

  const disabled = mode === "view";

  // Fetch autocomplete options
  const fetchAutocompleteOptions = useCallback(async (searchTerm: string) => {
    try {
      const res = await fetch(
        `https://cclm-poc.fermion.in/api/v1/customers/customer-name?name=${encodeURIComponent(searchTerm)}`
      );
      const result = await res.json();
      if (result.status === "OK" && Array.isArray(result.data)) {
        const uniqueOptions = result.data
          .map((item: any) => ({
            label: item.name || item.label || String(item),
            value: String(item.id || item.value || item),
          }))
          .filter(
            (option: any, index: number, self: any[]) =>
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
  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setSearchValue(searchTerm);
      if (searchTerm) {
        debouncedFetch(searchTerm);
      } else {
        setOptions([]);
      }
    },
    [debouncedFetch]
  );

  // Load initial value label when component mounts or value changes
  useEffect(() => {
    if (value && !initialValueLoaded) {
      // Fetch the label for the initial value
      const fetchInitialValue = async () => {
        try {
          // Using the same endpoint with empty search to get potential matches
          const res = await fetch(
            `https://cclm-poc.fermion.in/api/v1/customers/customer-name?name=`
          );
          const result = await res.json();
          if (result.status === "OK" && Array.isArray(result.data)) {
            const item = result.data.find((item: any) => 
              String(item.id || item.value) === value
            );
            if (item) {
              const option = {
                label: item.name || item.label || String(item),
                value: String(item.id || item.value),
              };
              setOptions(prev => {
                if (!prev.find(opt => opt.value === option.value)) {
                  return [option, ...prev];
                }
                return prev;
              });
              setSearchValue(option.label); // Set the display label
            } else {
              console.warn(`Initial value ${value} not found in default fetch. Consider implementing a fetch by ID endpoint.`);
            }
          }
        } catch (err) {
          console.error("Failed to fetch initial value:", err);
        } finally {
          setInitialValueLoaded(true);
        }
      };

      fetchInitialValue();
    }
  }, [value, initialValueLoaded]);

  // Update searchValue when options change and a value is selected
  useEffect(() => {
    if (value) {
      const selected = options.find(opt => opt.value === value);
      if (selected && searchValue !== selected.label) {
        setSearchValue(selected.label);
      }
    }
  }, [options, value, searchValue]);

  return (
    <Select
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || `Search ${label}`}
      data={options}
      value={value || ''}
      onChange={(val) => {
        if (val === null || val === '') {
          setSearchValue('');
          setOptions([]);
          onChange?.(null);
          return;
        }
        const selected = options.find(opt => opt.value === val);
        if (selected) {
          setSearchValue(selected.label);
        } else {
          setSearchValue(val);
        }
        onChange?.(val);
      }}
      onSearchChange={handleSearchChange}
      searchValue={searchValue}
      searchable
      clearable
      error={error}
      disabled={disabled}
      withAsterisk={required}
      nothingFoundMessage="No options found"
      {...rest}
    />
  );
};

export default AutocompleteField;