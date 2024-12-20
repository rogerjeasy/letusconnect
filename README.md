# 🚀 Master's Program Networking & Collaboration Platform - Frontend

This repository contains the frontend implementation for the **Master's Program Networking & Collaboration Platform (letusconnect.com)**. It is a dynamic web application built with **Next.js**, **TypeScript**, and various libraries to facilitate networking, collaboration, and mentorship among students, alumni, and external partners.

---

## 📋 Table of Contents

1. [Project Setup](#project-setup)
2. [Technologies Used](#technologies-used)
3. [Folder Structure](#folder-structure)
4. [Key Features](#key-features)
5. [Environment Variables](#environment-variables)
6. [Running the Project](#running-the-project)
7. [State Management](#state-management)
8. [Form Validation](#form-validation)
9. [Real-Time Communication](#real-time-communication)
10. [Image Uploads](#image-uploads)
11. [Pagination & Filtering](#pagination--filtering)
12. [Contributing](#contributing)
13. [License](#license)

---

## 🛠️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rogerjeasy/letusconnect.git
cd letusconnect
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a `.env.local` File

Create a `.env` file in the root directory of the project and add the following environment variables:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_url

```

### 4. Start the Development Server

Make sure the backend server is running. You can find the backend repository [here](https://github.com/rogerjeasy/go-letusconnect). After setting up the backend server, make sure to update the `NEXT_PUBLIC_API_URL` environment variable in the `.env` file.
Then, start the development server:

```bash
go run main.go
```

---

## 5. 🛠️ Technologies Used

- **Next.js** - A React framework for building server-rendered applications.
- **TypeScript** - A statically typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS** - A utility-first CSS framework for rapidly building custom designs.
- **Zod React Hook Form** - A performant form validation library.
- **Tailwind CSS** - A utility-first CSS framework for rapidly building custom designs.
- **Zustand** - A small, fast, and scalable state management library.
- **Pusher** - Real-time communication.
- **Cloudinary** - A cloud-based image and video management service.
- **Icons** - React icons library.
- **NextUI** - A collection of accessible, reusable, and composable React components.

---

## 6. 📁 Folder Structure

The project is structured as follows:

```
letusconnect/
│   README.md
│   package.json        # NPM dependencies
│   tsconfig.json
│   .env          # Environment variables
│   .gitignore
│   public/             # Static assets
│   src/
│   └── components/     # Reusable components
│   └── app/
│       └── pages/      # Application (Next.js) pages
│   └── helpers/        # Utility functions (API calls, error handling, etc.)
│   └── store/          # Zustand store
│   └── schemas/        # Zod schemas for form validation

```

---

## 7. 🌟 Key Features

- **Mentoring & Coolaboration Tools** - Users can connect with mentors and collaborate with other students.
- **Networking Directory** - Users can browse through a directory of students, alumni, and external partners.
- **Real-Time Chat** - Users can chat with each other in real-time.
- **Event Management & RSVP** - Users can create and RSVP to events.
- **Job Board & Career Resources** - Users can post job opportunities and access career resources.
- **Authentication** - Users can sign up, log in, and log out.
- **Profile Creation** - Users can create and update their profiles.
- **Image Uploads** - Users can upload images to their profiles.
- **Pagination & Filtering** - Users can paginate and filter through profiles.
- **Responsive Design** - The application is fully responsive and works on all devices.

---

## 🌐 Running the Project

To run the project, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 🧩 State Management

The project uses **Zustand** for state management. Zustand is a small, fast, and scalable state management library that allows you to create global state stores that can be used across your application.

---

## 📝 Form Validation

The project uses **Zod React Hook Form** for form validation. Zod React Hook Form is a performant form validation library that integrates seamlessly with React Hook Form.

---

## 📡 Real-Time Communication

The project uses **Pusher** for real-time communication. Pusher is a hosted service that allows you to add real-time features to your applications.

---

## 🖼️ Image Uploads

The project uses **Cloudinary** for image uploads. Cloudinary is a cloud-based image and video management service that allows you to upload, store, and manipulate images

---

## 📑 Pagination & Filtering

The project uses **React Query** for pagination and filtering. React Query is a library that provides tools for managing, caching, and syncing server state in your React applications.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/rogerjeasy/letusconnect/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---



