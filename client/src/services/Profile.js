import httpService from "./httpService";
import axios from "axios";

const API_URL = "/api/profile";
const token = localStorage.getItem("token");

const fetchProfile = async (userId) => {
	const response = await httpService.get(`${API_URL}/${userId}`);
	return response.data;
};

const fetchProfiles = async () => {
	const response = await httpService.get(`${API_URL}/fetchAll`);
	return response.data;
};

const updateProfile = async (userId, updatedData) => {
	const response = await httpService.put(`${API_URL}/${userId}`, updatedData);
	return response.data;
};

const deleteUserProfile = async (userId) => {
	const response = await httpService.delete(`${API_URL}/${userId}`);
	return response.data;
};

export default {
	fetchProfiles,
	fetchProfile,
	updateProfile,
	deleteUserProfile,
};
