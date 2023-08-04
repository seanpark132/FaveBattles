import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function useTheme() {
	return useContext(ThemeContext);
}

export const ThemeContextProvider = ({ children }) => {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
		if (darkThemeMq.matches) {
			setTheme("dark");
		}
	}, []);

	return (
		<ThemeContext.Provider value={{ theme: theme, setTheme: setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
