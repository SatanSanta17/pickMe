import httpService from "./httpService";

const API_URL = "/api/task";

const createTask = async (taskData) => {
	const response = await httpService.post(`${API_URL}/create`, taskData);
	return response.data;
};

const fetchTask = async (taskId) => {
	const response = await httpService.get(`${API_URL}/fetch/${taskId}`);
	return response.data;
};

const fetchMyTasks = async (employerId) => {
	const response = await httpService.get(
		`${API_URL}//fetchTasks/${employerId}`
	);
	return response.data;
};

const fetchAllTasks = async () => {
	const response = await httpService.get(`${API_URL}/fetchAll`);
	return response.data;
};

const updateTask = async (taskId, updatedData) => {
	const response = await httpService.put(
		`${API_URL}/update/${taskId}`,
		updatedData
	);
	return response.data;
};

const deleteTask = async (taskId) => {
	const response = await httpService.delete(`${API_URL}/delete/${taskId}`);
	return response.data;
};

export default {
	createTask,
	fetchTask,
	fetchAllTasks,
	updateTask,
	deleteTask,
	fetchMyTasks,
};
