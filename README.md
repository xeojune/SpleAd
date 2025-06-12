# SpleAd Platform

## 🧹 Overview

**SpleAd** is a web platform that connects **Japanese influencers** with **Korean beauty brands**. It enables influencers to link their social media accounts (Twitter/X, Instagram, TikTok), participate in promotional campaigns, and showcase their content to brand partners.

---

## ⚙️ Features

### 🌐 Frontend (React)

* Influencer registration/login
* Social media OAuth linking (Twitter, Instagram, TikTok)
* Dashboard showing follower counts and post metrics
* Campaign participation and content submission

### 🧠 Backend (NestJS)

* Handles OAuth 2.0 authentication flows
* Securely stores access tokens and user metadata
* Interfaces with social APIs to pull post and profile data
* Enables campaign and influencer management

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/splead.git
cd splead
```

### 2. Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd ../server
npm install
```

### 3. Setup Environment Variables

Create `.env` files in both `client/` and `server/` directories.

#### Example: `server/.env`

```env
X_API_KEY=your_twitter_client_id
X_API_SECRET=your_twitter_client_secret
X_REDIRECT_URI=https://your-ngrok-url/api/x/callback

IG_APP_ID=your_instagram_app_id
IG_APP_SECRET=your_instagram_app_secret
IG_REDIRECT_URI=https://your-ngrok-url/api/instagram/callback

TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_REDIRECT_URI=https://your-ngrok-url/api/tiktok/callback
```

> ⚠️ Replace `your-ngrok-url` after setting up ngrok.

---

## 🧪 Development

### Start Backend (NestJS)

```bash
cd server
npm run start:dev
```

### Start Frontend (Vite + React)

```bash
cd ../client
npm run dev
```

---

## 🌐 HTTPS with Ngrok (for OAuth Redirects)

Since Instagram and TikTok **require HTTPS**, use Ngrok to tunnel your local server:

### 1. Install Ngrok

```bash
npm install -g ngrok
```

### 2. Run Tunnel

```bash
ngrok http 3000
```

### 3. Copy and Use the URL

Update the `.env` files and developer dashboard redirect URIs with the HTTPS URL provided by ngrok.

> If you're using Vite, allow the domain in `vite.config.js`:

```js
server: {
  allowedHosts: ['your-ngrok-subdomain.ngrok-free.app']
}
```

---

## 📦 Deployment Instructions

1. **Frontend Hosting**: Use Vercel, Netlify, or your own HTTPS server.
2. **Backend Hosting**: Deploy to Render, Railway, or AWS EC2.
3. **Environment Setup**: Ensure environment variables are securely injected into both environments.
4. **Domain Settings**: Set correct redirect URIs on Twitter, Instagram, and TikTok developer dashboards.
5. **Database**: Use MongoDB Atlas or PostgreSQL as needed; Redis for PKCE token caching.

---

## 🔐 OAuth Flow Summary

### 🔹 Twitter / X

* Uses OAuth 2.0 with PKCE
* Auth URL: `https://twitter.com/i/oauth2/authorize`
* Callback: `/api/x/callback`
* Retrieves: User ID, handle, follower count, media stats

### 📸 Instagram (via Meta)

* OAuth 2.0 via Facebook Login
* Auth URL: `https://www.facebook.com/v18.0/dialog/oauth`
* Callback: `/api/instagram/callback`
* Requires Business/Creator accounts & app approval
* Retrieves: Profile info, media insights

### 🎵 TikTok

* TikTok OAuth 2.0
* Auth URL: `https://www.tiktok.com/v2/auth/authorize`
* Callback: `/api/tiktok/callback`
* Retrieves: Profile info, video stats

---

## 🖼️ Screenshots

### 1. OAuth Integration Screen

![OAuth Login Screen](screenshots/oauth-login.png)

### 2. Influencer Dashboard

![Dashboard](screenshots/dashboard.png)

### 3. Campaign Participation

![Campaign](screenshots/campaign.png)

> Place screenshots inside a `screenshots/` directory in your root project folder.

---

## 🌍 Deployment Notes

* Use real HTTPS domains in production
* Register production redirect URIs in developer portals
* Use Redis or DB-backed PKCE verifier store for scalability
* Move tokens to a secure secrets manager if needed

---

## 📜 License

MIT License. For commercial use, contact project maintainers.

---

## 🧑‍💻 Contact

Open an issue on GitHub or contact the lead developer for contributions or support.
