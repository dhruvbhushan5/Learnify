# Learnify Backend Project

## Prerequisites
- Node.js installed
- MongoDB installed locally, or a MongoDB Atlas connection string

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Configure Environment**
    Copy `.env.example` to `.env` and update the values if needed:
    ```bash
    PORT=8080
    MONGODB_URI=mongodb://127.0.0.1:27017/learnifyDB
    ```

3.  **Seed Database (Optional)**
    Populate the database with initial video data:
    ```bash
    npm run seed
    ```

4.  **Start the Server**
    ```bash
    npm start
    ```

5.  **Access the Application**
    Open your browser and navigate to:
    [http://localhost:8080](http://localhost:8080)

## Deploying to Render

1. Push this repository to GitHub.
2. Create a free MongoDB Atlas cluster and copy your database connection string.
3. In Render, create a new **Web Service** from the GitHub repository.
4. Use these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`
5. Add this Render environment variable:
   - `MONGODB_URI`: your MongoDB Atlas connection string
6. Deploy the service.

Render will provide the `PORT` variable automatically, so you do not need to set it there.

## Project Structure
- `server.js`: Main entry point.
- `db.js`: Database connection setup.
- `routes/`: API and page routes.
- `views/`: EJS templates for the frontend.
- `public/`: Static assets (CSS, images).
