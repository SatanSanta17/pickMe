# PickMe

## Overview

Task Generator is an AI-powered application designed to generate tasks based on user input. It utilizes NLP models for text generation and provides a seamless way to create structured tasks dynamically.

## Features

- User Authentication (Login & Register)
- Employer and Candidate Profile Completion
- Task Creation by Employer
- Task Editing and Deletion by Employer
- Task Submission by Candidate
- Submission Editing and Deletion by Candidate
- AI-powered Task Generation

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Optional, if needed later)
- **AI Model:** Gemini-1.5-flash-001
- **Authentication:** JWT-based authentication

## Installation

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (if using a database)
- API key for AI model

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SatanSanta17/pickMe.git
   cd pickMe
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   AI_API_KEY=your_ai_service_api_key
   ```

4. **Run the server:**

   ```bash
   npm run server
   ```

5. **Run the frontend:**

   ```bash
   cd client
   npm install
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login and get token |

### Profile Completion

| Method | Endpoint               | Description                         |
| ------ | ---------------------- | ----------------------------------- |
| POST   | `/api/profile/create`  | Complete employer/candidate profile |
| GET    | `/api/profile/:userId` | Get user profile                    |

### Task Management

| Method | Endpoint                | Description   |
| ------ | ----------------------- | ------------- |
| POST   | `/api/tasks/create`     | Create a task |
| PUT    | `/api/tasks/edit/:id`   | Edit a task   |
| DELETE | `/api/tasks/delete/:id` | Delete a task |

### Task Submission

| Method | Endpoint                      | Description       |
| ------ | ----------------------------- | ----------------- |
| POST   | `/api/submissions/create`     | Submit a task     |
| PUT    | `/api/submissions/edit/:id`   | Edit submission   |
| DELETE | `/api/submissions/delete/:id` | Delete submission |

## Running Tests

This project includes Cypress for end-to-end testing.

1. **Run Cypress tests:**

   ```bash
   npm run test
   ```

2. **Example Test Case:** (Located in `cypress/e2e/profile_spec.cy.js`)

   ```javascript
   describe("Candidate Profile Completion Test", () => {
       it("should complete the candidate profile", () => {
           cy.login("candidate@example.com", "password123"); // Custom login command
           cy.visit("/profile-completion");
           cy.get('input[name="phone"]').type("1234567890");
           cy.get('input[name="profilePicture"]').type("profilePic.png");
           cy.get('button[type="submit"]').click();
           cy.contains("Profile updated successfully").should("be.visible");
       });
   });
   ```

## Deployment

To deploy the application, consider using:

- **Frontend:** Vercel, Netlify
- **Backend:** Render, Heroku, AWS
- **Database:** MongoDB Atlas (if using a database)

1. **Build for production:**
   ```bash
   npm run build
   ```
2. **Deploy backend & frontend separately using chosen service.**

## Future Improvements

- Implement AI-based task recommendations
- Add real-time notifications
- Integrate payment system (if required)
- UI implementations

## Contributing

1. Fork the repository.
2. Create a new branch (`feature-branch-name`).
3. Commit your changes.
4. Push to your branch and create a Pull Request.

---

**Author:** SatanSanta17\

