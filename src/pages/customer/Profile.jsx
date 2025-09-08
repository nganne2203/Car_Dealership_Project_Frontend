import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    message,
    Typography,
    Row,
    Col,
    Select,
    Divider,
    Space,
    Avatar
} from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    HomeOutlined,
    EditOutlined,
    SaveOutlined
} from '@ant-design/icons';
import { customerService } from '../../services/customerService';

const { Title } = Typography;

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const loadProfileData = async () => {
        try {
            setLoading(true);
            const response = await customerService.getProfile();
            const profileData = response.data || {};
            setProfile(profileData);
            form.setFieldsValue(profileData);
        } catch (error) {
            message.error('Failed to load profile');
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
        };
        
        loadProfileData();
    }, [form]);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        form.setFieldsValue(profile);
    };

    const handleSubmit = async (values) => {
        try {
        setLoading(true);
        await customerService.updateProfile(values);
        message.success('Profile updated successfully');
        setProfile(values);
        setEditing(false);
        } catch (error) {
        message.error('Failed to update profile');
        console.error('Error updating profile:', error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div>
        <Row justify="center">
            <Col xs={24} md={16} lg={12}>
            <Card
                title={
                <Space>
                    <Avatar size={64} icon={<UserOutlined />} />
                    <div>
                    <Title level={3} style={{ margin: 0 }}>
                        My Profile
                    </Title>
                    <p style={{ margin: 0, color: '#666' }}>
                        Manage your personal information
                    </p>
                    </div>
                </Space>
                }
                extra={
                !editing && (
                    <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    >
                    Edit Profile
                    </Button>
                )
                }
                loading={loading}
            >
                <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={!editing}
                >
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                    <Form.Item
                        name="custName"
                        label="Full Name"
                        rules={[
                        { required: true, message: 'Please enter your full name!' },
                        { min: 2, message: 'Name must be at least 2 characters!' }
                        ]}
                    >
                        <Input
                        prefix={<UserOutlined />}
                        placeholder="Enter your full name"
                        />
                    </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                        { required: true, message: 'Please enter your phone number!' },
                        { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number!' }
                        ]}
                    >
                        <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Enter your phone number"
                        />
                    </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                    <Form.Item
                        name="sex"
                        label="Gender"
                        rules={[{ required: true, message: 'Please select your gender!' }]}
                    >
                        <Select placeholder="Select gender">
                        <Select.Option value="M">Male</Select.Option>
                        <Select.Option value="F">Female</Select.Option>
                        </Select>
                    </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                        { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                        placeholder="Enter your email address"
                        />
                    </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="custAddress"
                    label="Address"
                    rules={[{ required: true, message: 'Please enter your address!' }]}
                >
                    <Input.TextArea
                    rows={3}
                    placeholder="Enter your full address"
                    />
                </Form.Item>

                <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                >
                    <Input
                    type="date"
                    placeholder="Select your date of birth"
                    />
                </Form.Item>

                <Form.Item
                    name="emergencyContact"
                    label="Emergency Contact"
                >
                    <Input
                    placeholder="Enter emergency contact information"
                    />
                </Form.Item>

                {editing && (
                    <>
                    <Divider />
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                        >
                            Save Changes
                        </Button>
                        </Space>
                    </Form.Item>
                    </>
                )}
                </Form>

                {!editing && (
                <>
                    <Divider />
                    <div style={{ textAlign: 'center', color: '#666' }}>
                    <p>Click "Edit Profile" to update your information</p>
                    </div>
                </>
                )}
            </Card>
            </Col>
        </Row>
        </div>
    );
};

export default Profile;
