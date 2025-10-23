// components/FormComponent/field-types/DateField.tsx
import React from 'react';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';

interface DateFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: any; // ✅ always string from form
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
  ...rest
}) => {
  const disabled = mode === 'view';

  // Parse DD/MM/YYYY string to Date
  const parseDateString = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    // Validate parsed date
    if (
      isNaN(date.getTime()) ||
      date.getDate() !== day ||
      date.getMonth() !== month ||
      date.getFullYear() !== year
    ) {
      return null;
    }
    return date;
  };

  // Format Date to DD/MM/YYYY string
  const formatDateString = (date: any | null): string | null => {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parsedValue = parseDateString(value);

  return (
    <DatePickerInput
      label={`${label}${required ? ' *' : ''}`}
      placeholder={placeholder || `Select ${label}`}
      value={parsedValue}
      onChange={(date) => {
        const formatted = formatDateString(date);
        onChange?.(formatted);
      }}
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
      {...rest}
    />
  );
};

export default DateField;