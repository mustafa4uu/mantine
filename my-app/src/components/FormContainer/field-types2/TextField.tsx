// field-types/TextField.tsx
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
  onBlur?: () => void;
  error?: string;
  mode?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  maxLength,
  required = false,
  value,
  onChange,
  onBlur,
  error,
  mode = "edit",
}) => {
  const disabled = mode === "view";

  return (
    <TextInput
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || label}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={onBlur}
      maxLength={maxLength}
      error={error}
      disabled={disabled}
      withAsterisk={required}
    />
  );
};

export default TextField;