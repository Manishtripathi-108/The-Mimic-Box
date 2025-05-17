# The Mimic Box

## Project Overview

The Mimic Box is a Next.js-based application designed to provide a seamless user experience for managing and interacting with various media services. It integrates with platforms like Spotify, JioSaavn, and Anilist to offer features such as media playback, user authentication, and data synchronization. The project is built with scalability and modern web development practices in mind.

## Features

- **User Authentication**: Secure login and account linking using NextAuth.
- **Media Playback**: Audio player with advanced settings and media session integration.
- **Third-Party Integrations**: Spotify, JioSaavn, and Anilist APIs for fetching and managing media data.
- **File Uploads**: Support for file uploads with progress tracking.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Error Handling**: Centralized error management for a robust user experience.

## Technology Stack

- **Framework**: Next.js 15.2.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **APIs**: Spotify, JioSaavn, Anilist
- **Database**: Prisma ORM with PostgreSQL
- **Utilities**: Axios, Zod, Lodash, Fluent-FFmpeg

## Badges

Below are the icons representing the core technologies used in this project:

- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
- ![Zod](https://img.shields.io/badge/Zod-4A90E2?style=for-the-badge&logo=zod&logoColor=white)
- ![Lodash](https://img.shields.io/badge/Lodash-3498DB?style=for-the-badge&logo=lodash&logoColor=white)
- ![Fluent-FFmpeg](https://img.shields.io/badge/Fluent--FFmpeg-FF0000?style=for-the-badge&logo=ffmpeg&logoColor=white)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Manishtripathi-108/The-Mimic-Box.git
    cd themimicbox
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables:
    - Copy `.env.example` to `.env` and fill in the required values.

## Running the Project Locally

1. Start the development server:
    ```bash
    npm run dev
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## Usage Examples

- **API Endpoints**: The application provides several API routes under `/api/` for authentication, media data, and more.
- **Components**: Reusable UI components like `FileUpload`, `ErrorMessage`, and `ProfileDropdown` are available in the `src/components/` directory.
- **Hooks**: Custom hooks like `useAudioPlayer` and `useSafeApiCall` simplify state management and API interactions.

## Folder Structure

- **`src/`**: Contains the main application code.
    - **`pages/`**: Defines the routes and UI for the application.
    - **`components/`**: Reusable React components.
    - **`hooks/`**: Custom React hooks for state and logic management.
    - **`lib/`**: Utility functions, configurations, and services.
    - **`public/`**: Static assets like images and icons.
    - **`prisma/`**: Database schema and migrations.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint to check for code quality issues.
- `npm run format`: Format the codebase using Prettier.

## Contribution Guidelines

We welcome contributions to The Mimic Box! To get started:

1. **Fork the Repository**: Create a personal fork of the repository on GitHub.
2. **Clone the Repository**: Clone your forked repository to your local machine:
    ```bash
    git clone https://github.com/Manishtripathi-108/The-Mimic-Box.git
    cd themimicbox
    ```
3. **Create a Branch**: Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
4. **Make Changes**: Implement your changes and ensure they follow the project's coding standards.
5. **Test Your Changes**: Run the application locally and verify your changes work as expected.
6. **Commit Your Changes**: Commit your changes with a descriptive commit message:
    ```bash
    git commit -m "Add a brief description of your changes"
    ```
7. **Push Your Changes**: Push your branch to your forked repository:
    ```bash
    git push origin feature/your-feature-name
    ```
8. **Create a Pull Request**: Open a pull request from your branch to the main repository's `main` branch.

## License

This project is licensed under the [MIT License](./LICENSE).
