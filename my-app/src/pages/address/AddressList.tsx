import React, { useState, useEffect } from 'react';
import { Container, Title, Button, Group } from '@mantine/core';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import ListingTable from '../../components/ListingTable/ListingTable';
import { fetchPaginatedData } from '../../api/api';
import { Link } from 'react-router-dom';

export interface Address {
  masterId: number;
  custId: string;
  custName: string;
  mobileNumber: string;
  email?: string;
}

const AddressList: React.FC = () => {
  const [offset, setOffset] = useState(0); // Start from offset 0
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState(''); // Search state
  const queryClient = useQueryClient();

  // Debounce search term to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setOffset(0); // Reset to first page when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["address", offset, pageSize, debouncedSearchTerm],
    queryFn: () => fetchPaginatedData('/api/v1/customers/address/list', debouncedSearchTerm, offset, pageSize),
    placeholderData: keepPreviousData,
  });

  // Calculate current page for display (1-based)
  const currentPage = Math.floor(offset / pageSize) + 1;

  // Handle page change from the ListingTable component
  const handlePageChange = (page: number) => {
    // Convert 1-based page to offset
    const newOffset = (page - 1) * pageSize;
    setOffset(newOffset);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setOffset(0); // Reset to first page (offset 0)
  };

  // Handle search change from ListingTable
  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  // Extract the actual data from the API response
  let customers = (data as any)?.data?.data || [];
  const totalItems = (data as any)?.data?.page?.totalRecords ?? 0;

  if (isError) {
    return (
      <Container p={10} m={0}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Title order={3}>
            Error: {error.message || "Something went wrong!"}
          </Title>
          <Button 
            onClick={() => queryClient.refetchQueries({ queryKey: ['customers'] })} 
            style={{ marginTop: '20px' }}
          >
            Retry
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container p={10} m={0}>
      <Group justify="space-between" mb="md">
        <Title order={2} size="h3">
          Customers ({totalItems} total)
          {debouncedSearchTerm && (
            debouncedSearchTerm
          )}
        </Title>
        <Button
            component={Link}
            to="/customer-address/add"
            variant="filled"
            >
            Add New Customer
        </Button>
      </Group>

      <div style={{ width: '100%' }}>
        <ListingTable 
          data={customers} 
          loading={isPending}
          pageSize={pageSize}
          currentPage={currentPage} // Use calculated current page
          totalItems={totalItems}
          searchTerm={searchTerm}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearchChange={handleSearchChange}
          editPageUrl="/customer-address/"
        />
      </div>
    </Container>
  );
};

export default AddressList;