import React, { useState, useMemo } from 'react'; 
import {
  Table,
  Group,
  Text,
  Box,
  Paper,
  LoadingOverlay,
  ActionIcon,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconArrowUp, IconArrowDown, IconEdit, IconTrash } from '@tabler/icons-react';
import TableControls from './TableControls';
import ListingPagination from './ListingPagination';

export interface ListingTableProps<T extends { masterId: number }> {
  data: T[];
  loading?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  searchTerm?: string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (searchTerm: string) => void;
  editPageUrl?: string;
  columns: Array<{
    key: keyof T;
    header: string;
    sortable?: boolean;
    cellRenderer?: (value: T[keyof T], item: T) => React.ReactNode;
  }>;
  searchPlaceholder?: string;
  onDelete?: (id: number) => void;
}

type SortField<T> = keyof T | null;
type SortDirection = 'asc' | 'desc';

const ListingTable = <T extends { masterId: number }>({
  data,
  loading = false,
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  searchTerm = '',
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  editPageUrl,
  columns,
  searchPlaceholder = 'Search...',
  onDelete,
}: ListingTableProps<T>) => {
  const [pageSizeState, setPageSizeState] = useState(pageSize);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [sortField, setSortField] = useState<SortField<T>>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Client-side sorting
  const sortedData = useMemo(() => {
    if (!sortField) return data;

    const sorted = [...data];
    sorted.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Handle null/undefined
      if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
      if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

      if (typeof aValue === typeof bValue) {
        if (typeof aValue === 'string') {
          return sortDirection === 'asc'
            ? (aValue as string).localeCompare(bValue as string)
            : (bValue as string).localeCompare(aValue as string);
        } else if (typeof aValue === 'number') {
          return sortDirection === 'asc'
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
        }
      }

      // Fallback to string comparison
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return sorted;
  }, [data, sortField, sortDirection] as const);

  // Use sorted data for display
  const displayData = sortedData;
  const displayTotalItems = totalItems;

  // Calculate pagination values
  const startIndex = (currentPage - 1) * pageSizeState;

  // Handle sorting
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSizeState(newPageSize);
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
    if (onPageChange) {
      onPageChange(1); // Reset to first page when page size changes
    }
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setLocalSearchTerm(newSearchTerm);
    if (onSearchChange) {
      onSearchChange(newSearchTerm);
    }
  };

  // Table rows
  const rows = displayData.map((item, index) => (
    <Table.Tr key={item.masterId}>
      <Table.Td>{startIndex + index + 1}</Table.Td>
      {columns.map((col) => (
        <Table.Td key={String(col.key)}>
          {col.cellRenderer 
            ? col.cellRenderer(item[col.key], item) 
            : String(item[col.key] ?? '')
          }
        </Table.Td>
      ))}
      <Table.Td>
        <Group gap="xs">
          {editPageUrl && (
            <ActionIcon
              component={Link}
              to={`${editPageUrl}edit/${item.masterId}`}
              variant="subtle"
              color="blue"
            >
              <IconEdit size={16} />
            </ActionIcon>
          )}
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => {
              if (onDelete) {
                onDelete(item.masterId);
              } else {
                console.log('Delete item:', item.masterId);
              }
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  // Sort icon
  const getSortIcon = (field: keyof T) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />;
  };

  const colSpan = columns.length + 2; // # + columns + actions

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Box pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} />
        
        {/* Search and Controls */}
        <TableControls
          searchTerm={localSearchTerm}
          onSearchChange={handleSearchChange}
          pageSize={pageSizeState}
          onPageSizeChange={handlePageSizeChange}
          searchPlaceholder={searchPlaceholder}
        />

        {/* Table */}
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              {columns.map((col) => (
                <Table.Th key={String(col.key)}>
                  {col.sortable ? (
                    <Group 
                      gap="xs" 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => handleSort(col.key)}
                    >
                      {col.header}
                      {getSortIcon(col.key)}
                    </Group>
                  ) : (
                    col.header
                  )}
                </Table.Th>
              ))}
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={colSpan} style={{ textAlign: 'center' }}>
                  <Text c="dimmed" py="xl">
                    {loading ? 'Loading...' : 'No items found'}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>

        {/* Pagination */}
        {displayTotalItems > 0 && (
          <ListingPagination
            totalItems={displayTotalItems}
            pageSize={pageSizeState}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        )}
      </Box>
    </Paper>
  );
};

export default ListingTable;