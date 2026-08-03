# 🚀 Portfolio Database Setup Guide

## **Step 1: MySQL Database Setup**

### Windows par MySQL install karo:
1. Download: https://dev.mysql.com/downloads/mysql/
2. Install karo (default settings theek hai)
3. MySQL Command Line Client kholo

### Database aur Table create karo:
```sql
CREATE DATABASE portfolio_db;
USE portfolio_db;

CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## **Step 2: Node.js Backend Setup**

### 1. `backend` folder mein jao:
```bash
cd d:\vikki-portfolio\backend
```

### 2. `.env` file update karo:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db
DB_PORT=3306
PORT=5000
```

### 3. Dependencies install karo:
```bash
npm install
```

### 4. Server start karo:
```bash
npm start
```

Expected output:
```
✓ Table "contacts" created or already exists
✓ Server running on http://localhost:5000
```

---

## **Step 3: Test API**

Browser mein jaao:
- `http://localhost:5000/api/test` - Server check karo
- `http://localhost:5000/api/contacts` - Sabhi contacts dekho

---

## **Step 4: Portfolio Frontend Test**

1. `d:\vikki-portfolio\myportfolio\index.html` kholo
2. Contact form fill karo
3. Submit button click karo
4. Green message ✓ dekhna chahiye

---

## **API Endpoints**

### GET `/api/contacts`
Sabhi submitted contacts ko get karo

**Response:**
```json
[
  {
    "id": 1,
    "name": "Raj",
    "email": "raj@email.com",
    "phone": "9876543210",
    "subject": "Test",
    "message": "Hello!",
    "created_at": "2025-01-15T10:30:00.000Z"
  }
]
```

### POST `/api/contacts`
Naya contact save karo

**Request Body:**
```json
{
  "name": "Raj Kumar",
  "email": "raj@email.com",
  "phone": "9876543210",
  "subject": "Job Inquiry",
  "message": "Great portfolio!"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Contact saved successfully!"
}
```

---

## **Troubleshooting**

### ❌ "Connection refused" error
- MySQL running hai? Check karo: `mysql -u root -p`
- Server running hai? Terminal mein `npm start` run karo

### ❌ "Cannot find module" error
```bash
npm install
```

### ❌ Database connection error
- `.env` file check karo
- MySQL username/password sahi hai?
- Database `portfolio_db` create hua hai?

---

## **Production Deploy Karne Ke Liye**

- Backend: Heroku, Railway, Render pe deploy karo
- Frontend: Netlify, Vercel pe deploy karo
- Database: MongoDB Atlas ya AWS RDS use karo

---

**Questions? Pooch lena!** 😊
