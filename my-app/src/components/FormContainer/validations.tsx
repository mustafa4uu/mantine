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
  description: {
    required: false, // Adjust as needed
    maxLength: 250,
    pattern: {
      value: /^[a-zA-Z0-9\s.,;:'"?!@#\/_\-&%*+,=()<>]{0,250}$/,
      message: "Description allows alphanumeric characters, spaces, and common punctuation (.,;:'\"?!@#/_-&%*+,=()<>).",
    },
  },

  registrationDate1: {
    required: false, // Set to false since required is now conditional
    validate: (value: string, formValues?: any) => {
      const description = formValues?.description;
      // Conditional required: if description is entered, registrationDate is required
      if (description && description.trim() !== '' && (!value || value.trim() === '')) {
        return 'Registration date is required when description is provided';
      }
      // Future date check if value is provided
      if (value && value.trim() !== '') {
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Allow up to end of today
        const regDate = new Date(value);
        if (regDate > today) {
          return 'Registration date cannot be in the future';
        }
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
  milkAmount: {
    required: false, // Set to false since required is now conditional
    validate: (value: number, formValues?: any) => {
      const description = formValues?.description;
      // Conditional required: if description is entered, milkAmount is required
      if (description && description.trim() !== '' && (value === undefined || value === null || value === '')) {
        return 'Milk Amount is required when description is provided';
      }
      // Non-negative number check if value is provided
      if (value !== undefined && value !== null && (isNaN(value) || value < 0)) {
        return 'Milk Amount must be a valid non-negative number';
      }
      return true;
    },
  },

  // serialNumber: {
  //   required: true,
  //   validate: async (value: string) => {
  //     if (!value || value.trim() === '') {
  //       return `${'Serial Number'} is required`;
  //     }
  //     try {
  //       const response = await fetch(`/api/check-serial?serial=${encodeURIComponent(value.trim())}`);
  //       const data = await response.json();
  //       if (data.exists) {
  //         return 'Serial number already exists';
  //       }
  //       return true;
  //     } catch (error) {
  //       console.error('Error checking serial number:', error);
  //       return 'Error checking serial number. Please try again.';
  //     }
  //   },
  // },
  // const calculateYearsDiff = (startDate: string | null, endDate: string | null): string => {
  //   if (!startDate || !endDate) return '';
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);
  //   if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return 'Invalid dates';
  //   const diffInMs = end.getTime() - start.getTime();
  //   const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
  //   return years.toString();
  // };
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