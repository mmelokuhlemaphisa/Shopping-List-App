<img src="https://socialify.git.ci/mmelokuhlemaphisa/Shopping-List-App/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="Shopping-List-App" width="640" height="320" />

## 🛒 About Shopping List 

A Shopping List is the web app that helps users create and manage multiple shopping lists with categorized items. Each list can contain various products, notes, and images — all stored locally using **JSON Server** as a mock API.

---

### Features

#### 🧾 Shopping Lists

* Create, edit, and delete shopping lists.
* Add categories and custom images.
* Sort lists by **name**, **category**, or **date added**.
* Search through all lists instantly.
* Automatically counts how many items each list has.

#### 🛍️ Shopping Items

* Add items to specific shopping lists.
* Update item details (quantity, notes, or status).
* Delete items easily.
* Categorized and filterable by status:

  * ✅ Purchased
  * 🕒 Pending
  * ❌ Out of Stock

#### 💾 Data Persistence

* All data (lists and items) are stored and fetched from **JSON Server**.
* Fully supports CRUD (Create, Read, Update, Delete) operations.

#### 🧠 State Management

* Built with **Redux Toolkit** for predictable state handling.
* slices created:

  * `RegisterSlice.ts` → manages register
  * `LoginSlice.ts` → manages login
  * `shoppingListSlice.ts` → manages lists
  * `shoppingItemsSlice.ts` → manages items

#### 💅 UI/UX

* Simple, responsive interface with modal forms.
* Consistent modern look (uses `App.css`).
* User-friendly empty states and progress feedback.

---

### 🧩 Tech Stack

| Category           | Technologies                   |
| ------------------ | ------------------------------ |
| Frontend           | React, TypeScript              |
| State Management   | Redux Toolkit                  |
| Routing            | React Router                   |
| Backend (Mock API) | JSON Server                    |
| Styling            | APP.CSS |
| Utilities          | Axios, UUID                    |

---

### How to Clone and Run This Project steps

1. Open vs code.
2. On welcome page click on Clone Git repository.
3. Past the repository URL (https://github.com/mmelokuhlemaphisa/Shopping-List-App.git) then press enter.
4. Choose a local folder where you want to save project.
5. Click Open.
6. Use Terminal to install npm and run dev
7. npm install
8. npm run dev

---

### Steps Taken to Build the React App

** Set up React Project **

* npm create vite@latest
* Project name Shopping-List-App
* cd Shopping-List-App
* npm install
* npm run dev

Then open your browser at:
(http://localhost:5173)

---
### Set Up Redux Toolkit

* Install react redux using this(npm install @reduxjs/toolkit react-redux)
* Create the Redux Store
* Connect Redux to Your App
    * Open your main.tsx file (or main.jsx) and wrap your <App /> component with the Redux Provider:
* Create Your First Slice
    * inside src/features/, create a new file:
* Use Redux in Components

----
### Steps for JSON Server

1. npm install -g json-server

2. cd src

3. cd data

4. npx json-server --watch db.json --port 3000

 ## Example db.json

{
  "User":[
    {
     "id": "28b4",
      "username": "Melo",
      "password": "U2FsdGVkX1+Xd7VstG/r+bAvc2uqBm8Lj6I6B6dCf2I=",
      "email": "melokuhlemaphisa99@gmail.com",
      "name": "Melokuhle",
      "surname": "Maphisa",
      "cellNumber": "0649581777",
      "loading": false,
      "error": null
    }
  ],

  "shoppingLists": [
    {
     "listId": "3f2119dd-56fd-4e5e-ad9c-4bab8e7b8ba9",
      "name": "Weekly Groceries",
      "category": "Foods",
      "userId": "28b4",
      "dateAdded": "2025-10-09T07:57:02.038Z",
      "image": "https://www.shutterstock.com/image-photo/shopping-cart-full-groceries-supermarket-260nw-2379778937.jpg",
      "id": "4a13"
    }
  ],
  "shoppingItems": [
    {
      "id": "262ca87b-fe86-4886-ab20-4ce0f62b5296",
      "name": "Apples",
      "quantity": 6,
      "notes": "Preferably red apples",
      "category": "Fruits",
      "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/jjhbgy
      "status": "Pending",
      "dateAdded": "2025-10-09T07:51:53.680Z",
      "userId": "28b4",
      "listId": "3f2119dd-56fd-4e5e-ad9c-4bab8e7b8ba9"
    }
  ]
}

---

### 💻 API Endpoints (JSON Server)

| Endpoint             | Method | Description                 |
| -------------------- | ------ | --------------------------- |
| `/user`             | GET    | Fetch all registered users  |
| `/user`             | POST   | Register a new user         |
| `/user/:id`         | GET    | Fetch a specific user by ID |
| `/user/:id`         | PUT    | Update user details         |
| `/user/:id`         | DELETE | Delete a user account       |
| `/shoppingLists`     | GET    | Fetch all shopping lists    |
| `/shoppingLists`     | POST   | Add a new shopping list     |
| `/shoppingLists/:id` | PUT    | Update an existing list     |
| `/shoppingLists/:id` | DELETE | Delete a shopping list      |
| `/shoppingItems`     | GET    | Fetch all shopping items    |
| `/shoppingItems`     | POST   | Add new item                |
| `/shoppingItems/:id` | PUT    | Update item                 |
| `/shoppingItems/:id` | DELETE | Delete item                 |


---

### Notes and security

- The backend is JSON Server 
- This project currently encrypts passwords client-side with CryptoJS (VITE_SECRET_KEY). That is for demonstration only and is NOT secure for production. In a real app:
- Hash passwords server-side with a strong algorithm (bcrypt/argon2) and a unique salt.
- Serve the app over HTTPS and use secure, HttpOnly cookies or short-lived JWTs for authentication.
- The `src/data/db.json` file contains example data and some large base64 images. These increase the JSON size and can slow the dev server — consider replacing embedded images with external URLs or smaller thumbnails for faster reloads.













