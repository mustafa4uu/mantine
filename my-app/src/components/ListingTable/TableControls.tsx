import React from 'react';
import { Group } from '@mantine/core';
import SearchInput from './SearchInput';
import PageSizeSelector from './PageSizeSelector';

interface TableControlsProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  searchPlaceholder?: string;
}

const TableControls: React.FC<TableControlsProps> = ({
  searchTerm,
  onSearchChange,
  pageSize,
  onPageSizeChange,
  searchPlaceholder = "Search customers...",
}) => {
  return (
    <Group justify="space-between" mb="md">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
      <PageSizeSelector
        value={pageSize}
        onChange={onPageSizeChange}
      />
    </Group>
  );
};

export default TableControls;