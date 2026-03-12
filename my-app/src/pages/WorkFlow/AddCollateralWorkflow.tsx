import { Card, Stack, Text, Group, ThemeIcon } from "@mantine/core";
import {
  IconFileText,
  IconListCheck,
  IconSettings,
  IconCircleCheck,
} from "@tabler/icons-react";

interface Step {
  id: number;
  label: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 1,
    label: "Manage Collateral",
    icon: <IconFileText size={16} />,
  },
  {
    id: 2,
    label: "Basic Details",
    icon: <IconListCheck size={16} />,
  },
  {
    id: 3,
    label: "Additional Details",
    icon: <IconSettings size={16} />,
  },
  {
    id: 4,
    label: "Workflow Stages",
    icon: <IconCircleCheck size={16} />,
  },
];

interface Props {
  activeStep?: number;
}

export default function AddCollateralWorkflow({ activeStep = 1 }: Props) {
  return (
    <Card
      shadow="sm"
      radius="md"
      withBorder
      w={260}
      p="lg"
    >
      <Stack gap="md">
        <Text fw={600} size="lg">
          Add Collateral
        </Text>

        <Text size="xs" c="dimmed">
          WORKFLOW STEPS
        </Text>

        <Stack gap="xs">
          {steps.map((step) => (
            <Group
              key={step.id}
              p="xs"
              style={{
                borderRadius: 8,
                background:
                  activeStep === step.id ? "#f1f3f5" : "transparent",
                cursor: "pointer",
              }}
            >
              <ThemeIcon
                variant={activeStep === step.id ? "filled" : "light"}
                size="sm"
                color={activeStep === step.id ? "blue" : "gray"}
              >
                {step.icon}
              </ThemeIcon>

              <Text
                size="sm"
                fw={activeStep === step.id ? 600 : 400}
                c={activeStep === step.id ? "blue" : "dark"}
              >
                {step.label}
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}