import httpService from "./httpService";

const API_URL = "/api/profile";

const createUser = async (userData) => {
	const response = await httpService.post(API_URL, userData);
	return response.data;
};

const viewUser = async (userId) => {
	const response = await httpService.get(`${API_URL}/${userId}`);
	return response.data;
};

const updateUser = async (userId, updatedData) => {
	const response = await httpService.put(`${API_URL}/${userId}`, updatedData);
	return response.data;
};

const deleteUser = async (userId) => {
	const response = await httpService.delete(`${API_URL}/${userId}`);
	return response.data;
};

export default { createUser, viewUser, updateUser, deleteUser };
