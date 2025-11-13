import React, { useState } from 'react';
import {
  Title,
  Text,
  Grid,
  TextInput,
  Select,
  Textarea,
  Button,
  Group,
  Table,
  Badge,
  Divider,
  Stack,
  Container,
  FileInput,
  NumberInput,
  Space,
  Card,
  ActionIcon,
  Progress,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconUpload, IconDownload, IconPlus, IconSearch, IconCheck, IconX } from '@tabler/icons-react';
import * as XLSX from 'xlsx';
import { useForm } from '@mantine/form';
import '@mantine/dates/styles.css';

interface Collateral {
  id: string;
  name: string;
  type: string;
  category: string;
  currency: string;
  value: number;
  chargeType: string;
  seniority: string;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  description: string;
  remarks: string;
  linkedFacilities: string[];
  cpId: string;
}

const AddCollateral: React.FC = () => {
  const [collaterals, setCollaterals] = useState<Collateral[]>([
    {
      id: 'COL003',
      name: 'Real Estate',
      type: 'Real Estate',
      category: 'Commercial',
      currency: 'AID',
      value: 3245,
      chargeType: 'Mortgage',
      seniority: 'First',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'Approved',
      description: 'A brief description about the collateral email.',
      remarks: 'Initial collateral entry',
      linkedFacilities: ['GBO5322', 'FAC001', 'FAC002'],
      cpId: 'FAC006'
    }
  ]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[][] | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationCompleted, setValidationCompleted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [currentSize, setCurrentSize] = useState(0);

  const form = useForm<Partial<Collateral>>({
    initialValues: {
      type: '',
      category: '',
      currency: '',
      value: 0,
      chargeType: '',
      seniority: '',
      startDate: null,
      endDate: null,
      status: 'Proposed',
      description: 'A brief description about the collateral email.',
      remarks: ''
    },
    validate: {
      type: (value) => !value ? 'Collateral type is required' : null,
      category: (value) => !value ? 'Category is required' : null,
      currency: (value) => !value ? 'Currency is required' : null,
      value: (value) => !value || value <= 0 ? 'Valid value is required' : null,
      chargeType: (value) => !value ? 'Charge type is required' : null,
      seniority: (value) => !value ? 'Seniority is required' : null,
      startDate: (value) => !value ? 'Start date is required' : null,
    }
  });

  const collateralTypes = ['Real Estate', 'Cash', 'Inventory', 'Equipment', 'Securities', 'Vehicles'];
  const categories = ['Commercial', 'Residential', 'Industrial', 'Agricultural', 'Personal'];
  const currencies = ['AID', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
  const chargeTypes = ['Mortgage', 'Pledge', 'Lien', 'Charge', 'Hypothecation'];
  const seniorityTypes = ['First', 'Second', 'Third', 'Subordinated', 'Pari Passu'];
  const statusTypes = ['Proposed', 'Approved', 'Rejected', 'Expired', 'Active', 'Released'];

  const handleAddCollateral = (values: Partial<Collateral>) => {
    const collateral: Collateral = {
      id: `COL${String(collaterals.length + 1).padStart(3, '0')}`,
      name: values.type || '',
      type: values.type || '',
      category: values.category || '',
      currency: values.currency || '',
      value: values.value || 0,
      chargeType: values.chargeType || '',
      seniority: values.seniority || '',
      startDate: values.startDate || null,
      endDate: values.endDate || null,
      status: values.status || 'Proposed',
      description: values.description || '',
      remarks: values.remarks || '',
      linkedFacilities: [],
      cpId: `FAC${String(collaterals.length + 1).padStart(3, '0')}`
    };
    setCollaterals(prev => [...prev, collateral]);
    form.reset();
  };

  const handleFileSelect = (file: File | null) => {
    setErrors([]);
    setParsedData(null);
    setValidationCompleted(false);
    setIsValidating(false);
    setSelectedFile(null);

    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size === 0) {
      setErrors(['File is empty']);
      setSelectedFile(file);
      return;
    }

    if (file.size > maxSize) {
      setErrors([`File too large. Maximum size is ${maxSize / (1024 * 1024)} MB`]);
      setSelectedFile(file);
      return;
    }

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setErrors(['Please select a valid Excel file (.xlsx or .xls)']);
      setSelectedFile(file);
      return;
    }

    setSelectedFile(file);
    setTotalSize(file.size / 1024); // KB
    setCurrentSize(0);
    setIsValidating(true);

    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setCurrentSize(e.loaded / 1024);
      }
    };
    reader.onload = (e) => {
      setCurrentSize(totalSize);
      setIsValidating(false);
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;
        if (sheetNames.length === 0) {
          throw new Error('No sheets found in the file');
        }
        const worksheet = workbook.Sheets[sheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        if (jsonData.length < 2) {
          throw new Error('No data found. The file should contain at least headers and one data row.');
        }
        const headers = jsonData[0] as string[];
        const expectedHeaders = [
          'Collateral ID', 'Name', 'Type', 'Category', 'Currency', 'Value',
          'Charge Type', 'Seniority', 'Start Date', 'End Date', 'Status',
          'Description', 'Remarks', 'Linked Facilities', 'CP ID'
        ];
        const missing = expectedHeaders.filter(h => !headers.some(header => header.trim() === h));
        if (missing.length > 0) {
          throw new Error(`Missing required columns: ${missing.join(', ')}`);
        }
        if (Array.isArray(jsonData) && Array.isArray(jsonData[0])) {
            setParsedData(jsonData as any[][]);
        } else {
            console.error("Invalid data structure", jsonData);
        }
        setValidationCompleted(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Validation failed';
        setErrors([errorMsg]);
        setParsedData(null);
      }
    };
    reader.onerror = () => {
      setIsValidating(false);
      setErrors(['Failed to read file']);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmImport = () => {
    if (!parsedData || !validationCompleted) return;
    const importedCollaterals: Collateral[] = parsedData.slice(1).map((row: any[], index: number) => ({
      id: row[0] || `COL${String(collaterals.length + index + 1).padStart(3, '0')}`,
      name: row[1] || row[2] || '',
      type: row[2] || '',
      category: row[3] || '',
      currency: row[4] || '',
      value: Number(row[5]) || 0,
      chargeType: row[6] || '',
      seniority: row[7] || '',
      startDate: row[8] ? new Date(row[8]) : null,
      endDate: row[9] ? new Date(row[9]) : null,
      status: row[10] || 'Proposed',
      description: row[11] || '',
      remarks: row[12] || '',
      linkedFacilities: row[13] ? row[13].toString().split(',').map((f: string) => f.trim()) : [],
      cpId: row[14] || `FAC${String(collaterals.length + index + 1).padStart(3, '0')}`
    }));
    setCollaterals(prev => [...prev, ...importedCollaterals]);
    // Reset states
    setSelectedFile(null);
    setParsedData(null);
    setValidationCompleted(false);
    setIsValidating(false);
    setErrors([]);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(collaterals.map(col => ({
      'Collateral ID': col.id,
      'Name': col.name,
      'Type': col.type,
      'Category': col.category,
      'Currency': col.currency,
      'Value': col.value,
      'Charge Type': col.chargeType,
      'Seniority': col.seniority,
      'Start Date': col.startDate?.toISOString().split('T')[0],
      'End Date': col.endDate?.toISOString().split('T')[0],
      'Status': col.status,
      'Description': col.description,
      'Remarks': col.remarks,
      'Linked Facilities': col.linkedFacilities.join(', '),
      'CP ID': col.cpId
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Collateral Data');
    XLSX.writeFile(workbook, 'collateral_data.xlsx');
  };

  const downloadTemplate = () => {
    const template = [{
      'Collateral ID': 'COL001',
      'Name': 'Sample Collateral',
      'Type': 'Real Estate',
      'Category': 'Commercial',
      'Currency': 'USD',
      'Value': 100000,
      'Charge Type': 'Mortgage',
      'Seniority': 'First',
      'Start Date': '2024-01-01',
      'End Date': '2024-12-31',
      'Status': 'Approved',
      'Description': 'Sample description',
      'Remarks': 'Sample remarks',
      'Linked Facilities': 'FAC001, FAC002',
      'CP ID': 'CP001'
    }];
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'collateral_template.xlsx');
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Approved': 'green',
      'Proposed': 'blue',
      'Rejected': 'red',
      'Expired': 'gray',
      'Active': 'teal',
      'Released': 'violet'
    };
    return colors[status] || 'gray';
  };

  const rows = collaterals.map((collateral) => (
    <Table.Tr key={collateral.id}>
      <Table.Td>
        <Text fw={500}>{collateral.id}</Text>
      </Table.Td>
      <Table.Td>{collateral.name}</Table.Td>
      <Table.Td>{collateral.category}</Table.Td>
      <Table.Td>
        <Text fw={500}>{collateral.currency} {collateral.value.toLocaleString()}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Badge variant="light" color="blue">
            {collateral.linkedFacilities[0]}
          </Badge>
          {collateral.linkedFacilities.length > 1 && (
            <Badge variant="outline" color="gray">
              +{collateral.linkedFacilities.length - 1} more
            </Badge>
          )}
        </Group>
      </Table.Td>
      <Table.Td>{collateral.cpId}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(collateral.status)} variant="light">
          {collateral.status}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Download Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={2} mb="md">Download Template</Title>
          <Group align="flex-end">
            <Button
              leftSection={<IconDownload size={16} />}
              variant="light"
              onClick={downloadTemplate}
            >
              Download Template
            </Button>
            <Text size="sm" c="dimmed">Download sample template for import</Text>
          </Group>
          <Space h="md" />
          <Title order={3} mb="md">Import/Export Data</Title>
          <Group>
            <Button
              leftSection={<IconDownload size={16} />}
              onClick={exportToExcel}
            >
              Export to Excel
            </Button>
            <FileInput
              placeholder="Select Excel file"
              leftSection={<IconUpload size={16} />}
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              clearable
            />
          </Group>
          {selectedFile && (
            <Stack gap="sm" mt="md">
              <Group justify="apart" align="center">
                <Text fw={500} size="sm">{selectedFile.name}</Text>
                <ActionIcon
                  onClick={() => {
                    setSelectedFile(null);
                    setParsedData(null);
                    setValidationCompleted(false);
                    setIsValidating(false);
                    setErrors([]);
                    setCurrentSize(0);
                  }}
                  color="red"
                  variant="subtle"
                >
                  <IconX size={16} />
                </ActionIcon>
              </Group>
              <Text size="xs" c="dimmed">
                {Math.round(currentSize)} KB of {Math.round(totalSize)} KB
              </Text>
              <Progress
                value={(currentSize / totalSize) * 100}
                size="xs"
                color={validationCompleted ? "green" : isValidating ? "blue" : "gray"}
              />
              {isValidating && <Text size="xs" c="blue">Validating file...</Text>}
              {validationCompleted && (
                <Group gap="xs" justify="flex-start">
                  <IconCheck size={14} color="green" />
                  <Text size="xs" c="green">Validation Completed</Text>
                </Group>
              )}
              {errors.length > 0 && (
                <Text size="xs" c="red" span>
                  {errors.join('; ')}
                </Text>
              )}
              {validationCompleted && (
                <Group justify="flex-end" mt="xs">
                  <Button
                    size="xs"
                    onClick={handleConfirmImport}
                    leftSection={<IconUpload size={14} />}
                  >
                    Confirm
                  </Button>
                </Group>
              )}
            </Stack>
          )}
        </Card>
        <Divider />
        {/* New Collateral Form */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="md">New Collateral</Title>
         
          <form onSubmit={form.onSubmit(handleAddCollateral)}>
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Collateral Type"
                  placeholder="Select Type"
                  data={collateralTypes}
                  required
                  {...form.getInputProps('type')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Collateral Category"
                  placeholder="Select Category"
                  data={categories}
                  required
                  {...form.getInputProps('category')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Collateral Currency"
                  placeholder="Select Currency"
                  data={currencies}
                  required
                  {...form.getInputProps('currency')}
                />
              </Grid.Col>
            </Grid>
            <Grid gutter="md" mt="md">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <NumberInput
                  label="Collateral Value"
                  placeholder="Enter Value"
                  thousandSeparator=","
                  required
                  {...form.getInputProps('value')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Charge Type"
                  placeholder="Select Charge Type"
                  data={chargeTypes}
                  required
                  {...form.getInputProps('chargeType')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Seniority of Charge"
                  placeholder="Select Seniority"
                  data={seniorityTypes}
                  required
                  {...form.getInputProps('seniority')}
                />
              </Grid.Col>
            </Grid>
            <Grid gutter="md" mt="md">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <DatePickerInput
                  label="Start Date"
                  placeholder="Pick a Date"
                  required
                  {...form.getInputProps('startDate')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <DatePickerInput
                  label="End Date"
                  placeholder="Pick a Date"
                  {...form.getInputProps('endDate')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Select
                  label="Status"
                  data={statusTypes}
                  {...form.getInputProps('status')}
                />
              </Grid.Col>
            </Grid>
            <Grid gutter="md" mt="md">
              <Grid.Col span={12}>
                <Textarea
                  label="Description"
                  placeholder="A brief description about the collateral email."
                  autosize
                  minRows={3}
                  {...form.getInputProps('description')}
                />
              </Grid.Col>
            </Grid>
            <Grid gutter="md" mt="md">
              <Grid.Col span={12}>
                <Textarea
                  label="Remarks"
                  placeholder="Enter Remarks"
                  autosize
                  minRows={2}
                  {...form.getInputProps('remarks')}
                />
              </Grid.Col>
            </Grid>
            <Group justify="flex-start" mt="xl">
              <Button
                type="submit"
                leftSection={<IconPlus size={16} />}
                size="md"
              >
                Add Collateral
              </Button>
            </Group>
          </form>
        </Card>
        <Divider />
        {/* Search and Table Section */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <TextInput
              placeholder="Search by facility, description..."
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1, maxWidth: 400 }}
            />
            <Text size="sm" c="dimmed">
              {collaterals.length} record{collaterals.length !== 1 ? 's' : ''} selected
            </Text>
          </Group>
          <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm" striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Collateral ID</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Value</Table.Th>
                  <Table.Th>Linked Facilities</Table.Th>
                  <Table.Th>CP ID</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
        {/* Action Buttons */}
        <Group justify="space-between" mt="xl">
          <Group>
            <Button variant="default">Previous</Button>
            <Button variant="outline">Save as Draft</Button>
          </Group>
          <Button>Next</Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default AddCollateral;