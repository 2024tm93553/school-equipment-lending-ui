# 🎓 School Equipment Lending System

A modern, responsive web application for managing school equipment lending operations. Built with React.js and featuring a comprehensive equipment management system with role-based access control.

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-purple?logo=bootstrap)
![Axios](https://img.shields.io/badge/Axios-1.4.0-green?logo=axios)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🚀 Getting Started](#-getting-started)
- [📱 User Roles & Permissions](#-user-roles--permissions)
- [🔧 API Integration](#-api-integration)
- [🎨 UI/UX Features](#-uiux-features)
- [📁 Project Structure](#-project-structure)
- [🛠️ Technology Stack](#️-technology-stack)
- [📖 API Documentation](#-api-documentation)
- [🔒 Security Features](#-security-features)
- [📱 Responsive Design](#-responsive-design)
- [♿ Accessibility](#-accessibility)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Features

### 👥 **User Management**
- **User Registration** - Students and teachers can register with role-based access
- **Secure Authentication** - JWT-based authentication with role validation
- **Profile Management** - User profile viewing and basic information management

### 📦 **Equipment Management**
- **Equipment Catalog** - Browse and search available equipment
- **Advanced Search & Filtering** - Filter by category, availability, and search by name/description
- **Real-time Availability** - Live equipment availability status
- **Equipment CRUD Operations** - Admin can add, edit, and delete equipment

### 📋 **Borrow Request System**
- **Request Creation** - Students can request equipment for specific date ranges
- **Request Tracking** - View request status and history
- **Approval Workflow** - Teachers/admins can approve or reject requests
- **Return Management** - Mark equipment as returned with condition notes

### 🎛️ **Admin Dashboard**
- **Request Management** - View and manage all borrow requests
- **Equipment Statistics** - Monitor equipment usage and availability
- **User Activity** - Track user engagement and system usage

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern Animations** - Smooth transitions and micro-interactions
- **Intuitive Interface** - Clean, professional design with excellent usability
- **Dark Mode Support** - Automatic dark mode based on system preferences

## 🏗️ System Architecture

### **Frontend Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                        │
├─────────────────────────────────────────────────────────────┤
│  Components Layer                                           │
│  ├── Common Components (Reusable UI Elements)              │
│  ├── Feature Components (Equipment, Requests, Auth)        │
│  └── Layout Components (Header, Footer, Navigation)        │
├─────────────────────────────────────────────────────────────┤
│  Services Layer                                             │
│  ├── AuthService (Authentication & Authorization)          │
│  ├── EquipmentService (Equipment Management)               │
│  ├── BorrowRequestService (Request Management)             │
│  └── apiClient (HTTP Client Configuration)                 │
├─────────────────────────────────────────────────────────────┤
│  State Management                                           │
│  ├── React Hooks (useState, useEffect, useCallback)        │
│  ├── Custom Hooks (useRequestManagement, useModal)         │
│  └── Local Storage (Token & User Data Persistence)         │
└─────────────────────────────────────────────────────────────┘
```

### **Component Hierarchy**
```
App
├── HeaderComponent
├── AuthenticatedRoute
│   ├── EquipmentListComponent
│   ├── EquipmentFormComponent
│   ├── BorrowRequestFormComponent
│   ├── MyRequestsComponent
│   └── AdminRequestsComponent
├── LoginComponent
├── RegisterComponent
└── FooterComponent
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Backend API server running on `http://localhost:8080`

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-equipment-lending-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   REACT_APP_ENVIRONMENT=development
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### **Available Scripts**

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📱 User Roles & Permissions

### 🎓 **Student Role**
| Feature | Access Level |
|---------|-------------|
| Browse Equipment | ✅ Full Access |
| Search & Filter | ✅ Full Access |
| Create Borrow Requests | ✅ Full Access |
| View Own Requests | ✅ Full Access |
| Equipment Management | ❌ No Access |
| Approve Requests | ❌ No Access |

### 👨‍🏫 **Teacher/Admin Role**
| Feature | Access Level |
|---------|-------------|
| All Student Features | ✅ Full Access |
| Add/Edit/Delete Equipment | ✅ Full Access |
| View All Requests | ✅ Full Access |
| Approve/Reject Requests | ✅ Full Access |
| Mark Equipment as Returned | ✅ Full Access |
| System Administration | ✅ Full Access |

## 🔧 API Integration

### **Service Architecture**

#### **AuthService**
```javascript
// User Registration
AuthService.register(userData)

// User Login
AuthService.login(username, password)

// Token Management
AuthService.storeToken(token)
AuthService.getToken()

// User Data Management
AuthService.saveUserInfo(userInfo)
AuthService.getUserRole()
AuthService.isAdmin()
```

#### **EquipmentService**
```javascript
// Equipment CRUD Operations
EquipmentService.getAllEquipment(filters)
EquipmentService.getEquipmentById(id)
EquipmentService.addEquipment(equipmentData)
EquipmentService.updateEquipment(id, equipmentData)
EquipmentService.deleteEquipment(id)

// Advanced Filtering
EquipmentService.getAvailableEquipment()
EquipmentService.searchEquipment(searchTerm)
EquipmentService.getEquipmentByCategory(category)
```

#### **BorrowRequestService**
```javascript
// Request Management
BorrowRequestService.createBorrowRequest(requestData)
BorrowRequestService.getMyRequests()
BorrowRequestService.getAllRequests(filters)

// Admin Operations
BorrowRequestService.approveRequest(id, approvalData)
BorrowRequestService.rejectRequest(id, rejectionData)
BorrowRequestService.markAsReturned(id, returnData)
```

### **API Endpoints**

#### **Authentication Endpoints**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

#### **Equipment Endpoints**
- `GET /api/equipment` - Get all equipment (with filters)
- `GET /api/equipment/{id}` - Get equipment by ID
- `POST /api/equipment` - Create new equipment (Admin only)
- `PUT /api/equipment/{id}` - Update equipment (Admin only)
- `DELETE /api/equipment/{id}` - Delete equipment (Admin only)

#### **Borrow Request Endpoints**
- `GET /api/requests/my` - Get user's requests
- `GET /api/requests` - Get all requests (Admin only)
- `POST /api/requests` - Create borrow request
- `PUT /api/requests/{id}/approve` - Approve request (Admin only)
- `PUT /api/requests/{id}/reject` - Reject request (Admin only)
- `PUT /api/requests/{id}/return` - Mark as returned (Admin only)

## 🎨 UI/UX Features

### **Modern Design System**
- **CSS Custom Properties** - Centralized design tokens
- **Gradient Color Palette** - Professional blue-based color scheme
- **Typography System** - Inter font with optimal readability
- **Consistent Spacing** - 8px grid system for perfect alignment

### **Interactive Elements**
- **Smooth Animations** - Entrance, hover, and loading animations
- **Micro-interactions** - Button ripple effects and hover states
- **Loading States** - Skeleton screens and spinners
- **Form Validation** - Real-time validation with helpful error messages

### **Responsive Components**
- **Mobile-first Design** - Optimized for all screen sizes
- **Touch-friendly Interface** - Large touch targets for mobile
- **Adaptive Layouts** - Grid systems that work everywhere

## 📁 Project Structure

```
school-equipment-lending-ui/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/              # Reusable UI components
│   │   │   ├── Alert.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── index.js
│   │   ├── AdminRequestsComponent.jsx
│   │   ├── BorrowRequestFormComponent.jsx
│   │   ├── EquipmentFormComponent.jsx
│   │   ├── EquipmentListComponent.jsx
│   │   ├── HeaderComponent.jsx
│   │   ├── FooterComponent.jsx
│   │   ├── LoginComponent.jsx
│   │   ├── MyRequestsComponent.jsx
│   │   ├── RegisterComponent.jsx
│   │   ├── EquipmentStyles.css
│   │   └── animations.css
│   ├── services/
│   │   ├── apiClient.js          # HTTP client configuration
│   │   ├── AuthService.js        # Authentication service
│   │   ├── EquipmentService.js   # Equipment management
│   │   └── BorrowRequestService.js # Request management
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── package-lock.json
└── README.md
```

## 🛠️ Technology Stack

### **Frontend**
- **React 19.2.0** - Modern React with hooks and functional components
- **React Router DOM 6.11.2** - Client-side routing and navigation
- **Bootstrap 5.3.8** - Responsive UI framework
- **Axios 1.4.0** - HTTP client for API communication

### **Development Tools**
- **React Scripts 5.0.1** - Build and development tools
- **Testing Library** - Unit and integration testing
- **ESLint** - Code linting and formatting

### **CSS & Styling**
- **CSS Custom Properties** - Modern CSS variables
- **Flexbox & Grid** - Modern layout systems
- **CSS Animations** - Smooth transitions and effects
- **Google Fonts** - Inter font family

## 📖 API Documentation

### **Request/Response Format**

#### **Equipment Object**
```json
{
  "equipmentId": 1,
  "name": "Dell Laptop XPS 13",
  "category": "Laptops",
  "conditionStatus": "Good",
  "totalQuantity": 10,
  "availableQuantity": 8,
  "availability": true,
  "description": "High-performance ultrabook for development work",
  "createdBy": "Admin User",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-20T14:45:00"
}
```

#### **Borrow Request Object**
```json
{
  "requestId": 123,
  "equipmentId": 1,
  "equipmentName": "Dell Laptop XPS 13",
  "userId": 456,
  "userName": "John Doe",
  "quantity": 2,
  "fromDate": "2024-12-01",
  "toDate": "2024-12-15",
  "returnDate": null,
  "reason": "For science lab project",
  "status": "PENDING",
  "remarks": null,
  "conditionAfterUse": null,
  "approvedBy": null,
  "createdAt": "2024-11-09T10:30:00",
  "updatedAt": "2024-11-09T10:30:00"
}
```

### **Request Status Flow**
```
PENDING → APPROVED → RETURNED
   ↓
REJECTED
```

## 🔒 Security Features

### **Authentication & Authorization**
- **JWT Token Authentication** - Secure token-based authentication
- **Role-based Access Control** - Different permissions for students and teachers
- **Token Expiration Handling** - Automatic logout on token expiry
- **Secure Local Storage** - Encrypted token storage

### **Data Validation**
- **Client-side Validation** - Immediate feedback on form inputs
- **Server-side Validation** - Backend validation for security
- **Input Sanitization** - Clean and validate all user inputs
- **XSS Prevention** - Protection against cross-site scripting

### **API Security**
- **CORS Configuration** - Proper cross-origin resource sharing
- **Request Authentication** - All API calls include authorization headers
- **Error Handling** - Secure error messages without sensitive data

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Mobile Optimizations**
- **Touch-friendly buttons** - Minimum 44px touch targets
- **Simplified navigation** - Collapsible mobile menu
- **Optimized tables** - Horizontal scrolling for data tables
- **Reduced animations** - Respect user preferences for motion

## ♿ Accessibility

### **WCAG 2.1 Compliance**
- **Keyboard Navigation** - Full keyboard accessibility
- **Screen Reader Support** - Proper ARIA labels and descriptions
- **Color Contrast** - WCAG AA compliant color ratios
- **Focus Management** - Visible focus indicators

### **Inclusive Design**
- **Reduced Motion** - Respects user preferences
- **High Contrast Support** - Enhanced contrast for visibility
- **Font Size Scaling** - Supports browser zoom up to 200%

## 🧪 Testing

### **Testing Strategy**
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### **Test Coverage Areas**
- **Component Rendering** - Ensure components render correctly
- **User Interactions** - Test user actions and form submissions
- **API Integration** - Mock API calls and test responses
- **Authentication Flow** - Test login/logout functionality

## 🚀 Deployment

### **Production Build**
```bash
# Create production build
npm run build

# The build folder will contain optimized files
```

### **Environment Variables**
```env
REACT_APP_API_URL=https://your-production-api.com
REACT_APP_ENVIRONMENT=production
```

### **Deployment Options**
- **Netlify** - Simple static site deployment
- **Vercel** - Optimized for React applications
- **AWS S3 + CloudFront** - Scalable cloud deployment
- **Docker** - Containerized deployment

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### **Code Standards**
- **ESLint Configuration** - Follow the project's linting rules
- **Component Structure** - Use functional components with hooks
- **CSS Organization** - Follow the established CSS architecture
- **Documentation** - Add JSDoc comments for new functions