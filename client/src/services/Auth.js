import httpService from "./httpService";

const API_URL = "/api/auth";

const login = async (email, password) => {
	const response = await httpService.post(`${API_URL}/login`, {
		email,
		password,
	});
	return response.data;
};

const register = async (userData) => {
	const response = await httpService.post(`${API_URL}/register`, userData);
	return response.data;
};

const logout = () => {
	localStorage.removeItem("token"); // Clear token on logout
};

export default { login, register, logout };
