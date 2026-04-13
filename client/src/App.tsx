import { ThemeProvider } from './components/providers/theme-provider'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GetStarted from './pages/start/GetStarted'

const router = createBrowserRouter([
  {
    path: "/",
    element: <GetStarted />,
  }
]);

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
