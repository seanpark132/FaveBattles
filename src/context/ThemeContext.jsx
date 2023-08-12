import { createContext, useContext, useEffect, useState } from "react";
import PrimeReact from "primereact/api";

const ThemeContext = createContext();

export function useTheme() {
	return useContext(ThemeContext);
}

export const ThemeContextProvider = ({ children }) => {
	const [theme, setTheme] = useState("light");

	function changeTheme(theme) {
		setTheme(theme);
		localStorage.setItem("theme", theme);

		if (theme === "dark") {
			PrimeReact?.changeTheme?.(
				"lara-light-teal",
				"lara-dark-teal",
				"prime-react-theme"
			);
		} else {
			PrimeReact?.changeTheme?.(
				"lara-dark-teal",
				"lara-light-teal",
				"prime-react-theme"
			);
		}
	}

	useEffect(() => {
		const existingTheme = localStorage.getItem("theme");

		if (existingTheme) {
			setTheme(existingTheme);
			if (existingTheme === "dark") {
				PrimeReact?.changeTheme?.(
					"lara-light-teal",
					"lara-dark-teal",
					"prime-react-theme"
				);
			}
		} else {
			const darkThemeMq = window.matchMedia(
				"(prefers-color-scheme: dark)"
			);
			if (darkThemeMq.matches) {
				setTheme("dark");
				PrimeReact?.changeTheme?.(
					"lara-light-teal",
					"lara-dark-teal",
					"prime-react-theme"
				);
			}
		}
	}, []);

	return (
		<ThemeContext.Provider value={{ theme: theme, setTheme: changeTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
