# JCODER Blog API

This is the API for the **JCODER** blog, created using Node.js, Express, and MongoDB. The API supports the content management system (CMS) of the blog, the [admins website](https://blog-api-admin-page.vercel.app/) and the [users website](https://blog-api-users-page.vercel.app/). It also includes image upload functionality using the Multer library, user authentication with JSON Web Tokens (jsonwebtoken), and password encryption with bcryptjs.

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [API Endpoints](#api-endpoints)
-   [Image Upload](#image-upload)
-   [Authentication](#authentication)
-   [Deployment](#deployment)
-   [Learnings](#learnings)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/JosueDeLosSantos/Blog-API.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Blog-API
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

## Create .env file and add the following variables:

1. Mongodb connection string:
    ```bash
    DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.clyk6yk.mongodb.net/<databasename>?retryWrites=true&w=majority&appName=Cluster0"
    ```
2. Access token:
    ```bash
    ACCESS_TOKEN_SECRET="<access_token_secret>"
    ```

## Usage

1. Start the server:
    ```bash
    npm start
    ```
2. The API will be available at `http://localhost:3000`.

## API Endpoints

### Admin Routes

-   **Get Admin Profile**
    ```http
    GET /admin/profile
    ```
-   **Admin Sign-Up**
    ```http
    POST /admin/sign-up
    ```
-   **Admin Log-In**
    ```http
    POST /admin/log-in
    ```
-   **Create Post**
    ```http
    POST /create-post
    ```
-   **Update Admin Profile**
    ```http
    PUT /admin/profile
    ```
-   **Update Admin Profile Photo**
    ```http
    PUT /admin/profile/photo
    ```
-   **Update Post**
    ```http
    PUT /posts/:id
    ```
-   **Delete Post**
    ```http
    DELETE /posts/:id
    ```

### User Routes

-   **Get User Profile**
    ```http
    GET /profile
    ```
-   **User Sign-Up**
    ```http
    POST /sign-up
    ```
-   **User Log-In**
    ```http
    POST /log-in
    ```
-   **Update User Profile**
    ```http
    PUT /profile
    ```
-   **Update User Profile Photo**
    ```http
    PUT /profile/photo
    ```

### Shared Routes (Admins and Users)

-   **Get Post**
    ```http
    GET /posts/:id
    ```
-   **Add Comment**
    ```http
    POST /comments
    ```
-   **Update Comment**
    ```http
    PUT /comments
    ```
-   **Delete Comment**
    ```http
    DELETE /comments/:id
    ```
-   **Get All Posts**
    ```http
    GET /
    ```

## Image Upload

The API uses the Multer library for handling image uploads. Images can be uploaded as part of the post creation and update processes.

## Authentication

The API uses JSON Web Tokens (jsonwebtoken) for user authentication and bcryptjs for password encryption to ensure secure access and data protection.

## Learnings

Building this fullstack project has been a significant learning experience. Some of the key aspects I learned include:

-   Setting up and configuring a Node.js and Express server.
-   Integrating MongoDB for data storage.
-   Implementing image upload functionality using Multer.
-   Using JSON Web Tokens for authentication.
-   Encrypting passwords with bcryptjs.
-   Deploying applications on PaaS platforms.
