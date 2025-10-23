// components/FormComponent/field-types/TextField.tsx
import React from 'react';
import { TextInput } from '@mantine/core';

interface TextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  mode?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  placeholder,
  maxLength,
  required = false,
  value,
  onChange,
  error,
  mode = "edit",
  ...rest
}) => {
  const disabled = mode === "view";

  return (
    <TextInput
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || label}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      maxLength={maxLength}
      error={error}
      disabled={disabled}
      withAsterisk={required}
      {...rest}
    />
  );
};

export default TextField;