import React, { useState } from 'react';
import { Button, TextInput, Select, NumberInput, Group, Stack, Title, Box } from '@mantine/core';
import { IconPlus, IconMinus } from '@tabler/icons-react';

const EditCollateralForm = () => {
  const [active, setActive] = useState(0); // Track active section index (0 for first open by default)

  // Sample data for selects
  const propertyTypes = ['Apartment', 'House', 'Commercial Building', 'Land'];
  const propertyPurposes = ['Residential', 'Commercial', 'Industrial', 'Mixed Use'];
  const ownershipTypes = ['Freehold', 'Leasehold', 'Joint Ownership'];
  const ownershipNatures = ['Sole Ownership', 'Joint Ownership', 'Trust'];
  const measurementUnits = ['Sq Ft', 'Sq M', 'Acres', 'Hectares'];

  // Form state (simplified, use useForm for full validation)
  const [formValues, setFormValues] = useState({
    propertyType: '',
    propertyPurpose: '',
    ownershipType: '',
    ownershipNature: '',
    purchaseLeaseDate: null,
    leaseExpiryDate: null,
    leasePeriodAvailable: 0,
    registeredOwner: '',
    registrationNumber: '',
    numberOfUnits: 0,
    measurementUnit: '',
    propertySize: 0,
    // Add more for other sections as needed
  });

  const updateFormValue = (key:any, value:any) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const toggleSection = (sectionId:any) => {
    setActive(active === sectionId ? -1 : sectionId);
  };

  const sections = [
    {
      id: 0,
      title: 'Property Details',
      content: (
        <Stack gap="md">
          <Group grow>
            <Select
              label="Property Type*"
              placeholder="Select property type"
              data={propertyTypes}
              value={formValues.propertyType}
              onChange={(value) => updateFormValue('propertyType', value)}
              required
            />
            <Select
              label="Property Purpose*"
              placeholder="Select purpose"
              data={propertyPurposes}
              value={formValues.propertyPurpose}
              onChange={(value) => updateFormValue('propertyPurpose', value)}
              required
            />
            <Select
              label="Ownership Type*"
              placeholder="Select ownership type"
              data={ownershipTypes}
              value={formValues.ownershipType}
              onChange={(value) => updateFormValue('ownershipType', value)}
              required
            />
          </Group>
          <Select
            label="Ownership Nature*"
            placeholder="Select ownership nature"
            data={ownershipNatures}
            value={formValues.ownershipNature}
            onChange={(value) => updateFormValue('ownershipNature', value)}
            required
          />
          {/* <Group grow>
            <DatePicker
              label="Purchase/Lease Date"
              placeholder="Pick a date"
              value={formValues.purchaseLeaseDate}
              onChange={(value) => updateFormValue('purchaseLeaseDate', value)}
            />
            <DatePicker
              label="Lease Expiry Date*"
              placeholder="Pick a date"
              value={formValues.leaseExpiryDate}
              onChange={(value) => updateFormValue('leaseExpiryDate', value)}
              required
            />
          </Group> */}
          <NumberInput
            label="Lease Period Available (Number of years)*"
            placeholder="0"
            value={formValues.leasePeriodAvailable}
            onChange={(value) => updateFormValue('leasePeriodAvailable', value)}
            required
          />
          <TextInput
            label="Registered Owner*"
            placeholder="Enter owner name"
            value={formValues.registeredOwner}
            onChange={(e) => updateFormValue('registeredOwner', e.currentTarget.value)}
            required
          />
          <TextInput
            label="Registration Number"
            placeholder="Enter registration number"
            value={formValues.registrationNumber}
            onChange={(e) => updateFormValue('registrationNumber', e.currentTarget.value)}
          />
          <Group grow>
            <NumberInput
              label="Number of Units"
              placeholder="0"
              value={formValues.numberOfUnits}
              onChange={(value) => updateFormValue('numberOfUnits', value)}
            />
            <Select
              label="Measurement Unit"
              placeholder="Select unit"
              data={measurementUnits}
              value={formValues.measurementUnit}
              onChange={(value) => updateFormValue('measurementUnit', value)}
            />
            <NumberInput
              label="Property Size"
              placeholder="0"
              value={formValues.propertySize}
              onChange={(value) => updateFormValue('propertySize', value)}
            />
          </Group>
          <Button variant="light" color="red" onClick={() => {/* Clear logic */}}>
            Clear All
          </Button>
        </Stack>
      )
    },
    {
      id: 1,
      title: 'Property Valuation Details',
      content: (
        <Stack gap="md">
          {/* Placeholder form fields for valuation */}
          <TextInput label="Valuation Amount" placeholder="Enter amount" />
          {/* <DatePicker label="Valuation Date" placeholder="Pick date" /> */}
          <TextInput label="Valuator Name" placeholder="Enter name" />
          {/* Add more fields as needed */}
        </Stack>
      )
    },
    {
      id: 2,
      title: 'Property Address Details',
      content: (
        <Stack gap="md">
          {/* Placeholder form fields for address */}
          <TextInput label="Street Address" placeholder="Enter street" />
          <TextInput label="City" placeholder="Enter city" />
          <TextInput label="State" placeholder="Enter state" />
          <TextInput label="ZIP Code" placeholder="Enter ZIP" />
          <TextInput label="Country" placeholder="Enter country" />
          {/* Add more fields as needed */}
        </Stack>
      )
    },
    {
      id: 3,
      title: 'Other Details',
      content: (
        <Stack gap="md">
          {/* Placeholder form fields for other details */}
          <TextInput label="Additional Notes" placeholder="Enter notes" />
          <TextInput label="Collateral Mapping" placeholder="Enter mapping" />
          {/* Add more fields as needed */}
        </Stack>
      )
    }
  ];

  return (
    <Stack>
      {sections.map((section) => (
        <Box key={section.id}>
          <Button
            fullWidth
            variant="default"
            onClick={() => toggleSection(section.id)}
            rightSection={active === section.id ? <IconMinus size={16} /> : <IconPlus size={16} />}
            styles={{
              root: {
                backgroundColor: 'white',
                color: 'black',
                paddingLeft: 'var(--mantine-spacing-md)', // Minimal left padding to start text near left edge
                border: '1px solid #e0e0e0',
                borderRadius: '0',
              },
              section: {
                marginLeft: 'auto', // Ensures rightSection (icon) is pushed to the far right
              },
            }}
          >
            {section.title}
          </Button>
          <Box
            style={{
              display: active === section.id ? 'block' : 'none',
              padding: '0 var(--mantine-spacing-md)',
            }}
          >
            {section.content}
          </Box>
        </Box>
      ))}

      {/* Bottom buttons */}
      <Group justify="flex-end" gap="md">
        <Button variant="outline">Save as Draft</Button>
        <Button variant="outline">Save and Close</Button>
        <Button>Next</Button>
      </Group>
    </Stack>
  );
};

export default EditCollateralForm;