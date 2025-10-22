// components/FormContainer/FormContainer.tsx
import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Paper, SimpleGrid, Button, Group, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import FormComponent from './FormComponent';
import './FormContainer.css';

// Define interfaces locally since they're not imported
interface FormField {
  fieldName: string;
  fieldType: string;
  displayName: string;
  isRequired: boolean;
  validationRegs?: string;
  validationMsg?: string;
  maxLength?: number;
  dropDown?: Array<{ label: string; value: string; orderBy?: number }>;
}

interface FormSubmitData {
  [key: string]: any;
}

interface FormContainerProps {
  mode: string;
  fields: FormField[];
  initialData: { [key: string]: any };
  onSubmit: (formData: FormSubmitData) => void;
  isSubmitting?: boolean;
}

const FormContainer: React.FC<FormContainerProps> = ({
  mode,
  fields,
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
//   console.log({
//   mode,
//   fields,
//   initialData,
//   onSubmit,
//   isSubmitting,
// },'lllllllllll')
  // Initialize React Hook Form
  const methods = useForm<FormSubmitData>({
    mode: 'onChange',
    defaultValues: {},
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  // Initialize form data
  useEffect(() => {
    const defaultValues: FormSubmitData = {};
    
    fields.forEach((field: FormField) => {
      defaultValues[field.fieldName] = initialData[field.fieldName] ?? '';
    });
    
    reset(defaultValues);
  }, [fields, initialData, reset]);

  // Handle field changes with validation
  const handleFieldChange = (name: string, value: any) => {
    setValue(name, value, { shouldValidate: true });
  };

  // Handle form submission
  const onSubmitForm = (data: FormSubmitData) => {
    onSubmit(data);
  };

  // Handle form reset
  const handleReset = () => {
    const defaultValues: FormSubmitData = {};
    fields.forEach((field: FormField) => {
      defaultValues[field.fieldName] = initialData[field.fieldName] ?? '';
    });
    reset(defaultValues);
  };

  // Watch all form values to pass to FormComponent
  const formData = watch();

  // Check if form has errors
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Paper shadow="sm" p="md" radius="md" withBorder>
          {/* Form Validation Alert */}
          {hasErrors && (
            <Alert 
              icon={<IconAlertCircle size={16} />} 
              title="Form Validation Error" 
              color="red" 
              mb="lg"
            >
              Please fix the errors below before submitting the form.
            </Alert>
          )}

          {/* Form Fields Grid */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {fields.map((field, index) => (
              <div key={field.fieldName || index} className="form-field-container">
                <FormComponent
                  fieldType={field.fieldType}
                  name={field.fieldName}
                  label={field.displayName}
                  value={formData[field.fieldName]}
                  onChange={(value: any) => handleFieldChange(field.fieldName, value)}
                  options={field.dropDown}
                  placeholder={field.displayName}
                  maxLength={field.maxLength}
                  required={field.isRequired}
                  validationRegs={field.validationRegs}
                  validationMsg={field.validationMsg}
                  mode={mode}
                  error={errors[field.fieldName]?.message as string}
                />
              </div>
            ))}
          </SimpleGrid>

          {/* Form Actions */}
          <Group justify="flex-end" mt="xl">
            {mode !== 'edit' && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset All
              </Button>
            )}
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting || hasErrors}
            >
              {mode === 'edit' ? 'Update Customer' : 'Add Customer'}
            </Button>
          </Group>
        </Paper>
      </form>
    </FormProvider>
  );
};

export default FormContainer;