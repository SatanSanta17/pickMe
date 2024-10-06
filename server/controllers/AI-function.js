const { VertexAI } = require("@google-cloud/vertexai");

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
	project: "pickme-435813",
	location: "us-central1",
});
const model = "gemini-1.5-flash-001";

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
			{
				role: "user",
				parts: [
					{
						text: `Generate a technical task for the role of ${role} with ${experience} years of experience. \nThe tasks should focus on testing the candidate's ability to meet the key responsibilities and required skills. 
						\nPlease provide the response in the following JSON structure:
						\n{
							\n"taskTitle":"string"
							\n"taskObjective": "string",
							\n"requirements": ["string"],
							\n"deliverables": ["string"],
							\n"timeline": "string",
							\n"resourcesNeeded": ["string"],
						\n}
						\nKey Responsibilities: ${keyResponsibilities}
						\nRequired Skills: ${requiredSkills}
						\nJob Description: ${jobDescription}
						\nThe response should be a valid JSON object and nothing else.`,
					},
				],
			},
		],
	};
	try {
		const streamingResp = await generativeModel.generateContentStream(req);
		let aggregatedResponse = "";

		for await (const item of streamingResp.stream) {
			// console.log(item.candidates[0].content);
			aggregatedResponse += item.candidates[0].content.parts[0].text;
		}
		return aggregatedResponse;
	} catch (error) {
		console.error("Vertex AI API error:", error); // Print full error for debugging
		throw new Error("Task generation failed.");
	}
}

module.exports = { generateContent };
