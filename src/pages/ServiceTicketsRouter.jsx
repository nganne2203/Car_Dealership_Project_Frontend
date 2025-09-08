import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SalespersonServiceTickets from './salesperson/ServiceTickets';
import MechanicServiceTickets from './mechanic/ServiceTickets';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ServiceTicketsRouter = () => {
    const { userRole } = useAuth();
    const navigate = useNavigate();

    switch (userRole) {
        case 'SALESPERSON':
        return <SalespersonServiceTickets />;
        case 'MECHANIC':
        return <MechanicServiceTickets />;
        default:
        return (
            <Result
            status="403"
            title="Access Denied"
            subTitle="You don't have permission to access service tickets."
            extra={
                <Button type="primary" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
                </Button>
            }
            />
        );
    }
};

export default ServiceTicketsRouter;
