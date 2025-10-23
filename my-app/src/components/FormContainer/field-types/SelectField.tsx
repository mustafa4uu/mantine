// components/FormComponent/field-types/SelectField.tsx
// (Updated to match Next.js logic for baseOptions)
import React, { useMemo } from 'react';
import { Select, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { fetchMasterData } from '../../../api/api';

interface SelectFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  mode?: string;
  options?: { label: string; value: string; orderBy?: number; id?: number }[];
}

// Default address options (from Next.js)
const AddressOptions = [
  { label: "Permanent Address", value: "1", orderBy: 1 },
  { label: "Communication Address", value: "2", orderBy: 2 },
  { label: "Employer Address", value: "3", orderBy: 3 },
  { label: "Factory Address", value: "4", orderBy: 4 },
  { label: "Registered Address", value: "61", orderBy: 5 },
];

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  error,
  mode = "edit",
  options = [],
  ...rest
}) => {
  const disabled = mode === "view";

  // Fetch branches
  const { data: branchData = [], isLoading: loadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: () => fetchMasterData('/api/v1/masters/branches'),
    enabled: name === "locationCode",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch countries
  const { data: countryData = [], isLoading: loadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: () => fetchMasterData('/api/v1/masters/countries'),
    enabled: name === "country",
    staleTime: 5 * 60 * 1000,
  });

  // Transform branch data
  const branchOptions = useMemo(() => {
    return branchData.map((branch: any) => ({
      label: branch.branchName,
      value: String(branch.branchId),
      id: branch.branchId,
    }));
  }, [branchData]);

  // Transform country data
  const countryOptions = useMemo(() => {
    return countryData.map((country: any) => ({
      label: country.countryName,
      value: String(country.countryId),
      id: country.countryId,
    }));
  }, [countryData]);

  // Prepare select data (matching Next.js logic)
  const selectData = useMemo(() => {
    let baseOptions: { label: string; value: string }[] = [];
    
    if (name === "locationCode") {
      baseOptions = loadingBranches 
        ? [{ label: "Loading branches...", value: "loading" }]
        : branchOptions;
    } else if (name === "country") {
      baseOptions = loadingCountries
        ? [{ label: "Loading countries...", value: "loading" }]
        : countryOptions;
    } else {
      // For other selects: AddressOptions + provided options (matching Next.js ternary)
      baseOptions = [...AddressOptions, ...options];
    }

    // Filter out duplicates
    const uniqueOptions = baseOptions.filter((option, index, self) => 
      index === self.findIndex((o) => o.value === option.value)
    );

    // Add placeholder option if applicable
    if (uniqueOptions.length > 0 && !uniqueOptions.some(opt => opt.value === "")) {
      return [
        { label: `Select ${label}`, value: "" },
        ...uniqueOptions,
      ];
    }

    return uniqueOptions;
  }, [name, label, options, branchOptions, countryOptions, loadingBranches, loadingCountries]);

  const isLoading = (loadingBranches && name === "locationCode") || (loadingCountries && name === "country");

  return (
    <Select
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || `Select ${label}`}
      data={selectData}
      value={String(value || '')}
      onChange={(val) => onChange?.(val || '')}
      error={error}
      disabled={disabled || isLoading}
      withAsterisk={required}
      rightSection={isLoading ? <Loader size="xs" /> : undefined}
      clearable={!required}
      nothingFoundMessage={name === "locationCode" ? "No branches found" : name === "country" ? "No countries found" : "No options found"}
      {...rest}
    />
  );
};

export default SelectField;