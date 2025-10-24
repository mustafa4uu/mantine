import React, { useMemo } from 'react';
import { Select, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { fetchBranches, fetchCountries, fetchAddressTypes } from '../../utils/common'; // Adjust path as needed

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

  // Fetch branches using separate utility
  const { data: branchData = [], isLoading: loadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    enabled: name === "locationCode",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch countries using separate utility
  const { data: countryData = [], isLoading: loadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    enabled: name === "country",
    staleTime: 5 * 60 * 1000,
  });

  // Fetch address types using separate utility
  const { data: addressTypeData = [], isLoading: loadingAddressTypes } = useQuery({
    queryKey: ['addressTypes'],
    queryFn: fetchAddressTypes,
    enabled: name === "addressType",
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

  // Transform address type data
  const addressTypeOptions = useMemo(() => {
    return addressTypeData.map((addr: any) => ({
      label: addr.addressTypeName,
      value: String(addr.addressTypeId),
      id: addr.addressTypeId,
    }));
  }, [addressTypeData]);

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
    } else if (name === "addressType") {
      baseOptions = loadingAddressTypes
        ? [{ label: "Loading address types...", value: "loading" }]
        : addressTypeOptions;
    } else {
      // For other selects: use provided options
      baseOptions = options;
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
  }, [name, label, options, branchOptions, countryOptions, addressTypeOptions, loadingBranches, loadingCountries, loadingAddressTypes]);

  const isLoading = (loadingBranches && name === "locationCode") || (loadingCountries && name === "country") || (loadingAddressTypes && name === "addressType");

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
      nothingFoundMessage={name === "locationCode" ? "No branches found" : name === "country" ? "No countries found" : name === "addressType" ? "No address types found" : "No options found"}
      {...rest}
    />
  );
};

export default SelectField;