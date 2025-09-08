# Car Dealership Management System - Frontend

A comprehensive React frontend application for managing a car dealership with role-based access control. Built with React 18, Ant Design, and modern web technologies.

## 🚀 Features

### Multi-Role Authentication System
- **Salesperson**: Complete dealership management capabilities
- **Mechanic**: Service and repair management
- **Customer**: Personal service tracking and profile management

### Salesperson Dashboard & Functions
- **Customer Management**: Full CRUD operations with search by name
- **Car Inventory**: Manage cars with search by serial number, model, and year
- **Service Tickets**: Create and view service requests for customers
- **Parts Management**: Complete parts inventory with search capabilities
- **Invoice Generation**: Create and manage customer invoices
- **Comprehensive Reports**:
  - Cars sold statistics by year
  - Sales revenue analytics by year
  - Best-selling car models analysis
  - Most used parts tracking
  - Top 3 mechanics by workload

### Mechanic Dashboard & Functions
- **Service Ticket Management**: View, search, and update service tickets
- **Service Operations**: CRUD operations for maintenance services
- **Advanced Search**: Filter tickets by customer ID, car ID, or date received
- **Work Updates**: Update hours worked, comments, and service ratings

### Customer Portal
- **Service History**: View personal service tickets and detailed progress
- **Invoice Management**: Access and review personal invoices
- **Profile Management**: Update personal information and contact details

## 🛠 Technology Stack

- **Frontend Framework**: React 18.3.1
- **UI Library**: Ant Design 5.27.3
- **Routing**: React Router DOM 7.8.2
- **HTTP Client**: Axios 1.11.0
- **Build Tool**: Vite 7.1.4
- **Styling**: CSS3 with Ant Design themes
- **Authentication**: JWT-based with role-based access control

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8080`

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Car-Dealership-Project-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # .env file is already configured
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   ```
   Local: http://localhost:5173/
   ```

## 🔐 Authentication & Default Accounts

### Staff Login (Username/Password)
```
Salesperson:
- Username: salesperson
- Password: password123

Mechanic:
- Username: mechanic  
- Password: password123
```

### Customer Login (Name/Phone)
```
Customer:
- Name: John Customer
- Phone: 1234567890
```

> **Note**: Customer accounts must be created by salespersons before customers can log in.

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── MainLayout.jsx   # Main application layout with navigation
│   └── ProtectedRoute.jsx # Route protection based on authentication
├── configs/             # Configuration files
│   └── api.js          # Axios configuration and interceptors
├── contexts/            # React Context providers
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components organized by role
│   ├── Login.jsx       # Multi-tab login page
│   ├── Dashboard.jsx   # Role-based dashboard router
│   ├── customer/       # Customer-specific pages
│   ├── mechanic/       # Mechanic-specific pages
│   ├── salesperson/    # Salesperson-specific pages
│   └── dashboard/      # Role-specific dashboard components
├── services/           # API service layers
│   ├── authService.js  # Authentication services
│   ├── customerService.js # Customer API calls
│   ├── mechanicService.js # Mechanic API calls
│   └── salespersonService.js # Salesperson API calls
└── App.jsx            # Main application component with routing
```

## 🚦 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint for code quality checks
```

## 🔧 API Integration

The frontend integrates with a Spring Boot backend API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/init-data` - Initialize default users

### Salesperson Endpoints
- `/api/salesperson/customers` - Customer management
- `/api/salesperson/cars` - Car inventory management  
- `/api/salesperson/service-tickets` - Service ticket operations
- `/api/salesperson/parts` - Parts management
- `/api/salesperson/invoices` - Invoice generation
- `/api/salesperson/reports/*` - Various business reports

### Mechanic Endpoints
- `/api/mechanic/service-tickets` - Service ticket management
- `/api/mechanic/services` - Service operations

### Customer Endpoints
- `/api/customer/service-tickets` - Personal service history
- `/api/customer/invoices` - Personal invoice history
- `/api/customer/profile` - Profile management

## 🔒 Security Features

- **JWT Token Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Page-level and feature-level permissions
- **Route Protection**: Unauthorized access prevention
- **Automatic Token Refresh**: Seamless session management
- **Secure API Communication**: Axios interceptors for token management

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Interface**: Clean and intuitive Ant Design components
- **Dark/Light Theme**: Consistent color scheme and theming
- **Loading States**: Proper loading indicators for all operations
- **Error Handling**: User-friendly error messages and validation
- **Search & Filtering**: Advanced search capabilities across all modules
- **Data Visualization**: Charts and statistics in reports section

## 📊 Key Features by Role

### 👔 Salesperson Features
- Complete customer lifecycle management
- Comprehensive car inventory tracking
- Service appointment scheduling
- Parts inventory management with low stock alerts
- Invoice generation with automatic calculations
- Business intelligence reports and analytics
- Multi-criteria search and filtering

### 🔧 Mechanic Features
- Service ticket queue management
- Work progress tracking and updates
- Service catalog management
- Customer communication through comments
- Performance rating system
- Workload analytics

### 👤 Customer Features
- Personal service history tracking
- Real-time service status updates
- Invoice viewing and download
- Profile management and updates
- Service rating and feedback

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```bash
VITE_API_URL=your-production-api-url
```

### Deployment Platforms
- Vercel (recommended for Vite projects)
- Netlify
- AWS S3 + CloudFront
- Traditional web servers (Apache, Nginx)

## 🔧 Development Guidelines

### Code Style
- ESLint configuration for code quality
- Consistent component structure
- Proper error handling patterns
- Responsive design principles

### State Management
- React Context for authentication state
- Local state for component-specific data
- Service layer for API communication

### Component Architecture
- Functional components with hooks
- Reusable UI components
- Proper separation of concerns
- Error boundary implementation

## 🐛 Troubleshooting

### Common Issues

1. **Customer Login Not Working**
   - Ensure customer account exists (created by salesperson)
   - Verify name and phone number format
   - Check backend API connectivity

2. **API Connection Issues**
   - Verify backend server is running on port 8080
   - Check CORS configuration
   - Validate environment variables

3. **Authentication Problems**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify user roles and permissions

## 📞 Support

For technical support or questions:
- Check the backend API documentation
- Review console logs for error details
- Verify authentication and role permissions

## 🔄 Version History

- **v1.0.0**: Initial release with complete role-based functionality
- Multi-role authentication system
- Comprehensive CRUD operations
- Business reporting and analytics
- Responsive design implementation

---

## 📝 License

This project is developed for educational and demonstration purposes.
