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
  city: string;
  state: string;
  pinCode: string;
  mobileNo: string;
  emailId?: string;
  customerId?: {
    label: string;
    value: string;
  };
}

const addressColumns = [
  { key: 'custName' as keyof Address, header: 'Customer Name', sortable: true },
  { key: 'custId' as keyof Address, header: 'Cust Id', sortable: true },
  { key: 'mobileNo' as keyof Address, header: 'Mobile No', sortable: true },
  { 
    key: 'emailId' as keyof Address, 
    header: 'Email', 
    sortable: true, 
    cellRenderer: (value: any, _item: any) => value || 'N/A' 
  },
  { key: 'city' as keyof Address, header: 'City', sortable: true },
  { key: 'state' as keyof Address, header: 'State', sortable: true },
  { key: 'pinCode' as keyof Address, header: 'PIN Code', sortable: true },
];

const AddressList: React.FC = () => {
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
    queryKey: ["addresses", offset, pageSize, debouncedSearchTerm],
    queryFn: () => fetchPaginatedData('/api/v1/customers/address/list', debouncedSearchTerm, offset, pageSize),
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

  let rawAddresses = (data as any)?.data?.data || [];
  const totalItems = (data as any)?.data?.page?.totalRecords ?? 0;

  // Transform the data to set custName and custId from customerId
  const addresses: Address[] = rawAddresses.map((item: any) => ({
    ...item,
    custName: item.customerId?.label || 'N/A',
    custId: item.customerId?.value || 'N/A',
  }));

  if (isError) {
    return (
      <Container p={10} m={0}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Title order={3}>
            Error: {error.message || "Something went wrong!"}
          </Title>
          <Button 
            onClick={() => queryClient.refetchQueries({ queryKey: ['addresses'] })} 
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
          Addresses ({totalItems} total)
          {debouncedSearchTerm && ` - Searching for "${debouncedSearchTerm}"`}
        </Title>
        <Button
          component={Link}
          to="/customer-address/add"
          variant="filled"
        >
          Add New Address
        </Button>
      </Group>

      <div style={{ width: '100%' }}>
        <ListingTable 
          data={addresses} 
          loading={isPending}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={totalItems}
          searchTerm={searchTerm}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearchChange={handleSearchChange}
          editPageUrl="/customer-address/"
          columns={addressColumns}
          searchPlaceholder="Search addresses..."
        />
      </div>
    </Container>
  );
};

export default AddressList;