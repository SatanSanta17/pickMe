import httpService from "./httpService";

const API_URL = "/api/tasks";

const createTask = async (taskData) => {
	const response = await httpService.post(API_URL, taskData);
	return response.data;
};

const fetchTask = async (taskId) => {
	const response = await httpService.get(`${API_URL}/${taskId}`);
	return response.data;
};

const fetchTasks = async () => {
	const response = await httpService.get(API_URL);
	return response.data;
};

const updateTask = async (taskId, updatedData) => {
	const response = await httpService.put(`${API_URL}/${taskId}`, updatedData);
	return response.data;
};

const deleteTask = async (taskId) => {
	const response = await httpService.delete(`${API_URL}/${taskId}`);
	return response.data;
};

export default { createTask, fetchTask, fetchTasks, updateTask, deleteTask };
