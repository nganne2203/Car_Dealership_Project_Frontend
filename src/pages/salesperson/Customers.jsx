import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Input,
    Modal,
    Form,
    Select,
    message,
    Popconfirm,
    Typography,
    Row,
    Col,
    Divider
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    UserOutlined,
    PhoneOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { salespersonService } from '../../services/salespersonService';

const { Title } = Typography;
const { Search } = Input;

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
        setLoading(true);
        const response = await salespersonService.getCustomers();
        setCustomers(response.data || []);
        } catch (error) {
        message.error('Failed to load customers');
        console.error('Error loading customers:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleSearch = async (value) => {
        if (!value.trim()) {
        loadCustomers();
        return;
        }

        try {
        setLoading(true);
        const response = await salespersonService.searchCustomers(value);
        setCustomers(response.data || []);
        } catch (error) {
        message.error('Failed to search customers');
        console.error('Error searching customers:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCustomer(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        form.setFieldsValue(customer);
        setModalVisible(true);
    };

    const handleDelete = async (customerId) => {
        try {
        await salespersonService.deleteCustomer(customerId);
        message.success('Customer deleted successfully');
        loadCustomers();
        } catch (error) {
        message.error('Failed to delete customer');
        console.error('Error deleting customer:', error);
        }
    };

    const handleSubmit = async (values) => {
        try {
        if (editingCustomer) {
            await salespersonService.updateCustomer(editingCustomer.custID, values);
            message.success('Customer updated successfully');
        } else {
            await salespersonService.createCustomer(values);
            message.success('Customer created successfully');
        }
        setModalVisible(false);
        loadCustomers();
        } catch (error) {
        message.error(editingCustomer ? 'Failed to update customer' : 'Failed to create customer');
        console.error('Error saving customer:', error);
        }
    };

    const columns = [
        {
        title: 'Customer ID',
        dataIndex: 'custID',
        key: 'custID',
        width: 100,
        },
        {
        title: 'Name',
        dataIndex: 'custName',
        key: 'custName',
        render: (text) => (
            <Space>
            <UserOutlined />
            {text}
            </Space>
        ),
        },
        {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        render: (text) => (
            <Space>
            <PhoneOutlined />
            {text}
            </Space>
        ),
        },
        {
        title: 'Gender',
        dataIndex: 'sex',
        key: 'sex',
        width: 80,
        render: (sex) => sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : 'N/A',
        },
        {
        title: 'Address',
        dataIndex: 'custAddress',
        key: 'custAddress',
        render: (text) => (
            <Space>
            <HomeOutlined />
            {text || 'N/A'}
            </Space>
        ),
        },
        {
        title: 'Actions',
        key: 'actions',
        width: 150,
        render: (_, record) => (
            <Space>
            <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
            >
                Edit
            </Button>
            <Popconfirm
                title="Are you sure you want to delete this customer?"
                onConfirm={() => handleDelete(record.custID)}
                okText="Yes"
                cancelText="No"
            >
                <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                >
                Delete
                </Button>
            </Popconfirm>
            </Space>
        ),
        },
    ];

    return (
        <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
            <Title level={2}>Customer Management</Title>
            </Col>
            <Col>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
            >
                Add Customer
            </Button>
            </Col>
        </Row>

        <Card>
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={8}>
                <Search
                placeholder="Search customers by name"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                />
            </Col>
            </Row>

            <Table
            columns={columns}
            dataSource={customers}
            loading={loading}
            rowKey="custID"
            pagination={{
                total: customers.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} customers`,
            }}
            scroll={{ x: 800 }}
            />
        </Card>

        <Modal
            title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={600}
        >
            <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginTop: 16 }}
            >
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                <Form.Item
                    name="custName"
                    label="Customer Name"
                    rules={[
                    { required: true, message: 'Please enter customer name!' },
                    { min: 2, message: 'Name must be at least 2 characters!' }
                    ]}
                >
                    <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter customer name"
                    />
                </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                    { required: true, message: 'Please enter phone number!' },
                    { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number!' }
                    ]}
                >
                    <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Enter phone number"
                    />
                </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                <Form.Item
                    name="sex"
                    label="Gender"
                    rules={[{ required: true, message: 'Please select gender!' }]}
                >
                    <Select placeholder="Select gender">
                    <Select.Option value="M">Male</Select.Option>
                    <Select.Option value="F">Female</Select.Option>
                    </Select>
                </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                <Form.Item
                    name="custAddress"
                    label="Address"
                    rules={[{ required: true, message: 'Please enter address!' }]}
                >
                    <Input
                    prefix={<HomeOutlined />}
                    placeholder="Enter address"
                    />
                </Form.Item>
                </Col>
            </Row>

            <Divider />

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                <Button onClick={() => setModalVisible(false)}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                    {editingCustomer ? 'Update' : 'Create'}
                </Button>
                </Space>
            </Form.Item>
            </Form>
        </Modal>
        </div>
    );
};

export default Customers;
