// field-types/RadioField.tsx
import React from 'react';
import { Radio, Group } from '@mantine/core';

interface RadioFieldProps {
  name: string;
  label: string;
  required?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  error?: string;
  mode?: string;
  options?: { label: string; value: string; orderBy?: number; id?: number }[];
}

const RadioField: React.FC<RadioFieldProps> = ({
  label,
  required = false,
  value,
  onChange,
  onBlur,
  error,
  mode = "edit",
  options = [],
}) => {
  const disabled = mode === "view";

  return (
    <Radio.Group
      label={`${label}${required ? ' *' : ''}`}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      withAsterisk={required}
    >
      <Group mt="xs">
        {options.map((opt) => (
          <Radio 
            key={opt.value} 
            value={opt.value} 
            label={opt.label}
            disabled={disabled}
          />
        ))}
      </Group>
    </Radio.Group>
  );
};

export default RadioField;