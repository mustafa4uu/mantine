// validations.ts
// import { FieldValues } from 'react-hook-form'; // Remove this line if FieldValues is not available in your react-hook-form version

interface CustomValidation {
  required?: boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
  validate?: (value: any, formValues?: any) => string | boolean | Promise<string | boolean>;
  maxLength?: number;
  // Add other rule types as needed
}

export const customValidations: Record<string, CustomValidation> = {
  issuerName: {
    required: true,
    pattern: {
      value: /^[a-zA-Z0-9 .'_&-]+$/,
      message: "Issuer name must not contain special characters except '.', '_', '-', '&'",
    },
  },
  registrationDate: {
    required: true,
    validate: (value: string) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Allow up to end of today
      const regDate = new Date(value);
      if (regDate > today) {
        return 'Registration date cannot be in the future';
      }
      return true;
    },
  },
  rollNo1: {
    required: false, // Adjust as needed
    pattern: {
      value: /^\d{1,5}$/,
      message: "Roll No must be numeric and up to 5 digits",
    },
    maxLength: 5,
  },
  rollNo: {
    required: false, // Adjust as needed
    min: 0,
    max: 99999,
    validate: (value: number) => {
      if (value !== undefined && value !== null && (value < 0 || value > 99999)) {
        return "Roll No must be numeric and up to 5 digits";
      }
      return true;
    },
  },

  agreementDate: {
    required: true,
    validate: (value: string, formValues?: any) => {
      if (!value) return true;
      const regDateValue = formValues?.registrationDate;
      if (!regDateValue) return 'Registration date is required before validating agreement date';
      const regDate = new Date(regDateValue);
      const agrDate = new Date(value);
      if (agrDate <= regDate) {
        return 'Agreement date must be greater than registration date';
      }
      return true;
    },
  },
  // Add other field-specific validations here, e.g., from metadata
  // For example, for pinCode:
  // pinCode: {
  //   pattern: {
  //     value: /^\d{6}$/,
  //     message: 'Please Enter a Valid Pincode',
  //   },
  // },
  // Extend as needed for other fields like ucifId, emailId, etc.
};