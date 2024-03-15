import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthContextProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import { PrimeReactProvider } from "primereact/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <PrimeReactProvider value={{}}>
      <AuthContextProvider>
        <ThemeContextProvider>
          <BrowserRouter>
            <App />
            <ReactQueryDevtools />
          </BrowserRouter>
        </ThemeContextProvider>
      </AuthContextProvider>
    </PrimeReactProvider>
  </QueryClientProvider>,
);
