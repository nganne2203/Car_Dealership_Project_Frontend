import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    Statistic,
    Typography,
    Button,
    Space,
    List,
    Tag,
    Divider,
    Progress
} from 'antd';
import {
    FileTextOutlined,
    ToolOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    PlusOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mechanicService } from '../../services/mechanicService';

const { Title, Text } = Typography;

const MechanicDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTickets: 0,
        pendingTickets: 0,
        completedTickets: 0,
        services: 0
    });
    const [recentTickets, setRecentTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
        setLoading(true);
        
        const [serviceTickets, services] = await Promise.all([
            mechanicService.getServiceTickets(),
            mechanicService.getServices()
        ]);

        const tickets = serviceTickets.data || [];
        const pendingTickets = tickets.filter(ticket => ticket.status === 'PENDING' || !ticket.status);
        const completedTickets = tickets.filter(ticket => ticket.status === 'COMPLETED');

        setStats({
            totalTickets: tickets.length,
            pendingTickets: pendingTickets.length,
            completedTickets: completedTickets.length,
            services: services.data?.length || 0
        });

        setRecentTickets(tickets.slice(0, 5));

        } catch (error) {
        console.error('Error loading dashboard data:', error);
        } finally {
        setLoading(false);
        }
    };

    const quickActions = [
        {
        title: 'View Service Tickets',
        icon: <FileTextOutlined />,
        color: '#1890ff',
        onClick: () => navigate('/service-tickets')
        },
        {
        title: 'Manage Services',
        icon: <ToolOutlined />,
        color: '#52c41a',
        onClick: () => navigate('/services')
        },
        {
        title: 'Add New Service',
        icon: <PlusOutlined />,
        color: '#722ed1',
        onClick: () => navigate('/services?action=create')
        }
    ];

    const getTicketStatusTag = (status) => {
        switch (status) {
        case 'COMPLETED':
            return <Tag color="green">Completed</Tag>;
        case 'IN_PROGRESS':
            return <Tag color="blue">In Progress</Tag>;
        case 'PENDING':
        default:
            return <Tag color="orange">Pending</Tag>;
        }
    };

    const completionRate = stats.totalTickets > 0 
        ? Math.round((stats.completedTickets / stats.totalTickets) * 100) 
        : 0;

    return (
        <div>
        <Title level={2}>Mechanic Dashboard</Title>
        <Text type="secondary">Welcome to your dashboard. Here's an overview of your work.</Text>

        <Divider />

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} md={6}>
            <Card>
                <Statistic
                title="Total Service Tickets"
                value={stats.totalTickets}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
                loading={loading}
                />
            </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
            <Card>
                <Statistic
                title="Pending Tickets"
                value={stats.pendingTickets}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#fa8c16' }}
                loading={loading}
                />
            </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
            <Card>
                <Statistic
                title="Completed Tickets"
                value={stats.completedTickets}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
                loading={loading}
                />
            </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
            <Card>
                <Statistic
                title="Available Services"
                value={stats.services}
                prefix={<ToolOutlined />}
                valueStyle={{ color: '#722ed1' }}
                loading={loading}
                />
            </Card>
            </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} md={12}>
            <Card title="Work Progress">
                <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                    <Text strong>Completion Rate</Text>
                    <Progress 
                    percent={completionRate} 
                    status={completionRate > 80 ? 'success' : 'active'}
                    strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                    }}
                    />
                </div>
                <Row gutter={16}>
                    <Col span={12}>
                    <Statistic 
                        title="Pending" 
                        value={stats.pendingTickets} 
                        valueStyle={{ color: '#fa8c16', fontSize: '20px' }}
                    />
                    </Col>
                    <Col span={12}>
                    <Statistic 
                        title="Completed" 
                        value={stats.completedTickets} 
                        valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                    />
                    </Col>
                </Row>
                </Space>
            </Card>
            </Col>
            <Col xs={24} md={12}>
            <Card title="Quick Actions">
                <Row gutter={[16, 16]}>
                {quickActions.map((action, index) => (
                    <Col xs={24} sm={8} key={index}>
                    <Button
                        type="dashed"
                        size="large"
                        style={{
                        width: '100%',
                        height: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: action.color,
                        color: action.color
                        }}
                        onClick={action.onClick}
                    >
                        <Space direction="vertical" size="small">
                        <span style={{ fontSize: '24px' }}>{action.icon}</span>
                        <span style={{ fontSize: '12px', textAlign: 'center' }}>{action.title}</span>
                        </Space>
                    </Button>
                    </Col>
                ))}
                </Row>
            </Card>
            </Col>
        </Row>

        <Row>
            <Col span={24}>
            <Card 
                title="Recent Service Tickets" 
                extra={<Button type="link" icon={<EyeOutlined />} onClick={() => navigate('/service-tickets')}>View All</Button>}
            >
                <List
                dataSource={recentTickets}
                renderItem={(ticket) => (
                    <List.Item
                    actions={[
                        <Button 
                        type="link" 
                        onClick={() => navigate(`/service-tickets/${ticket.id}`)}
                        key="view"
                        >
                        View Details
                        </Button>
                    ]}
                    >
                    <List.Item.Meta
                        avatar={<FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                        title={
                        <Space>
                            <span>Ticket #{ticket.id}</span>
                            {getTicketStatusTag(ticket.status)}
                        </Space>
                        }
                        description={
                        <Space direction="vertical" size="small">
                            <Text>Customer: {ticket.customerName || 'N/A'}</Text>
                            <Text>Car: {ticket.carModel || 'N/A'}</Text>
                            <Text type="secondary">Created: {ticket.dateReceived || 'N/A'}</Text>
                        </Space>
                        }
                    />
                    {ticket.hours && (
                        <div style={{ textAlign: 'right' }}>
                        <Text strong>{ticket.hours} hours</Text>
                        </div>
                    )}
                    </List.Item>
                )}
                locale={{ emptyText: 'No service tickets found' }}
                />
            </Card>
            </Col>
        </Row>
        </div>
    );
};

export default MechanicDashboard;
