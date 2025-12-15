import React, { useMemo, useEffect } from 'react';
import { Select, Loader } from '@mantine/core';
import { useFormContext } from 'react-hook-form';
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
  branchId?: any; // New prop for dependency: used when name === "country" to filter countries by selected branch
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
  branchId, // Destructure the new prop
  ...rest
}) => {
  const { setValue } = useFormContext();
  const disabled = mode === "view";
  
  // Fetch countries using separate utility, now dependent on branchId
  const { data: countryData = [], isLoading: loadingCountries } = useQuery({
    queryKey: ['countries', branchId], // Include branchId in queryKey to refetch when it changes
    queryFn: () => fetchCountries(branchId), // Pass branchId to the fetch function (assume fetchCountries accepts it)
    enabled: name === "country" && branchId != 0, // Only fetch if it's the country field and branchId is available
    staleTime: 5 * 60 * 1000,
  });

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
    
    if (name === "country") {
      baseOptions = loadingCountries
        ? [{ label: "Loading countries...", value: "loading" }]
        : countryOptions;
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
  }, [name, label, options, countryOptions, loadingCountries]);

  // Clear invalid country value when options change (e.g., branchId changes)
  useEffect(() => {
    if (name === "country" && !loadingCountries && countryOptions.length > 0) {
      const currentValue = value;
      const isValid = countryOptions.some(opt => opt.value === String(currentValue));
      if (!isValid && currentValue !== '' && currentValue !== null && currentValue !== undefined) {
        setValue(name, '', { shouldValidate: false, shouldDirty: false });
      }
    }
  }, [countryOptions, name, value, loadingCountries, setValue]);

  const isLoading = false;

  return (
    <Select
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || `Select ${label}`}
      // data={selectData}
      //data={options.length > 0 ? selectData : [{ label: `No options available`, value: "" }]}
      data={name === "country" ? selectData : options}
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