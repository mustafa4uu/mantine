import React from 'react';
import { Group, Pagination, Text, Paper } from '@mantine/core';

interface ListingPaginationProps {
  totalItems: number;
  pageSize?: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}

const ListingPagination: React.FC<ListingPaginationProps> = ({
  totalItems,
  pageSize = 10,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <Paper 
      withBorder 
      p="md" 
      mt="md" 
      bg="var(--mantine-color-gray-0)"
      style={{ borderRadius: 'var(--mantine-radius-md)' }}
    >
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Showing {startIndex + 1}-{endIndex} of {totalItems} items
        </Text>

        <Pagination
          value={currentPage}
          onChange={handlePageChange}
          total={totalPages}
          size="sm"
          withEdges
          siblings={2}
          boundaries={1}
          styles={(theme) => ({
            control: {
              backgroundColor: '#FFE5B4',
              color: '#FF7F50',
              border: 'none',
              '&[data-active]': {
                backgroundColor: '#FF7F50',
                color: theme.white,
              },
              '&:hover': {
                backgroundColor: '#FFB347',
              },
            },
            dots: {
              color: '#FF7F50',
            },
          })}
        />
      </Group>
    </Paper>
  );
};

export default ListingPagination;