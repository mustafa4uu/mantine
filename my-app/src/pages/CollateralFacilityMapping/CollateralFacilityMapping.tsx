import React, { useMemo } from 'react';
import {
  Container,
  Title,
  Paper,
  Text,
  Radio,
  Group,
  Table,
  ScrollArea,
  Button,
  Stack,
  NumberInput,
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';

// Mock Data
const defaultCollaterals = [
  { id: '1', name: 'Land (C01234)', usd: '1000.00', aed: '3,672.50' },
  { id: '2', name: 'Aircraft (C01234)', usd: '1000.00', aed: '3,672.50' },
  { id: '3', name: 'Property (C01234)', usd: '1000.00', aed: '3,672.50' },
  { id: '4', name: 'Property (C02234)', usd: '1000.00', aed: '3,672.50' },
  { id: '5', name: 'Property (C02234)', usd: '8977.00', aed: '3,672.50' },
];

const facilities = [
  { name: 'Working Capital', desc: 'This is for the purpose...', proposedUSD: '1000.00', proposedAED: '3,672.50', utilizedUSD: '0.00', utilizedAED: '0.00' },
  { name: 'Fixed Funding', desc: 'This is for the purpose...', proposedUSD: null, proposedAED: '200.00', utilizedUSD: null, utilizedAED: '0.00' },
  { name: 'Non Funding', desc: 'This is for the purpose...', proposedUSD: '3000.00', proposedAED: '11,017.50', utilizedUSD: '0.00', utilizedAED: '0.00' },
  { name: 'Working Capital', desc: 'This is for the purpose...', proposedUSD: '4000.00', proposedAED: '14,690.00', utilizedUSD: '0.00', utilizedAED: '0.00' },
  { name: 'Term Loan', desc: 'This is for the purpose...', proposedUSD: '5000.00', proposedAED: '18,362.50', utilizedUSD: '0.00', utilizedAED: '0.00' },
  { name: 'Working Capital', desc: 'This is for the purpose...', proposedUSD: '2000.00', proposedAED: '7,345.00', utilizedUSD: '0.00', utilizedAED: '0.00' },
];

const CollateralMapping = () => {
  // Compute total proposed AED and prop percs (static)
  const totalProposedAED = useMemo(() => 
    facilities.reduce((sum, f) => sum + parseFloat(f.proposedAED || '0'), 0), 
    []
  );
  const propPercs = useMemo(() => 
    facilities.map(f => ((parseFloat(f.proposedAED || '0') / totalProposedAED) * 100).toFixed(2)), 
    [totalProposedAED]
  );

  // Build default values
  const defaultValuesObj = useMemo(() => {
    const obj = {};
    defaultCollaterals.forEach((col, cIdx) => {
      obj[`model-${cIdx}`] = ['prop', 'perc', 'prop', 'prop', 'abs'][cIdx];
      facilities.forEach((fac, fIdx) => {
        const perc = parseFloat(propPercs[fIdx]);
        const colAED = parseFloat(col.aed);
        const absVal = (perc / 100 * colAED).toFixed(2);
        obj[`perc-${cIdx}-${fIdx}`] = perc;
        obj[`abs-${cIdx}-${fIdx}`] = parseFloat(absVal);
      });
    });
    return obj;
  }, [propPercs]);

  const { control, handleSubmit, watch, getValues, reset } = useForm({
    defaultValues: defaultValuesObj,
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  // Define widths
  const FIRST_COL_WIDTH = 180;
  const SECOND_COL_WIDTH = 220;
  
  // Helper for Sticky Styles
  const emptyBoxStyle = { 
    position: 'sticky', 
    left: 0, 
    background: 'white', 
    zIndex: 3, 
    border: 'none',
    width: FIRST_COL_WIDTH,
  } as const;
  
  const stickyLeft = { 
    position: 'sticky', 
    left: 0, 
    background: 'white', 
    zIndex: 3, 
    borderRight: '1px solid #dee2e6',
    width: FIRST_COL_WIDTH,
  } as const;
  
  const secondColSticky = { 
    position: 'sticky', 
    left: FIRST_COL_WIDTH, 
    background: 'white', 
    zIndex: 3, 
    borderRight: '1px solid #dee2e6',
    width: SECOND_COL_WIDTH,
  } as const;
  
  const stickyRight = { 
    position: 'sticky', 
    right: 0, 
    background: 'white', 
    zIndex: 3, 
    borderLeft: '1px solid #dee2e6' 
  } as const;

  const getHeaderBg = (rowIndex) => {
    if (rowIndex === 3) return '#f8f9fa';
    return 'white';
  };

  // Compute LTV for a facility row
  const computeLTV = (fIdx) => {
    let totalValue = 0;
    const facilityAED = parseFloat(facilities[fIdx].proposedAED || '0');
    if (facilityAED === 0) return 0;
    defaultCollaterals.forEach((col, cIdx) => {
      const model = watch(`model-${cIdx}`);
      let val = 0;
      const colAED = parseFloat(col.aed);
      if (model === 'prop') {
        const perc = parseFloat(propPercs[fIdx]);
        val = (perc / 100) * colAED;
      } else if (model === 'perc') {
        const perc = getValues(`perc-${cIdx}-${fIdx}`) || 0;
        val = (perc / 100) * colAED;
      } else {
        val = getValues(`abs-${cIdx}-${fIdx}`) || 0;
      }
      totalValue += val;
    });
    return ((totalValue / facilityAED) * 100).toFixed(2);
  };

  // Compute total for a collateral column
  const computeTotalForCol = (cIdx) => {
    const model = watch(`model-${cIdx}`);
    const colAED = parseFloat(defaultCollaterals[cIdx].aed);
    let totalPerc = 0;
    let totalValue = 0;
    if (model === 'prop') {
      totalPerc = 100.00;
      totalValue = colAED;
    } else if (model === 'perc') {
      facilities.forEach((_, fIdx) => {
        const perc = getValues(`perc-${cIdx}-${fIdx}`) || 0;
        totalPerc += perc;
        totalValue += (perc / 100) * colAED;
      });
    } else {
      facilities.forEach((_, fIdx) => {
        const absVal = getValues(`abs-${cIdx}-${fIdx}`) || 0;
        totalValue += absVal;
      });
      totalPerc = (totalValue / colAED) * 100;
    }
    return { totalPerc: totalPerc.toFixed(2), totalValue: totalValue.toFixed(2) };
  };

  // Compute overall LTV for total row
  const computeOverallLTV = () => {
    let totalAllocated = 0;
    defaultCollaterals.forEach((col, cIdx) => {
      const { totalValue } = computeTotalForCol(cIdx);
      totalAllocated += parseFloat(totalValue);
    });
    return ((totalAllocated / totalProposedAED) * 100).toFixed(2);
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="md">
        <Title order={4} fw={500}>Select Collateral Allocation Model</Title>
        <Text size="xs" c="blue" style={{ cursor: 'pointer' }} onClick={() => reset()}>Clear All</Text>
      </Group>

      <Paper withBorder shadow="none" radius="xs" style={{ overflow: 'hidden' }}>
        <ScrollArea h={700} offsetScrollbars scrollbarSize={10}>
          <Table withColumnBorders withRowBorders verticalSpacing="md" style={{ minWidth: 1500, borderCollapse: 'separate', borderSpacing: 0 }}>
            <Table.Thead>
              {/* Row 1: Collateral Category & Amount */}
              <Table.Tr>
                <Table.Th w={FIRST_COL_WIDTH} style={emptyBoxStyle} />
                <Table.Th w={SECOND_COL_WIDTH} style={{ ...secondColSticky, background: getHeaderBg(0) }}>
                  <Text size="xs" fw={600} c="dimmed">Collateral Category</Text>
                  <Text size="xs" fw={600} c="dimmed" mt={5}>Collateral Amount</Text>
                </Table.Th>
                {defaultCollaterals.map((col) => (
                  <Table.Th key={col.id} colSpan={2} bg="gray.0">
                    <Text size="xs" fw={700} c="dark">{col.name}</Text>
                    <Text size="xs" fw={500} c="dimmed">USD {col.usd}</Text>
                    <Text size="xs" fw={500} c="dimmed">AED {col.aed}</Text>
                  </Table.Th>
                ))}
                <Table.Th w={120} style={stickyRight} />
              </Table.Tr>

              {/* Row 2: Description */}
              <Table.Tr>
                <Table.Th style={emptyBoxStyle} />
                <Table.Th style={{ ...secondColSticky, background: getHeaderBg(1) }}>
                  <Text size="xs" fw={600} c="dimmed">Collateral Description</Text>
                </Table.Th>
                {defaultCollaterals.map((col) => (
                  <Table.Th key={col.id} colSpan={2}>
                    <Text size="xs" fw={400} c="dimmed" style={{ whiteSpace: 'normal' }}>
                      This is for the purpose This is for the purpose...
                    </Text>
                  </Table.Th>
                ))}
                <Table.Th style={stickyRight} />
              </Table.Tr>

              {/* Row 3: Allocation Model */}
              <Table.Tr>
                <Table.Th style={emptyBoxStyle} />
                <Table.Th style={{ ...secondColSticky, background: getHeaderBg(2) }}>
                  <Text size="xs" fw={600} c="dimmed">Allocation Model</Text>
                </Table.Th>
                {defaultCollaterals.map((col, idx) => (
                  <Table.Th key={col.id} colSpan={2}>
                    <Controller
                      name={`model-${idx}`}
                      control={control}
                      render={({ field }) => (
                        <Radio.Group {...field} size="xs">
                          <Stack gap={4}>
                            <Radio value="prop" label="Proportionate" styles={{ label: { fontSize: 10 } }} />
                            <Radio value="perc" label="Percentage" styles={{ label: { fontSize: 10 } }} />
                            <Radio value="abs" label="Absolute" styles={{ label: { fontSize: 10 } }} />
                          </Stack>
                        </Radio.Group>
                      )}
                    />
                  </Table.Th>
                ))}
                <Table.Th style={stickyRight} />
              </Table.Tr>

              {/* Row 4: Column Headers */}
              <Table.Tr bg="gray.1">
                <Table.Th style={{ ...stickyLeft, background: '#f8f9fa' }}>
                  <Text size="xs" fw={700}>Facility Details</Text>
                </Table.Th>
                <Table.Th style={{ ...secondColSticky, background: '#f8f9fa' }}>
                  <Text size="xs" fw={700}>Facility Limit</Text>
                  <Group justify="space-between" mt={4}>
                    <Text size="10px" fw={600}>Proposed</Text>
                    <Text size="10px" fw={600}>Utilized</Text>
                  </Group>
                </Table.Th>
                {defaultCollaterals.map((col) => (
                  <React.Fragment key={`h-${col.id}`}>
                    <Table.Th colSpan={2} ta="center" bg="#f8f9fa">
                      <Text size="xs" fw={700}>Coverage</Text>
                      <Group justify="space-around" mt={4}>
                        <Text size="10px">Percentage</Text>
                        <Text size="10px">Value (AED)</Text>
                      </Group>
                    </Table.Th>
                  </React.Fragment>
                ))}
                <Table.Th style={{ ...stickyRight, background: '#f8f9fa' }}>
                  <Text size="xs" fw={700}>LTV Percentage</Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {facilities.map((f, fIdx) => (
                <Table.Tr key={fIdx}>
                  <Table.Td style={stickyLeft}>
                    <Text size="xs" fw={700}>{f.name}</Text>
                    <Text size="10px" c="dimmed" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{f.desc}</Text>
                  </Table.Td>
                  <Table.Td style={secondColSticky}>
                    <Group justify="space-between">
                      <Stack gap={0}>
                        {f.proposedUSD && <Text size="10px">USD {f.proposedUSD}</Text>}
                        {f.proposedAED && <Text size="10px" c="dimmed">AED {f.proposedAED}</Text>}
                      </Stack>
                      <Stack gap={0}>
                        {f.utilizedUSD && <Text size="10px">USD {f.utilizedUSD}</Text>}
                        {f.utilizedAED && <Text size="10px" c="dimmed">AED {f.utilizedAED}</Text>}
                      </Stack>
                    </Group>
                  </Table.Td>
                  {defaultCollaterals.map((col, cIdx) => {
                    const model = watch(`model-${cIdx}`);
                    const colAED = parseFloat(col.aed);
                    let percDisplay, valueDisplay;
                    if (model === 'prop') {
                      const perc = propPercs[fIdx];
                      const value = ((parseFloat(perc) / 100) * colAED).toFixed(2);
                      percDisplay = <Text size="xs">{perc} %</Text>;
                      valueDisplay = <Text size="xs">{value}</Text>;
                    } else if (model === 'perc') {
                      percDisplay = (
                        <Controller
                          name={`perc-${cIdx}-${fIdx}`}
                          control={control}
                          rules={{ min: 0, max: 100, valueAsNumber: true }}
                          render={({ field }) => (
                            <NumberInput
                              {...field}
                              size="xs"
                              min={0}
                              max={100}
                              suffix="%"
                              precision={2}
                            />
                          )}
                        />
                      );
                      const perc = getValues(`perc-${cIdx}-${fIdx}`) || 0;
                      const value = ((perc / 100) * colAED).toFixed(2);
                      valueDisplay = <Text size="xs">{value}</Text>;
                    } else { // abs
                      valueDisplay = (
                        <Controller
                          name={`abs-${cIdx}-${fIdx}`}
                          control={control}
                          rules={{ min: 0, max: colAED, valueAsNumber: true }}
                          render={({ field }) => (
                            <NumberInput
                              {...field}
                              size="xs"
                              min={0}
                              max={colAED}
                              precision={2}
                            />
                          )}
                        />
                      );
                      const absVal = getValues(`abs-${cIdx}-${fIdx}`) || 0;
                      const perc = ((absVal / colAED) * 100).toFixed(2);
                      percDisplay = <Text size="xs">{perc} %</Text>;
                    }
                    return (
                      <React.Fragment key={`${fIdx}-${cIdx}`}>
                        <Table.Td>{percDisplay}</Table.Td>
                        <Table.Td>{valueDisplay}</Table.Td>
                      </React.Fragment>
                    );
                  })}
                  <Table.Td style={stickyRight} align="center">
                    <Text size="xs" fw={500}>{computeLTV(fIdx)}%</Text>
                  </Table.Td>
                </Table.Tr>
              ))}

              {/* Total Row */}
              <Table.Tr bg="blue.0">
                <Table.Td style={{ ...stickyLeft, background: '#e7f5ff' }}>
                  <Text size="xs" fw={700}>Total Collateral Allocation</Text>
                </Table.Td>
                <Table.Td style={{ ...secondColSticky, background: '#e7f5ff' }} />
                {defaultCollaterals.map((_, cIdx) => {
                  const { totalPerc, totalValue } = computeTotalForCol(cIdx);
                  return (
                    <React.Fragment key={`tot-${cIdx}`}>
                      <Table.Td><Text size="xs" fw={700}>{totalPerc}%</Text></Table.Td>
                      <Table.Td><Text size="xs" fw={700}>{totalValue}</Text></Table.Td>
                    </React.Fragment>
                  );
                })}
                <Table.Td style={{ ...stickyRight, background: '#e7f5ff' }} align="center">
                  <Text size="xs" fw={700}>{computeOverallLTV()}%</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      <Group justify="flex-end" mt="xl">
        <Button variant="default" radius="xl">Back</Button>
        <Button color="dark" radius="xl" px="xl" onClick={handleSubmit(onSubmit)}>Next</Button>
      </Group>
    </Container>
  );
};

export default CollateralMapping;