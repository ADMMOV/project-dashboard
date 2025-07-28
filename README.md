# Project Status Dashboard

A modern, interactive Proof of Concept (POC) for a Project Status Dashboard web application built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Authentication
- **Login Screen**: Clean, professional login interface with form validation
- **User Management**: Role-based access control (Admin, Manager, Developer, Client)
- **Session Management**: Simulated authentication flow

### Dashboard Overview
- **Project Overview**: Visual progress indicators with donut charts
- **Key Metrics**: Tasks completed, days remaining, budget usage, team velocity
- **Status Indicators**: Color-coded status badges for project health
- **Real-time Updates**: Last updated timestamps with relative time display

### Task Management
- **Task Cards**: Interactive cards with progress bars and status indicators
- **Search & Filtering**: Advanced filtering by status, priority, and search terms
- **Priority System**: Visual priority indicators (Critical, High, Medium, Low)
- **Progress Tracking**: Real-time progress visualization

### Blocker Management
- **Active Blockers**: Prominent display of project blockers
- **Blocker Details**: Priority levels and resolution tracking
- **Quick Actions**: Easy access to blocker information

Sanity check

### Responsive Design
- **Mobile-First**: Fully responsive across all device sizes
- **Touch Optimized**: Mobile-friendly interactions
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Heroicons** for icons
- **Recharts** for data visualization

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎯 Usage

### Login
- Use any email from the mock data: `john.smith@company.com`, `sarah.johnson@company.com`, etc.
- Password can be any 6+ character string
- The app will authenticate and show the dashboard

### Dashboard Navigation
- **Project Overview**: View project progress and key metrics
- **Task Cards**: Click on any task card to view details (currently logs to console)
- **Search & Filter**: Use the search bar and filters to find specific tasks
- **Notifications**: Click the bell icon to view recent notifications
- **User Profile**: Click your profile to access settings or logout

### Mock Data
The application includes realistic mock data for:
- 1 active project (E-Commerce Platform Redesign)
- 5 tasks with varying statuses and priorities
- 4 team members with different roles
- Active blockers and task updates

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── LoginScreen.tsx
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── ProjectOverview.tsx
│   │   └── TaskCard.tsx
│   └── Layout/
│       └── Header.tsx
├── data/
│   └── mockData.ts
├── types/
│   └── index.ts
├── App.tsx
└── index.tsx
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#22C55E)
- **Warning**: Yellow (#F59E0B)
- **Danger**: Red (#EF4444)

### Components
- **Cards**: Consistent card styling with hover effects
- **Buttons**: Primary and secondary button variants
- **Status Badges**: Color-coded status indicators
- **Progress Bars**: Animated progress visualization

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Future Enhancements

- Task detail screens with full CRUD operations
- Team management interface
- Kanban board view
- Reporting and analytics
- Real-time notifications
- Dark mode toggle
- Export functionality
- API integration

## 📄 License

This project is a POC and is intended for demonstration purposes.

---

**Your Project, Your Clarity** ✨
