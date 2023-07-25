import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthContextProvider } from "./context/AuthContext";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthContextProvider>
				<BrowserRouter>
					<Navbar />
					<App />
					<ReactQueryDevtools />
				</BrowserRouter>
			</AuthContextProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
