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

interface Customer {
  masterId: number;
  custId: string;
  custName: string;
  mobileNumber: string;
  email?: string;
}

interface ListingTableProps {
  data: Customer[];
  loading?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  searchTerm?: string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (searchTerm: string) => void;
  editPageUrl?: string;
}

type SortField = keyof Customer | null;
type SortDirection = 'asc' | 'desc';

const ListingTable: React.FC<ListingTableProps> = ({
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
}) => {
  const [pageSizeState, setPageSizeState] = useState(pageSize);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Only client-side sorting (search is now server-side)
  const sortedData = useMemo(() => {
    if (!sortField) return data;

    const sorted = [...data];
    sorted.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc'
        ? (aValue as any) - (bValue as any)
        : (bValue as any) - (aValue as any);
    });

    return sorted;
  }, [data, sortField, sortDirection]);

  // Use sorted data for display
  const displayData = sortedData;
  const displayTotalItems = totalItems;

  // Calculate pagination values
  const startIndex = (currentPage - 1) * pageSizeState;

  // Handle sorting
  const handleSort = (field: keyof Customer) => {
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
  const rows = displayData.map((customer, index) => (
    <Table.Tr key={customer.masterId}>
      <Table.Td>
        {startIndex + index + 1}
      </Table.Td>
      <Table.Td>{customer.custName}</Table.Td>
      <Table.Td>{customer.custId}</Table.Td>
      <Table.Td>{customer.mobileNumber}</Table.Td>
      <Table.Td>{customer.email || 'N/A'}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            component={Link}
            to={`${editPageUrl}edit/${customer.masterId}`}
            variant="subtle"
            color="blue"
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => {
              // Handle delete functionality
              console.log('Delete customer:', customer.masterId);
            }}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  // Sort icon
  const getSortIcon = (field: keyof Customer) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />;
  };

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
          searchPlaceholder="Search customers..."
        />

        {/* Table */}
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>
                <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('custName')}>
                  Name
                  {getSortIcon('custName')}
                </Group>
              </Table.Th>
              <Table.Th>
                <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('custId')}>
                  Customer ID
                  {getSortIcon('custId')}
                </Group>
              </Table.Th>
              <Table.Th>
                <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('mobileNumber')}>
                  Phone
                  {getSortIcon('mobileNumber')}
                </Group>
              </Table.Th>
              <Table.Th>
                <Group gap="xs" style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>
                  Email
                  {getSortIcon('email')}
                </Group>
              </Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} style={{ textAlign: 'center' }}>
                  <Text c="dimmed" py="xl">
                    {loading ? 'Loading...' : 'No customers found'}
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