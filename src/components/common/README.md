# 🗳️ Narada Voting Committee 2026

A modern, secure, and user-friendly online voting system built with React and Supabase.

## ✨ Features

### 👥 For Members
- **Phone Registration** - Register using your phone number
- **Secure Login** - Login with phone number + 8-character approval code
- **Real-time Voting** - Cast votes for published positions
- **Live Results** - View real-time vote counts with charts
- **Personal Reports** - Download your voting history
- **Anonymous Voting** - No one knows who you voted for

### 👑 For Admin
- **Member Management** - Approve/reject members, generate login codes
- **Position Management** - Create positions (President, Secretary, etc.)
- **Candidate Management** - Add candidates to positions
- **Publish/Stop Voting** - Control which position is active
- **Voting Controls** - Start/stop the entire voting process
- **Reports** - Download Excel reports for members and votes

### 📊 Key Features
- **Real-time Updates** - Vote counts update instantly
- **Beautiful Charts** - Bar charts and pie charts
- **Mobile Responsive** - Works on all devices
- **Secure** - Row Level Security in Supabase
- **Kinyarwanda Language** - Full support for Kinyarwanda

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend framework |
| Tailwind CSS | Styling |
| Supabase | Backend database & authentication |
| Recharts | Charts and graphs |
| XLSX | Excel report generation |
| Font Awesome | Icons |

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account (free tier)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/dieumerci-niyonkuru/hr-hub.git
cd hr-hub
2. Install dependencies
bash
npm install
3. Set up environment variables
Create a .env.local file:

env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
4. Start development server
bash
npm start
5. Build for production
bash
npm run build
📁 Project Structure
text
src/
├── components/
│   ├── admin/
│   ├── auth/
│   ├── common/
│   ├── member/
│   └── voting/
├── utils/
│   └── supabase.js
├── App.js
└── index.js
🔐 Database Schema
Table	Purpose
profiles	User information
positions	Voting positions
candidates	Candidates for each position
votes	Record of votes cast
voting_status	Controls voting activity
👥 User Roles
Admin
Email + password login

Full system management

Member
Phone + approval code login

Vote in published positions