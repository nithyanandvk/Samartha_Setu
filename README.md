# 🌉 Samartha Setu - Real-time Hyperlocal Food Sharing Platform

**Symbolizing the Ram Setu — connecting donors and receivers across India in a lasting, reliable bridge.**

## _"The food you save today might save a life tomorrow."_

Samartha Setu is a full-stack MERN application that connects food donors with receivers to minimize food waste through real-time, hyperlocal matching. Built for hackathons with production-ready features.

**Platform Name:** **Samartha Setu** (सामर्थ्य सेतु)  
**Meaning:** A bridge of capability and compassion, inspired by the legendary Ram Setu that connected lands and hearts.

---

## 🎯 Core Features

### ✅ Implemented Features

#### **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Donor, Receiver, Admin)
- Organization verification workflow
- Secure password hashing with bcrypt

#### **Food Listing Management**
- Create quick/bulk listings with geolocation
- TTL-based automatic expiration (configurable)
- Claim → Confirm → Complete workflow
- Fallback routing (Receiver → Animal Farm → Biocompost)
- Real-time status updates via Socket.IO

#### **Map Interface**
- Leaflet.js + OpenStreetMap integration
- Live pins for listings, fridges, animal farms, biocompost centers
- Geospatial queries (radius-based filtering)
- Food type and immediate pickup filters
- Interactive popups with claim buttons

#### **Real-time Features**
- Socket.IO for instant notifications
- Live listing updates
- Per-listing chat with quick replies
- Claim/confirm/complete events
- New message notifications

#### **Gamification & Leaderboard**
- Points system (10 points per KG donated)
- Automatic badge awards (5 tiers)
- Public leaderboard with rankings
- Reward eligibility tracking
- Gift/certificate issuance

#### **Admin Panel**
- Dashboard with analytics charts
- User management (verify/ban)
- Organization verification
- Checkpoint management (fridges, animal farms, biocompost)
- Reward creation and tracking
- CSV export for listings/users

#### **Fallback Automation**
- Cron-based TTL checking (runs every minute)
- Auto-routing to nearest checkpoint if no claims
- Configurable fallback delay
- Checkpoint capacity tracking

#### **Ratings & Moderation**
- Post-pickup ratings (1-5 stars)
- Auto-ban for donors with low ratings (<2 stars, 5+ ratings)
- Manual ban/unban by admins
- Feedback collection

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with Mongoose (geospatial indexes)
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **bcrypt** for password hashing
- **node-cron** for TTL automation
- **express-rate-limit** for API protection
- **helmet** + **CORS** for security

### Frontend
- **React 18** with Hooks
- **React Router v6** for routing
- **Axios** for API calls
- **Socket.IO Client** for real-time updates
- **Leaflet** + **React-Leaflet** for maps
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **date-fns** for date formatting

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone Repository
```bash
cd Samartha_Setu
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and secrets
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/samartha_setu

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/samartha_setu

# Start backend
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file (optional, defaults work for local)
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
echo "REACT_APP_SOCKET_URL=http://localhost:5000" >> .env

# Start frontend
npm start
```

### 4. Seed Database
```bash
cd ../backend
npm run seed
```

---

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Serve with backend
cd ../backend
NODE_ENV=production npm start
```

---

## 🎭 Demo Credentials

### Admin
- **Email:** admin@samarthasetu.org
- **Password:** Admin@123

### Donors
1. **Individual:** rajesh@example.com / Donor@123
2. **Organization:** annapurna@example.com / Donor@123
3. **Individual:** priya@example.com / Donor@123
4. **Organization (Langar):** langar@example.com / Donor@123

### Receivers
1. **Individual:** amit@example.com / Receiver@123
2. **Charity:** hope@example.com / Receiver@123
3. **Biocompost:** greenearth@example.com / Receiver@123
4. **Animal Farm:** shelter@example.com / Receiver@123

---

## 📖 Demo Flow (3-Minute Judge Demo)

### **Step 1: Landing Page (30s)**
1. Open `http://localhost:3000`
2. Show hero section with live stats
3. Highlight "Post Food", "Find Food", "Admin Portal" CTAs
4. Scroll to features section

### **Step 2: Donor Flow (60s)**
1. Login as donor: `rajesh@example.com` / `Donor@123`
2. View dashboard (stats, recent listings, leaderboard)
3. Click "Create Listing"
4. Fill form:
   - Title: "Fresh Biryani - 20 servings"
   - Description: "Made 1 hour ago, still hot"
   - Food Type: Cooked
   - Quantity: 20 servings
   - Click "Get Location" (or enter manually)
   - Set pickup times (now + 2 hours)
   - Fallback: Receiver → Animal Farm → Biocompost
5. Submit → See real-time notification

### **Step 3: Receiver Flow (60s)**
1. Open incognito/new browser
2. Login as receiver: `amit@example.com` / `Receiver@123`
3. Go to Map View
4. Apply filters (radius, food type)
5. Click on blue marker (the listing just created)
6. Click "Claim" in popup
7. Show real-time notification to donor (switch tabs)

### **Step 4: Confirm & Complete (30s)**
1. Switch to donor tab
2. See "Listing Claimed" notification
3. Go to "My Donations"
4. Click listing → Confirm claim
5. Switch to receiver → See "Claim Confirmed"
6. Complete the donation
7. Show points awarded to donor

### **Step 5: Admin Panel (30s)**
1. Login as admin: `admin@samarthasetu.org` / `Admin@123`
2. View dashboard stats
3. Show user management (verify/ban)
4. Show checkpoints on map
5. Show leaderboard

### **Step 6: Real-time Demo (10s)**
1. Keep both donor/receiver tabs open
2. Create new listing as donor
3. Show instant appearance on receiver's map
4. Demonstrate Socket.IO real-time updates

---

## 🗂️ Project Structure

```
Samartha_Setu/
├── backend/
│   ├── models/              # Mongoose schemas
│   │   ├── User.js          # User with roles, points, badges
│   │   ├── Listing.js       # Food listings with geospatial
│   │   ├── Chat.js          # Per-listing chat
│   │   ├── Notification.js  # Real-time notifications
│   │   ├── Checkpoint.js    # Fridges, animal farms, biocompost
│   │   └── Reward.js        # Gamification rewards
│   ├── controllers/         # Business logic
│   │   ├── authController.js
│   │   ├── listingController.js
│   │   ├── chatController.js
│   │   └── adminController.js
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth, rate limiting, error handling
│   ├── utils/               # Notifications helper
│   ├── scripts/seed.js      # Demo data seeder
│   └── server.js            # Express + Socket.IO setup
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/           # Route pages
│   │   │   ├── LandingPage.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── MapView.js
│   │   │   ├── donor/       # Donor dashboard, create, donations
│   │   │   ├── receiver/    # Receiver dashboard, claims
│   │   │   └── admin/       # Admin dashboard, users, checkpoints
│   │   ├── context/         # Auth context
│   │   ├── utils/           # API, Socket.IO
│   │   ├── App.js
│   │   └── index.js
│   └── public/
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Listings
- `GET /api/listings` - Get listings (with geospatial filters)
- `POST /api/listings` - Create listing (Donor)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings/:id/claim` - Claim listing (Receiver)
- `POST /api/listings/:id/confirm` - Confirm/reject claim (Donor)
- `POST /api/listings/:id/complete` - Mark as completed
- `GET /api/listings/my/donations` - Get my donations (Donor)
- `GET /api/listings/my/claims` - Get my claims (Receiver)

### Chat
- `GET /api/chat/listing/:listingId` - Get chat for listing
- `POST /api/chat/:chatId/message` - Send message
- `GET /api/chat/my` - Get my chats

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/verify/:userId` - Verify organization
- `PUT /api/admin/ban/:userId` - Ban/unban user
- `GET /api/admin/leaderboard` - Get leaderboard
- `GET /api/admin/checkpoints` - Get checkpoints
- `POST /api/admin/checkpoints` - Create checkpoint
- `GET /api/admin/rewards` - Get rewards
- `POST /api/admin/rewards` - Create reward
- `GET /api/admin/export?type=listings|users` - Export CSV

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/samartha_setu
JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
LISTING_TTL_MINUTES=120
FALLBACK_DELAY_MINUTES=30
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 🎨 UI/UX Highlights

- **Mobile-first responsive design**
- **Accessible** (ARIA labels, keyboard navigation, focus states)
- **Dark mode ready** (CSS variables)
- **Microinteractions** (hover effects, transitions)
- **Real-time toast notifications**
- **Loading states** for all async operations
- **Error handling** with user-friendly messages

---

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on auth/listing/claim endpoints
- CORS protection
- Helmet.js security headers
- Input validation
- Role-based authorization
- Anti-spoofing measures

---

## 📊 Analytics & Metrics

- Meals redistributed (daily/weekly)
- KG food saved
- Active donors/receivers
- Completion rate
- Top donors leaderboard
- Food type breakdown
- Status distribution

---

## 🚧 Known Limitations & Future Enhancements

### Current Limitations
- Chat UI is simplified (full chat interface can be expanded)
- Image upload not implemented (placeholder ready)
- Email notifications stubbed (SMTP integration needed)
- Web push notifications not implemented

### Planned Enhancements
- Mobile apps (React Native)
- Advanced analytics dashboard
- ML-based demand prediction
- Multi-language support
- Integration with food banks
- Blockchain for donation tracking

---

## 🏆 Hackathon Readiness

### ✅ Complete Features
- [x] Full MERN stack
- [x] Real-time updates (Socket.IO)
- [x] Geospatial queries
- [x] Map interface
- [x] Claim-confirm flow
- [x] TTL automation
- [x] Fallback routing
- [x] Gamification
- [x] Admin panel
- [x] Seed data
- [x] Demo credentials
- [x] Responsive UI

### 📝 Deployment Checklist
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas URI
3. Generate strong JWT_SECRET
4. Configure CORS_ORIGIN for production domain
5. Build frontend: `npm run build`
6. Serve frontend from backend or use Netlify/Vercel
7. Run seed script on production DB

---

## 📞 Support & Contact

For issues or questions:
- Check the demo credentials above
- Review the API endpoints section
- Ensure MongoDB is running
- Check console for errors

---

## 📄 License

MIT License - Built for social impact

---

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Leaflet.js for mapping library
- Socket.IO for real-time communication
- MongoDB for geospatial capabilities
- React community for amazing tools

---

**Built with ❤️ for ending food waste across India**

🌉 **Samartha Setu** - The bridge that connects hearts and meals
