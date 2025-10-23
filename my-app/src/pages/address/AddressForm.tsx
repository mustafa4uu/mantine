// CustomerAddressForm.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Container, Title, LoadingOverlay, Alert, Button, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { fetchFormData, createNewRecord, updateFormRecord } from '../../api/api';
import './AddressForm.css'; // Assume CSS similar to CustomerForm.css
import FormContainer from '../../components/FormContainer/FormContainer';
import { notifications } from "@mantine/notifications";

export interface FormField {
  fieldName: string;
  fieldType: string;
  displayName: string;
  isRequired: boolean;
  validationRegs?: string;
  validationMsg?: string;
  maxLength?: number;
  dropDown?: Array<{ label: string; value: string; orderBy?: number }>;
}

export interface FormDataResponse {
  fieldsMetaData: FormField[];
  [key: string]: any;
}

export interface FormSubmitData {
  [key: string]: any;
}

const AddressForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();

  // Extract mode and id from params
  const id = params.id;
  const mode = id ? 'edit' : 'add';

  // Fetch form data
  const { data: formDataResponse, isPending, isError, error } = useQuery({
    queryKey: ['customerAddressForm', mode, id],
    queryFn: () =>
      mode === 'add'
        ? fetchFormData('/api/v1/customers/address/add-form')
        : fetchFormData(`/api/v1/customers/address/edit-form/${id}`),
    enabled: !!mode && (mode === 'add' || !!id),
  });

  // Mutation for creating/updating customer address
  const mutation = useMutation({
    mutationFn: (submitData: FormSubmitData) =>
      mode === 'edit' && id
        ? updateFormRecord('/api/v1/customers/address/update-address', { ...submitData, masterId: Number(id) })
        : createNewRecord('/api/v1/customers/address/create-address', submitData),

    onSuccess: () => {
      const message =
        mode === 'edit'
          ? 'Customer Address updated successfully!'
          : 'Customer Address created successfully!';

      notifications.show({
        message: message,
        color: "green",
      });

      queryClient.invalidateQueries({ queryKey: ['customerAddresses'] });
      queryClient.invalidateQueries({ queryKey: ['customerAddressForm'] });

      navigate('/customer-address');
    },

    onError: (error: Error) => {
      console.error('Form submission error:', error);
      notifications.show({
        message: error.message || 'An error occurred while submitting the form',
        color: "red",
      });
    },
  });

  // Handle form submission from FormContainer
  const handleFormSubmit = (formData: FormSubmitData) => {
    mutation.mutate(formData);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/customer-address');
  };

  if (isPending) {
    return (
      <Container p={10} m={0}>
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container p={10} m={0}>
        <Alert color="red" title="Error" mb="md">
          {error?.message || 'Failed to load form data'}
        </Alert>
        <Button onClick={handleBack} leftSection={<IconArrowLeft size={16} />}>
          Back to Customer Addresses
        </Button>
      </Container>
    );
  }

  return (
    <Container p={10} m={0}>
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Group>
          <Button 
            variant="subtle" 
            leftSection={<IconArrowLeft size={16} />}
            onClick={handleBack}
          >
            Back to Customer Addresses
          </Button>
          <Title order={2} size="h3">
            Customer Address Details
          </Title>
        </Group>
      </Group>

      {/* Form Container with React Hook Form */}
      {formDataResponse && (
        <FormContainer
          mode={mode}
          fields={(formDataResponse as any).fieldsMetaData || []}
          initialData={(formDataResponse as any)}
          onSubmit={handleFormSubmit}
          isSubmitting={mutation.isPending}
        />
      )}

      {/* Submission Error Alert */}
      {mutation.isError && (
        <Alert color="red" title="Submission Error" mt="md">
          {mutation.error?.message || 'An error occurred while submitting the form. Please try again.'}
        </Alert>
      )}
    </Container>
  );
};

export default AddressForm;