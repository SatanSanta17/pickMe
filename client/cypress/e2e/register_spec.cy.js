describe("Register Page Test", () => {
	it("should register a new user successfully", () => {
		cy.visit("http://localhost:3000/register");
		cy.get('input[name="name"]').type("Test User");
		cy.get('input[name="email"]').type("testuser@example.com");
		cy.get('input[name="password"]').type("password123");
		// cy.get('input[name="confirmPassword"]').type("password123");
		cy.get('button[type="submit"]').first().click(); // Submit the form

		// Check URL after successful registration
		cy.url().should("include", "http://localhost:3000/");
	});
});
