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
    Avatar
} from 'antd';
import {
    FileTextOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    EyeOutlined,
    EditOutlined,
    DollarOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../../services/customerService';

const { Title, Text } = Typography;

const CustomerDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        serviceTickets: 0,
        invoices: 0,
        totalSpent: 0
    });
    const [recentServiceTickets, setRecentServiceTickets] = useState([]);
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [profile, setProfile] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
        setLoading(true);
        
        const [serviceTickets, invoices, profileData] = await Promise.all([
            customerService.getServiceTickets(),
            customerService.getInvoices(),
            customerService.getProfile()
        ]);

        const tickets = serviceTickets.data || [];
        const invoiceList = invoices.data || [];
        const totalSpent = invoiceList.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

        setStats({
            serviceTickets: tickets.length,
            invoices: invoiceList.length,
            totalSpent: totalSpent
        });

        setRecentServiceTickets(tickets.slice(0, 3));
        setRecentInvoices(invoiceList.slice(0, 3));
        setProfile(profileData.data || {});

        } catch (error) {
        console.error('Error loading dashboard data:', error);
        } finally {
        setLoading(false);
        }
    };

    const quickActions = [
        {
        title: 'View All Service Tickets',
        icon: <FileTextOutlined />,
        color: '#1890ff',
        onClick: () => navigate('/my-service-tickets')
        },
        {
        title: 'View All Invoices',
        icon: <ShoppingCartOutlined />,
        color: '#52c41a',
        onClick: () => navigate('/my-invoices')
        },
        {
        title: 'Update Profile',
        icon: <EditOutlined />,
        color: '#722ed1',
        onClick: () => navigate('/profile')
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

    const getInvoiceStatusTag = (status) => {
        switch (status) {
        case 'PAID':
            return <Tag color="green">Paid</Tag>;
        case 'PENDING':
        default:
            return <Tag color="orange">Pending</Tag>;
        }
    };

    return (
        <div>
        <Title level={2}>Customer Dashboard</Title>
        <Text type="secondary">Welcome back! Here's an overview of your services and invoices.</Text>

        <Divider />

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={24}>
            <Card title="Profile Summary">
                <Row align="middle">
                <Col span={4}>
                    <Avatar size={64} icon={<UserOutlined />} />
                </Col>
                <Col span={20}>
                    <Space direction="vertical">
                    <Title level={4} style={{ margin: 0 }}>
                        {profile.custName || 'Customer Name'}
                    </Title>
                    <Text type="secondary">Phone: {profile.phone || 'N/A'}</Text>
                    <Text type="secondary">Address: {profile.custAddress || 'N/A'}</Text>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={() => navigate('/profile')}
                    >
                        Update Profile
                    </Button>
                    </Space>
                </Col>
                </Row>
            </Card>
            </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={8}>
            <Card>
                <Statistic
                title="Service Tickets"
                value={stats.serviceTickets}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
                loading={loading}
                />
            </Card>
            </Col>
            <Col xs={24} sm={8}>
            <Card>
                <Statistic
                title="Total Invoices"
                value={stats.invoices}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#52c41a' }}
                loading={loading}
                />
            </Card>
            </Col>
            <Col xs={24} sm={8}>
            <Card>
                <Statistic
                title="Total Spent"
                value={stats.totalSpent}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#fa8c16' }}
                precision={2}
                loading={loading}
                />
            </Card>
            </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={24}>
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
                        <span style={{ textAlign: 'center' }}>{action.title}</span>
                        </Space>
                    </Button>
                    </Col>
                ))}
                </Row>
            </Card>
            </Col>
        </Row>

        <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
            <Card 
                title="Recent Service Tickets" 
                extra={<Button type="link" icon={<EyeOutlined />} onClick={() => navigate('/my-service-tickets')}>View All</Button>}
            >
                <List
                dataSource={recentServiceTickets}
                renderItem={(ticket) => (
                    <List.Item
                    actions={[
                        <Button 
                        type="link" 
                        onClick={() => navigate(`/my-service-tickets/${ticket.id}`)}
                        key="view"
                        >
                        View
                        </Button>
                    ]}
                    >
                    <List.Item.Meta
                        avatar={<FileTextOutlined style={{ fontSize: '16px', color: '#1890ff' }} />}
                        title={
                        <Space>
                            <span>Ticket #{ticket.id}</span>
                            {getTicketStatusTag(ticket.status)}
                        </Space>
                        }
                        description={
                        <Space direction="vertical" size="small">
                            <Text>Service: {ticket.serviceName || 'N/A'}</Text>
                            <Text type="secondary">
                            <CalendarOutlined /> {ticket.dateReceived || 'N/A'}
                            </Text>
                        </Space>
                        }
                    />
                    </List.Item>
                )}
                locale={{ emptyText: 'No service tickets found' }}
                />
            </Card>
            </Col>
            <Col xs={24} md={12}>
            <Card 
                title="Recent Invoices" 
                extra={<Button type="link" icon={<EyeOutlined />} onClick={() => navigate('/my-invoices')}>View All</Button>}
            >
                <List
                dataSource={recentInvoices}
                renderItem={(invoice) => (
                    <List.Item
                    actions={[
                        <Button 
                        type="link" 
                        onClick={() => navigate(`/my-invoices/${invoice.id}`)}
                        key="view"
                        >
                        View
                        </Button>
                    ]}
                    >
                    <List.Item.Meta
                        avatar={<ShoppingCartOutlined style={{ fontSize: '16px', color: '#52c41a' }} />}
                        title={
                        <Space>
                            <span>Invoice #{invoice.id}</span>
                            {getInvoiceStatusTag(invoice.status)}
                        </Space>
                        }
                        description={
                        <Space direction="vertical" size="small">
                            <Text strong>${invoice.totalAmount || 0}</Text>
                            <Text type="secondary">
                            <CalendarOutlined /> {invoice.invoiceDate || 'N/A'}
                            </Text>
                        </Space>
                        }
                    />
                    </List.Item>
                )}
                locale={{ emptyText: 'No invoices found' }}
                />
            </Card>
            </Col>
        </Row>
        </div>
    );
};

export default CustomerDashboard;
