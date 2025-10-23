// components/FormComponent/field-types/NumberField.tsx
import React from 'react';
import { NumberInput } from '@mantine/core';

interface NumberFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  mode?: string;
}

const NumberField: React.FC<NumberFieldProps> = ({
  name,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  error,
  mode = "edit",
  ...rest
}) => {
  const disabled = mode === "view";

  return (
    <NumberInput
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || label}
      value={value === null || value === undefined ? undefined : Number(value)}
      onChange={(val) => onChange?.(val === '' ? null : Number(val))}
      error={error}
      disabled={disabled}
      withAsterisk={required}
      hideControls={disabled}
      {...rest}
    />
  );
};

export default NumberField;