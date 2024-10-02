const axios = require("axios");
const { VertexAI } = require("@google-cloud/vertexai");

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
	project: "pickme-435813",
	location: "us-central1",
});
const model = "gemini-1.5-flash-002";

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
	model: model,
	generationConfig: {
		maxOutputTokens: 8192,
		temperature: 1,
		topP: 0.95,
	},
	safetySettings: [
		{
			category: "HARM_CATEGORY_HATE_SPEECH",
			threshold: "OFF",
		},
		{
			category: "HARM_CATEGORY_DANGEROUS_CONTENT",
			threshold: "OFF",
		},
		{
			category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
			threshold: "OFF",
		},
		{
			category: "HARM_CATEGORY_HARASSMENT",
			threshold: "OFF",
		},
	],
});

async function generateContent(
	role,
	experience,
	keyResponsibilities,
	requiredSkills,
	jobDescription
) {
	const req = {
		contents: [
			`Generate a technical task for the role of ${role} with ${experience} years of experience. The tasks should focus on testing the candidate's ability to meet the key responsibilities and required skills for this role.\nEach task should: Include a clear objective, requirements, deliverables, and a timeline for completion. \nHighlight any resources needed from the employer (e.g., Git repository, web application). \nMerge tasks if they share common goals (e.g., code review and performance audit). \nAlign with the key responsibilities and required skills as outlined below. \nKey Responsibilities: ${keyResponsibilities} \nRequired Skills: ${requiredSkills}  \nJob Description: ${jobDescription} \nEnsure the tasks are comprehensive, realistic, and assess both technical and leadership abilities (if applicable).`,
		],
	};
	try {
		const streamingResp = await generativeModel.generateContentStream(req);
		let aggregatedResponse = ""; // Initialize an empty string to store the combined response

		// Collect the streamed chunks
		for await (const item of streamingResp.stream) {
			// Concatenate each chunk to the aggregatedResponse
			aggregatedResponse += item.text; // Assuming item.text contains the response text
		}

		// Return the complete aggregated response
		return aggregatedResponse;
	} catch (error) {
		console.log("Task generation failed:", error);
		throw new Error("Task generation failed: " + error.message);
	}
}

module.exports = { generateContent };
