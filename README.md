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
### Steps for JSON Server

1. npm install -g json-server

2. cd src

3. cd data

4. npx json-server --watch db.json --port 3000


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

- The mock backend is JSON Server and is intended for local development only. Do not use it as a production backend.
- This project currently encrypts passwords client-side with CryptoJS (VITE_SECRET_KEY). That is for demonstration only and is NOT secure for production. In a real app:
- Hash passwords server-side with a strong algorithm (bcrypt/argon2) and a unique salt.
- Serve the app over HTTPS and use secure, HttpOnly cookies or short-lived JWTs for authentication.
- The `src/data/db.json` file contains example data and some large base64 images. These increase the JSON size and can slow the dev server — consider replacing embedded images with external URLs or smaller thumbnails for faster reloads.













