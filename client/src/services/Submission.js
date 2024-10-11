import httpService from "./httpService";

const API_URL = "/api/submission";

const createSubmission = async (submissionData) => {
	const response = await httpService.post(`${API_URL}/submit`, submissionData);
	return response.data;
};

const viewSubmission = async (submissionId) => {
	const response = await httpService.get(`${API_URL}/fetch/${submissionId}`);
	return response.data;
};

const viewSubmissionsByCreator = async (creatorId) => {
	const response = await httpService.get(
		`${API_URL}/fetchUserSubmissions/${creatorId}`
	);
	return response.data;
};

const viewSubmissionsForTask = async (taskId) => {
	const response = await httpService.get(
		`${API_URL}/fetchTaskSubmissions/${taskId}`
	);
	return response.data;
};

const viewAllSubmissions = async () => {
	const response = await httpService.get(`${API_URL}/fetchAll`);
	return response.data;
};

const updateSubmission = async (submissionId, updatedData) => {
	const response = await httpService.put(
		`${API_URL}/update/${submissionId}`,
		updatedData
	);
	return response.data;
};

const deleteSubmission = async (submissionId) => {
	const response = await httpService.delete(
		`${API_URL}/delete/${submissionId}`
	);
	return response.data;
};

export default {
	createSubmission,
	viewSubmission,
	viewSubmissionsByCreator,
	viewSubmissionsForTask,
	viewAllSubmissions,
	updateSubmission,
	deleteSubmission,
};
