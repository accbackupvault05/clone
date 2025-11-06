# Snapchat Clone

A full-stack Snapchat clone built with modern web technologies including React 18, Node.js, TypeScript, MongoDB, and Socket.IO.

## 🚀 Features

- **Real-time Messaging**: Instant messaging with Socket.IO
- **Snap & Stories**: Send disappearing photos/videos with custom timers
- **User Authentication**: Secure JWT-based authentication
- **Friend System**: Add friends, manage friend requests
- **Media Upload**: Photo/video capture and upload with AWS S3
- **Responsive Design**: Mobile-first responsive UI
- **Real-time Notifications**: Push notifications for messages and snaps

## 🛠️ Tech Stack

### Frontend
- **React 18+** with TypeScript
- **Vite** for build tooling
- **Styled Components** for styling
- **React Router v6** for navigation
- **Socket.IO Client** for real-time communication
- **React Hook Form** with Yup validation
- **Axios** for HTTP requests

### Backend
- **Node.js 18+** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time features
- **JWT** for authentication
- **Redis** for caching and sessions
- **AWS S3** for media storage
- **Multer** for file uploads

### DevOps
- **Docker** & Docker Compose
- **GitHub Actions** for CI/CD
- **ESLint** & Prettier for code quality

## 📦 Installation

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MongoDB (or use Docker)
- Redis (or use Docker)

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/blackout069/snap-clone.git
cd snap-clone
```

2. Start all services with Docker Compose:
```bash
docker-compose up -d
```

3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Installation

1. Install root dependencies:
```bash
npm install
```

2. Install all project dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Start MongoDB and Redis (if not using Docker)

5. Run the development servers:
```bash
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snapchat_clone
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=snapchat-clone-media
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 📱 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Add Friends**: Search for users and send friend requests
3. **Send Messages**: Chat with friends in real-time
4. **Send Snaps**: Capture and send disappearing photos/videos
5. **View Stories**: Watch friends' stories that disappear after 24 hours
6. **Manage Profile**: Update profile information and settings

## 🧪 Testing

Run tests for both frontend and backend:
```bash
npm test
```

Or run tests individually:
```bash
npm run test:frontend
npm run test:backend
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 API Documentation

API documentation is available at `http://localhost:5000/api-docs` when running the backend server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Snapchat's user experience
- Built with modern web development best practices
- Thanks to the open-source community for the amazing tools
