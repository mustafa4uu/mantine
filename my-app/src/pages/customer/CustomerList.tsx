import React, { useState, useEffect } from 'react';
import { Container, Title, Button, Group } from '@mantine/core';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import ListingTable from '../../components/ListingTable/ListingTable';
import { fetchPaginatedData } from '../../api/api';
import { Link } from 'react-router-dom';
import EditCollateralForm from '../../components/common/EditCollateralForm';

export interface Customer {
  masterId: number;
  custId: string;
  custName: string;
  mobileNumber: string;
  email?: string;
}

const customerColumns = [
  { key: 'custName' as keyof Customer, header: 'Name', sortable: true },
  { key: 'custId' as keyof Customer, header: 'Customer ID', sortable: true },
  { key: 'mobileNumber' as keyof Customer, header: 'Phone', sortable: true },
  { 
    key: 'email' as keyof Customer, 
    header: 'Email', 
    sortable: true, 
    cellRenderer: (value: any, _item: any) => value || 'N/A' 
  },
];

const CustomerList: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setOffset(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["customers", offset, pageSize, debouncedSearchTerm],
    queryFn: () => fetchPaginatedData('/api/v1/customers/list', debouncedSearchTerm, offset, pageSize),
    placeholderData: keepPreviousData,
  });

  const currentPage = Math.floor(offset / pageSize) + 1;

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * pageSize;
    setOffset(newOffset);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setOffset(0);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  const customers = (data as any)?.data?.data || [];
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
          {debouncedSearchTerm && ` - Searching for "${debouncedSearchTerm}"`}
        </Title>
        <Button
          component={Link}
          to="/customer-details/add"
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
          currentPage={currentPage}
          totalItems={totalItems}
          searchTerm={searchTerm}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearchChange={handleSearchChange}
          editPageUrl="/customer-details/"
          columns={customerColumns}
          searchPlaceholder="Search customers..."
        />
      </div>
      <EditCollateralForm />
    </Container>
  );
};

export default CustomerList;