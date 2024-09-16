describe("Employer Profile Completion Test", () => {
	it("should complete the employer profile", () => {
		cy.login("abdeali@gmail.com", "password123"); // Custom command for login
		cy.visit("http://localhost:3000/profile-completion");

		cy.get('input[name="phone"]').type("8452959340");
		cy.get('input[name="companyName"]').type("ABC Company");
		cy.get('input[name="companyLogo"]').type("companyLogo.png");
		// cy.get('input[name="website"]').type("http://awesome-company.com");
		cy.get('button[type="submit"]').first().click();

		// Check profile completion success
		// cy.contains("Profile saved successfully").should("be.visible");
	});
});

describe("Candidate Profile Completion Test", () => {
	it("should complete the candidate profile", () => {
		// Log in as a candidate
		cy.login("burhan@gmail.com", "password123"); // Custom command for login

		// Wait for the page to load
		cy.visit("http://localhost:3000/profile-completion");

		// Check if the user role is set to 'candidate' by ensuring the candidate-specific fields are visible
		cy.get('input[name="phone"]').type("8452959340");

		// Ensure profilePicture input is visible
		cy.get('input[name="profilePicture"]')
			.should("be.visible")
			.type("profilePic.png");

		// Ensure resume input is visible
		cy.get('input[name="resume"]').should("be.visible").type("resume.pdf");

		// Submit the form
		cy.get('button[type="submit"]').first().click();

		// Check profile completion success
		// cy.contains("Profile updated successfully").should("be.visible");
	});
});
