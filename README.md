# Skill Learning Hub

This repository contains the full-stack implementation of the **Skill Learning Hub Project**, an online platform for learning various skills. The project includes both a **Spring Boot** backend providing RESTful APIs and a **React.js with Ant Design** frontend for an intuitive user interface.

---

## 📦 Technologies Used

### Backend
- Java 17
- Spring Boot 3.x
- Spring Data MongoDB
- Maven
- MongoDB Database

### Frontend
- React.js
- Ant Design UI Library
- Axios for API requests
- React Router
- Context API for state management

---

## 📂 Project Structure

```
skill-learning-hub/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/skilllearninghub/
│   │   │   │   ├── config/
│   │   │   │   ├── controllers/
│   │   │   │   ├── dtos/
│   │   │   │   ├── models/
│   │   │   │   ├── repositories/
│   │   │   │   ├── security/
│   │   │   │   ├── services/
│   │   │   │   └── SkillLearningHubApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── static/
│   │   │       └── templates/
│   │   └── test/
│   ├── target/
│   ├── pom.xml
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── routes.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
└── README.md
```

---

## ✨ Features

### User Management
- CRUD operations (Create, Read, Update, Delete)
- Google OAuth integration for login
- User profile with basic information
- Session management and authentication

### Post Management
- Create, read, update, and delete posts
- Social media-style display with user names and profile pictures
- Timeline feed similar to Facebook
- Rich text and media content in posts

### Learning Progress Management
- Create learning plans
- Edit learning plans
- Delete learning plans
- Track completion status

### Social Interaction
- Like posts
- Comment on posts
- Update comments
- Delete comments

### Notification Management
- Create notifications
- Display notifications on user pages
- Delete notifications
- Notification preferences

---

## 🚀 How to Run the Project

### Backend Setup

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/skill-learning-hub.git
cd skill-learning-hub/backend
```

2. **Configure the Database**
Edit the `src/main/resources/application.properties` file:

```properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=skill_learning_hub
server.port=8081

# Google OAuth2 Configuration
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=email,profile
```

3. **Build & Run the Backend**
```bash
mvn clean install
mvn spring-boot:run
```
The backend will start at `http://localhost:8081`

### Frontend Setup

1. **Navigate to Frontend Directory**
```bash
cd ../frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run the Frontend**
```bash
npm start
```
The application will open in your browser at `http://localhost:3000`

---

## 📚 API Endpoints

### User Management
| HTTP Method | Endpoint | Description |
|-------------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/{id}` | Update user profile |
| DELETE | `/api/users/{id}` | Delete user |
| GET | `/api/auth/google` | Initiate Google login |
| GET | `/api/auth/google/callback` | Google OAuth2 callback |

### Post Management
| HTTP Method | Endpoint | Description |
|-------------|----------|-------------|
| GET | `/api/posts` | Get all posts with user info |
| GET | `/api/posts/{id}` | Get post by ID with user details |
| POST | `/api/posts` | Create new post |
| PUT | `/api/posts/{id}` | Update post |
| DELETE | `/api/posts/{id}` | Delete post |
| GET | `/api/posts/user/{userId}` | Get posts by user |

### Learning Progress Management
| HTTP Method | Endpoint | Description |
|-------------|----------|-------------|
| GET | `/api/plans` | Get all learning plans |
| GET | `/api/plans/{id}` | Get learning plan by ID |
| POST | `/api/plans` | Create new learning plan |
| PUT | `/api/plans/{id}` | Update learning plan |
| DELETE | `/api/plans/{id}` | Delete learning plan |

### Like & Comment Management
| HTTP Method | Endpoint | Description |
|-------------|----------|-------------|
| POST | `/api/comments` | Add comment |
| GET | `/api/comments/{postId}` | Get comments for post |
| PUT | `/api/comments/{id}` | Update comment |
| DELETE | `/api/comments/{id}` | Delete comment |
| POST | `/api/likes/{postId}` | Like/unlike post |
| GET | `/api/likes/{postId}` | Get likes for post |

### Notification Management
| HTTP Method | Endpoint | Description |
|-------------|----------|-------------|
| GET | `/api/notifications/{userId}` | Get user notifications |
| POST | `/api/notifications` | Create notification |
| DELETE | `/api/notifications/{id}` | Delete notification |
| PUT | `/api/notifications/preferences` | Update notification preferences |

If you use Swagger for API documentation, you can access it at:
`http://localhost:8081/swagger-ui/`

---

## 🛠️ Prerequisites

* Java 17 or higher
* Maven 3.8+
* MongoDB running on localhost:27017
* Node.js (v16+) and npm
* IDE: IntelliJ IDEA / Eclipse / VS Code
* Google Developer Console project (for OAuth2)

---

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```


## 🌟 Main Pages

- **Login Page**: Google authentication and login
- **Home Feed**: Social media-style post feed with user information
- **Post Details**: View post content, likes, and comments
- **User Profile**: User information and activity
- **Post Creation**: Create and edit posts
- **Learning Plans**: Create and manage learning plans 
- **Notification Center**: View and manage notifications

---

## 📜 License

This project is licensed under the MIT License.

---

## ✨ Author

* **Buddhika Roshan**  
  Undergraduate, Sri Lanka Institute of Information Technology (SLIIT)
* **Sonali Liyanahetti**  
  Undergraduate, Sri Lanka Institute of Information Technology (SLIIT)
* **Heshani Niwanthika**  
  Undergraduate, Sri Lanka Institute of Information Technology (SLIIT)
* **Shamith Udesha**  
  Undergraduate, Sri Lanka Institute of Information Technology (SLIIT)

---

## 📢 Project Status

* ✅ Backend Development Completed
* ✅ Frontend UI Implementation Completed
* ✅ User Management with Google Login Implemented
* ✅ Post Management with Social Features Complete
* ✅ Comment & Like System Implemented
* 🛠️ Notification System In Progress
* 🛠️ Learning Progress Plans In Progress
* 🚀 Deployment Planned

---

## 📞 Contact

For any questions or support:
* GitHub Issues
* Email: buddhikaroshanofficial@gmail.com

---

# 🔥 Special Tips for Uploading

✅ Create a file named README.md inside your project root.  
✅ Paste the above content.  
✅ Replace:
  - your-username → your GitHub username
  - YOUR_GOOGLE_CLIENT_ID and YOUR_GOOGLE_CLIENT_SECRET → your actual Google OAuth credentials
  - Update MongoDB configuration if needed
  - Add your actual screenshots
  - Update your email address
  - Adjust project status as needed

✅ Then commit and push:
```bash
git add README.md
git commit -m "Add comprehensive project README"
git push
```
