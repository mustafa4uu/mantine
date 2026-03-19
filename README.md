import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
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
  Box,
  Card,
  Checkbox,
  Divider,
  ActionIcon,
} from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import _get from 'lodash.get';
import { formatCurrency } from '../../utils/common';
import './collateral-facility-mapping.css';
import { CoverageExceededModal } from '../common/CoverageExceededModal/CoverageExceededModal';
import { ConfirmationModal } from '../common/ConfirmationModal/ConfirmationModal';
import { IconChevronDown, IconChevronUp, IconChevronsUp, IconChevronsDown, IconMinus, IconPlus } from '@tabler/icons-react';
import { useI18n } from 'shared/useI18n';
import { COLLATERAL_NAMESPACE } from '../../constants/i18n.constants';

type CollateralFacilityCoverageProps = {
  mappingData?: any;
  obligorDetails?: any;
  initialData: Record<string, any>;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
  mode: string;
  setObligorId: (obligorId: string) => void;
  isViewMapping: boolean;
  hasFacilities?: boolean;
  hasCollaterals?: boolean;
};

const FIRST_COL_WIDTH = 190;
const SECOND_COL_WIDTH = 220;
const COLLATERAL_COL_WIDTH = 150;
const COLLATERAL_COL_WIDTH_COLLAPSED = 80;
const stickyLeft = {
  position: 'sticky' as const,
  left: 0,
  background: '#f8f9fa',
  zIndex: 3,
  borderRight: '1px solid #dee2e6',
};

const secondColSticky = {
  position: 'sticky' as const,
  left: FIRST_COL_WIDTH,
  background: '#f8f9fa',
  zIndex: 2,
  borderRight: '1px solid #dee2e6',
};
const secondStickyColr = { background: '#E7ECF3' };

const EmptyLeftTh: React.FC<{ width: number }> = ({ width }) => (
  <Table.Th
    w={width}
    style={{
      position: 'sticky',
      left: 0,
      zIndex: 4,
      border: 'none',
      padding: 0,
      background: 'transparent',
    }}
  >
    <Box style={{ position: 'absolute', inset: 0, background: 'white', pointerEvents: 'none', borderRight: '1px solid #dee2e6' }} />
  </Table.Th>
);

const findFacilityByIndex = (facilities: any[], targetIdx: number): any => {
  let currentIdx = 0;
  const traverse = (facList: any[]): any => {
    for (const facility of facList) {
      if (currentIdx === targetIdx) return facility;
      currentIdx++;
      if (facility.children) {
        const found = traverse(facility.children);
        if (found) return found;
      }
    }
    return null;
  };
  return traverse(facilities);
};

const TableHeader: React.FC<{
  defaultCollaterals: any[];
  isViewMapping: boolean;
  control: any;
  handleModelChange: (cIdx: number, newModel: string) => void;
  mapAtCpLevel?: boolean;
  headerMapChecked: Record<number, boolean>;
  headerMapIndeterminate: Record<number, boolean>;
  handleHeaderMapChange: (cIdx: number, checked: boolean) => void;
  expandAll: boolean;
  setExpandAll: (expand: boolean) => void;
  expandedCollaterals: Record<number, boolean>;
  toggleCollateralExpand: (cIdx: number) => void;
}> = ({
  defaultCollaterals,
  isViewMapping,
  control,
  handleModelChange,
  mapAtCpLevel,
  headerMapChecked,
  headerMapIndeterminate,
  handleHeaderMapChange,
  expandAll,
  setExpandAll,
  expandedCollaterals,
  toggleCollateralExpand,
}) => {
    const { t } = useI18n(COLLATERAL_NAMESPACE);
    if (defaultCollaterals.length === 0) return null;

    const handleExpandAll = () => {
      setExpandAll(prev => !prev);
    };
    return (
      <Table.Thead>
        <Table.Tr>
          <EmptyLeftTh width={FIRST_COL_WIDTH} />
          <Table.Th
            w={SECOND_COL_WIDTH}
            className="header-cell top-left-aligned"
            style={secondColSticky}
            pt="sm" pl="sm"
          >
            <Text size="sm" c="#262626" fw={600}>
              {t('customTable.collateralCategory')}
            </Text>
            <Text size="sm" c="#262626">
              {t('customTable.collAmount')}
              <Text span size="xs" c="red">**</Text>
            </Text>
          </Table.Th>

          {defaultCollaterals.map((col: any, idx: number) => (
            <Table.Th
              key={col.bid}
              colSpan={expandedCollaterals[idx] ? 3 : 1}
              className="header-cell top-left-aligned"
              style={{
                width: expandedCollaterals[idx]
                  ? COLLATERAL_COL_WIDTH * 3
                  : COLLATERAL_COL_WIDTH_COLLAPSED,
                background: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 4
              }}
            >
              <Group justify="space-between" wrap="nowrap" pt="sm" pl="sm">
                <Box style={{ overflow: 'hidden', flex: 1 }}>
                  <Text size="sm" fw={700} c={col.isChanged === 1 ? 'red' : '#262626'} truncate="end"
                    style={{ whiteSpace: expandedCollaterals[idx] ? 'normal' : 'normal', wordBreak: 'break-word' }}>
                    {expandedCollaterals[idx] ? `${col.category} (${col.collateralId})` : `${col.category?.slice(0, 5)} (${col.collateralId?.slice(0, 5)}...`}
                    {col.collateralStatus !== 'ACTIVE' && (<Text span c="red" truncate> {" "}— {t('customTable.expiredn')} </Text>)}
                  </Text>
                  {expandedCollaterals[idx] && (
                    <>
                      <Text size="sm" c="#262626" truncate="end">
                        {col.proposedAmount.currency}{" "}
                        {formatCurrency(col.proposedAmount.value)}
                      </Text>
                      <Text size="sm" c="dimmed" truncate="end">
                        {col.proposedAmount.baseCurrency}{" "}
                        {formatCurrency(col.proposedAmount.baseValue)}
                      </Text>
                    </>
                  )}
                </Box>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  onClick={() => toggleCollateralExpand(idx)}
                  style={{ flexShrink: 0 }}
                >
                  {expandedCollaterals[idx] ? (
                    <IconMinus size={14} />
                  ) : (
                    <IconPlus size={14} />
                  )}
                </ActionIcon>
              </Group>
            </Table.Th>
          ))}
        </Table.Tr>

        {/* Header Row 2 - Collateral Description (only shown when expanded) */}
        <Table.Tr>
          <EmptyLeftTh width={FIRST_COL_WIDTH} />
          <Table.Th className="header-cell" style={secondColSticky} pt="sm" pl="sm">
            <Text size="sm" fw={600} c="#262626">{t('customTable.collateralDescription')}</Text>
          </Table.Th>
          {defaultCollaterals.map((col: any, idx: number) => (
            <Table.Th
              key={col.bid}
              colSpan={expandedCollaterals[idx] ? 3 : 1}
              className="header-cell top-left-aligned"
              style={{
                ...(!expandedCollaterals[idx] ? { background: '#fff', border: '0', borderLeft: '0', borderRight: '0', borderTop: '0', borderBottom: '0' } : { background: 'white' }),
                position: 'sticky',
                top: 41,
                zIndex: 4
              }}
              pt="sm" pl="sm"
            >
              {expandedCollaterals[idx] ? (
                <Text className="des" size="sm" c="#4F4F4F" truncate="end">{col.description}.</Text>
              ) : (
                <Box>&nbsp;</Box>
              )}
            </Table.Th>
          ))}
        </Table.Tr>

        {/* Header Row 3 - Allocation Model (only shown when expanded) */}
        <Table.Tr>
          <EmptyLeftTh width={FIRST_COL_WIDTH} />
          <Table.Th className="header-cell" pt="sm" pl="sm" style={{ 
            position: 'sticky', 
            left: FIRST_COL_WIDTH, 
            zIndex: 4, 
            background: 'white', 
            borderBottom: '0px !important',
            top: 82
          }}>
            <Text size="sm" fw={600}>{t('customTable.allocationModel')}</Text>
          </Table.Th>
          {defaultCollaterals.map((col: any, idx: number) => (
            <Table.Th
              key={col.bid}
              colSpan={expandedCollaterals[idx] ? 3 : 1}
              className="cell-all-border"
              style={{
                background: 'white',
                width: expandedCollaterals[idx] ? COLLATERAL_COL_WIDTH * 3 : COLLATERAL_COL_WIDTH_COLLAPSED,
                position: 'sticky',
                top: 82,
                zIndex: 4
              }}
            >
              {expandedCollaterals[idx] ? (
                <Controller
                  name={`model-${idx}`}
                  control={control}
                  render={({ field }) => (
                    <Radio.Group
                      {...field}
                      size="xs"
                      disabled={isViewMapping || mapAtCpLevel}
                      onChange={(value) => {
                        field.onChange(value);
                        handleModelChange(idx, value as string);
                      }}
                    >
                      <Stack gap={16} pt="sm" pl="sm">
                        <Radio value="prop" label={t('customTable.proportionate')} size="sm" c="#1A1A1A" />
                        <Radio value="perc" label={t('customTable.percentage')} size="sm" c="#1A1A1A" />
                        <Radio value="abs" label={t('customTable.absolute')} size="sm" c="#1A1A1A" />
                      </Stack>
                    </Radio.Group>
                  )}
                />
              ) : (
                <Box>&nbsp;</Box>
              )}
            </Table.Th>
          ))}
        </Table.Tr>

        {/* Header Row 4 - Coverage Headers (only shown when expanded) */}
        <Table.Tr>
          <Table.Th ta="left" style={{ 
            ...stickyLeft, 
            ...secondStickyColr,
            position: 'sticky',
            top: 123,
            zIndex: 4
          }}>
            <Group gap={4}>
              <ActionIcon size="xs" variant="transparent" onClick={handleExpandAll} >
                {expandAll ? (<IconChevronsUp size={14} />) : (<IconChevronsDown size={14} />)}
              </ActionIcon>
              <Text size="sm" fw={500}>{t('customTable.facilityDetails')}</Text>
            </Group>
          </Table.Th>
          <Table.Th className="cell-all-border cell-padding-remove" ta="left" style={{ 
            ...secondColSticky, 
            ...secondStickyColr,
            position: 'sticky',
            left: FIRST_COL_WIDTH,
            top: 123,
            zIndex: 4
          }}>
            <Text size="sm" fw={500} m={0} style={{ lineHeight: 'calc(1em + 2px)' }}>
              {t('customTable.facilityAmount')}<br />
              {t('customTable.rPA')}
            </Text>
          </Table.Th>
          {defaultCollaterals.map((col: any, idx: number) => (
            <Table.Th
              key={col.bid}
              colSpan={expandedCollaterals[idx] ? 3 : 1}
              className="cell-all-border cell-padding-remove"
              style={{
                ...(!expandedCollaterals[idx]
                  ? { background: '#fff', border: 0 }
                  : { backgroundColor: '#f8f9fa' }),
                position: 'sticky',
                top: 123,
                zIndex: 4
              }}
              ta="center"
            >
              {expandedCollaterals[idx] ? (
                <Table withTableBorder={false} withColumnBorders>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td colSpan={3} style={{ padding: 4 }}>
                        <Text size="sm" fw={500}>{t('customTable.coverage')}</Text>
                      </Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                      <Table.Td style={{ padding: 4 }}>
                        <Group gap={4} justify="center">
                          <Checkbox
                            checked={headerMapChecked[idx] || false}
                            size="xs"
                            indeterminate={headerMapIndeterminate[idx] || false}
                            onChange={(e) =>
                              handleHeaderMapChange(idx, e.currentTarget.checked)
                            }
                            disabled={isViewMapping || mapAtCpLevel}
                          />
                          <Text size="sm" style={{ fontSize: 12 }}>
                            {t('customTable.mapManually')}
                          </Text>
                        </Group>
                      </Table.Td>

                      <Table.Td style={{ padding: 4, textAlign: "center" }}>
                        <Text size="sm" style={{ fontSize: 12 }}>
                          {t('customTable.valueAED')}
                        </Text>
                      </Table.Td>

                      <Table.Td style={{ padding: 4, textAlign: "center" }}>
                        <Text size="sm" style={{ fontSize: 12 }}>
                          {t('customTable.percentage')}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              ) : (
                <Box>&nbsp;</Box>
              )}
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
    );
  };

const FacilityRow: React.FC<{
  facility: any;
  facilities: any[];
  facilityIndex: number;
  defaultCollaterals: any[];
  watchedForm: any;
  control: any;
  isViewMapping: boolean;
  getApiValue: (colId: string, fIdx: number, type: 'pct' | 'value') => number;
  parseAED: (v: any) => number;
  totalProposedAED: number;
  handlePercentageChange: (cIdx: number, fIdx: number, value: number | null) => void;
  handleValueChange: (cIdx: number, fIdx: number, value: number | null) => void;
  handleMapManuallyChange: (cIdx: number, fIdx: number, checked: boolean) => void;
  handleMapManuallyWithChildren?: (cIdx: number, checked: boolean, facility: any) => void;
  formatTwoDecimals: (num: any) => string;
  level?: number;
  isLastInGroup?: boolean;
  mapAtCpLevel?: boolean;
  selectedFacilities?: Map<string, Set<string>>;
  expandAll?: boolean;
  expandedCollaterals: Record<number, boolean>;
}> = ({
  facility,
  facilities,
  facilityIndex,
  defaultCollaterals,
  watchedForm,
  control,
  isViewMapping,
  getApiValue,
  parseAED,
  totalProposedAED,
  handlePercentageChange,
  handleValueChange,
  handleMapManuallyChange,
  handleMapManuallyWithChildren,
  formatTwoDecimals,
  level = 0,
  isLastInGroup = false,
  mapAtCpLevel = false,
  selectedFacilities = new Map(),
  expandAll = true,
  expandedCollaterals,
}) => {
    const { t } = useI18n(COLLATERAL_NAMESPACE);
    const [expanded, setExpanded] = useState(expandAll ?? true);

    useEffect(() => {
      setExpanded(expandAll ?? true);
    }, [expandAll]);

    const hasChildren = facility.children && facility.children.length > 0;

    const getProportionateValues = (colAED: number) => {
      if (totalProposedAED <= 0) return { pct: 0, value: 0 };
      const facilityLimit = parseAED(facility.limitProposed?.baseValue || '0');
      const value = (colAED * facilityLimit) / totalProposedAED;
      const pct = colAED > 0 ? (value / colAED) * 100 : 0;
      return { pct, value };
    };

    const hasAnyManualMappingForCollateral = (colId: string, cIdx: number): boolean => {
      let hasManual = false;
      const traverse = (facList: any[]) => {
        facList.forEach((fac) => {
          if (watchedForm[`map-${cIdx}-${fac.bid}`]) hasManual = true;
          if (fac.children) traverse(fac.children);
        });
      };
      traverse(facilities);
      return hasManual;
    };

    return (
      <>
        <Table.Tr>
          <Table.Td
            className="cell-height"
            style={{
              ...stickyLeft,
              borderBottom: isLastInGroup ? '2px solid #dee2e6' : '1px solid #dee2e6',
              borderTop: facilityIndex === 0 ? 'none' : '1px solid #dee2e6',
              paddingLeft: `${level * 24 + 12}px`,
              background: '#f8f9fa',
            }}
          >
            <Group gap="xs" wrap="nowrap">
              {hasChildren && (
                <ActionIcon size="xs" variant="transparent" onClick={() => setExpanded(!expanded)} style={{ padding: 0 }}>
                  {expanded ? <IconChevronDown size={14} /> : <IconChevronUp size={14} />}
                </ActionIcon>
              )}
              {!hasChildren && <Box w={20} />}
              <Box>
                {facility.limitStatus === 'E' && (
                  <Text c="red" >{t('customTable.expiredn')}</Text>)}
                <Text size="sm" className="ellipsis-text">{facility.limitId}</Text>
                <Text size="sm" fw={600}>{facility.name ?? facility.category}</Text>
                <Text size="sm" className="ellipsis-text">{facility.description}</Text>
              </Box>
            </Group>
          </Table.Td>
          <Table.Td
            className="cell-height"
            style={{
              ...secondColSticky,
              borderBottom: isLastInGroup ? '2px solid #dee2e6' : '1px solid #dee2e6',
              borderTop: facilityIndex === 0 ? 'none' : '1px solid #dee2e6',
              textAlign: 'right',
              background: '#f8f9fa',
            }}
          >
            <Stack gap={4} align="flex-end">
              <Text size="sm" style={{ fontSize: 12 }}>
                {facility.limitProposed.currency ? `${facility.limitProposed.currency} ${formatCurrency(facility.limitProposed.value)}` : '-'}
              </Text>
              <Text size="sm" c="dimmed" style={{ fontSize: 12 }}>
                {facility.limitProposed.baseCurrency ? `${facility.limitProposed.baseCurrency} ${formatCurrency(facility.limitProposed.baseValue)}` : '-'}
              </Text>
            </Stack>
          </Table.Td>

          {defaultCollaterals.map((col: any, cIdx: number) => {
            const isExpanded = expandedCollaterals[cIdx];

            if (!isExpanded) {
              // When collapsed, render a single empty cell
              return (
                <Table.Td
                  key={`${facilityIndex}-${cIdx}`}
                  colSpan={1}
                  className="cell-height"
                  ta="center"
                  style={{
                    border: 'none',
                    background: 'white',
                    width: COLLATERAL_COL_WIDTH_COLLAPSED,
                    minWidth: COLLATERAL_COL_WIDTH_COLLAPSED,
                    maxWidth: COLLATERAL_COL_WIDTH_COLLAPSED,
                    boxSizing: 'border-box',
                    padding: '8px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: 'white', }}>
                    &nbsp;
                  </div>
                </Table.Td>
              );
            }

            // Expanded view - render all three cells
            const model = watchedForm[`model-${cIdx}`];
            const colAED = parseAED(col.proposedAmount?.baseValue);
            const apiPct = getApiValue(col.bid, facilityIndex, 'pct');
            const apiVal = getApiValue(col.bid, facilityIndex, 'value');

            const isMapManuallyChecked = watchedForm[`map-${cIdx}-${facility.bid}`] || false;
            const anyManualMappingForThisCollateral = hasAnyManualMappingForCollateral(col.bid, cIdx);

            const propValues = getProportionateValues(colAED);

            let finalPct = 0;
            let finalVal = 0;

            if (model === 'prop') {
              finalPct = propValues.pct;
              finalVal = propValues.value;
            } else if (model === 'perc') {
              finalPct = watchedForm[`perc-${cIdx}-${facility.bid}`] ?? apiPct;
              finalVal = (finalPct / 100) * colAED;
            } else if (model === 'abs') {
              finalVal = watchedForm[`abs-${cIdx}-${facility.bid}`] ?? apiVal;
              finalPct = colAED > 0 ? (finalVal / colAED) * 100 : 0;
            }

            let mapManuallyDisplay: React.ReactNode = null;
            let percDisplay: React.ReactNode = null;
            let valueDisplay: React.ReactNode = null;

            if (mapAtCpLevel) {
              mapManuallyDisplay = (
                <Checkbox size="xs" disabled checked={false} styles={{ root: { display: 'flex', justifyContent: 'right' } }} />
              );
              percDisplay = <Text size="sm">{formatTwoDecimals(finalPct)} %</Text>;
              valueDisplay = <Text size="sm">{formatTwoDecimals(finalVal)}</Text>;
            } else if (isViewMapping) {
              mapManuallyDisplay = (
                <Checkbox size="xs" disabled checked={isMapManuallyChecked} styles={{ root: { display: 'flex', justifyContent: 'right' } }} />
              );
              percDisplay = <Text size="sm">{formatTwoDecimals(apiPct)} %</Text>;
              valueDisplay = <Text size="sm">{formatTwoDecimals(apiVal)}</Text>;
            } else {
              mapManuallyDisplay = (
                <Controller
                  name={`map-${cIdx}-${facility.bid}`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      size="xs"
                      styles={{ root: { display: 'flex', justifyContent: 'right' } }}
                      checked={field.value || false}
                      onChange={(e) => {
                        const checked = e.currentTarget.checked;
                        field.onChange(checked);
                        if (handleMapManuallyWithChildren) {
                          handleMapManuallyWithChildren(cIdx, checked, facility);
                        } else {
                          handleMapManuallyChange(cIdx, facilityIndex, checked);
                        }
                      }}
                    />
                  )}
                />
              );
              const isSelected = selectedFacilities.get(col.bid)?.has(facility.bid) || false;
              if (!anyManualMappingForThisCollateral) {
                percDisplay = <Text size="sm">{formatTwoDecimals(finalPct)} %</Text>;
                valueDisplay = <Text size="sm">{formatTwoDecimals(finalVal)}</Text>;
              }
              else if (!isMapManuallyChecked) {
                percDisplay = <Text size="sm" c="dimmed">0.00%</Text>;
                valueDisplay = <Text size="sm" c="dimmed">--</Text>;
              } else {
                if (model === 'prop') {
                  percDisplay = (
                    <Controller
                      name={`perc-${cIdx}-${facility.bid}`}
                      control={control}
                      render={({ field }) => {
                        const finalPct = field.value ?? (apiPct || propValues.pct);
                        return (
                          <NumberInput
                            {...field}
                            size="sm"
                            w={80}
                            min={0}
                            max={100}
                            suffix="%"
                            decimalScale={2}
                            fixedDecimalScale={true}
                            allowNegative={false}
                            disabled={!isSelected}
                            onChange={(val) => {
                              const num = val === '' || val == null ? 0 : Number(val);
                              field.onChange(num);
                              handlePercentageChange(cIdx, facilityIndex, num);
                            }}
                            value={finalPct}
                            thousandSeparator
                            hideControls
                            styles={{ input: { textAlign: 'center' } }}
                          />
                        );
                      }}
                    />
                  );
                  valueDisplay = (
                    <Controller
                      name={`abs-${cIdx}-${facility.bid}`}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          size="sm"
                          w={80}
                          min={0}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          disabled
                          value={field.value ?? finalVal}
                          thousandSeparator
                          hideControls
                          styles={{ input: { textAlign: 'center' } }}
                        />
                      )}
                    />
                  );
                } else if (model === 'perc') {
                  percDisplay = (
                    <Controller
                      name={`perc-${cIdx}-${facility.bid}`}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          size="sm"
                          w={80}
                          min={0}
                          max={100}
                          suffix="%"
                          decimalScale={2}
                          fixedDecimalScale={true}
                          onChange={(val) => {
                            const num = val === '' || val == null ? 0 : Number(val);
                            field.onChange(num);
                            handlePercentageChange(cIdx, facilityIndex, num);
                          }}
                          value={field.value ?? apiPct}
                          thousandSeparator
                          hideControls
                          styles={{ input: { textAlign: 'center' } }}
                        />
                      )}
                    />
                  );
                  const currentPerc = watchedForm[`perc-${cIdx}-${facility.bid}`] ?? apiPct;
                  valueDisplay = (
                    <NumberInput
                      size="sm"
                      w={80}
                      disabled
                      value={Number(((currentPerc / 100) * colAED).toFixed(2))}
                      fixedDecimalScale={true}
                      thousandSeparator
                      hideControls
                      styles={{ input: { textAlign: 'center' } }}
                    />
                  );
                } else if (model === 'abs') {
                  valueDisplay = (
                    <Controller
                      name={`abs-${cIdx}-${facility.bid}`}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          size="sm"
                          w={80}
                          min={0}
                          max={colAED}
                          precision={2}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          disabled={!isSelected}
                          onChange={(val) => {
                            const num = val === '' || val == null ? 0 : Number(val);
                            field.onChange(num);
                            handleValueChange(cIdx, facilityIndex, num);
                          }}
                          value={field.value ?? finalVal}
                          thousandSeparator
                          hideControls
                          styles={{ input: { textAlign: 'center' } }}
                        />
                      )}
                    />
                  );
                  const currentVal = watchedForm[`abs-${cIdx}-${facility.bid}`] ?? finalVal;
                  percDisplay = (
                    <NumberInput
                      size="sm"
                      w={80}
                      min={0}
                      max={100}
                      suffix="%"
                      decimalScale={2}
                      fixedDecimalScale={true}
                      disabled
                      value={colAED > 0 ? (currentVal / colAED) * 100 : 0}
                      thousandSeparator
                      hideControls
                      styles={{ input: { textAlign: 'center' } }}
                    />
                  );
                }
              }
            }

            return (
              <React.Fragment key={`${facilityIndex}-${cIdx}`}>
                <Table.Td className="cell-height" ta="center" style={{ 
                  borderBottom: isLastInGroup ? '2px solid #dee2e6' : '1px solid #dee2e6', 
                  borderTop: facilityIndex === 0 ? 'none' : '1px solid #dee2e6', 
                  width: '160px', 
                  minWidth: '160px', 
                  maxWidth: '160px', 
                  boxSizing: 'border-box', 
                  padding: '8px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    {mapManuallyDisplay}
                  </div>
                </Table.Td>
                <Table.Td className="cell-height" ta="center" style={{ 
                  borderBottom: isLastInGroup ? '2px solid #dee2e6' : '1px solid #dee2e6', 
                  borderTop: facilityIndex === 0 ? 'none' : '1px solid #dee2e6', 
                  width: '160px', 
                  minWidth: '160px', 
                  maxWidth: '160px', 
                  boxSizing: 'border-box', 
                  padding: '8px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    {valueDisplay}
                  </div>
                </Table.Td>
                <Table.Td className="cell-height" ta="center" style={{ 
                  borderBottom: isLastInGroup ? '2px solid #dee2e6' : '1px solid #dee2e6', 
                  borderTop: facilityIndex === 0 ? 'none' : '1px solid #dee2e6', 
                  width: '160px', 
                  minWidth: '160px', 
                  maxWidth: '160px', 
                  boxSizing: 'border-box', 
                  padding: '8px',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    {percDisplay}
                  </div>
                </Table.Td>
              </React.Fragment>
            );
          })}
        </Table.Tr>

        {expanded && facility.children?.map((child: any, childIdx: number) => {
          const childIndex = facilityIndex + 1 + childIdx;
          return (
            <FacilityRow
              key={child.bid}
              facility={child}
              facilities={facilities}
              facilityIndex={childIndex}
              defaultCollaterals={defaultCollaterals}
              watchedForm={watchedForm}
              control={control}
              isViewMapping={isViewMapping}
              getApiValue={getApiValue}
              parseAED={parseAED}
              totalProposedAED={totalProposedAED}
              handlePercentageChange={handlePercentageChange}
              handleValueChange={handleValueChange}
              handleMapManuallyChange={handleMapManuallyChange}
              handleMapManuallyWithChildren={handleMapManuallyWithChildren}
              formatTwoDecimals={formatTwoDecimals}
              level={level + 1}
              isLastInGroup={childIdx === facility.children.length - 1}
              mapAtCpLevel={mapAtCpLevel}
              selectedFacilities={selectedFacilities}
              expandedCollaterals={expandedCollaterals}
            />
          );
        })}
      </>
    );
  };

const FacilityRows: React.FC<{
  facilities: any[];
  defaultCollaterals: any[];
  watchedForm: any;
  control: any;
  isViewMapping: boolean;
  getApiValue: (colId: string, fIdx: number, type: 'pct' | 'value') => number;
  parseAED: (v: any) => number;
  totalProposedAED: number;
  handlePercentageChange: (cIdx: number, fIdx: number, value: number | null) => void;
  handleValueChange: (cIdx: number, fIdx: number, value: number | null) => void;
  handleMapManuallyChange: (cIdx: number, fIdx: number, checked: boolean) => void;
  handleMapManuallyWithChildren?: (cIdx: number, checked: boolean, facility: any) => void;
  formatTwoDecimals: (num: any) => string;
  mapAtCpLevel?: boolean;
  selectedFacilities?: Map<string, Set<string>>;
  expandAll: boolean;
  expandedCollaterals: Record<number, boolean>;
}> = ({
  facilities,
  defaultCollaterals,
  watchedForm,
  control,
  isViewMapping,
  getApiValue,
  parseAED,
  totalProposedAED,
  handlePercentageChange,
  handleValueChange,
  handleMapManuallyChange,
  handleMapManuallyWithChildren,
  formatTwoDecimals,
  mapAtCpLevel = false,
  selectedFacilities = new Map(),
  expandAll,
  expandedCollaterals,
}) => {
    let facilityIndex = 0;

    const renderRows = (facilityList: any[], level: number = 0): React.ReactNode[] => {
      return facilityList.map((facility: any, idx: number) => {
        const currentIndex = facilityIndex++;
        return (
          <FacilityRow
            key={facility.bid}
            facility={facility}
            facilities={facilities}
            facilityIndex={currentIndex}
            defaultCollaterals={defaultCollaterals}
            watchedForm={watchedForm}
            control={control}
            isViewMapping={isViewMapping}
            getApiValue={getApiValue}
            parseAED={parseAED}
            totalProposedAED={totalProposedAED}
            handlePercentageChange={handlePercentageChange}
            handleValueChange={handleValueChange}
            handleMapManuallyChange={handleMapManuallyChange}
            handleMapManuallyWithChildren={handleMapManuallyWithChildren}
            formatTwoDecimals={formatTwoDecimals}
            level={level}
            isLastInGroup={idx === facilityList.length - 1}
            mapAtCpLevel={mapAtCpLevel}
            selectedFacilities={selectedFacilities}
            expandAll={expandAll}
            expandedCollaterals={expandedCollaterals}
          />
        );
      });
    };
    return <>{renderRows(facilities)}</>;
  };

const CollateralFacilityCoverage: React.FC<CollateralFacilityCoverageProps> = ({
  mappingData,
  obligorDetails,
  isSubmitting,
  isViewMapping = false,
  onSubmit,
  setObligorId,
  hasFacilities = true,
  hasCollaterals = true,
}) => {
  const { t } = useI18n(COLLATERAL_NAMESPACE);
  const defaultCollaterals = _get(mappingData, 'collaterals', []);
  const facilities = _get(mappingData, 'facilities', []);

  const [opened, setOpened] = useState(false);
  const [confirmOpened, setConfirmOpened] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any>(null);
  const [disclaimerText, setDisclaimerText] = useState<string>('');
  const [disclaimerExpiredText, setDisclaimerExpiredText] = useState<string>('');
  const [editedCollaterals, setEditedCollaterals] = useState<Set<string>>(new Set());
  const [mapAtCpLevel, setMapAtCpLevel] = useState(_get(mappingData, 'isMappedAtCpLevel', false));
  const [selectedFacilities, setSelectedFacilities] = useState<Map<string, Set<string>>>(new Map());
  const [headerMapChecked, setHeaderMapChecked] = useState<Record<number, boolean>>({});
  const [headerMapIndeterminate, setHeaderMapIndeterminate] = useState<Record<number, boolean>>({});
  const [expandAll, setExpandAll] = useState(true);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [expandedCollaterals, setExpandedCollaterals] = useState<Record<number, boolean>>({});

  // Refs for scroll synchronization
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  // Synchronize horizontal scrolling between header and body
  const handleHorizontalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    if (headerScrollRef.current && e.currentTarget !== headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = scrollLeft;
    }
    if (bodyScrollRef.current && e.currentTarget !== bodyScrollRef.current) {
      bodyScrollRef.current.scrollLeft = scrollLeft;
    }
  };

  // Initialize all collaterals as expanded
  useEffect(() => {
    const initialExpanded: Record<number, boolean> = {};
    defaultCollaterals.forEach((_: any, idx: number) => {
      initialExpanded[idx] = true;
    });
    setExpandedCollaterals(initialExpanded);
  }, [defaultCollaterals]);

  const toggleCollateralExpand = (cIdx: number) => {
    setExpandedCollaterals(prev => ({
      ...prev,
      [cIdx]: !prev[cIdx]
    }));
  };

  const isAllocationScreenDisabled = !hasFacilities || !hasCollaterals;

  const parseAED = (v: any): number => {
    if (!v) return 0;
    const s = typeof v === 'number' ? String(v) : v;
    const n = parseFloat(s.replace(/,/g, ''));
    return isNaN(n) ? 0 : n;
  };

  const totalProposedAED = useMemo(() => {
    let sum = 0;
    const calculateSum = (facList: any[]) => {
      facList.forEach((facility) => {
        sum += parseAED(facility.limitProposed?.baseValue || '0');
        if (facility.children) calculateSum(facility.children);
      });
    };
    calculateSum(facilities);
    return sum;
  }, [facilities]);

  const { control, watch, setValue } = useForm({
    defaultValues: (() => {
      const defaults: Record<string, any> = {};

      defaultCollaterals.forEach((col: any, cIdx: number) => {
        const colId = col.bid;
        const colAED = parseAED(col.proposedAmount?.baseValue);
        const apiModel = col.allocationModel;
        let formModel = 'prop';
        if (apiModel === 'PERCENTAGE') {
          formModel = 'perc';
        } else if (apiModel === 'ABSOLUTE') {
          formModel = 'abs';
        } else if (apiModel === 'PROPORTIONATE') {
          formModel = 'prop';
        }
        defaults[`model-${cIdx}`] = formModel;
        const setCoverageValues = (facList: any[]) => {
          facList.forEach((facility) => {
            const cov = facility.coverage?.[colId] || { pct: 0, value: 0, isMappedManually: false };
            let initialPct = 0;
            let initialValue = 0;
            if (cov.isMappedManually && cov.pct != null && cov.value != null) {
              initialPct = Number(cov.pct);
              initialValue = Number(cov.value);
            } else if (totalProposedAED > 0) {
              const facilityLimit = parseAED(facility.limitProposed?.baseValue || '0');
              const coverageValue = (colAED * facilityLimit) / totalProposedAED;
              const coveragePerc = colAED > 0 ? (coverageValue / colAED) * 100 : 0;
              initialPct = Number(coveragePerc.toFixed(2));
              initialValue = Number(coverageValue.toFixed(2));
            }

            defaults[`map-${cIdx}-${facility.bid}`] = !!cov.isMappedManually;
            defaults[`perc-${cIdx}-${facility.bid}`] = initialPct;
            defaults[`abs-${cIdx}-${facility.bid}`] = initialValue;

            if (facility.children) setCoverageValues(facility.children);
          });
        };
        setCoverageValues(facilities);
      });
      return defaults;
    })(),
  });
  const watchedForm = watch();

  const getApiValue = (colId: string, facilityIdx: number, type: 'pct' | 'value') => {
    let currentIdx = 0;
    let result = 0;
    const findValue = (facList: any[]): boolean => {
      for (const facility of facList) {
        if (currentIdx === facilityIdx) {
          const cov = facility.coverage?.[colId] || { pct: 0, value: 0 };
          result = Number(cov[type] || 0);
          return true;
        }
        currentIdx++;
        if (facility.children) if (findValue(facility.children)) return true;
      }
      return false;
    };
    findValue(facilities);
    return result;
  };

  useEffect(() => {
    const newMap = new Map<string, Set<string>>();
    defaultCollaterals.forEach((col: any, cIdx: number) => {
      const set = new Set<string>();
      const collect = (list: any[]) => {
        list.forEach((f) => {
          if (watch(`map-${cIdx}-${f.bid}`)) {
            set.add(f.bid);
          }
          if (f.children) collect(f.children);
        });
      };
      collect(facilities);
      if (set.size > 0) {
        newMap.set(col.bid, set);
      }
    });
    setSelectedFacilities(newMap);
  }, []);

  // Disclaimer effect
  useEffect(() => {
    const changed: string[] = [];
    const expiredCollaterals: string[] = [];
    const expiredFacilities: string[] = [];

    defaultCollaterals.forEach((col: any) => {
      if (col?.isChanged === 1) {
        changed.push(`${col.category ?? 'Unknown'} (${col.collateralId ?? 'N/A'})`);
      }
      if (col?.collateralStatus !== 'ACTIVE') {
        expiredCollaterals.push(`${col.category ?? 'Unknown'} (${col.collateralId ?? 'N/A'})`);
      }
    });

    const checkFacilityExpiry = (facility: any) => {
      if (facility?.limitStatus === 'E') {
        expiredFacilities.push(`${facility.name ?? 'Unnamed'} (${facility.limitId ?? 'N/A'})`);
      }
      if (facility?.children?.length) {
        facility.children.forEach(checkFacilityExpiry);
      }
    };
    facilities?.forEach(checkFacilityExpiry);
    setDisclaimerText(changed.length ? `Changed: ${changed.join(', ')}` : '');
    setDisclaimerExpiredText(
      expiredCollaterals.length || expiredFacilities.length
        ? `Expired: ${[...expiredCollaterals, ...expiredFacilities].join(', ')}`
        : ''
    );
  }, [defaultCollaterals, facilities]);

  useEffect(() => {
    if (mapAtCpLevel) {
      defaultCollaterals.forEach((col: any, cIdx: number) => {
        const colAED = parseAED(col.proposedAmount?.baseValue);
        const updateAll = (facList: any[]) => {
          facList.forEach((f) => {
            if (totalProposedAED > 0) {
              const limit = parseAED(f.limitProposed?.baseValue || '0');
              const val = (colAED * limit) / totalProposedAED;
              const pct = colAED > 0 ? (val / colAED) * 100 : 0;
              setValue(`perc-${cIdx}-${f.bid}`, Number(pct.toFixed(2)));
              setValue(`abs-${cIdx}-${f.bid}`, Number(val.toFixed(2)));
            }
            if (f.children) updateAll(f.children);
          });
        };
        updateAll(facilities);
      });
      setSelectedFacilities(new Map());
    }
  }, [mapAtCpLevel, defaultCollaterals, facilities, totalProposedAED, setValue]);

  useEffect(() => {
    const newChecked: Record<number, boolean> = {};
    const newIndeterminate: Record<number, boolean> = {};
    defaultCollaterals.forEach((col: any, cIdx: number) => {
      const selectedSet = selectedFacilities.get(col.bid);
      let totalCount = 0;
      let checkedCount = 0;
      const count = (list: any[]) => {
        list.forEach((f) => {
          totalCount++;
          if (selectedSet?.has(f.bid)) {
            checkedCount++;
          }
          if (f.children) count(f.children);
        });
      };
      count(facilities);
      newChecked[cIdx] = totalCount > 0 && checkedCount === totalCount;
      newIndeterminate[cIdx] = checkedCount > 0 && checkedCount < totalCount;
    });
    setHeaderMapChecked(newChecked);
    setHeaderMapIndeterminate(newIndeterminate);
  }, [selectedFacilities, defaultCollaterals, facilities]);

  const handleModelChange = (cIdx: number, newModel: string) => {
    if (isViewMapping || mapAtCpLevel) return;

    const colId = defaultCollaterals[cIdx]?.bid;
    const colAED = parseAED(defaultCollaterals[cIdx]?.proposedAmount?.baseValue);

    const newEdited = new Set(editedCollaterals);

    if (newModel === 'perc' || newModel === 'abs') {
      newEdited.add(colId);
    } else {
      newEdited.delete(colId);
    }

    setEditedCollaterals(newEdited);
    setValue(`model-${cIdx}`, newModel);

    const resetValues = (facList: any[]) => {
      facList.forEach((f) => {
        const apiPct = getApiValue(colId, getFacilityIndex(facilities, f.bid), 'pct');
        const apiVal = getApiValue(colId, getFacilityIndex(facilities, f.bid), 'value');

        if (newModel === 'prop') {
          const limit = parseAED(f.limitProposed?.baseValue || '0');
          const val = (colAED * limit) / totalProposedAED;
          const pct = colAED > 0 ? (val / colAED) * 100 : 0;

          setValue(`perc-${cIdx}-${f.bid}`, Number(pct.toFixed(2)));
          setValue(`abs-${cIdx}-${f.bid}`, Number(val.toFixed(2)));
        } else if (newModel === 'perc') {
          setValue(`perc-${cIdx}-${f.bid}`, apiPct);
          setValue(`abs-${cIdx}-${f.bid}`, Number(((apiPct / 100) * colAED).toFixed(2)));
        } else if (newModel === 'abs') {
          setValue(`abs-${cIdx}-${f.bid}`, apiVal);
          setValue(`perc-${cIdx}-${f.bid}`, colAED > 0 ? Number(((apiVal / colAED) * 100).toFixed(2)) : 0);
        }

        if (f.children) resetValues(f.children);
      });
    };

    resetValues(facilities);
  };

  const redistributePercentages = (
    colId: string,
    cIdx: number,
    selectedBids: Set<string>
  ) => {
    const colAED = parseAED(defaultCollaterals[cIdx]?.proposedAmount?.baseValue);
    if (selectedBids.size === 0) return;
    let totalSelectedLimit = 0;
    const limitMap = new Map<string, number>();
    const collectLimits = (list: any[]) => {
      list.forEach((f) => {
        if (selectedBids.has(f.bid)) {
          const limit = parseAED(f.limitProposed?.baseValue || '0');
          limitMap.set(f.bid, limit);
          totalSelectedLimit += limit;
        }
        if (f.children) collectLimits(f.children);
      });
    };
    collectLimits(facilities);
    if (totalSelectedLimit === 0) return;
    selectedBids.forEach((bid) => {
      const limit = limitMap.get(bid) || 0;
      const pct = (limit / totalSelectedLimit) * 100;
      const value = (pct / 100) * colAED;
      setValue(`perc-${cIdx}-${bid}`, Number(pct.toFixed(2)));
      setValue(`abs-${cIdx}-${bid}`, Number(value.toFixed(2)));
    });
  };

  const handleMapManuallyWithChildren = (
    cIdx: number,
    checked: boolean,
    facility: any
  ) => {
    const update = (fac: any) => {
      updateManualSelection(cIdx, fac.bid, checked);
      if (fac.children?.length) {
        fac.children.forEach(update);
      }
    };

    update(facility);
  };

  const handlePercentageChange = (cIdx: number, fIdx: number, value: number | null) => {
    const v = value ?? 0;
    const colId = defaultCollaterals[cIdx]?.bid;
    const colAED = parseAED(defaultCollaterals[cIdx]?.proposedAmount?.baseValue);

    const facility = findFacilityByIndex(facilities, fIdx);
    if (!facility) return;

    setValue(`abs-${cIdx}-${facility.bid}`, Number(((v / 100) * colAED).toFixed(2)));

    const model = watchedForm[`model-${cIdx}`];
    if (model === 'prop' && totalProposedAED > 0) {
      const limit = parseAED(facility.limitProposed?.baseValue || '0');
      const expVal = (colAED * limit) / totalProposedAED;
      const expPct = colAED > 0 ? (expVal / colAED) * 100 : 0;

      if (Math.abs(v - expPct) > 0.3) {
        setValue(`model-${cIdx}`, 'perc');
        setEditedCollaterals((prev) => new Set([...prev, colId]));
      }
    }
  };

  const handleValueChange = (cIdx: number, fIdx: number, value: number | null) => {
    const v = value ?? 0;
    const colAED = parseAED(defaultCollaterals[cIdx]?.proposedAmount?.baseValue);
    const facility = findFacilityByIndex(facilities, fIdx);
    if (!facility) return;

    setValue(`perc-${cIdx}-${facility.bid}`, Number((colAED > 0 ? (v / colAED) * 100 : 0).toFixed(2)));

    const model = watchedForm[`model-${cIdx}`];
    if (model === 'prop' && totalProposedAED > 0) {
      const limit = parseAED(facility.limitProposed?.baseValue || '0');
      const expVal = (colAED * limit) / totalProposedAED;

      if (Math.abs(v - expVal) > 1) {
        setValue(`model-${cIdx}`, 'perc');
        setEditedCollaterals((prev) => new Set([...prev, defaultCollaterals[cIdx]?.bid]));
      }
    }
  };

  const updateManualSelection = (
    cIdx: number,
    bid: string,
    checked: boolean
  ) => {
    const colId = defaultCollaterals[cIdx]?.bid;
    const model = watchedForm[`model-${cIdx}`];
    setSelectedFacilities((prev) => {
      const newMap = new Map(prev);
      if (!newMap.has(colId)) {
        newMap.set(colId, new Set());
      }
      const set = newMap.get(colId)!;
      if (checked) set.add(bid);
      else set.delete(bid);
      setValue(`map-${cIdx}-${bid}`, checked);
      if (model === 'prop' && set.size > 0) {
        redistributePercentages(colId, cIdx, set);
      }
      if (model === 'perc' || model === 'abs') {
        const apiPct = getApiValue(colId, getFacilityIndex(facilities, bid), 'pct');
        const apiVal = getApiValue(colId, getFacilityIndex(facilities, bid), 'value');
        setValue(`perc-${cIdx}-${bid}`, apiPct);
        setValue(`abs-${cIdx}-${bid}`, apiVal);
      }

      return newMap;
    });
  };

  const handleMapManuallyChange = (
    cIdx: number,
    fIdx: number,
    checked: boolean
  ) => {
    const facility = findFacilityByIndex(facilities, fIdx);
    if (!facility) return;
    updateManualSelection(cIdx, facility.bid, checked);
  };

  const handleHeaderMapChange = (cIdx: number, checked: boolean) => {
    const colId = defaultCollaterals[cIdx]?.bid;
    const model = watchedForm[`model-${cIdx}`];

    const toggleAll = (facList: any[]) => {
      facList.forEach((facility) => {
        setValue(`map-${cIdx}-${facility.bid}`, checked);
        setSelectedFacilities((prev) => {
          const newMap = new Map(prev);
          if (!newMap.has(colId)) newMap.set(colId, new Set());
          const s = newMap.get(colId)!;
          if (checked) s.add(facility.bid);
          else s.delete(facility.bid);
          return newMap;
        });
        if (facility.children?.length) toggleAll(facility.children);
      });
    };
    toggleAll(facilities);

    if (checked && model === 'prop') {
      const bids = new Set<string>();
      const collect = (list: any[]) => {
        list.forEach((f) => {
          bids.add(f.bid);
          if (f.children) collect(f.children);
        });
      };
      collect(facilities);
      redistributePercentages(colId, cIdx, bids);
    }

    if (checked && (model === 'perc' || model === 'abs')) {
      const resetValues = (list: any[]) => {
        list.forEach((f) => {
          const apiPct = getApiValue(colId, getFacilityIndex(facilities, f.bid), 'pct');
          const apiVal = getApiValue(colId, getFacilityIndex(facilities, f.bid), 'value');

          setValue(`perc-${cIdx}-${f.bid}`, apiPct);
          setValue(`abs-${cIdx}-${f.bid}`, apiVal);

          if (f.children) resetValues(f.children);
        });
      };
      resetValues(facilities);
    }
  };

  const formatTwoDecimals = (num: any) => {
    if (num === undefined || num === null || num === '') return '0.00';
    const parsed = parseFloat(num);
    return isNaN(parsed) ? '0.00' : parsed.toFixed(2);
  };

  const onSubmitForm = () => {
    setOpened(false);
    let hasParentChildViolation = false;
    const parentChildErrors: string[] = [];

    defaultCollaterals.forEach((col: any, cIdx: number) => {
      const model = watchedForm[`model-${cIdx}`] || 'prop';
      const colAED = parseAED(col.proposedAmount?.baseValue);
      let totalSelectedLimit = 0;
      const selectedFacilitiesWithLimits = new Map();

      if (model === 'prop') {
        const calculateSelectedLimits = (facList: any[]) => {
          facList.forEach((fac: any) => {
            const isChecked = watchedForm[`map-${cIdx}-${fac.bid}`] || false;
            if (isChecked) {
              const limit = parseAED(fac.limitProposed?.baseValue || '0');
              selectedFacilitiesWithLimits.set(fac.bid, limit);
              totalSelectedLimit += limit;
            }
            if (fac.children?.length) {
              calculateSelectedLimits(fac.children);
            }
          });
        };
        calculateSelectedLimits(facilities);
      }

      const validateParentChild = (facList: any[], parentAllocation?: number) => {
        facList.forEach((fac: any) => {
          const isChecked = watchedForm[`map-${cIdx}-${fac.bid}`] || false;

          if (isChecked) {
            let facilityAllocation = 0;
            const facilityLimit = parseAED(fac.limitProposed?.baseValue || '0');
            if (model === 'perc') {
              const pct = watchedForm[`perc-${cIdx}-${fac.bid}`] ?? 0;
              facilityAllocation = (pct / 100) * colAED;
            } else if (model === 'abs') {
              facilityAllocation = watchedForm[`abs-${cIdx}-${fac.bid}`] ?? 0;
            } else if (model === 'prop') {
              if (totalSelectedLimit > 0) {
                const facilitySelectedLimit = selectedFacilitiesWithLimits.get(fac.bid) || 0;
                facilityAllocation = (colAED * facilitySelectedLimit) / totalSelectedLimit;
              } else {
                facilityAllocation = (colAED * facilityLimit) / totalProposedAED;
              }
            }

            if (parentAllocation !== undefined && facilityAllocation > parentAllocation + 0.01) {
              hasParentChildViolation = true;
              parentChildErrors.push(
                `${fac.name || fac.category} (${fac.limitId}) allocation ${facilityAllocation.toFixed(2)} exceeds its parent allocation ${parentAllocation.toFixed(2)}`
              );
            }

            if (fac.children?.length) {
              validateParentChild(fac.children, facilityAllocation);
            }
          } else if (fac.children?.length) {
            validateParentChild(fac.children, undefined);
          }
        });
      };

      validateParentChild(facilities, undefined);
    });

    if (hasParentChildViolation) {
      setErrorMessages(parentChildErrors);
      setOpened(true);
      return;
    }

    if (disclaimerExpiredText) {
      setOpened(true);
      return;
    }

    const flattenFacilities = (facList: any[]): any[] => {
      let result: any[] = [];
      facList.forEach((f) => {
        result.push(f);
        if (f.children?.length) result = result.concat(flattenFacilities(f.children));
      });
      return result;
    };
    const payload = {
      obligorId: obligorDetails?.ObligorId || 'OBLIGOR-001',
      cpId: obligorDetails?.ObligorId === 'OBLIGOR-001' ? 'AKSHAY' : obligorDetails?.CpId,
      isMappedAtCpLevel: mapAtCpLevel,
      coverageDetails: defaultCollaterals.map((col: any, cIdx: number) => {
        const model = watchedForm[`model-${cIdx}`] || 'prop';
        const colAED = parseAED(col.proposedAmount?.baseValue);
        let allocationModel: string | null = null;
        if (model === 'prop') allocationModel = 'PROPORTIONATE';
        if (model === 'perc') allocationModel = 'PERCENTAGE';
        if (model === 'abs') allocationModel = 'ABSOLUTE';
        const facilityCoverageDetails: any[] = [];
        const hasManualSelected = flattenFacilities(facilities).some(
          (f: any) => watchedForm[`map-${cIdx}-${f.bid}`]
        );
        const collect = (facList: any[]) => {
          facList.forEach((f: any) => {
            const bid = f.bid;
            const isChecked = watchedForm[`map-${cIdx}-${bid}`] ?? false;
            let pct = 0;
            let val = 0;
            if (hasManualSelected) {
              if (isChecked) {
                if (model === 'perc') {
                  pct = watchedForm[`perc-${cIdx}-${bid}`] ?? 0;
                  val = (pct / 100) * colAED;
                } else if (model === 'abs') {
                  val = watchedForm[`abs-${cIdx}-${bid}`] ?? 0;
                  pct = colAED > 0 ? (val / colAED) * 100 : 0;
                } else if (model === 'prop') {
                  val = watchedForm[`abs-${cIdx}-${bid}`] ??
                    ((colAED * parseAED(f.limitProposed?.baseValue || '0')) / totalProposedAED);
                  pct = colAED > 0 ? (val / colAED) * 100 : 0;
                }

                facilityCoverageDetails.push({
                  facilityId: bid,
                  isMappedManually: true,
                  pct: Number(pct.toFixed(2)),
                  value: Number(val.toFixed(2)),
                });
              }
            } else {
              if (model === 'perc') {
                pct = watchedForm[`perc-${cIdx}-${bid}`] ?? getApiValue(col.bid, getFacilityIndex(facilities, bid), 'pct');
                val = (pct / 100) * colAED;
              } else if (model === 'abs') {
                val = watchedForm[`abs-${cIdx}-${bid}`] ?? getApiValue(col.bid, getFacilityIndex(facilities, bid), 'value');
                pct = colAED > 0 ? (val / colAED) * 100 : 0;
              } else {
                val = (colAED * parseAED(f.limitProposed?.baseValue || '0')) / totalProposedAED;
                pct = colAED > 0 ? (val / colAED) * 100 : 0;
              }
              facilityCoverageDetails.push({
                facilityId: bid,
                isMappedManually: false,
                pct: Number(pct.toFixed(2)),
                value: Number(val.toFixed(2)),
              });
            }
            if (f.children) collect(f.children);
          });
        };
        collect(facilities);
        const allocated = facilityCoverageDetails.reduce((sum, item) => sum + item.value, 0);
        return {
          collateralId: col.bid,
          allocatedValue: Number(allocated.toFixed(2)),
          allocationModel,
          facilityCoverageDetails,
        };
      }),
    };
    console.log('Payload to submit:', payload);
    setPendingPayload(payload);
    setConfirmOpened(true);
  };

  const getFacilityIndex = (facilities: any[], targetBid: string): number => {
    let currentIdx = 0;
    const traverse = (facList: any[]): number => {
      for (const facility of facList) {
        if (facility.bid === targetBid) return currentIdx;
        currentIdx++;
        if (facility.children) {
          const found = traverse(facility.children);
          if (found !== -1) return found;
        }
      }
      return -1;
    };
    return traverse(facilities);
  };

  const handleMapAtCpLevelChange = (checked: boolean) => {
    setMapAtCpLevel(checked);
    if (checked) {
      defaultCollaterals.forEach((_, cIdx: number) => {
        setValue(`model-${cIdx}`, 'prop');
        const uncheck = (list: any[]) => {
          list.forEach((f) => {
            setValue(`map-${cIdx}-${f.bid}`, false);
            if (f.children) uncheck(f.children);
          });
        };
        uncheck(facilities);
      });
      setSelectedFacilities(new Map());
    } else {
      setSelectedFacilities(new Map());
    }
  };

  if (isAllocationScreenDisabled && !isViewMapping) {
    return (
      <Card shadow="sm" padding="xl" radius="xl" withBorder>
        <Title order={4} fw={500} mb="xl">{t('customTable.collateralFacilityMapping')}</Title>
        <Paper withBorder shadow="none" radius="xs" p="xl" style={{ textAlign: 'center' }}>
          <Text size="lg" c="dimmed">
            {!hasCollaterals && !hasFacilities
              ? t('customTable.pleaseAddCollateralAndFacility')
              : !hasCollaterals
                ? t('customTable.pleaseAddCollateral')
                : t('customTable.pleaseAddFacility')}
          </Text>
        </Paper>
      </Card>
    );
  }

  const minTableWidth = FIRST_COL_WIDTH + SECOND_COL_WIDTH +
    defaultCollaterals.reduce((sum, _, idx) => {
      return sum + (expandedCollaterals[idx] ? COLLATERAL_COL_WIDTH * 3 : COLLATERAL_COL_WIDTH_COLLAPSED);
    }, 0);

  return (
    <>
      <Card shadow="sm" padding="xl" radius="xl" withBorder>
        <Group justify="space-between" align="center" mb="sm">
          <Title order={4} fw={500}>{t('customTable.collateralFacilityMapping')}</Title>
          <Group gap={6}>
            <Checkbox
              size="xs"
              checked={mapAtCpLevel}
              onChange={(e) => handleMapAtCpLevelChange(e.currentTarget.checked)}
              disabled={isViewMapping}
            />
            <Text size="sm" c="#262626" truncate="end">{t('customTable.mapAtCPLevel')}</Text>
          </Group>
        </Group>

        <Paper withBorder shadow="none" radius="xs" p={0} m={0} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '600px' }}>
            {/* Header Section - Sticky at top with horizontal scroll */}
            <Box 
              ref={headerScrollRef}
              onScroll={handleHorizontalScroll}
              style={{ 
                overflowX: 'auto',
                overflowY: 'hidden',
                borderBottom: '1px solid #dee2e6',
                background: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 5
              }}
            >
              <Table
                withRowBorders={false}
                verticalSpacing="xs"
                horizontalSpacing="xs"
                className="table-default"
                style={{ 
                  minWidth: minTableWidth, 
                  tableLayout: 'fixed', 
                  borderCollapse: 'collapse',
                  marginBottom: 0
                }}
              >
                <TableHeader
                  defaultCollaterals={defaultCollaterals}
                  isViewMapping={isViewMapping}
                  control={control}
                  handleModelChange={handleModelChange}
                  mapAtCpLevel={mapAtCpLevel}
                  headerMapChecked={headerMapChecked}
                  headerMapIndeterminate={headerMapIndeterminate}
                  handleHeaderMapChange={handleHeaderMapChange}
                  expandAll={expandAll}
                  setExpandAll={setExpandAll}
                  expandedCollaterals={expandedCollaterals}
                  toggleCollateralExpand={toggleCollateralExpand}
                />
              </Table>
            </Box>

            {/* Body Section - Vertical and horizontal scroll */}
            <Box 
              ref={bodyScrollRef}
              onScroll={handleHorizontalScroll}
              style={{ 
                overflowX: 'auto',
                overflowY: 'auto',
                flex: 1,
                background: 'white'
              }}
            >
              <Table
                withRowBorders={false}
                verticalSpacing="xs"
                horizontalSpacing="xs"
                className="table-default"
                style={{ 
                  minWidth: minTableWidth, 
                  tableLayout: 'fixed', 
                  borderCollapse: 'collapse'
                }}
              >
                <Table.Tbody>
                  <FacilityRows
                    facilities={facilities}
                    defaultCollaterals={defaultCollaterals}
                    watchedForm={watchedForm}
                    control={control}
                    isViewMapping={isViewMapping}
                    getApiValue={getApiValue}
                    parseAED={parseAED}
                    totalProposedAED={totalProposedAED}
                    handlePercentageChange={handlePercentageChange}
                    handleValueChange={handleValueChange}
                    handleMapManuallyChange={handleMapManuallyChange}
                    handleMapManuallyWithChildren={handleMapManuallyWithChildren}
                    formatTwoDecimals={formatTwoDecimals}
                    mapAtCpLevel={mapAtCpLevel}
                    selectedFacilities={selectedFacilities}
                    expandAll={expandAll}
                    expandedCollaterals={expandedCollaterals}
                  />
                </Table.Tbody>
              </Table>
            </Box>
          </Box>
        </Paper>

        <Box style={{ borderTop: '1px solid #eee', paddingTop: 24, paddingBottom: 2, marginTop: 16 }}>
          <Stack gap={0}>
            {disclaimerText && (
              <Text size="xs" c="#262626">
                <Text span size="xs" c="red">*</Text>{t('customTable.disclaimer')}: {disclaimerText}
              </Text>
            )}
            {disclaimerExpiredText && (
              <Text size="xs" c="#262626">
                <Text span size="xs" c="red">*</Text>{t('customTable.disclaimer')}: {disclaimerExpiredText}
              </Text>
            )}
            <Text size="xs" c="#262626">
              <Text span size="xs" c="red">**</Text>{t('customTable.actualCurrency')}
            </Text>
            <Text size="xs" c="dimmed">
              <Text span size="xs" c="red">**</Text>{t('customTable.baseCurrency')}
            </Text>
          </Stack>
        </Box>

        <Box mt={6}>
          <Group justify="flex-end">
            {!isViewMapping && (
              <Group gap="sm">
                <Button variant="light" color="gray" radius="xl" size="sm" onClick={() => setObligorId('')}>
                  Cancel
                </Button>
                <Button color="#213C81" radius="xl" size="sm" onClick={onSubmitForm} loading={isSubmitting}>
                  Next
                </Button>
              </Group>
            )}
          </Group>
        </Box>
      </Card>

      <CoverageExceededModal
        opened={opened}
        title={disclaimerExpiredText ? t('customTable.expiredDetected') : t('customTable.coverageLimitExceeded')}
        body={disclaimerExpiredText || errorMessages.join(', ')}
        onClose={() => setOpened(false)}
      />
      <ConfirmationModal
        opened={confirmOpened}
        onClose={() => {
          setConfirmOpened(false);
          setPendingPayload(null);
        }}
        onConfirm={() => {
          if (pendingPayload) onSubmit(pendingPayload);
          setConfirmOpened(false);
          setPendingPayload(null);
        }}
        title={t('customTable.confirmCollateralAllocationMapping')}
        confirmLabel={t('customTable.confirmAndSubmit')}
        loading={isSubmitting}
      />
    </>
  );
};

export default CollateralFacilityCoverage;
/* collateral-facility-mapping.css */

/* Ensure the facility details column stays sticky during horizontal scroll */
.cell-height:first-child {
  position: sticky !important;
  left: 0;
  z-index: 3;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
}

.cell-height:nth-child(2) {
  position: sticky !important;
  left: 190px; /* FIRST_COL_WIDTH */
  z-index: 2;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
}

/* For the header section */
.header-cell {
  position: sticky;
  top: 0;
  background: white;
  z-index: 4;
  border-bottom: 1px solid #dee2e6;
}

/* Smooth scrolling */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Ensure proper border rendering */
.cell-all-border {
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
}

/* Collapsed state styling */
.cell-collapsed {
  background: white;
  border: none !important;
}

/* For the nested table in header */
.nested-table {
  width: 100%;
  border-collapse: collapse;
}

.nested-table td {
  padding: 4px;
  border: none;
}

/* Table default styles */
.table-default {
  width: 100%;
  border-collapse: collapse;
}

.table-default th,
.table-default td {
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
}

/* Top-left alignment utility */
.top-left-aligned {
  text-align: left;
  vertical-align: top;
}

/* Cell padding utilities */
.cell-padding-remove {
  padding: 0 !important;
}

/* Cell height consistency */
.cell-height {
  height: 80px;
  min-height: 80px;
}

/* Ellipsis text */
.ellipsis-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

/* Description text */
.des {
  max-width: 200px;
  word-wrap: break-word;
}

/* Sticky positioning for collateral headers */
[style*="position: sticky"][style*="top: 0"] {
  background: white;
  z-index: 4;
}

[style*="position: sticky"][style*="top: 41px"] {
  background: white;
  z-index: 4;
}

[style*="position: sticky"][style*="top: 82px"] {
  background: white;
  z-index: 4;
}

[style*="position: sticky"][style*="top: 123px"] {
  background: #f8f9fa;
  z-index: 4;
}
