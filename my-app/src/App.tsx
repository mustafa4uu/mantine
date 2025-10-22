import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import HomePage from "./pages/HomePage";
import { routesConfig } from "./routesConfig";
import Page404 from "./pages/Page404";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        {routesConfig.map(({ path, element }) => (
          <Route key={`${path}`} path={path} element={element} />
        ))}
      </Route>
      {/* Fallback when nothing matches at all */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
