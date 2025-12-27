import React, { useMemo, useState } from 'react';
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
import { APIDATA } from '../../constants';

// Parse AED value with commas (defined outside component to avoid redeclaration issues)
const parseAED = (aedString: string) => parseFloat(aedString.replace(/,/g, '')) || 0;

// data
const data = APIDATA;

const CollateralMapping = () => {
  // State for submit error
  const [submitError, setSubmitError] = useState<string>('');

  // State for edited collaterals (all by default)
  const initialEdited = data.collaterals.map(c => c.id);
  const [editedCollaterals, setEditedCollaterals] = useState<string[]>(initialEdited);

  const collaterals = useMemo(() => 
    data.collaterals.map(c => ({
      id: c.id,
      name: `${c.category} (${c.collateralId})`,
      usd: c.amount.currency === 'USD' ? c.amount.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : undefined,
      aed: c.amount.baseValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      description: c.description,
    })), 
    []
  );

  const facilities = useMemo(() => 
    data.facilities.map(f => ({
      name: f.name,
      desc: `${f.name} - ${f.limitId}`,
      proposedUSD: f.limitProposed.currency === 'USD' ? f.limitProposed.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : undefined,
      proposedAED: f.limitProposed.baseValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      utilizedUSD: f.limitUtilised.currency === 'USD' ? (f.limitUtilised.value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : undefined,
      utilizedAED: f.limitUtilised.baseValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    })), 
    []
  );

  // Compute total proposed AED and prop percs (static)
  const totalProposedAED = useMemo(() => 
    facilities.reduce((sum, f) => sum + parseAED(f.proposedAED), 0), 
    [facilities]
  );
  const propPercs = useMemo(() => 
    facilities.map(f => totalProposedAED > 0 ? ((parseAED(f.proposedAED) / totalProposedAED) * 100).toFixed(2) : '0.00'), 
    [facilities, totalProposedAED]
  );

  // Build default values - empty initially
  const defaultValuesObj = useMemo(() => ({}), []);

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: defaultValuesObj,
  });

  // Watch all form values for real-time updates
  const watchedValues = watch();

  const onSubmit = (formData: any) => {
    setSubmitError('');

    // Compute totalsCoverage to validate overall LTV and per collateral
    const totalsCoverage = {
      coverageDetails: {},
      ltvPct: 0
    };
    data.collaterals.forEach(col => {
      let sumPct = 0;
      let sumValue = 0;
      data.facilities.forEach((fac, fIdx) => {
        const cIdx = data.collaterals.findIndex(c => c.id === col.id);
        const isEdited = editedCollaterals.includes(col.id);
        let pct, value;

        if (!isEdited) {
          // Keep API value
          pct = fac.coverage[col.id]?.pct || 0;
          value = fac.coverage[col.id]?.value || 0;
        } else {
          // Use form data
          const model = formData[`model-${cIdx}`];
          const colAED = col.amount.baseValue; // Use original amount

          if (!model) {
            // Fallback to API if no model selected
            pct = fac.coverage[col.id]?.pct || 0;
            value = fac.coverage[col.id]?.value || 0;
          } else if (model === 'prop') {
            pct = formData[`perc-${cIdx}-${fIdx}`] || fac.coverage[col.id]?.pct || 0;
            value = formData[`abs-${cIdx}-${fIdx}`] || fac.coverage[col.id]?.value || 0;
          } else if (model === 'perc') {
            pct = formData[`perc-${cIdx}-${fIdx}`] || 0;
            value = (pct / 100) * colAED;
          } else if (model === 'abs') {
            value = formData[`abs-${cIdx}-${fIdx}`] || 0;
            pct = colAED > 0 ? (value / colAED) * 100 : 0;
          }
        }

        sumPct += pct;
        sumValue += value;
      });
      totalsCoverage.coverageDetails[col.id] = { pct: sumPct, value: sumValue };
    });

    let grandTotalValue = 0;
    let hasPerCollateralError = false;
    Object.entries(totalsCoverage.coverageDetails).forEach(([colId, det]: [string, any]) => {
      grandTotalValue += det.value;
      if (det.pct > 100) {
        hasPerCollateralError = true;
      }
    });
    totalsCoverage.ltvPct = totalProposedAED > 0 ? (grandTotalValue / totalProposedAED) * 100 : 0;

    // Validation: if overall LTV > 100% or any per-collateral > 100%, show error and prevent submit
    let errorMsg = '';
    if (hasPerCollateralError) {
      errorMsg += 'One or more collateral allocations exceed 100%. ';
    }
    if (totalsCoverage.ltvPct > 100) {
      errorMsg += 'Overall allocation exceeds 100%. ';
    }
    if (errorMsg) {
      setSubmitError(`${errorMsg.trim()} Please adjust the values.`);
      return;
    }

    // Construct payload
    const payload = {
      obligorid: "OB123", // Replace with actual obligor ID from data/context
      cpid: "CP456", // Replace with actual CP ID from data/context
      coverageUpdates: data.collaterals.map((col, cIdx) => {
        const model = formData[`model-${cIdx}`];
        let allocateModel: string;
        if (model === 'prop') allocateModel = 'PROPORTIONATE';
        else if (model === 'perc') allocateModel = 'PERCENTAGE';
        else if (model === 'abs') allocateModel = 'ABSOLUTE';
        else allocateModel = 'DEFAULT'; // Fallback

        const facilityCoverages = data.facilities.map((fac, fIdx) => {
          const isEdited = editedCollaterals.includes(col.id);
          let pct: number, value: number;

          if (!isEdited) {
            pct = fac.coverage[col.id]?.pct || 0;
            value = fac.coverage[col.id]?.value || 0;
          } else {
            const colAED = col.amount.baseValue;

            if (!model) {
              pct = fac.coverage[col.id]?.pct || 0;
              value = fac.coverage[col.id]?.value || 0;
            } else if (model === 'prop') {
              pct = parseFloat(formData[`perc-${cIdx}-${fIdx}`] || '0');
              value = parseFloat(formData[`abs-${cIdx}-${fIdx}`] || '0');
            } else if (model === 'perc') {
              pct = parseFloat(formData[`perc-${cIdx}-${fIdx}`] || '0');
              value = (pct / 100) * colAED;
            } else if (model === 'abs') {
              value = parseFloat(formData[`abs-${cIdx}-${fIdx}`] || '0');
              pct = colAED > 0 ? (value / colAED) * 100 : 0;
            }
          }

          return {
            facilityId: fac.limitId, // Assuming limitId is the facility ID
            coveragePercentage: parseFloat(pct.toFixed(2)),
            coverageValue: parseFloat(value.toFixed(2))
          };
        });

        // Calculate allocatedValue as sum of coverageValues for this collateral
        const allocatedValue = facilityCoverages.reduce((sum, fc) => sum + fc.coverageValue, 0);

        return {
          id: col.id,
          allocatedValue: parseFloat(allocatedValue.toFixed(2)),
          allocateModel,
          facilityCoverages
        };
      })
    };

    console.log('Submitted payload:', payload);
    // Here you can send the payload to your API endpoint
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

  const getHeaderBg = (rowIndex: number) => {
    if (rowIndex === 3) return '#f8f9fa';
    return 'white';
  };

  // Handle radio button change (only for edited)
  const handleModelChange = (cIdx: number, newModel: string) => {
    // Update the model value
    setValue(`model-${cIdx}`, newModel);
    
    const colAED = parseAED(collaterals[cIdx].aed);
    const colId = data.collaterals[cIdx].id;
    
    facilities.forEach((_, fIdx) => {
      const apiCov = data.facilities[fIdx].coverage[colId] || { pct: 0, value: 0 };
      let percToSet: number, valToSet: number;

      if (newModel === 'prop') {
        percToSet = parseFloat(propPercs[fIdx]);
        valToSet = (percToSet / 100) * colAED;
      } else if (newModel === 'perc') {
        percToSet = apiCov.pct;
        valToSet = (percToSet / 100) * colAED;
      } else if (newModel === 'abs') {
        valToSet = apiCov.value;
        percToSet = colAED > 0 ? (valToSet / colAED) * 100 : 0;
      }

      setValue(`perc-${cIdx}-${fIdx}`, percToSet, { shouldValidate: false });
      setValue(`abs-${cIdx}-${fIdx}`, valToSet, { shouldValidate: false });
    });
  };

  // Compute LTV for a facility row - memoized for performance
  const computeLTV = useMemo(() => {
    return facilities.map((f, fIdx) => {
      let totalValue = 0;
      const facilityAED = parseAED(f.proposedAED);
      if (facilityAED === 0) return '0.00';
      
      collaterals.forEach((col, cIdx) => {
        const isEdited = editedCollaterals.includes(col.id);
        let val = 0;
        
        if (!isEdited) {
          val = data.facilities[fIdx].coverage[col.id]?.value || 0;
        } else {
          const model = watchedValues[`model-${cIdx}`];
          const colId = col.id;
          if (!model) {
            val = data.facilities[fIdx].coverage[colId]?.value || 0;
          } else if (model === 'prop') {
            val = watchedValues[`abs-${cIdx}-${fIdx}`] || data.facilities[fIdx].coverage[colId]?.value || 0;
          } else if (model === 'perc') {
            const perc = watchedValues[`perc-${cIdx}-${fIdx}`] || 0;
            const colAED = parseAED(col.aed);
            val = (perc / 100) * colAED;
          } else {
            val = watchedValues[`abs-${cIdx}-${fIdx}`] || 0;
          }
        }
        totalValue += val;
      });
      return ((totalValue / facilityAED) * 100).toFixed(2);
    });
  }, [watchedValues, propPercs, collaterals, facilities, editedCollaterals]);

  // Compute total for a collateral column - memoized for performance
  const computeTotalForCol = useMemo(() => {
    return collaterals.map((col, cIdx) => {
      const isEdited = editedCollaterals.includes(col.id);
      const colAED = parseAED(col.aed);
      let totalValue = 0;
      
      facilities.forEach((_, fIdx) => {
        let val = 0;
        if (!isEdited) {
          val = data.facilities[fIdx].coverage[col.id]?.value || 0;
        } else {
          const model = watchedValues[`model-${cIdx}`];
          const colId = col.id;
          if (!model) {
            val = data.facilities[fIdx].coverage[colId]?.value || 0;
          } else if (model === 'prop') {
            val = watchedValues[`abs-${cIdx}-${fIdx}`] || data.facilities[fIdx].coverage[colId]?.value || 0;
          } else if (model === 'perc') {
            const perc = watchedValues[`perc-${cIdx}-${fIdx}`] || 0;
            val = (perc / 100) * colAED;
          } else {
            val = watchedValues[`abs-${cIdx}-${fIdx}`] || 0;
          }
        }
        totalValue += val;
      });
      
      const totalPerc = colAED > 0 ? (totalValue / colAED) * 100 : 0;
      return { 
        totalPerc: totalPerc.toFixed(2), 
        totalValue: totalValue.toFixed(2),
        exceeds: totalPerc > 100 
      };
    });
  }, [watchedValues, collaterals, facilities, propPercs, editedCollaterals]);

  // Compute overall LTV for total row - memoized for performance
  const computeOverallLTV = useMemo(() => {
    let totalAllocated = 0;
    computeTotalForCol.forEach((colTotal) => {
      totalAllocated += parseFloat(colTotal.totalValue);
    });
    const ltv = totalProposedAED > 0 ? ((totalAllocated / totalProposedAED) * 100).toFixed(2) : '0.00';
    return { ltv, exceeds: parseFloat(ltv) > 100 };
  }, [computeTotalForCol, totalProposedAED]);

  // Handle percentage change for a specific collateral and facility
  const handlePercentageChange = (cIdx: number, fIdx: number, value: number) => {
    const colAED = parseAED(collaterals[cIdx].aed);
    const calculatedValue = (value / 100) * colAED;
    
    // Update the value field
    setValue(`abs-${cIdx}-${fIdx}`, calculatedValue, { 
      shouldValidate: false, 
      shouldDirty: false 
    });
  };

  // Handle value change for a specific collateral and facility
  const handleValueChange = (cIdx: number, fIdx: number, value: number) => {
    const colAED = parseAED(collaterals[cIdx].aed);
    const calculatedPercentage = colAED > 0 ? (value / colAED) * 100 : 0;
    
    // Update the percentage field
    setValue(`perc-${cIdx}-${fIdx}`, calculatedPercentage, { 
      shouldValidate: false, 
      shouldDirty: false 
    });
  };

  // Format number to 2 decimal places
  const formatTwoDecimals = (num: any) => {
    if (num === null || num === undefined) return '0.00';
    const number = typeof num === 'number' ? num : parseFloat(num);
    return isNaN(number) ? '0.00' : number.toFixed(2);
  };

  // Get API coverage for a specific facility and collateral
  const getAPICoverage = (fIdx: number, colId: string) => {
    return data.facilities[fIdx].coverage[colId] || { pct: 0, value: 0 };
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
                {collaterals.map((col) => (
                  <Table.Th key={col.id} colSpan={2} bg="gray.0">
                    <Text size="xs" fw={700} c="dark">{col.name}</Text>
                    {col.usd && <Text size="xs" fw={500} c="dimmed">USD {col.usd}</Text>}
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
                {collaterals.map((col) => (
                  <Table.Th key={col.id} colSpan={2}>
                    <Text size="xs" fw={400} c="dimmed" style={{ whiteSpace: 'normal' }}>
                      {col.description}
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
                {collaterals.map((col, idx) => {
                  const isEdited = editedCollaterals.includes(col.id);
                  return (
                    <Table.Th key={col.id} colSpan={2}>
                      {isEdited ? (
                        <Controller
                          name={`model-${idx}`}
                          control={control}
                          render={({ field }) => (
                            <Radio.Group
                              value={field.value || undefined}
                              onChange={(value) => handleModelChange(idx, value)}
                              size="xs"
                            >
                              <Stack gap={4}>
                                <Radio value="prop" label="Proportionate" styles={{ label: { fontSize: 10 } }} />
                                <Radio value="perc" label="Percentage" styles={{ label: { fontSize: 10 } }} />
                                <Radio value="abs" label="Absolute" styles={{ label: { fontSize: 10 } }} />
                              </Stack>
                            </Radio.Group>
                          )}
                        />
                      ) : (
                        <Text size="xs" c="dimmed">Default (API)</Text>
                      )}
                    </Table.Th>
                  );
                })}
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
                {collaterals.map((col) => (
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
                        <Text size="10px" c="dimmed">AED {f.proposedAED}</Text>
                      </Stack>
                      <Stack gap={0}>
                        {f.utilizedUSD && <Text size="10px">USD {f.utilizedUSD}</Text>}
                        <Text size="10px" c="dimmed">AED {f.utilizedAED}</Text>
                      </Stack>
                    </Group>
                  </Table.Td>
                  {collaterals.map((col, cIdx) => {
                    const isEdited = editedCollaterals.includes(col.id);
                    const model = watchedValues[`model-${cIdx}`];
                    const colAED = parseAED(col.aed);
                    const colId = col.id;
                    const apiCoverage = getAPICoverage(fIdx, colId);
                    
                    if (!isEdited || !model) {
                      // Show API values (read-only)
                      return (
                        <React.Fragment key={`${fIdx}-${cIdx}`}>
                          <Table.Td><Text size="xs">{apiCoverage.pct}%</Text></Table.Td>
                          <Table.Td><Text size="xs">{formatTwoDecimals(apiCoverage.value)}</Text></Table.Td>
                        </React.Fragment>
                      );
                    } else if (model === 'prop') {
                      // Proportionate model - both fields are read-only, using set form values (proportionate)
                      const perc = watchedValues[`perc-${cIdx}-${fIdx}`] || parseFloat(propPercs[fIdx]);
                      const value = watchedValues[`abs-${cIdx}-${fIdx}`] || ((perc / 100) * colAED);
                      return (
                        <React.Fragment key={`${fIdx}-${cIdx}`}>
                          <Table.Td><Text size="xs">{formatTwoDecimals(perc)}%</Text></Table.Td>
                          <Table.Td><Text size="xs">{formatTwoDecimals(value)}</Text></Table.Td>
                        </React.Fragment>
                      );
                    } else if (model === 'perc') {
                      // Percentage model - show percentage input, value is calculated
                      const currentPerc = watchedValues[`perc-${cIdx}-${fIdx}`] || 0;
                      const calculatedValue = ((currentPerc / 100) * colAED);
                      
                      return (
                        <React.Fragment key={`${fIdx}-${cIdx}`}>
                          <Table.Td>
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
                                  onChange={(value) => {
                                    const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                    field.onChange(numValue);
                                    if (numValue !== null && !isNaN(numValue)) {
                                      handlePercentageChange(cIdx, fIdx, numValue);
                                    }
                                  }}
                                  value={field.value || 0}
                                />
                              )}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Text size="xs">{formatTwoDecimals(calculatedValue)}</Text>
                          </Table.Td>
                        </React.Fragment>
                      );
                    } else {
                      // Absolute model - show value input, percentage is calculated
                      const currentValue = watchedValues[`abs-${cIdx}-${fIdx}`] || 0;
                      const calculatedPerc = colAED > 0 ? ((currentValue / colAED) * 100) : 0;
                      
                      return (
                        <React.Fragment key={`${fIdx}-${cIdx}`}>
                          <Table.Td>
                            <Text size="xs">{formatTwoDecimals(calculatedPerc)}%</Text>
                          </Table.Td>
                          <Table.Td>
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
                                  onChange={(value) => {
                                    const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                    field.onChange(numValue);
                                    if (numValue !== null && !isNaN(numValue)) {
                                      handleValueChange(cIdx, fIdx, numValue);
                                    }
                                  }}
                                  value={field.value || 0}
                                />
                              )}
                            />
                          </Table.Td>
                        </React.Fragment>
                      );
                    }
                  })}
                  <Table.Td style={stickyRight} align="center">
                    <Text size="xs" fw={500}>{computeLTV[fIdx]}%</Text>
                  </Table.Td>
                </Table.Tr>
              ))}

              {/* Total Row */}
              <Table.Tr bg="blue.0">
                <Table.Td style={{ ...stickyLeft, background: '#e7f5ff' }}>
                  <Text size="xs" fw={700}>Total Collateral Allocation</Text>
                </Table.Td>
                <Table.Td style={{ ...secondColSticky, background: '#e7f5ff' }} />
                {collaterals.map((_, cIdx) => {
                  const { totalPerc, totalValue, exceeds } = computeTotalForCol[cIdx];
                  return (
                    <React.Fragment key={`tot-${cIdx}`}>
                      <Table.Td>
                        <Text size="xs" fw={700} c={exceeds ? "red" : "dark"}>{totalPerc}%</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" fw={700} c={exceeds ? "red" : "dark"}>{totalValue}</Text>
                      </Table.Td>
                    </React.Fragment>
                  );
                })}
                <Table.Td style={{ ...stickyRight, background: '#e7f5ff' }} align="center">
                  <Text size="xs" fw={700} c={computeOverallLTV.exceeds ? "red" : "dark"}>{computeOverallLTV.ltv}%</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>

      {submitError && <Text c="red" size="sm" mt="md" ta="center">{submitError}</Text>}

      <Group justify="flex-end" mt="xl">
        <Button variant="default" radius="xl">Back</Button>
        <Button color="dark" radius="xl" px="xl" onClick={handleSubmit(onSubmit)}>Next</Button>
      </Group>
    </Container>
  );
};

export default CollateralMapping;