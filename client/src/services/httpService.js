import axios from "axios";

const httpService = axios.create({
	baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000", // Your backend base URL
});

// Add interceptors to include token automatically if available
httpService.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default httpService;
