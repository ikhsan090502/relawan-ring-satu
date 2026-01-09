# Backend API for Relawan Ring Satu

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
Copy `.env` file and configure database credentials:
```bash
cp .env .env.local
```

3. Setup MySQL database:
```bash
mysql -u root < ../setup-mysql.sql
```

4. Start the server:
```bash
npm run dev  # Development with nodemon
npm start    # Production
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Reports
- `GET /api/reports` - Get reports (filtered by role)
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report (Admin only)

### Health Check
- `GET /api/health` - Server health status

## Environment Variables

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=relawan_ring_satu
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=24h

PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3002
```

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation