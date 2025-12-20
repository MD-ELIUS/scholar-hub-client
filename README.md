# ScholarHub  🎓

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![React](https://img.shields.io/badge/React-17.0.2-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-yellow.svg)](https://expressjs.com/)

## 🎯 Project Overview

**ScholarHub** is a full-stack MERN scholarship management platform designed to connect students with scholarship opportunities worldwide. Universities or organizations can post scholarships, while students can search, apply, and review them. The platform simplifies the process of discovering and managing financial aid for higher education.

**Live Demo:** [ScholarHub Live Site](https://scholar-hub-client.web.app)

**Client Repository:** [ScholarHub Client Repo](https://github.com/MD-ELIUS/scholar-hub-client)

**Server Repository:** [ScholarHub Server Repo](https://github.com/MD-ELIUS/scholar-hub-server)


---

## 🛠 Features

### General Features
- Responsive and modern UI using **React**, **TailwindCSS**, and **DaisyUI**
- Full **Authentication System** with email/password and Google social login
- Role-based access: **Student**, **Moderator**, **Admin**
- Secure JWT-based API authentication
- Stripe payment integration for scholarship applications
- Animated components using **Framer Motion**
- Server-side **search, filter, sort, and pagination** for scholarships
- Dashboard layouts for each user role
- Comprehensive error handling and loading states

### Student Dashboard
- View and edit profile
- Track scholarship applications
- Apply for scholarships after payment
- Add, edit, and delete reviews
- Real-time application status updates

### Moderator Dashboard
- Review and manage student applications
- Provide feedback on applications
- Moderate student reviews

### Admin Dashboard
- Manage all users and promote/demote roles
- Add, edit, and delete scholarships
- View platform analytics with charts
- Monitor all applications and reviews

### Scholarship Pages
- **Home Page:** Hero banner, top scholarships, success stories/testimonials
- **All Scholarships:** Grid layout, search, filter, sort, pagination
- **Scholarship Details:** Full scholarship info, reviews, apply button

---

## 💻 Tech Stack

| Layer          | Technology                  |
|----------------|-----------------------------|
| Frontend       | React.js, TailwindCSS, DaisyUI, Framer Motion |
| Backend        | Node.js, Express.js         |
| Database       | MongoDB                     |
| Authentication | Firebase Auth (Email/Google) |
| Payment        | Stripe API                  |
| Deployment     | Vercel (Client) |

---
 
## 🗂 Database Collections

### Users Collection
- `name`, `email`, `photoURL`, `role` (`Student`, `Moderator`, `Admin`)

### Scholarships Collection
- `scholarshipName`, `universityName`, `universityImage`, `country`, `city`, `worldRank`
- `subjectCategory`, `scholarshipCategory`, `degree`, `tuitionFees` (optional)
- `applicationFees`, `serviceCharge`, `applicationDeadline`, `postDate`, `postedUserEmail`

### Applications Collection
- `scholarshipId`, `userId`, `userName`, `userEmail`
- `universityName`, `scholarshipCategory`, `degree`
- `applicationFees`, `serviceCharge`, `applicationStatus` (`pending` by default)
- `paymentStatus` (`unpaid`/`paid`), `applicationDate`, `feedback` (from moderator)

### Reviews Collection
- `scholarshipId`, `universityName`, `userName`, `userEmail`, `userImage`
- `ratingPoint`, `reviewComment`, `reviewDate`

---

### NPM Packages Used

ScholarHub uses several npm packages to enhance functionality, UI, and development workflow:

- **@smastrom/react-rating** – For interactive star rating components.
- **@tailwindcss/vite** & **tailwindcss** – Tailwind CSS integration with Vite for utility-first styling.
- **@tanstack/react-query** – For efficient server-state management and data fetching.
- **axios** – Promise-based HTTP client for API requests.
- **firebase** – Authentication and user management.
- **lottie-react** – Animations for interactive UI elements.
- **lucide-react** & **react-icons** – Icon components for dashboard and UI elements.
- **motion** – Animation library for smooth UI transitions.
- **react-hook-form** – Easy and performant form handling.
- **react-router** – Client-side routing.
- **recharts** – Charts and data visualization for analytics.
- **sweetalert2** – Alert and modal dialogs.
- **swiper** – Carousel/slideshow components.
- **daisyui** – Tailwind CSS plugin for pre-built components.

**Dev Dependencies**:  
- **vite**, **@vitejs/plugin-react** – Build and dev tooling.  
- **eslint**, **@eslint/js**, **eslint-plugin-react-hooks**, **eslint-plugin-react-refresh** – Code linting and quality enforcement.  
- **@types/react**, **@types/react-dom**, **globals** – Type definitions for better development experience.


## 🚀 Installation & Setup

### Backend
```bash
git clone https://github.com/MD-ELIUS/scholar-hub-server.git
cd scholarhub-server
npm install
cp .env.example .env  # configure DB_USER, DB_PASS, JWT_SECRET, STRIPE_SECRET
npm start
```

### Frontend
```bash
git clone https://github.com/MD-ELIUS/scholar-hub-client.git
cd scholarhub-client
npm install
cp .env.example .env  # configure REACT_APP_FIREBASE_API_KEY, etc.
npm run dev
