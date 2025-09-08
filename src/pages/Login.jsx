import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Tabs,
    Typography,
    Space,
    Alert,
    Row,
    Col,
    Spin
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    PhoneOutlined,
    CarOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('staff');
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const from = location.state?.from?.pathname || '/dashboard';

    const handleStaffLogin = async (values) => {
        setLoading(true);
        setError('');
        
        try {
        await login(values, false);
        navigate(from, { replace: true });
        } catch (err) {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
        setLoading(false);
        }
    };

    const handleCustomerLogin = async (values) => {
        setLoading(true);
        setError('');
        
        try {
            await login({ name: values.name, phone: values.phone }, true);
            navigate(from, { replace: true });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.error || 
                                err.message || 
                                'Login failed. Please check your credentials.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
        }}>
        <Row justify="center" style={{ width: '100%' }}>
            <Col xs={24} sm={16} md={12} lg={8} xl={6}>
            <Card
                style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                borderRadius: '12px'
                }}
            >
                <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="large">
                <div>
                    <CarOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                    <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                    Car Dealership
                    </Title>
                    <Text type="secondary">Management System</Text>
                </div>

                {error && (
                    <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError('')}
                    />
                )}

                <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab}
                    centered
                    items={[
                    {
                        key: 'staff',
                        label: 'Staff Login',
                        children: (
                        <Form
                            name="staff-login"
                            onFinish={handleStaffLogin}
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: 'Please enter your username!' }
                            ]}
                            >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Username"
                                disabled={loading}
                            />
                            </Form.Item>

                            <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please enter your password!' }
                            ]}
                            >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Password"
                                disabled={loading}
                            />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%' }}
                                loading={loading}
                            >
                                {loading ? <Spin size="small" /> : 'Login'}
                            </Button>
                            </Form.Item>
                        </Form>
                        )
                    },
                    {
                        key: 'customer',
                        label: 'Customer Login',
                        children: (
                        <Form
                            name="customer-login"
                            onFinish={handleCustomerLogin}
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                            name="name"
                            rules={[
                                { required: true, message: 'Please enter your name!' }
                            ]}
                            >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Full Name"
                                disabled={loading}
                            />
                            </Form.Item>

                            <Form.Item
                            name="phone"
                            rules={[
                                { required: true, message: 'Please enter your phone number!' }
                            ]}
                            >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="Phone Number"
                                disabled={loading}
                            />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%' }}
                                loading={loading}
                            >
                                {loading ? <Spin size="small" /> : 'Login'}
                            </Button>
                            </Form.Item>
                        </Form>
                        )
                    }
                    ]}
                />

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Default Staff Accounts:<br />
                    Salesperson: salesperson / password123<br />
                    Mechanic: mechanic / password123<br /><br />
                    Customer Login:<br />
                    Name: John Customer<br />
                    Phone: 1234567890
                  </Text>
                </div>
              </Space>
            </Card>
            </Col>
        </Row>
        </div>
    );
};

export default Login;
