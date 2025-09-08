import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Input,
    Modal,
    Form,
    message,
    Popconfirm,
    Typography,
    Row,
    Col,
    Select,
    InputNumber,
    Tag
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    CarOutlined,
    CalendarOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { salespersonService } from '../../services/salespersonService';

const { Title } = Typography;
const { Search } = Input;

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [searchParams, setSearchParams] = useState({});
    const [form] = Form.useForm();

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        try {
        setLoading(true);
        const response = await salespersonService.getCars();
        setCars(response.data || []);
        } catch (error) {
        message.error('Failed to load cars');
        console.error('Error loading cars:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
        setLoading(true);
        const response = await salespersonService.searchCars(searchParams);
        setCars(response.data || []);
        } catch (error) {
        message.error('Failed to search cars');
        console.error('Error searching cars:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchParams({});
        loadCars();
    };

    const handleCreate = () => {
        setEditingCar(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (car) => {
        setEditingCar(car);
        form.setFieldsValue(car);
        setModalVisible(true);
    };

    const handleDelete = async (carId) => {
        try {
        await salespersonService.deleteCar(carId);
        message.success('Car deleted successfully');
        loadCars();
        } catch (error) {
        message.error('Failed to delete car');
        console.error('Error deleting car:', error);
        }
    };

    const handleSubmit = async (values) => {
        try {
        if (editingCar) {
            await salespersonService.updateCar(editingCar.carID, values);
            message.success('Car updated successfully');
        } else {
            await salespersonService.createCar(values);
            message.success('Car created successfully');
        }
        setModalVisible(false);
        loadCars();
        } catch (error) {
        message.error(editingCar ? 'Failed to update car' : 'Failed to create car');
        console.error('Error saving car:', error);
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
        case 'AVAILABLE':
            return <Tag color="green">Available</Tag>;
        case 'SOLD':
            return <Tag color="red">Sold</Tag>;
        case 'RESERVED':
            return <Tag color="orange">Reserved</Tag>;
        default:
            return <Tag color="blue">{status || 'Unknown'}</Tag>;
        }
    };

    const columns = [
        {
        title: 'Car ID',
        dataIndex: 'carID',
        key: 'carID',
        width: 80,
        },
        {
        title: 'Serial Number',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        render: (text) => (
            <Space>
            <CarOutlined />
            {text}
            </Space>
        ),
        },
        {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
        },
        {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
        width: 80,
        render: (text) => (
            <Space>
            <CalendarOutlined />
            {text}
            </Space>
        ),
        },
        {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (price) => (
            <Space>
            <DollarOutlined />
            ${price?.toLocaleString() || 'N/A'}
            </Space>
        ),
        },
        {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => getStatusTag(status),
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
                title="Are you sure you want to delete this car?"
                onConfirm={() => handleDelete(record.carID)}
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
            <Title level={2}>Car Management</Title>
            </Col>
            <Col>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
            >
                Add Car
            </Button>
            </Col>
        </Row>

        <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={8} md={6}>
                <label>Serial Number:</label>
                <Input
                placeholder="Search by serial number"
                value={searchParams.serialNumber}
                onChange={(e) => setSearchParams(prev => ({ ...prev, serialNumber: e.target.value }))}
                />
            </Col>
            <Col xs={24} sm={8} md={6}>
                <label>Model:</label>
                <Input
                placeholder="Search by model"
                value={searchParams.model}
                onChange={(e) => setSearchParams(prev => ({ ...prev, model: e.target.value }))}
                />
            </Col>
            <Col xs={24} sm={8} md={6}>
                <label>Year:</label>
                <InputNumber
                placeholder="Search by year"
                style={{ width: '100%' }}
                value={searchParams.year}
                onChange={(value) => setSearchParams(prev => ({ ...prev, year: value }))}
                />
            </Col>
            <Col xs={24} sm={24} md={6}>
                <Space>
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                >
                    Search
                </Button>
                <Button onClick={handleClearSearch}>
                    Clear
                </Button>
                </Space>
            </Col>
            </Row>
        </Card>

        <Card>
            <Table
            columns={columns}
            dataSource={cars}
            loading={loading}
            rowKey="carID"
            pagination={{
                total: cars.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} cars`,
            }}
            scroll={{ x: 800 }}
            />
        </Card>

        <Modal
            title={editingCar ? 'Edit Car' : 'Add New Car'}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={700}
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
                    name="serialNumber"
                    label="Serial Number"
                    rules={[
                    { required: true, message: 'Please enter serial number!' },
                    ]}
                >
                    <Input placeholder="Enter serial number" />
                </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                <Form.Item
                    name="model"
                    label="Model"
                    rules={[
                    { required: true, message: 'Please enter car model!' },
                    ]}
                >
                    <Input placeholder="Enter car model" />
                </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={8}>
                <Form.Item
                    name="year"
                    label="Year"
                    rules={[
                    { required: true, message: 'Please enter year!' },
                    { type: 'number', min: 1900, max: new Date().getFullYear() + 1, message: 'Please enter a valid year!' }
                    ]}
                >
                    <InputNumber
                    placeholder="Enter year"
                    style={{ width: '100%' }}
                    />
                </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                    { required: true, message: 'Please enter price!' },
                    { type: 'number', min: 0, message: 'Price must be positive!' }
                    ]}
                >
                    <InputNumber
                    placeholder="Enter price"
                    style={{ width: '100%' }}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select status!' }]}
                >
                    <Select placeholder="Select status">
                    <Select.Option value="AVAILABLE">Available</Select.Option>
                    <Select.Option value="SOLD">Sold</Select.Option>
                    <Select.Option value="RESERVED">Reserved</Select.Option>
                    </Select>
                </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                <Form.Item
                    name="color"
                    label="Color"
                >
                    <Input placeholder="Enter car color" />
                </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                <Form.Item
                    name="engineType"
                    label="Engine Type"
                >
                    <Input placeholder="Enter engine type" />
                </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="description"
                label="Description"
            >
                <Input.TextArea
                rows={3}
                placeholder="Enter car description"
                />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                <Button onClick={() => setModalVisible(false)}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                    {editingCar ? 'Update' : 'Create'}
                </Button>
                </Space>
            </Form.Item>
            </Form>
        </Modal>
        </div>
    );
};

export default Cars;
