import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthContextProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <ThemeContextProvider>
        <BrowserRouter>
          <App />
          <ReactQueryDevtools />
        </BrowserRouter>
      </ThemeContextProvider>
    </AuthContextProvider>
  </QueryClientProvider>,
);
