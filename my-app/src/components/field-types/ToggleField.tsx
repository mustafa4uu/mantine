// components/FormComponent/field-types/ToggleField.tsx
import React from 'react';
import { Switch, Text } from '@mantine/core';

interface ToggleFieldProps {
  name: string;
  label: string;
  required?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  mode?: string;
  options?: { label: string; value: string; orderBy?: number; id?: number }[];
  yesLabel?: string;
  noLabel?: string;
}

const ToggleField: React.FC<ToggleFieldProps> = ({
  name,
  label,
  required = false,
  value = 'no',
  onChange,
  error,
  mode = "edit",
  options,
  yesLabel = 'Yes',
  noLabel = 'No',
  ...rest
}) => {
  const disabled = mode === "view";
  
  // Default to yes/no if no options provided
  const yesValue = options?.[0]?.value || 'yes';
  const noValue = options?.[1]?.value || 'no';
  const checked = value === yesValue;
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.currentTarget.checked ? yesValue : noValue);
  };

  return (
    <div>
      <Switch
        label={`${label}${required ? ' *' : ''}`}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        error={error}
        withAsterisk={required}
        {...rest}
        // Labels for on/off states
        description={
          <Text size="sm" c={checked ? 'blue' : 'gray'}>
            {checked ? yesLabel : noLabel}
          </Text>
        }
      />
    </div>
  );
};

export default ToggleField;