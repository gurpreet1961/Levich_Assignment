# Authentication and Comment Permission Service

This is a Node.js backend service that provides:

- User authentication (signup, login, password reset)
- Session management with JWT access/refresh tokens
- Role-based permissions (read, write, delete)
- Comment module with permission-based access
- SQLite database for persistence

---

## 🚀 Deployed API

**Base URL:**

```
https://levich-assignment-a93p.onrender.com
```

---

## 🖥️ Running Locally

1. **Clone the repository:**
   ```sh
   git clone https://github.com/gurpreet1961/Levich_Assignment.git
   cd Levich_Assignment
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set environment variables:**
   - Copy `.env.example` to `.env` (or create `.env`):
     ```env
     ACCESS_TOKEN_SECRET=your_access_secret_key
     REFRESH_TOKEN_SECRET=your_refresh_secret_key
     PORT=3000
     ```
   - Use strong random values for the secrets.
4. **Start the server:**
   ```sh
   node index.js
   ```
   The server will run at `http://localhost:3000` by default.

---

## 🧑‍💻 API Endpoints

### 1. **Signup**

- **POST** `/signup`
- **Body:**
  ```json
  {
  	"name": "Test User",
  	"email": "testuser@example.com",
  	"password": "test123"
  }
  ```
- **Curl:**
  ```sh
  curl -X POST https://levich-assignment-a93p.onrender.com/signup \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"testuser@example.com","password":"test123"}'
  ```
- **Response:**
  ```json
  { "message": "User registered" }
  ```

### 2. **Login**

- **POST** `/login`
- **Body:**
  ```json
  {
  	"email": "testuser@example.com",
  	"password": "test123"
  }
  ```
- **Curl:**
  ```sh
  curl -X POST https://levich-assignment-a93p.onrender.com/login \
    -H "Content-Type: application/json" \
    -d '{"email":"testuser@example.com","password":"test123"}'
  ```
- **Response:**
  ```json
  {
  	"accessToken": "...",
  	"refreshToken": "..."
  }
  ```

### 3. **Forgot Password (Mocked)**

- **POST** `/forgot-password`
- **Body:**
  ```json
  { "email": "testuser@example.com" }
  ```
- **Curl:**
  ```sh
  curl -X POST https://levich-assignment-a93p.onrender.com/forgot-password \
    -H "Content-Type: application/json" \
    -d '{"email":"testuser@example.com"}'
  ```
- **Response:**
  ```json
  { "message": "Password reset token (mocked)", "resetToken": "..." }
  ```

### 4. **Reset Password (Mocked)**

- **POST** `/reset-password`
- **Body:**
  ```json
  {
  	"resetToken": "...",
  	"newPassword": "newpassword12"
  }
  ```
- **Curl:**
  ```sh
  curl -X POST https://levich-assignment-a93p.onrender.com/reset-password \
    -H "Content-Type: application/json" \
    -d '{"resetToken":"...","newPassword":"newpassword12"}'
  ```
- **Response:**
  ```json
  { "message": "Password reset successful" }
  ```

### 5. **Refresh Token**

- **POST** `/refresh-token`
- **Body:**
  ```json
  { "refreshToken": "..." }
  ```
- **Curl:**
  ```sh
  curl -X POST https://levich-assignment-a93p.onrender.com/refresh-token \
    -H "Content-Type: application/json" \
    -d '{"refreshToken":"..."}'
  ```
- **Response:**
  ```json
  {
  	"accessToken": "...",
  	"refreshToken": "..."
  }
  ```

### 6. **Logout**

- **POST** `/logout`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
- **Curl:**
  ```sh
  curl -X POST https://levich-assignment-a93p.onrender.com/logout \
    -H "Authorization: Bearer <accessToken>"
  ```
- **Response:**
  ```json
  { "message": "Logged out" }
  ```

### 7. **Get Permissions**

- **GET** `/permissions/:userId`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
- **Curl:**
  ```sh
  curl -X GET https://levich-assignment-a93p.onrender.com/permissions/<userId> \
    -H "Authorization: Bearer <accessToken>"
  ```
- **Response:**
  ```json
  {
  	"can_read": 1,
  	"can_write": 1,
  	"can_delete": 0
  }
  ```

### 8. **Update Permissions**

- **POST** `/permissions/:userId`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
- **Body:**
  ```json
  {
  	"can_read": 1,
  	"can_write": 1,
  	"can_delete": 1
  }
  ```
- **Curl:**
  ```sh
  curl -X POST https://levich-assignment-a93p.onrender.com/permissions/<userId> \
    -H "Authorization: Bearer <accessToken>" \
    -H "Content-Type: application/json" \
    -d '{"can_read":1,"can_write":1,"can_delete":1}'
  ```
- **Response:**
  ```json
  { "message": "Permissions updated" }
  ```

### 9. **Get Comments**

- **GET** `/comments`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
- **Curl:**
  ```sh
  curl -X GET https://levich-assignment-a93p.onrender.com/comments \
    -H "Authorization: Bearer <accessToken>"
  ```
- **Response:**
  ```json
  [
  	{
  		"id": 1,
  		"content": "This is a test comment.",
  		"created_at": "2024-05-28T09:00:00.000Z",
  		"name": "Test User"
  	}
  ]
  ```

### 10. **Add Comment**

- **POST** `/comments`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
- **Body:**
  ```json
  { "content": "This is a test comment." }
  ```
- **Curl:**
  ```sh
  curl -X POST https://levich-assignment-a93p.onrender.com/comments \
    -H "Authorization: Bearer <accessToken>" \
    -H "Content-Type: application/json" \
    -d '{"content":"This is a test comment."}'
  ```
- **Response:**
  ```json
  { "id": 1, "content": "This is a test comment." }
  ```

### 11. **Delete Comment**

- **DELETE** `/comments/:id`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
- **Curl:**
  ```sh
  curl -X DELETE https://levich-assignment-a93p.onrender.com/comments/<id> \
    -H "Authorization: Bearer <accessToken>"
  ```
- **Response:**
  ```json
  { "message": "Comment deleted" }
  ```

---

## 🧪 Postman Collection

A ready-to-use Postman collection is included:

- **File:** `Levich API Collection.json`

**How to use:**

1. Open Postman.
2. Click `Import` and select `Levich API Collection.json` from this repo.
3. Use the pre-configured requests for all endpoints. Edit variables (like tokens) as needed.

---

## 🔑 Notes

- Passwords are securely hashed.
- All endpoints (except signup, login, forgot/reset password, refresh-token) require a valid JWT access token in the `Authorization` header.
- Permissions must be set for users to access comments or update permissions.
- The deployed API is available at: https://levich-assignment-a93p.onrender.com

---

## 📋 Example Usage

### Signup

Request:

```json
{
	"name": "Test User",
	"email": "testuser@example.com",
	"password": "test123"
}
```

Response:

```json
{ "message": "User registered" }
```

### Login

Request:

```json
{
	"email": "testuser@example.com",
	"password": "test123"
}
```

Response:

```json
{
	"accessToken": "...",
	"refreshToken": "..."
}
```

---

For more details, see the code or the Postman collection.
