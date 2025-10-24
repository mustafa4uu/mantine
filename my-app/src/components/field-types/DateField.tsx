// components/FormComponent/field-types/DateField.tsx
import React from 'react';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';

interface DateFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string | null; // ✅ string from form
  onChange?: (value: string | null) => void;
  error?: string;
  mode?: string;
}

const DateField: React.FC<DateFieldProps> = ({
  label,
  placeholder,
  required = false,
  value,
  onChange,
  error,
  mode = 'edit',
}) => {
  const disabled = mode === 'view';

  // Convert string value to Date object for the DatePicker
  const dateValue = React.useMemo(() => {
    if (!value) return null;
    
    // Handle different string formats
    if (value.includes('/')) {
      // DD/MM/YYYY format
      const [day, month, year] = value.split('/').map(Number);
      return new Date(year, month - 1, day);
    } else {
      // ISO format or other
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }
  }, [value]);
  return (
    <DatePickerInput
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || `Select ${label}`}
      value={dateValue}
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