import React from 'react';
import { Select } from '@mantine/core';

interface PageSizeSelectorProps {
  value: number;
  onChange: (pageSize: number) => void;
  options?: { value: number; label: string }[];
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  value,
  onChange,
  options = [
    { value: 5, label: '5 per page' },
    { value: 10, label: '10 per page' },
    { value: 20, label: '20 per page' },
    { value: 50, label: '50 per page' },
  ],
}) => {
  const handleChange = (value: string | null) => {
    if (value) {
      const newPageSize = parseInt(value, 10);
      onChange(newPageSize);
    }
  };

  return (
    <Select
      value={value.toString()}
      onChange={handleChange}
      data={options.map(option => ({
        value: option.value.toString(),
        label: option.label,
      }))}
      style={{ width: '130px' }}
    />
  );
};

export default PageSizeSelector;