// components/FormContainer/FormContainer.tsx
import React, {useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Paper, SimpleGrid, Button, Group, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import FormComponent from './FormComponent';
import './FormContainer.css';

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
  const [isSaveAsDraft, setIsSaveAsDraft] = useState(false);
  const methods = useForm<FormSubmitData>({
    mode: 'onBlur', // triggers validation on blur and submit
    defaultValues: {},
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  // Initialize form data when API returns
  useEffect(() => {
    const defaultValues: FormSubmitData = {};
    fields.forEach((field) => {
      let fieldValue = initialData[field.fieldName] ?? '';
      // For AUTOCOMPLETE fields, extract the value (ID) if it's an object
      if (field.fieldType === 'AUTOCOMPLETE' && typeof fieldValue === 'object' && fieldValue !== null && 'value' in fieldValue) {
        fieldValue = fieldValue.value ?? '';
      }
      defaultValues[field.fieldName] = fieldValue;
    });
    reset(defaultValues);
  }, [fields, initialData, reset]);

  const onSubmitForm = (data: FormSubmitData) => {
    onSubmit(data);
  };

  const hasErrors = Object.keys(errors).length > 0;
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Paper shadow="sm" p="md" radius="md" withBorder>
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

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {fields.map((field, index) => (
              <div key={field.fieldName || index} className="form-field-container">
                <FormComponent
                  field={field}
                  mode={mode}
                  isSaveAsDraft={isSaveAsDraft}
                  isFirstField={index === 0}
                />
              </div>
            ))}
          </SimpleGrid>

          <Group justify="flex-end" mt="xl">
            {mode !== 'edit' && (
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Reset All
              </Button>
            )}
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={() => setIsSaveAsDraft(true)}
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {mode === 'edit' ? 'Update Address' : 'Add New Address'}
            </Button>
          </Group>
        </Paper>
      </form>
    </FormProvider>
  );
};

export default FormContainer;