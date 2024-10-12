import { useState, useEffect, useContext, createContext } from "react";
import { authService } from "../services/"; // Assuming you have an authService for login/logout

// Create an Auth Context
const AuthContext = createContext(null);

// Create a provider to wrap your app
export const AuthProvider = ({ children }) => {
	const auth = useProvideAuth();
	return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Custom hook to use the Auth Context
export const useAuth = () => {
	return useContext(AuthContext);
};

// The actual hook that manages the authentication logic
const useProvideAuth = () => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		const token = localStorage.getItem("token");
		if (storedUser && token) {
			setUser(JSON.parse(storedUser));
			setIsAuthenticated(true);
		} else {
			setUser(null);
			setIsAuthenticated(false);
		}
	}, []);

	// Login function (calls the auth service and sets the user)
	const login = async (email, password) => {
		try {
			const response = await authService.login(email, password);
			const { token, user } = response;
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));
			setUser(user); // Set user in state
		} catch (error) {
			console.error("Login failed", error);
		}
	};

	const register = async (name, email, password, role) => {
		try {
			const response = await authService.register({
				name,
				email,
				password,
				role,
			});
			const { token, user } = response;
			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));
			setUser(user);
		} catch (error) {
			console.error("Registration failed", error);
		}
	};

	// Logout function
	const logout = () => {
		authService.logout(); // Call the logout method from authService
		setUser(null); // Clear user state
	};

	return {
		user,
		isAuthenticated,
		login,
		register,
		logout,
	};
};
