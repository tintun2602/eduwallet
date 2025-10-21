# EduWallet University Portal

<!-- @author Diego Da Giau -->
<!-- @co-author Tin Tun Naing -->

A web-based portal for universities to manage students in the EduWallet system.

## Features

- **University Login** - Institution-based authentication
- **Student Directory** - Search and view all students
- **Student Management** - Add new students manually
- **Academic Records** - View and manage student academic data
- **Dark Theme** - Consistent with EduWallet design system

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the university portal directory:

```bash
cd university-portal
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and go to `http://localhost:3001`

## Project Structure

```
university-portal/
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx          # University login
│   │   ├── DashboardPage.tsx     # Student directory & search
│   │   └── StudentDetailPage.tsx # Individual student view
│   ├── styles/
│   │   └── index.css             # Global styles
│   └── App.tsx                    # Main app component
├── public/
└── package.json
```

## Current Status

**Implemented:**

- Login page with institution ID authentication
- Student directory with search functionality
- Add student modal
- Responsive dark theme design
- Basic routing structure

**Next Steps:**

- Integrate with EduWallet SDK
- Connect to blockchain for real student data
- Implement student detail page
- Add academic record management
- University authentication system

## Integration with EduWallet

This portal will integrate with the existing EduWallet infrastructure:

- **Smart Contracts** - Use existing Student/University contracts
- **SDK** - Leverage existing SDK functions for student management
- **Authentication** - Connect to university wallet system
- **Data Models** - Use existing Student/University interfaces

## Design

The portal follows the EduWallet design system:

- Dark theme (#0a0a0a background)
- Purple accents (#8b5cf6)
- Clean, modern interface
- Responsive design
- Consistent with browser extension styling
