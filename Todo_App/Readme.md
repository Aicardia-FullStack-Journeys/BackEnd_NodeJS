**Todo List API**
=======================

This is a task to create a set of rest API endpoints used for managing a to-do list.

**Features**
=================

  - Create Todos: Create new to-do items.
  - Read Todos: Retrieve a list of all to-do items.
  - Update Todos: Update existing to-do items (e.g., mark as completed, edit task description).
  - Delete Todos: Delete to-do items.


**Getting Started**
======================
These instructions will get you a copy of the project up and running on your local machine.

**Usage**

1. **Clone the Repository:**
   - Create a new directory: `mkdir my-todo-clone`
   - Navigate to the directory: `cd my-todo-clone`
   - Initialize a Git repository: `git init`
   - Add this repository:
     ```bash
     git remote add -f origin https://github.com/Aicardia-FullStack-Journeys/BackEnd_NodeJS.git
     ```
   - Enable sparse checkout to clone only the Todo_App directory:
     ```bash
     git config core.sparseCheckout true
     ```
   - Specify the Todo_App directory path:
     ```bash
     echo "Todo_App" >> .git/info/sparse-checkout
     ```
   - Perform the checkout:
     ```bash
     git checkout
     ```

2. **Install Dependencies:**
   - Install the required packages: `npm install`

3. **Configure Your Database:**
   - Rename the `.env-sample` file to `.env`
   - Enter your MongoDB connection string and other database credentials in the `.env` file.

4. **Start the Server:**
   - Navigate to the Todo_App directory: `cd Todo_App`
   - Run the server: `node server.js`

**Use the Todo**
Enter `http://localhost:3000/` in your browser (you can change the port in `server.js`). Then you can start adding tasks, marking them complete, and deleting completed tasks.

**Technology Stack**
* **Backend:** Node.js + Express.js
* **Database:** MongoDB

