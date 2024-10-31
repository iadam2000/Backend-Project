## 🌐 Hosted Version

You can access the live version of the API here:  
🔗 **[Backend Project Live API](https://backend-project-u7dc.onrender.com/api)**

# 🛠️ Backend Project

Welcome to my **Backend Project** repository! I'll be creating a forum database similar to Reddit.

This project is a RESTful API built with Node.js, Express, and PostgreSQL. 

It provides core functionalities such as CRUD operations, user authentication, and more. 

Explore the hosted version and feel free to contribute, clone, or improve it!

---

## 📄 Project Overview

This project aims to demonstrate my backend development skills by building a scalable and efficient API. The main features include:

- User authentication with JWT
- CRUD operations for resources
- PostgreSQL database integration
- RESTful API architecture with Express
- Comprehensive error handling and logging

This project is ideal for developers looking to explore API design patterns, authentication strategies, and integration with PostgreSQL.

---

## ⚙️ Getting Started

To set up this project locally, follow the instructions below.

### 1. Clone the Repository

```bash
git clone https://github.com/iadam2000/Backend-Project.git
cd backend-project
```
### 2. Install Dependencies

Make sure you have **Node.js** and **PostgreSQL** installed on your machine. Then, install the necessary dependencies by running:

```bash
npm install
```

### 3. Create the Following Environment Files in the Root Folder

.env.development 

.env.production

.env.test

### In each file, paste the following code:

For development: 
```bash
PGDATABASE=nc_news
```

For testing: 
```bash
PGDATABASE=nc_news_test
```

For development: 
```bash
DATABASE_URL=postgresql://postgres.inkpgijddvxdrvqfasjc:northcoders123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### At this point, you're ready to run unit tests if you wish. From the root folder, run:
```bash
npm test __tests__/endpoints.test.js
```
Thanks!

