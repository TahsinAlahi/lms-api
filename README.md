# 📚 Boba Library Management API

A RESTful Library Management System built using **Express.js**, **TypeScript**, and **MongoDB (Mongoose)**. This API allows for managing a collection of books and handling borrowing operations with business logic, validation, filtering, and aggregation.

---

## 🚀 Features

- 📘 Book Management (CRUD)
- 🔄 Borrowing System with availability checks
- ✅ Schema validation with Mongoose
- 🔍 Filter & sort books by genre or created date
- 📊 Aggregated summary of borrowed books
- ⚙️ Mongoose Middleware (`pre`)
- 🧠 Custom Instance Method for availability control

---

## 🧪 Tech Stack

- **Backend**: Express.js + TypeScript
- **Database**: MongoDB + Mongoose
- **Validation**: Mongoose built-in
- **Deployment**: (Add your link here)
- **Version Control**: Git + GitHub

---

## 🧱 Models

### 📘 Book

| Field       | Type    | Required | Notes                                 |
| ----------- | ------- | -------- | ------------------------------------- |
| title       | string  | ✅       | Book title                            |
| author      | string  | ✅       | Book author                           |
| genre       | enum    | ✅       | One of `FICTION`, `NON_FICTION`, etc. |
| isbn        | string  | ✅       | Unique identifier                     |
| description | string  | ❌       | Optional                              |
| copies      | number  | ✅       | Must be ≥ 0                           |
| available   | boolean | ❌       | Defaults to `true`                    |

### 🔄 Borrow

| Field    | Type     | Required | Notes             |
| -------- | -------- | -------- | ----------------- |
| book     | ObjectId | ✅       | References `Book` |
| quantity | number   | ✅       | Must be > 0       |
| dueDate  | date     | ✅       | Return deadline   |

---

## 📦 API Endpoints

### 📘 Book Routes

#### ➕ Create Book

`POST /api/books`

#### 📚 Get All Books

`GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

#### 🔍 Get Single Book

`GET /api/books/:bookId`

#### ✏️ Update Book

`PUT /api/books/:bookId`

#### ❌ Delete Book

`DELETE /api/books/:bookId`

---

### 🔄 Borrow Routes

#### 📥 Borrow Book

`POST /api/borrow`  
Business Logic:

- Check available copies
- Deduct quantity
- Set `available: false` if copies reach 0

#### 📊 Borrowed Summary

`GET /api/borrow`  
Returns total quantity per book (using aggregation)

---

## ❗ Error Response Format

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number"
      }
    }
  }
}
```

---

## 🛠️ Local Setup

### 1. Clone the Repo

```bash
git clone https://github.com/TahsinAlahi/lms-api.git
cd lms-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/library-db
```

### 4. Start Dev Server

```bash
npm run dev
```
