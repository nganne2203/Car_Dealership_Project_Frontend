import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SalespersonDashboard from './dashboard/SalespersonDashboard';
import MechanicDashboard from './dashboard/MechanicDashboard';
import CustomerDashboard from './dashboard/CustomerDashboard';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { userRole } = useAuth();
    const navigate = useNavigate();

    switch (userRole) {
        case 'SALESPERSON':
        return <SalespersonDashboard />;
        case 'MECHANIC':
        return <MechanicDashboard />;
        case 'CUSTOMER':
        return <CustomerDashboard />;
        default:
        return (
            <Result
            status="403"
            title="Access Denied"
            subTitle="You don't have permission to access this dashboard."
            extra={
                <Button type="primary" onClick={() => navigate('/login')}>
                Go to Login
                </Button>
            }
            />
        );
    }
};

export default Dashboard;
