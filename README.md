Lost & Found Campus System

A full stack campus platform built with React (frontend) and Node.js (backend). The system allows students and staff to report and recover misplaced items.

Features

User authentication (Members and Admins)

Lost and Found reporting system

Image uploads for items

Admin verification and resolve functionality

Secure JWT based authentication

Project Structure

frontend → React code

backend → Node.js code

Prerequisites

Node.js (v14+)

npm or yarn

MongoDB (local or Atlas)

Setup
1. Clone Repository
git clone https://github.com/<your-username>/lostandfound-campus.git

2. Backend Setup
cd backend
npm install


Create a .env file inside backend:

MONGO_URI=<MONGODB_URL>
JWT_SECRET=<TOKEN>
PORT=<PORT>


Run backend:

npm start

3. Frontend Setup
cd frontend


Update the base URL of the backend in src/axiosConfig.jsx:

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '<backend-url>',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;


Install dependencies and run:

npm install
npm start

CI/CD Pipeline Details

Setup GitHub runner and environment variables.

Install nginx nvm node pm2:

sudo apt install nginx nvm
nvm install 22
npm install -g pm2


Build the frontend:

yarn run build


Configure nginx server → edit /etc/nginx/sites-available/default:

server {
    server_name _;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real_IP $remote_addr;
        proxy_set_header X-Forwarded-for $proxy_add_x_forwarded_for;
    }
}


Restart nginx:

sudo service nginx restart


Start pm2 instances:

cd backend
pm2 start 'npm start' --name 'backend'
cd ..
pm2 serve build/ 3000 --name "frontend" --spa
