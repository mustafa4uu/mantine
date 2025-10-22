// components/FormComponent/field-types/CheckboxField.tsx
import React from 'react';
import { Checkbox, Group } from '@mantine/core';

interface CheckboxFieldProps {
  name: string;
  label: string;
  required?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  mode?: string;
  options?: { label: string; value: string; orderBy?: number; id?: number }[];
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  required = false,
  value,
  onChange,
  error,
  mode = "edit",
  options = [],
}) => {
  const disabled = mode === "view";

  // Single checkbox (boolean)
  if (options.length === 0) {
    return (
      <Checkbox
        label={`${label}${required ? ' *' : ''}`}
        checked={Boolean(value)}
        onChange={(e) => onChange?.(e.target.checked)}
        error={error}
        disabled={disabled}
      />
    );
  }

  // Multiple checkboxes (array of values)
  return (
    <Checkbox.Group
      label={`${label}${required ? ' *' : ''}`}
      value={Array.isArray(value) ? value : []}
      onChange={onChange}
      error={error}
      withAsterisk={required}
    >
      <Group mt="xs">
        {options.map((opt) => (
          <Checkbox 
            key={opt.value} 
            value={opt.value} 
            label={opt.label}
            disabled={disabled}
          />
        ))}
      </Group>
    </Checkbox.Group>
  );
};

export default CheckboxField;