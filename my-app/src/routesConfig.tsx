import CustomerList from "./pages/customer/CustomerList";
import CustomerFormPage from "./pages/customer/CustomerForm";

import AddressList from "./pages/address/AddressList";
import AddressForm from "./pages/address/AddressForm";

import AddCollateral from "./pages/collateral/AddCollateral";
// import CollateralFacilityMapping from "./pages/CollateralFacilityMapping/CollateralFacilityMapping";
import AddCollateralPage from "./pages/WorkFlow/AddCollateralPage";

export const routesConfig = [
    { path: "/customer-details", element: <CustomerList /> },
    { path: "/customer-details/add", element: <CustomerFormPage /> },  
    { path: "/customer-details/edit/:id", element: <CustomerFormPage /> },
    { path: "/customer-address", element: <AddressList /> },
    { path: "/customer-address/add", element: <AddressForm /> },  
    { path: "/customer-address/edit/:id", element: <AddressForm /> },
    { path: "/onboarding", element: <AddCollateral /> },
    { path: "/collateral-perfections", element: <AddCollateralPage /> },
];
