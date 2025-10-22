// components/FormComponent/FormComponent.tsx
import React from 'react';
import TextField from './field-types/TextField';
import DateField from './field-types/DateField';
import SelectField from './field-types/SelectField';
import AutocompleteField from './field-types/AutocompleteField';
import TextareaField from './field-types/TextareaField';
import NumberField from './field-types/NumberField';
import RadioField from './field-types/RadioField';
import CheckboxField from './field-types/CheckboxField';
import './FormComponent.css';

interface FormComponentProps {
  fieldType: string;
  name: string;
  label: string;
  options?: { label: string; value: string; orderBy?: number; id?: number }[];
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  regex?: string;
  regexmsg?: string;
  mode?: string;
  validationRegs?: string;
  validationMsg?: string;
}


const FormComponent: React.FC<FormComponentProps> = (props) => {
  const { fieldType } = props;
  // console.log(props,'hhhhhhhhhh')
  // Render appropriate field component based on fieldType
  const renderField = () => {
    switch (fieldType) {
      case "TEXT":
        return <TextField {...props} />;
        
      case "DATE":
        return <DateField {...props} />;
        
      case "SELECT":
        return <SelectField {...props} />;
        
      case "AUTOCOMPLETE":
        return <AutocompleteField {...props} />;
        
      case "TEXTAREA":
        return <TextareaField {...props} />;
        
      case "NUMBER":
        return <NumberField {...props} />;
        
      case "RADIO":
        return <RadioField {...props} />;
        
      case "CHECKBOX":
        return <CheckboxField {...props} />;
        
      default:
        console.warn(`Unsupported field type: ${fieldType}`);
        return <TextField {...props} />;
    }
  };

  return <div className="form-component">{renderField()}</div>;
};

export default FormComponent;