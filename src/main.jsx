import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const store = configureStore({
	reducer: {},
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<App />
				<ReactQueryDevtools />
			</QueryClientProvider>
		</Provider>
	</React.StrictMode>
);
