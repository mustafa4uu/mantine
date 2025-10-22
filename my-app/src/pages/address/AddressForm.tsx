import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Container, Title, LoadingOverlay, Alert, Button, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { fetchFormData, createNewRecord, updateFormRecord } from '../../api/api';
import './CustomerForm.css';
import FormContainer from '../../components/FormContainer/FormContainer';

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
  const slug = params;
  const mode = slug['id'] != undefined ? 'edit' : 'add';
  const id = slug['id'];
  // Fetch form data
  const { data : formDataResponse, isPending, isError, error } = useQuery({
  queryKey: ['customerForm', mode, id],
  queryFn: () =>
    mode === 'add'
      ? fetchFormData('/api/v1/customers/address/add-form')
      : fetchFormData(`/api/v1/customers/address/edit-form/${id}`),
  enabled: !!mode && (mode === 'add' || !!id),
});

  // Mutation for creating/updating customer
  const mutation = useMutation({
  mutationFn: (submitData: FormSubmitData) =>
    mode === 'edit' && id
      ? updateFormRecord(`/api/v1/customers/address/update-address`, { ...submitData, masterId: Number(id) })
      : createNewRecord('/api/v1/customers/address/create-address', submitData),

  onSuccess: () => {
    const message =
      mode === 'edit'
        ? 'Customer updated successfully!'
        : 'Customer created successfully!';

    queryClient.invalidateQueries({ queryKey: ['customers'] });
    queryClient.invalidateQueries({ queryKey: ['customerForm'] });

    navigate('/customer-details');
  },

  onError: (error: Error) => {
    console.error('Form submission error:', error);
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
          Back to Address
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
            Back to Address
          </Button>
          <Title order={2} size="h3">
            {mode === 'edit' ? 'Edit Customer Address' : 'Add New Customer Address'}
          </Title>
        </Group>
      </Group>

      {/* Form Container with all form logic */
      }
      
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