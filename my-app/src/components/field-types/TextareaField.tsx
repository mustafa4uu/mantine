import React from 'react';
import { Textarea } from '@mantine/core';

interface TextareaFieldProps {
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

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  placeholder,
  maxLength,
  required = false,
  value,
  onChange,
  error,
  mode = "edit",
}) => {
  const disabled = mode === "view";

  return (
    <Textarea
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || label}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      maxLength={maxLength}
      error={error}
      disabled={disabled}
      withAsterisk={required}
      autosize
      minRows={3}
    />
  );
};

export default TextareaField;