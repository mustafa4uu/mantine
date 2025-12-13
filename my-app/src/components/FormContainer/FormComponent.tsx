import React from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import TextField from '../field-types/TextField';
import DateField from '../field-types/DateField';
import SelectField from '../field-types/SelectField';
import AutocompleteField from '../field-types/AutocompleteField';
import TextareaField from '../field-types/TextareaField';
import NumberField from '../field-types/NumberField';
import RadioField from '../field-types/RadioField';
import CheckboxField from '../field-types/CheckboxField';
import { customValidations } from './validations'; // Adjust path as needed

interface FormField {
  fieldName: string;
  fieldType: string;
  displayName: string;
  isRequired: boolean;
  isVisible?: boolean;
  validationRegs?: string;
  validationMsg?: string;
  maxLength?: number;
  dropDown?: Array<{ label: string; value: string; orderBy?: number }>;
}

interface FormComponentProps {
  field: FormField;
  mode?: string;
  isSaveAsDraft?: boolean;
  isFirstField?: boolean;
}

const FormComponent: React.FC<FormComponentProps> = ({ field, mode, isSaveAsDraft, isFirstField }) => {
  const { control, formState: { errors }, trigger, getValues } = useFormContext();
  const locationCodeValue = useWatch({ control, name: 'locationCode' });
  const validationRules: Record<string, any> = {};
  
  // If field is not visible, skip all validation
  if (field.isVisible === false) {
    return (
      <Controller
        name={field.fieldName}
        control={control}
        render={({ field: { onChange, value } }) => (
          <input
            type="hidden"
            name={field.fieldName}
            value={value ?? ''}
            onChange={onChange}
          />
        )}
      />
    );
  }

  // Apply required validation: All in normal mode; only first required in draft
  // Override with custom if specified
  let shouldValidateRequired = (!isSaveAsDraft && field.isRequired) || (isSaveAsDraft && isFirstField && field.isRequired);
  if (customValidations[field.fieldName]?.required) {
    shouldValidateRequired = !isSaveAsDraft || (isSaveAsDraft && isFirstField);
  }
  if (shouldValidateRequired) {
    validationRules.required = `${field.displayName} is required`;
  }

  // Other validations only in normal mode
  if (!isSaveAsDraft && field.validationRegs) {
    validationRules.pattern = {
      value: new RegExp(field.validationRegs),
      message: field.validationMsg || `${field.displayName} is invalid`,
    };
  }

  if (!isSaveAsDraft && field.maxLength) {
    validationRules.maxLength = {
      value: field.maxLength,
      message: `${field.displayName} must be at most ${field.maxLength} characters`,
    };
  }

  // Merge with custom validations
  const custom = customValidations[field.fieldName];
  if (custom) {
    if (custom.pattern) {
      validationRules.pattern = custom.pattern;
    }
    if (custom.maxLength !== undefined) {
      validationRules.maxLength = {
        value: custom.maxLength,
        message: `${field.displayName} must be at most ${custom.maxLength} characters`,
      };
    }
    if (custom.validate) {
      validationRules.validate = custom.validate;
    }
  }

  const error = errors[field.fieldName]?.message as string | undefined;

  // Define onBlur handler to trigger validation on blur (for regex/pattern, etc.)
  const handleBlur = () => {
    if (!isSaveAsDraft && (field.validationRegs || field.maxLength || custom?.pattern || custom?.validate || custom?.maxLength)) {
      trigger(field.fieldName);
    }
  };

  return (
    <Controller
      name={field.fieldName}
      control={control}
      rules={validationRules}
      render={({ field: { onChange, value, onBlur: fieldOnBlur } }) => {
        const commonProps = {
          name: field.fieldName,
          label: field.displayName,
          value: value ?? '',
          onChange,
          onBlur: (e: any) => {
            fieldOnBlur?.(e);
            handleBlur();
          },
          error,
          mode,
          required: shouldValidateRequired, // Consistent with validation rule (star only where enforced)
          maxLength: field.maxLength ?? custom?.maxLength,
          placeholder: field.displayName,
        };

        switch (field.fieldType) {
          case 'TEXT':
            return <TextField {...commonProps} />;
          case 'DATE':
            return <DateField {...commonProps} />;
          case 'SELECT':
            const selectProps = {
              ...commonProps,
              options: field.dropDown,
            };
            if (field.fieldName === 'country') {
              selectProps.branchId = locationCodeValue;
            }
            return <SelectField {...selectProps} />;
          case 'AUTOCOMPLETE':
            return <AutocompleteField {...commonProps} />;
          case 'TEXTAREA':
            return <TextareaField {...commonProps} />;
          case 'NUMBER':
            return <NumberField {...commonProps} />;
          case 'RADIO':
            return <RadioField {...commonProps} options={field.dropDown} />;
          case 'CHECKBOX':
            return <CheckboxField {...commonProps} options={field.dropDown} />;
          default:
            return <TextField {...commonProps} />;
        }
      }}
    />
  );
};

export default FormComponent;