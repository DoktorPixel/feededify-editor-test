import { Route, Routes } from "react-router-dom";
import { BannerProvider } from "./context/BannerContext";
import { ConfigProvider } from "./context/ConfigContext";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18n from "./locales/i18n";
import { I18nextProvider } from "react-i18next";
import { CssBaseline } from "@mui/material";
import theme from "../theme";
import Layout from "./components/Layout";

const App: React.FC = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <BannerProvider>
      <ConfigProvider>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
              <CssBaseline />
              <Routes>
                <Route path="/:projectId" element={<Layout />} />
                <Route path="/project/:projectName" element={<Layout />} />
                <Route path="/" element={<Layout />} />
              </Routes>
            </I18nextProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ConfigProvider>
    </BannerProvider>
  );
};

export default App;
