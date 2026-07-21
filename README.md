Full Stack Web Developer Intern  
Technical Assessment 
Company:  Koncepthive 
Position: Intern – Full Stack Web Developer 
Assessment Overview 
Thank you for your interest in joining our team. 
As part of our recruitment process, we would like you to complete a small technical assessment. 
This assignment is designed to evaluate your understanding of full-stack web development, 
coding standards, problem-solving ability, and software design practices. 
This is not expected to be a production-ready application. We are more interested in how you 
structure your code, solve problems, and explain your decisions. 
Assessment Duration  
Deadline 23rd of July 11:59pm. Please submit your completed project within the agreed 
deadline. 
Objective 
Develop a Task Management System that allows users to authenticate and manage their daily 
tasks. The application should include both a frontend and backend with a database. 
Technology Requirements 
Frontend 
Choose one: 
● React.js (Preferred) 
● Next.js 
Backend 
● Node.js 
● Express.js 
Preferred: TypeScript 
Database 
Choose one: 
● PostgreSQL 
● MySQL 
Functional Requirements 
1. User Authentication 
Implement a simple authentication system. 
Features 
● Login 
● Logout 
No registration page is required. 
Use the following default credentials: 
Email 
admin@test.com 
Password 
123456 
Authentication may be implemented using: 
● JWT (Preferred) 
● Session-based authentication 
2. Dashboard 
After successful login, display a dashboard showing: 
● Total Tasks 
● Pending Tasks 
● In Progress Tasks 
● Completed Tasks 
● Overdue Tasks 
3. Task Management 
Implement complete CRUD functionality. 
Each task should contain the following fields: 
Field 
Title 
Description 
Priority (Low / Medium / High) 
Required 
Yes 
No 
Yes 
Due Date 
Status (Pending / In Progress / Completed) 
Created Date 
Last Updated Date 
Users should be able to: 
● Create Tasks 
● View Tasks 
● Update Tasks 
● Delete Tasks 
4. Search 
Provide a search feature using: 
● Task Title 
Yes 
Yes 
Automatically Generated 
Automatically Generated 
Search should update the task list dynamically or after submission. 
5. Filtering 
Allow users to filter tasks by: 
● Status 
● Priority 
Multiple filters may be applied together. 
6. Sorting 
Allow sorting by: 
● Newest Created 
● Oldest Created 
● Due Date 
7. Validation 
Implement validation on both frontend and backend. 
Examples: 
● Title is required 
● Due date cannot be earlier than today 
● Priority is required 
● Status is required 
Display meaningful validation messages. 
8. Responsive Design 
The application should be usable on: 
● Desktop 
● Tablet 
● Mobile 
Responsive layouts are expected. 
REST API Requirements 
Implement RESTful APIs similar to the following: 
POST   /api/auth/login 
GET    /api/tasks 
GET    /api/tasks/:id 
POST   /api/tasks 
PUT    /api/tasks/:id 
DELETE /api/tasks/:id 
Additional endpoints may be added if necessary. 
Database Design 
Minimum tables: 
Users 
id 
name 
email 
password 
created_at 
updated_at 
Tasks 
id 
title 
description 
priority 
status 
due_date 
created_at 
updated_at 
Additional fields may be added where appropriate. 
Project Structure 
A clean project structure is expected. 
Example: 
project/ 
├── frontend/ 
├── backend/ 
├── README.md 
└── database/ 
You may organize the project differently if justified. 
Code Quality Expectations 
A clean and maintainable codebase is expected. 
Please follow good software development practices, including: 
● Meaningful naming conventions 
● Reusable components 
● Proper folder structure 
● Separation of concerns 
● Consistent coding style 
● Proper error handling 
● Maintainable code 
Avoid: 
● Hardcoded values 
● Unused code 
● Large files containing unrelated logic 
● Duplicate code 
Git Requirements 
Use Git throughout the development process. 
Expected commit history should demonstrate development progress. 
Example: 
Initial project setup 
Authentication 
Task CRUD 
Dashboard 
Search and filtering 
Bug fixes 
Final cleanup 
Avoid submitting the entire project in a single commit. 
README Requirements 
Include a README containing: 
● Project Overview 
● Technology Stack 
● Installation Instructions 
● Environment Variables 
● Database Setup 
● Running the Backend 
● Running the Frontend 
● API Documentation 
● Assumptions Made 
● Known Limitations (if any) 
Bonus Features (Optional) 
These are not required, but will be considered positively. 
● Pagination 
● Dark Mode 
● Docker Support 
● Unit Tests 
● Loading Indicators 
● Toast Notifications 
● Refresh Token Authentication 
● Deployment (Vercel, Netlify, Render, Railway, etc.) 
Submission Requirements 
Submit the following: 
● GitHub Repository Link 
● SQL Dump or Migration Files 
● README.md 
● .env.example file 
Include: 
● Frontend URL 
● Backend URL 
Submit to: career@koncepthive.com  
Important Notes 
● You may use any open-source libraries. 
● You may refer to documentation and online resources during development. 
● AI-assisted development tools (such as ChatGPT, GitHub Copilot, or Claude) may be 
used, but you should fully understand the code you submit. During the interview, you will 
be asked to explain your implementation and design decisions. 
● Plagiarized or copied projects will be rejected. 
We wish you the very best and look forward to reviewing your submission. 
*** 