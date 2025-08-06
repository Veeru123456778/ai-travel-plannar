# AI Travel Planner - Collaborative Trip Planning Platform

A production-ready, AI-powered collaborative travel planning platform built with Next.js, Socket.IO, MongoDB, and Clerk Authentication. Features real-time collaboration, AI itinerary generation with graph-based optimization, expense tracking, voice chat, and beautiful PDF exports.

## 🌟 Features

### 🤖 AI-Powered Itinerary Generation
- **Smart Itinerary Creation**: Uses Google Gemini AI to generate comprehensive trip itineraries
- **Graph-Based Optimization**: Applies Minimum Spanning Tree algorithms to optimize routes and reduce travel time
- **Realistic Cost Estimates**: Provides accurate cost projections for transport, accommodation, food, and activities
- **Customizable Preferences**: Tailors suggestions based on travel style, interests, and budget

### 🔄 Real-Time Collaboration
- **Multi-User Editing**: Multiple users can edit the same itinerary simultaneously
- **Field-Level Locking**: Prevents conflicts with smart field locking when users edit
- **Live User Presence**: See who's online and actively editing
- **Undo/Redo Support**: Track and revert changes with version control
- **Typing Indicators**: Real-time typing notifications for collaborative editing

### 💬 Communication & Notes
- **Shared Notes System**: Add and share notes for each trip with team members
- **WebRTC Voice Chat**: Built-in voice communication for real-time discussions
- **Private & Public Notes**: Control note visibility with privacy settings
- **Real-Time Messaging**: Instant message updates across all connected users

### 💰 Expense Tracking & Budget Management
- **Shared Expense Tracking**: Log and split expenses among trip collaborators
- **Smart Cost Splitting**: Automatically calculate fair splits or customize distributions
- **Budget Visualization**: Interactive charts showing spending by category
- **Balance Calculations**: Track who owes what with automatic balance calculations
- **Receipt Management**: Attach receipts and link expenses to specific activities

### 🎯 Advanced Trip Management
- **Role-Based Permissions**: Owner, Editor, and Viewer roles with appropriate access levels
- **Email Invitations**: Send secure invites to collaborators via email
- **Trip Sharing**: Generate shareable links with customizable permissions
- **Status Tracking**: Track trip progress from planning to completion

### 📄 Beautiful PDF Export
- **Professional Layouts**: Export itineraries as beautifully formatted PDFs
- **Comprehensive Reports**: Include itinerary, expenses, notes, and budget summaries
- **Customizable Templates**: Professional design with branding and styling
- **Multiple Export Options**: Download or preview PDFs before sharing

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Themes**: Choose your preferred theme with system detection
- **Loading States**: Smooth loading animations and progress indicators
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Toast Notifications**: Real-time feedback for all user actions

## 🛠 Technology Stack

### Frontend
- **Next.js 15** (App Router) - React framework with server-side rendering
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth interactions
- **Chart.js** - Interactive charts for expense visualization
- **React Hot Toast** - Beautiful toast notifications

### Backend
- **Node.js & Express** - Server runtime and web framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB with Mongoose** - NoSQL database with object modeling
- **Clerk Authentication** - Complete authentication solution

### AI & Integrations
- **Google Gemini AI** - Advanced AI for itinerary generation
- **WebRTC** - Peer-to-peer voice communication
- **PDF-lib** - Client-side PDF generation
- **Google Maps API** - Location services and mapping (optional)

## 📋 Prerequisites

Before running the application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Clerk Account** (for authentication)
- **Google Gemini API Key**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-travel-planner
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the environment template and configure your variables:
```bash
cp .env.local.example .env.local
```

Update `.env.local` with your actual values:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-travel-planner

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Email Configuration (for invites)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
```

### 4. Database Setup
Start your MongoDB instance:
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env.local
```

### 5. Start the Application
Use the convenient startup script:
```bash
./startup.sh
```

Or manually start both servers:
```bash
# Terminal 1 - Socket.IO Server
node server.js

# Terminal 2 - Next.js App
npm run dev
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Socket.IO Health**: http://localhost:3001/health

## 🔧 Configuration Guide

### Clerk Authentication Setup
1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Get your publishable and secret keys
4. Configure sign-in/sign-up URLs in the Clerk dashboard
5. Update environment variables

### Google Gemini AI Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your environment variables

### MongoDB Setup
Choose one of the following options:

#### Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod --dbpath /path/to/your/db
```

#### MongoDB Atlas (Recommended)
1. Create account at [mongodb.com](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update MONGODB_URI in .env.local

### Email Configuration (Optional)
For sending invitation emails:
1. Use Gmail SMTP or your preferred email service
2. Configure SMTP settings in .env.local
3. For Gmail, use App Passwords for enhanced security

## 📁 Project Structure

```
ai-travel-planner/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── trips/         # Trip management APIs
│   │   │   ├── generateItinerary/ # AI generation
│   │   │   └── ...
│   │   ├── dashboard/         # User dashboard
│   │   ├── trip/             # Trip detail pages
│   │   └── ...
│   ├── components/           # React components
│   │   ├── TripNotes.js     # Notes and voice chat
│   │   ├── ExpenseTracker.js # Expense management
│   │   ├── PDFExportButton.js # PDF generation
│   │   └── ...
│   ├── context/             # React contexts
│   │   ├── SocketContext.js # Real-time collaboration
│   │   ├── TripContext.js   # Trip state management
│   │   └── ...
│   ├── lib/                 # Utility libraries
│   │   ├── ai.js           # AI integration
│   │   ├── db.js           # Database connection
│   │   ├── pdf-export.js   # PDF generation
│   │   └── ...
│   ├── models/             # Database models
│   │   ├── Trip.js         # Trip schema
│   │   ├── User.js         # User schema
│   │   └── Invite.js       # Invitation schema
│   └── utils/              # Helper utilities
├── server.js               # Socket.IO server
├── startup.sh             # Startup script
└── README.md              # This file
```

## 🚀 Usage Guide

### Creating Your First Trip
1. **Sign Up/Login**: Use Clerk authentication to create an account
2. **Create Trip**: Click "Create Trip" and fill in basic details
3. **AI Generation**: Use the AI assistant to generate an optimized itinerary
4. **Customize**: Edit activities, times, and costs as needed
5. **Invite Collaborators**: Send email invitations to trip companions

### Real-Time Collaboration
1. **Join Trip**: Accept invitation or access via share link
2. **Live Editing**: See real-time updates as others edit
3. **Field Locking**: Fields lock automatically when someone is typing
4. **Voice Chat**: Start voice conversations with trip collaborators
5. **Notes**: Add shared or private notes for coordination

### Expense Management
1. **Add Expenses**: Log trip expenses with categories
2. **Split Costs**: Automatically or manually split between travelers
3. **Track Balances**: See who owes what in real-time
4. **View Reports**: Analyze spending with interactive charts
5. **Export Data**: Include expenses in PDF exports

### PDF Export
1. **Generate PDF**: Click the export button in any trip
2. **Preview**: Preview the PDF before downloading
3. **Download**: Save professionally formatted itinerary
4. **Share**: Send PDF to travel companions or print for offline use

## 🔐 Security Features

- **Authentication**: Secure authentication via Clerk
- **Authorization**: Role-based access control (Owner/Editor/Viewer)
- **Data Validation**: Comprehensive input validation and sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **Secure Communication**: HTTPS and WSS for all data transmission
- **Field Locking**: Prevents data conflicts in real-time editing

## 🌐 Deployment

### Vercel Deployment (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy the Next.js application
4. Deploy Socket.IO server separately (Railway, Heroku, etc.)

### Environment Variables for Production
Update these for production deployment:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
# ... other production configurations
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Socket.IO Connection Failed**
- Check if port 3001 is available
- Verify NEXT_PUBLIC_SOCKET_URL in environment
- Ensure firewall allows the connection

**MongoDB Connection Error**
- Verify MongoDB is running
- Check MONGODB_URI format
- Ensure network access (for Atlas)

**AI Generation Fails**
- Verify GEMINI_API_KEY is correct
- Check API quota and billing
- Ensure network connectivity

**PDF Export Issues**
- Clear browser cache
- Check for browser compatibility
- Verify PDF-lib dependency installation

### Getting Help
- Open an issue on GitHub
- Check the troubleshooting section
- Review environment variable configuration

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Offline functionality
- [ ] More AI providers (OpenAI, Claude)
- [ ] Advanced analytics and insights
- [ ] Integration with booking platforms
- [ ] Multi-language support
- [ ] Advanced mapping features

---

Built with ❤️ using Next.js, Socket.IO, and AI technology.
