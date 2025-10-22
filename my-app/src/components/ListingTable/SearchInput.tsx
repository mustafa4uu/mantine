import React from 'react';
import { TextInput, ActionIcon } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      leftSection={<IconSearch size={16} />}
      rightSection={
        value ? (
          <ActionIcon size="sm" onClick={handleClear}>
            ×
          </ActionIcon>
        ) : null
      }
      style={{ width: '300px' }}
    />
  );
};

export default SearchInput;