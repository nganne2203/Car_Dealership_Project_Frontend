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
    Divider
} from 'antd';
import {
    TeamOutlined,
    CarOutlined,
    FileTextOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    BarChartOutlined,
    PlusOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { salespersonService } from '../../services/salespersonService';

const { Title, Text } = Typography;

const SalespersonDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        customers: 0,
        cars: 0,
        serviceTickets: 0,
        parts: 0,
        invoices: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
        setLoading(true);
        
        const [customers, cars, serviceTickets, parts, invoices] = await Promise.all([
            salespersonService.getCustomers(),
            salespersonService.getCars(),
            salespersonService.getServiceTickets(),
            salespersonService.getParts(),
            salespersonService.getInvoices()
        ]);

        setStats({
            customers: customers.data?.length || 0,
            cars: cars.data?.length || 0,
            serviceTickets: serviceTickets.data?.length || 0,
            parts: parts.data?.length || 0,
            invoices: invoices.data?.length || 0
        });

        setRecentActivities([
            { id: 1, type: 'customer', action: 'Created new customer', time: '2 hours ago' },
            { id: 2, type: 'car', action: 'Added new car to inventory', time: '4 hours ago' },
            { id: 3, type: 'invoice', action: 'Generated invoice #INV-001', time: '1 day ago' },
            { id: 4, type: 'service', action: 'Created service ticket #ST-001', time: '2 days ago' }
        ]);

        } catch (error) {
        console.error('Error loading dashboard data:', error);
        } finally {
        setLoading(false);
        }
    };

    const quickActions = [
        {
        title: 'Add Customer',
        icon: <TeamOutlined />,
        color: '#52c41a',
        onClick: () => navigate('/customers?action=create')
        },
        {
        title: 'Add Car',
        icon: <CarOutlined />,
        color: '#1890ff',
        onClick: () => navigate('/cars?action=create')
        },
        {
        title: 'Create Service Ticket',
        icon: <FileTextOutlined />,
        color: '#722ed1',
        onClick: () => navigate('/service-tickets?action=create')
        },
        {
        title: 'Generate Invoice',
        icon: <ShoppingCartOutlined />,
        color: '#fa8c16',
        onClick: () => navigate('/invoices?action=create')
        }
    ];

    const getActivityIcon = (type) => {
        switch (type) {
        case 'customer': return <TeamOutlined style={{ color: '#52c41a' }} />;
        case 'car': return <CarOutlined style={{ color: '#1890ff' }} />;
        case 'invoice': return <ShoppingCartOutlined style={{ color: '#fa8c16' }} />;
        case 'service': return <FileTextOutlined style={{ color: '#722ed1' }} />;
        default: return <FileTextOutlined />;
        }
    };

    return (
        <div>
        <Title level={2}>Salesperson Dashboard</Title>
        <Text type="secondary">Welcome to your dashboard. Here's an overview of your activities.</Text>

        <Divider />

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
                <Statistic
                title="Total Customers"
                value={stats.customers}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
                loading={loading}
                />
            </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
                <Statistic
                title="Cars in Inventory"
                value={stats.cars}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#1890ff' }}
                loading={loading}
                />
            </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
                <Statistic
                title="Service Tickets"
                value={stats.serviceTickets}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#722ed1' }}
                loading={loading}
                />
            </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
                <Statistic
                title="Parts Available"
                value={stats.parts}
                prefix={<SettingOutlined />}
                valueStyle={{ color: '#fa541c' }}
                loading={loading}
                />
            </Card>
            </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={24}>
            <Card title="Quick Actions" extra={<PlusOutlined />}>
                <Row gutter={[16, 16]}>
                {quickActions.map((action, index) => (
                    <Col xs={24} sm={12} md={6} key={index}>
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
                        <span>{action.title}</span>
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
                title="Recent Activities" 
                extra={<Button type="link" icon={<EyeOutlined />}>View All</Button>}
            >
                <List
                dataSource={recentActivities}
                renderItem={(item) => (
                    <List.Item>
                    <List.Item.Meta
                        avatar={getActivityIcon(item.type)}
                        title={item.action}
                        description={item.time}
                    />
                    <Tag color="blue">{item.type}</Tag>
                    </List.Item>
                )}
                />
            </Card>
            </Col>
            <Col xs={24} md={12}>
            <Card 
                title="Reports & Analytics" 
                extra={<Button type="link" icon={<BarChartOutlined />} onClick={() => navigate('/reports')}>View Reports</Button>}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                    type="ghost" 
                    style={{ width: '100%', textAlign: 'left' }}
                    onClick={() => navigate('/reports?tab=cars-sold')}
                >
                    Cars Sold by Year
                </Button>
                <Button 
                    type="ghost" 
                    style={{ width: '100%', textAlign: 'left' }}
                    onClick={() => navigate('/reports?tab=revenue')}
                >
                    Sales Revenue by Year
                </Button>
                <Button 
                    type="ghost" 
                    style={{ width: '100%', textAlign: 'left' }}
                    onClick={() => navigate('/reports?tab=best-selling')}
                >
                    Best Selling Car Models
                </Button>
                <Button 
                    type="ghost" 
                    style={{ width: '100%', textAlign: 'left' }}
                    onClick={() => navigate('/reports?tab=top-mechanics')}
                >
                    Top Mechanics
                </Button>
                </Space>
            </Card>
            </Col>
        </Row>
        </div>
    );
};

export default SalespersonDashboard;
