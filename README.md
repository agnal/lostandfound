# Lost & Found Campus System  

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A full stack campus platform built with React (frontend) and Node.js (backend). The system allows students and staff to report and recover misplaced items.  

---

## Features  
- User authentication (Members and Admins)  
- Lost and Found reporting system  
- Image uploads for items  
- Admin verification and resolve functionality  
- Secure JWT based authentication  

---

## Project Structure  
- **frontend** → React code  
- **backend** → Node.js code  

---

## Prerequisites  
- Node.js (v14+)  
- npm or yarn  
- MongoDB (local or Atlas)  

---

## Setup  

### 1. Clone Repository  
```bash
git clone https://github.com/<your-username>/lostandfound-campus.git
```

### 2. Backend Setup  
```bash
cd backend
npm install
```

Create a `.env` file inside **backend**:  
```env
MONGO_URI=<MONGODB_URL>
JWT_SECRET=<TOKEN>
PORT=<PORT>
```

Run backend:  
```bash
npm start
```

### 3. Frontend Setup  
```bash
cd frontend
```

Update the base URL of the backend in **src/axiosConfig.jsx**:  
```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '<backend-url>',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
```

Install dependencies and run:  
```bash
npm install
npm start
```

---

## CI/CD Pipeline Details  
1. Setup GitHub runner and environment variables.  
2. Install **nginx nvm node pm2**:  
```bash
sudo apt install nginx nvm
nvm install 22
npm install -g pm2
```
3. Build the frontend:  
```bash
yarn run build
```
4. Configure nginx server → edit `/etc/nginx/sites-available/default`:  
```nginx
server {
    server_name _;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real_IP $remote_addr;
        proxy_set_header X-Forwarded-for $proxy_add_x_forwarded_for;
    }
}
```
Restart nginx:  
```bash
sudo service nginx restart
```
5. Start pm2 instances:  
```bash
cd backend
pm2 start 'npm start' --name 'backend'
cd ..
pm2 serve build/ 3000 --name "frontend" --spa
```

---

## Future Improvements  
- Push or email notifications  
- AI powered image recognition for match suggestions  
- Mobile app version for easier access  
