import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const UserContext = createContext();

export function useUser() {
	return useContext(UserContext);
}

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState({});

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
