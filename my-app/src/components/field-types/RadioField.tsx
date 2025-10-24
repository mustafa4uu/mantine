// components/FormComponent/field-types/RadioField.tsx
import React from 'react';
import { Radio, Group } from '@mantine/core';

interface RadioFieldProps {
  name: string;
  label: string;
  required?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  mode?: string;
  options?: { label: string; value: string; orderBy?: number; id?: number }[];
}

const RadioField: React.FC<RadioFieldProps> = ({
  name,
  label,
  required = false,
  value,
  onChange,
  error,
  mode = "edit",
  options = [],
  ...rest
}) => {
  const disabled = mode === "view";

  return (
    <Radio.Group
      label={`${label}${required ? ' *' : ''}`}
      value={String(value || '')}
      onChange={onChange}
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
            {...rest}
          />
        ))}
      </Group>
    </Radio.Group>
  );
};

export default RadioField;