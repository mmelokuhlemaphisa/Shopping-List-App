<img src="https://socialify.git.ci/mmelokuhlemaphisa/Shopping-List-App/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="Shopping-List-App" width="640" height="320" />

# 🛒 Shopping List App

A web app that helps users create and manage multiple shopping lists with categorized items.
Each list can contain products, notes, and images — all stored locally using **JSON Server** as a mock API.

**💻 Live Demo:** [Open Shopping List App](https://shopping-list-app-f3p5.onrender.com)

---

## 🧾 Features

### Shopping Lists

* Create, edit, and delete shopping lists
* Add categories and custom images
* Sort lists by **name**, **category**, or **date added**
* Search through all lists instantly
* Automatically counts how many items each list has

### Shopping Items

* Add items to specific shopping lists
* Update item details (quantity, notes, or status)
* Delete items easily
* Categorized and filterable by status:

  * ✅ Purchased
  * 🕒 Pending
  * ❌ Out of Stock

### Data Persistence

* All data stored and fetched from **JSON Server**
* Fully supports CRUD operations

### State Management

* Built with **Redux Toolkit** for predictable state handling
* Slices included:

  * `RegisterSlice.ts` → manages user registration
  * `LoginSlice.ts` → manages login
  * `shoppingListSlice.ts` → manages lists
  * `shoppingItemsSlice.ts` → manages items

### UI / UX

* Simple, responsive interface with modal forms
* Consistent modern look using `App.css`
* User-friendly empty states and progress feedback

---

## 🧩 Tech Stack

| Category           | Technologies      |
| ------------------ | ----------------- |
| Frontend           | React, TypeScript |
| State Management   | Redux Toolkit     |
| Routing            | React Router      |
| Backend (Mock API) | JSON Server       |
| Styling            | App.css           |
| Utilities          | Axios, UUID       |

---

## 📦 How to Clone and Run

1. Copy the repository link:

   ```
   https://github.com/mmelokuhlemaphisa/Shopping-List-App.git
   ```
2. Clone the repository using any Git tool.
3. Open the project folder.
4. Install dependencies:

   ```bash
   npm install
   ```
5. Start the development server:

   ```bash
   npm run dev
   ```
6. Open the app in your browser at the local address shown (usually `http://localhost:5173`).

---

## ⚙️ Setting Up Redux Toolkit

1. Install Redux:

   ```bash
   npm install @reduxjs/toolkit react-redux
   ```
2. Create the Redux store.
3. Wrap `<App />` with the Redux **Provider** in `main.tsx` (or `main.jsx`).
4. Create slices in `src/features/`.
5. Use Redux state and actions in your components.

---

## 🔧 JSON Server Setup

1. Install JSON Server globally:

   ```bash
   npm install -g json-server
   ```
2. Navigate to the data folder:

   ```bash
   cd src/data
   ```
3. Start JSON Server:

   ```bash
   npx json-server --watch db.json --port 3000
   ```

---

## 🧩 API Endpoints

| Endpoint             | Method | Description                 |
| -------------------- | ------ | --------------------------- |
| `/user`              | GET    | Fetch all registered users  |
| `/user`              | POST   | Register a new user         |
| `/user/:id`          | GET    | Fetch a specific user by ID |
| `/user/:id`          | PUT    | Update user details         |
| `/user/:id`          | DELETE | Delete a user account       |
| `/shoppingLists`     | GET    | Fetch all shopping lists    |
| `/shoppingLists`     | POST   | Add a new shopping list     |
| `/shoppingLists/:id` | PUT    | Update an existing list     |
| `/shoppingLists/:id` | DELETE | Delete a shopping list      |
| `/shoppingItems`     | GET    | Fetch all shopping items    |
| `/shoppingItems`     | POST   | Add new item                |
| `/shoppingItems/:id` | PUT    | Update item                 |
| `/shoppingItems/:id` | DELETE | Delete item                 |

---

✅ **Live App:** [Shopping List App](https://shopping-list-app-f3p5.onrender.com)

---


















