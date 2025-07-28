# ShelfScope 📚🎧

> A web application for book lovers offering both ebook reading and audiobook listening experiences. Built with React, Vite, and Firebase.

---

## 🚀 Features

- **Dual Modes:** Switch between "Read" (ebooks) and "Listen" (audiobooks) seamlessly.
- **User Authentication:** Secure Google sign-in via Firebase Authentication.
- **Personalized Lists:**
  - **Reading List:** Save ebooks you want to read.
  - **My Listens:** Save audiobooks you want to listen to.
- **Progress Tracking:**
  - Track your current page for ebooks.
  - Track your listening timestamp for audiobooks.
- **Powerful Search:** Find books by title or author.
- **Genre Discovery:** Explore curated genre and topic tags.
- **Integrated Readers & Players:** Read and listen without leaving the site.
- **Responsive Design:** Clean, modern UI across all devices with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, React Router, Tailwind CSS
- **Backend & Database:** Firebase (Authentication, Firestore, Cloud Functions)
- **APIs:**
  - Gutendex API (public domain ebooks)
  - LibriVox API (public domain audiobooks)
  - Open Library API(used for book covers)

---

## 📦 Getting Started

### Prerequisites

- Node.js
- npm (or Yarn)
- A Firebase project with Authentication, Firestore, and Cloud Functions enabled
- Firebase CLI installed globally:

```bash
npm install -g firebase-tools
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/shelfscope.git
cd shelfscope
```

2. Install dependencies:

```bash
npm install
```

### Configuration

1. Create a `.env` file in the project root and add your Firebase config keys:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Development

Run the development server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`

---

## 🚀 Deployment with Firebase Hosting

### Login to Firebase

```bash
firebase login
```

### Initialize Firebase (if not already configured)

```bash
firebase init
```

Follow the prompts:

- Select **Hosting**
- Choose **Use an existing project**
- Set public directory to `dist`
- Configure as a single-page app: **Yes**
- GitHub deploys: **No**

### Build the application

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

After deployment:

- Project Console: `https://console.firebase.google.com/project/your-firebase-project-id/overview`
- Hosting URL: `https://your-firebase-project-id.web.app`

---

## 🔧 Firebase Backend

1. Create or open a Firebase project in the Firebase Console
2. Deploy cloud functions:

In your project, go to the functions directory and run:

```bash
npm install
```

```bash
firebase deploy --only functions
```

---

## ✍️ Authors

- Daniel Muhia
- Brian Mwita Mogaya
- Sarah Sululu

---

## 📜 License

MIT License © 2025 ShelfScope

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---
