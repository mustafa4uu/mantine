import { Flex } from "@mantine/core";
import AddCollateralWorkflow from "./AddCollateralWorkflow";
// import AddCollateralWorkflow from "./AddCollateralWorkflow";

export default function AddCollateralPage() {
  return (
    <Flex gap="lg">
      <AddCollateralWorkflow activeStep={2} />

      {/* Right Side Content */}
      <div style={{ flex: 1 }}>
        Main Content Area
      </div>
    </Flex>
  );
}