import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ServiceTicketsRouter from './pages/ServiceTicketsRouter';

import Customers from './pages/salesperson/Customers';
import Cars from './pages/salesperson/Cars';
import Parts from './pages/salesperson/Parts';
import Invoices from './pages/salesperson/Invoices';
import Reports from './pages/salesperson/Reports';

import Services from './pages/mechanic/Services';

import MyServiceTickets from './pages/customer/MyServiceTickets';
import MyInvoices from './pages/customer/MyInvoices';
import Profile from './pages/customer/Profile';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout>
                  <Navigate to="/dashboard" replace />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/customers" element={
              <ProtectedRoute requiredRole="SALESPERSON">
                <MainLayout>
                  <Customers />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/cars" element={
              <ProtectedRoute requiredRole="SALESPERSON">
                <MainLayout>
                  <Cars />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/parts" element={
              <ProtectedRoute requiredRole="SALESPERSON">
                <MainLayout>
                  <Parts />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/invoices" element={
              <ProtectedRoute requiredRole="SALESPERSON">
                <MainLayout>
                  <Invoices />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/reports" element={
              <ProtectedRoute requiredRole="SALESPERSON">
                <MainLayout>
                  <Reports />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/service-tickets" element={
              <ProtectedRoute>
                <MainLayout>
                  <ServiceTicketsRouter />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/services" element={
              <ProtectedRoute requiredRole="MECHANIC">
                <MainLayout>
                  <Services />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/my-service-tickets" element={
              <ProtectedRoute requiredRole="CUSTOMER">
                <MainLayout>
                  <MyServiceTickets />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/my-invoices" element={
              <ProtectedRoute requiredRole="CUSTOMER">
                <MainLayout>
                  <MyInvoices />
                </MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
