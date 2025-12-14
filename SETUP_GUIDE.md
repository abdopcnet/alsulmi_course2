# Edumate Authentication Setup Guide

## 🎉 Setup Complete!

Your authentication system is now fully configured. Follow these steps to get started:

---

## 📋 Step 1: Database Setup

### Option A: Using MySQL Command Line
```bash
# Login to MySQL as root
sudo mysql -u root -p

# Run the setup script
source /var/www/backend/setup-database.sql
```

### Option B: Quick Command
```bash
sudo mysql -u root -p < /var/www/backend/setup-database.sql
```

### Default Credentials Created:
- **Database:** `edumate_db`
- **User:** `edumate_user`
- **Password:** `edumate123`
- **Host:** `localhost`

⚠️ **Important:** Change the password in production!

---

## 📦 Step 2: Install Backend Dependencies

```bash
cd /var/www/backend
npm install
```

### Required packages:
- express
- cors
- helmet
- express-rate-limit
- dotenv
- sequelize
- mysql2
- bcryptjs
- jsonwebtoken

---

## 🚀 Step 3: Start the Backend Server

```bash
cd /var/www/backend
npm start
# or for development with auto-reload:
npm run dev
```

The API will be available at: **http://localhost:3000**

---

## 🌐 Step 4: Frontend URLs

### Login Page:
```
http://localhost:8000/login.html
```

### Register Page:
```
http://localhost:8000/register.html
```

---

## 🔑 API Endpoints

### Authentication Endpoints:

#### Register (Sign Up)
```
POST http://localhost:3000/api/v1/auth/register

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```
POST http://localhost:3000/api/v1/auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile (requires authentication)
```
GET http://localhost:3000/api/v1/auth/profile

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Update Profile (requires authentication)
```
PUT http://localhost:3000/api/v1/auth/profile

Headers:
Authorization: Bearer YOUR_TOKEN_HERE

Body:
{
  "firstName": "Jane",
  "lastName": "Smith",
  "bio": "Student at..."
}
```

#### Change Password (requires authentication)
```
POST http://localhost:3000/api/v1/auth/change-password

Headers:
Authorization: Bearer YOUR_TOKEN_HERE

Body:
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

## 🔒 Security Features Implemented

✅ Password hashing with bcryptjs
✅ JWT authentication tokens
✅ Protected routes with middleware
✅ Role-based access control (student, teacher, admin)
✅ Rate limiting on API endpoints
✅ CORS protection
✅ Helmet security headers
✅ Input validation

---

## 📝 Environment Variables

The `.env` file has been created with these settings:

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=edumate_db
DB_USER=edumate_user
DB_PASSWORD=edumate123
JWT_SECRET=edumate_secret_key_2025_change_in_production
JWT_EXPIRES_IN=7d
```

⚠️ **Before going to production:**
1. Change `JWT_SECRET` to a strong random string
2. Change `DB_PASSWORD` to a secure password
3. Set `NODE_ENV=production`

---

## 🧪 Testing the Setup

### 1. Test Database Connection:
```bash
cd /var/www/backend
node -e "const {testConnection} = require('./src/config/database'); testConnection();"
```

### 2. Create a Test User:
Use the register page or send a POST request to `/api/v1/auth/register`

### 3. Login:
Use the login page or send a POST request to `/api/v1/auth/login`

---

## 🐛 Troubleshooting

### Database Connection Issues:
- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials in `.env` file
- Ensure database exists: `sudo mysql -e "SHOW DATABASES;"`

### Cannot Start Server:
- Install dependencies: `npm install`
- Check if port 3000 is available: `lsof -i :3000`

### CORS Errors:
- Update `CORS_ORIGIN` in `.env` to match your frontend URL
- Default is `http://localhost:8000`

### Frontend Not Working:
- Ensure backend server is running
- Check browser console for errors
- Verify API_BASE_URL in auth scripts matches your backend

---

## 📚 User Roles

The system supports three roles:
- **student** (default)
- **teacher**
- **admin**

Set role during registration by including `"role": "teacher"` in the request body.

---

## 🎯 Next Steps

1. ✅ Complete the user management features
2. ✅ Implement course CRUD operations
3. ✅ Add subscription management
4. ✅ Integrate payment gateway
5. ✅ Add email verification
6. ✅ Implement password reset

---

## 📞 Support

If you encounter any issues, check the server logs:
```bash
# View real-time logs
cd /var/www/backend
npm start
```

---

**Happy Coding! 🚀**
