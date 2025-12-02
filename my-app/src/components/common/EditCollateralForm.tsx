import React, { useState } from 'react';
import { Button, TextInput, Select, NumberInput, Group, Stack, Accordion } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconChevronDown } from '@tabler/icons-react';

const EditCollateralForm = () => {
  const [active, setActive] = useState<string | null>('0'); // Track active accordion index, first open by default

  // Sample data for selects
  const propertyTypes = ['Apartment', 'House', 'Commercial Building', 'Land'];
  const propertyPurposes = ['Residential', 'Commercial', 'Industrial', 'Mixed Use'];
  const ownershipTypes = ['Freehold', 'Leasehold', 'Joint Ownership'];
  const ownershipNatures = ['Sole Ownership', 'Joint Ownership', 'Trust'];
  const measurementUnits = ['Sq Ft', 'Sq M', 'Acres', 'Hectares'];

  // Proper form handling with useForm
  const form = useForm({
    initialValues: {
      propertyType: '',
      propertyPurpose: '',
      ownershipType: '',
      ownershipNature: '',
      leasePeriodAvailable: 0,
      registeredOwner: '',
      registrationNumber: '',
      numberOfUnits: 0,
      measurementUnit: '',
      propertySize: 0,
      // Add fields for other sections as needed, e.g.,
      // valuationAmount: '',
      // valuatorName: '',
      // streetAddress: '',
      // city: '',
      // state: '',
      // zipCode: '',
      // country: '',
      // additionalNotes: '',
      // collateralMapping: '',
    },
  });

  const handleSaveDraft = (values: typeof form.values) => {
    console.log('Save as Draft:', values);
    // Implement draft save logic here (e.g., API call)
  };

  const handleSaveAndClose = (values: typeof form.values) => {
    console.log('Save and Close:', values);
    // Implement save and close logic here (e.g., API call, then navigate away)
  };

  const handleNext = () => {
    if (form.validate()) {
      console.log('Next clicked, form valid:', form.values);
      // Implement next logic here (e.g., navigate to next page)
    }
  };

  const clearPropertyDetails = () => {
    form.setFieldValue('propertyType', '');
    form.setFieldValue('propertyPurpose', '');
    form.setFieldValue('ownershipType', '');
    form.setFieldValue('ownershipNature', '');
    form.setFieldValue('leasePeriodAvailable', 0);
    form.setFieldValue('registeredOwner', '');
    form.setFieldValue('registrationNumber', '');
    form.setFieldValue('numberOfUnits', 0);
    form.setFieldValue('measurementUnit', '');
    form.setFieldValue('propertySize', 0);
  };

  const sections = [
    {
      value: '0',
      title: 'Property Details',
      content: (
        <Stack gap="md">
          <Group grow>
            <Select
              label="Property Type*"
              placeholder="Select property type"
              data={propertyTypes}
              {...form.getInputProps('propertyType')}
              required
            />
            <Select
              label="Property Purpose*"
              placeholder="Select purpose"
              data={propertyPurposes}
              {...form.getInputProps('propertyPurpose')}
              required
            />
            <Select
              label="Ownership Type*"
              placeholder="Select ownership type"
              data={ownershipTypes}
              {...form.getInputProps('ownershipType')}
              required
            />
          </Group>
          <Select
            label="Ownership Nature*"
            placeholder="Select ownership nature"
            data={ownershipNatures}
            {...form.getInputProps('ownershipNature')}
            required
          />
          <NumberInput
            label="Lease Period Available (Number of years)*"
            placeholder="0"
            {...form.getInputProps('leasePeriodAvailable')}
            required
          />
          <TextInput
            label="Registered Owner*"
            placeholder="Enter owner name"
            {...form.getInputProps('registeredOwner')}
            required
          />
          <TextInput
            label="Registration Number"
            placeholder="Enter registration number"
            {...form.getInputProps('registrationNumber')}
          />
          <Group grow>
            <NumberInput
              label="Number of Units"
              placeholder="0"
              {...form.getInputProps('numberOfUnits')}
            />
            <Select
              label="Measurement Unit"
              placeholder="Select unit"
              data={measurementUnits}
              {...form.getInputProps('measurementUnit')}
            />
            <NumberInput
              label="Property Size"
              placeholder="0"
              {...form.getInputProps('propertySize')}
            />
          </Group>
          <Button variant="light" color="red" onClick={clearPropertyDetails}>
            Clear All
          </Button>
        </Stack>
      ),
    },
    {
      value: '1',
      title: 'Property Valuation Details',
      content: (
        <Stack gap="md">
          <TextInput
            label="Valuation Amount"
            placeholder="Enter amount"
            // {...form.getInputProps('valuationAmount')} // Uncomment and add to initialValues
          />
          <TextInput
            label="Valuator Name"
            placeholder="Enter name"
            // {...form.getInputProps('valuatorName')} // Uncomment and add to initialValues
          />
        </Stack>
      ),
    },
    {
      value: '2',
      title: 'Property Address Details',
      content: (
        <Stack gap="md">
          <TextInput
            label="Street Address"
            placeholder="Enter street"
            // {...form.getInputProps('streetAddress')} // Uncomment and add to initialValues
          />
          <TextInput
            label="City"
            placeholder="Enter city"
            // {...form.getInputProps('city')} // Uncomment and add to initialValues
          />
          <TextInput
            label="State"
            placeholder="Enter state"
            // {...form.getInputProps('state')} // Uncomment and add to initialValues
          />
          <TextInput
            label="ZIP Code"
            placeholder="Enter ZIP"
            // {...form.getInputProps('zipCode')} // Uncomment and add to initialValues
          />
          <TextInput
            label="Country"
            placeholder="Enter country"
            // {...form.getInputProps('country')} // Uncomment and add to initialValues
          />
        </Stack>
      ),
    },
    {
      value: '3',
      title: 'Other Details',
      content: (
        <Stack gap="md">
          <TextInput
            label="Additional Notes"
            placeholder="Enter notes"
            // {...form.getInputProps('additionalNotes')} // Uncomment and add to initialValues
          />
          <TextInput
            label="Collateral Mapping"
            placeholder="Enter mapping"
            // {...form.getInputProps('collateralMapping')} // Uncomment and add to initialValues
          />
        </Stack>
      ),
    },
  ];

  return (
    <Stack>
      <Accordion
        multiple={false}
        value={active}
        onChange={setActive}
        styles={{
          control: {
            backgroundColor: 'white',
            color: 'black',
            paddingLeft: 'var(--mantine-spacing-md)',
            border: '1px solid #e0e0e0',
            borderRadius: '0',
            '&:hover': {
              backgroundColor: 'white',
            },
          },
          content: {
            padding: '0 var(--mantine-spacing-md)',
          },
          chevron: {
            marginLeft: 'auto',
          },
        }}
        chevronPosition="right"
        chevron={<IconChevronDown size={16} />}
      >
        {sections.map((section) => (
          <Accordion.Item key={section.value} value={section.value}>
            <Accordion.Control>{section.title}</Accordion.Control>
            <Accordion.Panel>{section.content}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Bottom buttons with save functionality */}
      <Group justify="flex-end" gap="md">
        <Button
          variant="outline"
          onClick={() => handleSaveDraft(form.values)}
        >
          Save as Draft
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSaveAndClose(form.values)}
        >
          Save and Close
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </Group>
    </Stack>
  );
};

export default EditCollateralForm;