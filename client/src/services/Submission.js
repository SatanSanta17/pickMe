import httpService from "./httpService";

const API_URL = "/api/submissions";

const createSubmission = async (submissionData) => {
	const response = await httpService.post(API_URL, submissionData);
	return response.data;
};

const viewSubmission = async (submissionId) => {
	const response = await httpService.get(`${API_URL}/${submissionId}`);
	return response.data;
};

const viewSubmissionsByCreator = async (creatorId) => {
	const response = await httpService.get(`${API_URL}/creator/${creatorId}`);
	return response.data;
};

const viewSubmissionsForTask = async (taskId) => {
	const response = await httpService.get(`${API_URL}/task/${taskId}`);
	return response.data;
};

const updateSubmission = async (submissionId, updatedData) => {
	const response = await httpService.put(
		`${API_URL}/${submissionId}`,
		updatedData
	);
	return response.data;
};

const deleteSubmission = async (submissionId) => {
	const response = await httpService.delete(`${API_URL}/${submissionId}`);
	return response.data;
};

export default {
	createSubmission,
	viewSubmission,
	viewSubmissionsByCreator,
	viewSubmissionsForTask,
	updateSubmission,
	deleteSubmission,
};
