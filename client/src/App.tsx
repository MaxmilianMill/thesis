import { ThemeProvider } from './components/providers/theme-provider'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GetStarted from './pages/start/GetStarted'
import SetupScreen from './pages/setup/SetupScreen'
import PartnerCustomizationScreen from './pages/partner/PartnerCustomizationScreen'
import OverviewScreen from './pages/chat/Overview'

const router = createBrowserRouter([
  {
    path: "/",
    element: <GetStarted />,
  },
  {
    path: "/setup",
    element: <SetupScreen />,
  },
  {
    path: "/partner",
    element: <PartnerCustomizationScreen />,
  },
  {
    path: "/study",
    element: <OverviewScreen />,
  },
]);

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
