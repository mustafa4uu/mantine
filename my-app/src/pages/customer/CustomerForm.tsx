import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Container, Title, LoadingOverlay, Alert, Button, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { fetchFormData, createNewRecord, updateFormRecord } from '../../api/api';
import './CustomerForm.css';
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

const CustomerForm: React.FC = () => {
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
        ? fetchFormData('/api/v1/customers/add-form')
        : fetchFormData(`/api/v1/customers/edit-form/${id}`),
    enabled: !!mode && (mode === 'add' || !!id),
  });

  // Mutation for creating/updating customer address
  const mutation = useMutation({
  mutationFn: async (submitData: FormSubmitData) => {
    try {
      if (mode === 'edit' && id) {
        return await updateFormRecord('/api/v1/customers/update-customer', { ...submitData, masterId: Number(id) });
      } else {
        return await createNewRecord('/api/v1/customers/create-customer', submitData);
      }
    } catch (error) {
      // Re-throw to let onError handle it
      throw error;
    }
  },

  onSuccess: (data) => {
    const message =
      mode === 'edit'
        ? 'Customer Details updated successfully!'
        : 'Customer Details created successfully!';

    notifications.show({
      message: message,
      color: "green",
    });

    queryClient.invalidateQueries({ queryKey: ['customerDetails'] });
    queryClient.invalidateQueries({ queryKey: ['customerDetailsForm'] });

    // Redirect only on success
    navigate('/customer-details');
  },

  onError: (error: any) => {
    console.error('Full error object:', error); // Log full error for debugging
    
    // Enhanced error handling for the specific API response structure
    let errorMessage = 'An error occurred while submitting the form';
    const responseData = error.response?.data;

    if (responseData && responseData.success === false) {
      // Handle the specific error structure: { success: false, error: "...", errorList: [...] }
      errorMessage = responseData.error || errorMessage;
      
      // If errorList exists, prioritize field-specific messages
      if (responseData.errorList && Array.isArray(responseData.errorList) && responseData.errorList.length > 0) {
        const fieldErrors = responseData.errorList.map((err: any) => 
          `${err.field}: ${err.massage || err.message || 'Validation error'}`
        ).join('\n'); // Use 'massage' as per API, or fallback to 'message'
        errorMessage = fieldErrors.length > 0 ? fieldErrors : errorMessage;
        
        // Optionally, set field-specific errors in form (requires access to setError from useForm)
        // Example: responseData.errorList.forEach((err: any) => setError(err.field as Path<TFieldValues>, { message: err.massage }));
      }
    } else if (error.response?.status) {
      errorMessage = `Server error (${error.response.status}): ${error.response.statusText}`;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (Object.keys(error || {}).length === 0) {
      errorMessage = 'Empty response from server. Please check network or try again.';
    }

    // Show error notification but DO NOT redirect on error
    notifications.show({
      message: errorMessage,
      color: "red",
    });
  },
});
  // const mutation = useMutation({
  //   mutationFn: (submitData: FormSubmitData) =>
  //     mode === 'edit' && id
  //       ? updateFormRecord('/api/v1/customers/update-customer', { ...submitData, masterId: Number(id) })
  //       : createNewRecord('/api/v1/customers/create-customer', submitData),

  //   onSuccess: () => {
  //     const message =
  //       mode === 'edit'
  //         ? 'Customer Details updated successfully!'
  //         : 'Customer Details created successfully!';

  //     notifications.show({
  //       message: message,
  //       color: "green",
  //     });

  //     // await queryClient.setQueriesData(['customerDetails'], submiytData);
  //     queryClient.invalidateQueries({ queryKey: ['customerDetails'] });
  //     queryClient.invalidateQueries({ queryKey: ['customerDetailsForm'] });

  //     navigate('/customer-details');
  //   },

  //   onError: (error: Error) => {
  //     console.error('Form submission error:', error);
  //     notifications.show({
  //       message: error.message || 'An error occurred while submitting the form',
  //       color: "red",
  //     });
  //   },
  // });

  // Handle form submission from FormContainer
  const handleFormSubmit = (formData: FormSubmitData) => {
    mutation.mutate(formData);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/customer-details');
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
          Back to Customer Details
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
            Back to Customer Details
          </Button>
          <Title order={2} size="h3">
            Customer Details
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

export default CustomerForm;

// // CustomerForm.tsx
// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { Container, Title, LoadingOverlay, Alert, Button, Group } from '@mantine/core';
// import { IconArrowLeft } from '@tabler/icons-react';
// import { fetchFormData, createNewRecord, updateFormRecord } from '../../api/api';
// import './CustomerForm.css';
// import FormContainer from '../../components/FormContainer/FormContainer';
// import { notifications } from "@mantine/notifications";

// export interface CustomerFormField {
//   fieldName: string;
//   fieldType: string;
//   displayName: string;
//   isRequired: boolean;
//   validationRegs?: string;
//   validationMsg?: string;
//   maxLength?: number;
//   dropDown?: Array<{ label: string; value: string; orderBy?: number }>;
// }

// export interface CustomerFormDataResponse {
//   fieldsMetaData: CustomerFormField[];
//   [key: string]: any;
// }

// export interface CustomerFormSubmitData {
//   [key: string]: any;
// }

// const CustomerForm: React.FC = () => {
//   const navigate = useNavigate();
//   const params = useParams<{ id?: string }>();
//   const queryClient = useQueryClient();

//   // Extract mode and id from params
//   const id = params.id;
//   const mode = id ? 'edit' : 'add';

//   // Fetch form data
//   const {
//     data: customerFormData,
//     isPending: isLoadingFormData,
//     isError: isFormDataError,
//     error: formDataError,
//   } = useQuery({
//     queryKey: ['customerForm', mode, id],
//     queryFn: async (): Promise<CustomerFormDataResponse> => {
//       const url = mode === 'add'
//         ? '/api/v1/customers/add-form'
//         : `/api/v1/customers/edit-form/${id}`;
//       const response = await fetchFormData(url);
//       return response as unknown as CustomerFormDataResponse;
//     },
//     enabled: !!mode && (mode === 'add' || !!id),
//   });

//   // Mutation for creating/updating customer
//   const customerMutation = useMutation({
//     mutationFn: (submitData: CustomerFormSubmitData) =>
//       mode === 'edit' && id
//         ? updateFormRecord('/api/v1/customers/update-customer', { ...submitData, masterId: Number(id) })
//         : createNewRecord('/api/v1/customers/create-customer', submitData),

//     onSuccess: () => {
//       const successMessage =
//         mode === 'edit'
//           ? 'Customer updated successfully!'
//           : 'Customer created successfully!';

//       notifications.show({
//         message: successMessage,
//         color: "green",
//       });

//       queryClient.invalidateQueries({ queryKey: ['customers'] });
//       queryClient.invalidateQueries({ queryKey: ['customerForm'] });

//       navigate('/customer-details');
//     },

//     onError: (error: Error) => {
//       console.error('Customer form submission error:', error);
//       notifications.show({
//         message: error.message || 'An error occurred while submitting the form',
//         color: "red",
//       });
//     },
//   });

//   // Handle form submission from FormContainer
//   const onFormSubmit = (formData: CustomerFormSubmitData) => {
//     customerMutation.mutate(formData);
//   };

//   // Handle back navigation
//   const onBack = () => {
//     navigate('/customer-details');
//   };

//   if (isLoadingFormData) {
//     return (
//       <Container p={10} m={0}>
//         <LoadingOverlay visible={true} />
//       </Container>
//     );
//   }

//   if (isFormDataError) {
//     return (
//       <Container p={10} m={0}>
//         <Alert color="red" title="Error" mb="md">
//           {formDataError?.message || 'Failed to load form data'}
//         </Alert>
//         <Button onClick={onBack} leftSection={<IconArrowLeft size={16} />}>
//           Back to Customers
//         </Button>
//       </Container>
//     );
//   }

//   return (
//     <Container p={10} m={0}>
//       {/* Header */}
//       <Group justify="space-between" mb="md">
//         <Group>
//           <Button 
//             variant="subtle" 
//             leftSection={<IconArrowLeft size={16} />}
//             onClick={onBack}
//           >
//             Back to Customers
//           </Button>
//           <Title order={2} size="h3">
//             {mode === 'edit' ? 'Edit Customer' : 'Add New Customer'}
//           </Title>
//         </Group>
//       </Group>

//       {/* Form Container with React Hook Form */}
//       {customerFormData && (
//         <FormContainer
//           mode={mode}
//           fields={customerFormData.fieldsMetaData || []}
//           initialData={customerFormData}
//           onSubmit={onFormSubmit}
//           isSubmitting={customerMutation.isPending}
//         />
//       )}

//       {/* Submission Error Alert */}
//       {customerMutation.isError && (
//         <Alert color="red" title="Submission Error" mt="md">
//           {customerMutation.error?.message || 'An error occurred while submitting the form. Please try again.'}
//         </Alert>
//       )}
//     </Container>
//   );
// };

// export default CustomerForm;