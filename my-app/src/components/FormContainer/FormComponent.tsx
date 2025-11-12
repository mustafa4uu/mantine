import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '../field-types/TextField';
import DateField from '../field-types/DateField';
import SelectField from '../field-types/SelectField';
import AutocompleteField from '../field-types/AutocompleteField';
import TextareaField from '../field-types/TextareaField';
import NumberField from '../field-types/NumberField';
import RadioField from '../field-types/RadioField';
import CheckboxField from '../field-types/CheckboxField';

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

interface FormComponentProps {
  field: FormField;
  mode?: string;
  isSaveAsDraft?: boolean;
  isFirstField?: boolean;
}

const FormComponent: React.FC<FormComponentProps> = ({ field, mode, isSaveAsDraft, isFirstField }) => {
  const { control, formState: { errors } } = useFormContext();
  const validationRules: Record<string, any> = {};

  if ((!isSaveAsDraft && field.isRequired) || (isSaveAsDraft && isFirstField && field.isRequired)) {
    validationRules.required = `${field.displayName} is required`;
  }
  // if (field.isRequired) {
  //   validationRules.required = `${field.displayName} is required`;
  // }
  // Only apply pattern validation when not in draft mode
  if (!isSaveAsDraft && field.validationRegs) {
    validationRules.pattern = {
      value: new RegExp(field.validationRegs),
      message: field.validationMsg || `${field.displayName} is invalid`,
    };
  }
  // if (field.validationRegs) {
  //   validationRules.pattern = {
  //     value: new RegExp(field.validationRegs),
  //     message: field.validationMsg || `${field.displayName} is invalid`,
  //   };
  // }

  // Only apply maxLength validation when not in draft mode
  if (!isSaveAsDraft && field.maxLength) {
    validationRules.maxLength = {
      value: field.maxLength,
      message: `${field.displayName} must be at most ${field.maxLength} characters`,
    };
  }
  // if (field.maxLength) {
  //   validationRules.maxLength = {
  //     value: field.maxLength,
  //     message: `${field.displayName} must be at most ${field.maxLength} characters`,
  //   };
  // }

  const error = errors[field.fieldName]?.message as string | undefined;

  return (
    <Controller
      name={field.fieldName}
      control={control}
      rules={validationRules}
      render={({ field: { onChange, value } }) => {
        const commonProps = {
          name: field.fieldName,
          label: field.displayName,
          value: value ?? '',
          onChange,
          error,
          mode,
          // required: field.isRequired,
          required: field.isRequired && (!isSaveAsDraft || isFirstField), // Update required prop
          maxLength: field.maxLength,
          placeholder: field.displayName,
        };

        switch (field.fieldType) {
          case 'TEXT':
            return <TextField {...commonProps} />;
          case 'DATE':
            return <DateField {...commonProps} />;
          case 'SELECT':
            return <SelectField {...commonProps} options={field.dropDown} />;
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