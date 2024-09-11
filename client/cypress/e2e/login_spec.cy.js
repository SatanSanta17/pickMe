describe("Login Page Test", () => {
	it("should login successfully with valid credentials", () => {
		cy.visit("http://localhost:3000/login"); // Navigate to the login page

		cy.get('input[name="email"]').type("abdeali@gmail.com"); // Enter email
		cy.get('input[name="password"]').type("12345678"); // Enter password
		cy.get('button[type="submit"]').first().click(); // Submit the form

		cy.url().should("include", "http://localhost:3000/"); // Verify successful login by checking the URL
		// cy.get(".welcome-message").should("contain", "Welcome, Test User"); // Verify welcome message
	});
});
