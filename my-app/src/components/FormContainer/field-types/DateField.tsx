import React from 'react';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';

interface DateFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string | null; // ✅ always string from form
  onChange?: (value: string | null) => void;
  error?: string;
  mode?: string;
}

const DateField: React.FC<DateFieldProps> = ({
  name,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  error,
  mode = 'edit',
}) => {
  const disabled = mode === 'view';

  return (
    <DatePickerInput
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || `Select ${label}`}
      value={value}
      onChange={onChange}
      error={error}
      disabled={disabled}
      withAsterisk={required}
      valueFormat="DD/MM/YYYY"
      popoverProps={{ withinPortal: true }}
      clearable={!required}
      leftSection={<IconCalendar size={16} />}
      leftSectionPointerEvents="none"
      minDate={new Date(1900, 0, 1)}
      maxDate={new Date(2100, 11, 31)}
      locale="en"
    />
  );
};

export default DateField;