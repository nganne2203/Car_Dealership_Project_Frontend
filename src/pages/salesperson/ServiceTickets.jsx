import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Modal,
    Form,
    message,
    Typography,
    Row,
    Col,
    Select,
    Input,
    DatePicker,
    Tag,
    Descriptions
} from 'antd';
import {
    PlusOutlined,
    EyeOutlined,
    FileTextOutlined,
    CalendarOutlined,
    UserOutlined,
    CarOutlined
} from '@ant-design/icons';
import { salespersonService } from '../../services/salespersonService';

const { Title } = Typography;
const { TextArea } = Input;

const ServiceTickets = () => {
    const [serviceTickets, setServiceTickets] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
        setLoading(true);
        const [ticketsResponse, customersResponse, carsResponse] = await Promise.all([
            salespersonService.getServiceTickets(),
            salespersonService.getCustomers(),
            salespersonService.getCars()
        ]);
        
        setServiceTickets(ticketsResponse.data || []);
        setCustomers(customersResponse.data || []);
        setCars(carsResponse.data || []);
        } catch (error) {
        message.error('Failed to load data');
        console.error('Error loading data:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleCreate = () => {
        form.resetFields();
        setModalVisible(true);
    };

    const handleView = (ticket) => {
        setSelectedTicket(ticket);
        setViewModalVisible(true);
    };

    const handleSubmit = async (values) => {
        try {
        const submitData = {
            ...values,
            dateReceived: values.dateReceived?.format('YYYY-MM-DD')
        };
        
        await salespersonService.createServiceTicket(submitData);
        message.success('Service ticket created successfully');
        setModalVisible(false);
        loadData();
        } catch (error) {
        message.error('Failed to create service ticket');
        console.error('Error creating service ticket:', error);
        }
    };

    const getStatusTag = (status) => {
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

    const columns = [
        {
        title: 'Ticket ID',
        dataIndex: 'ticketID',
        key: 'ticketID',
        width: 100,
        },
        {
        title: 'Customer',
        dataIndex: 'customerName',
        key: 'customerName',
        render: (text, record) => (
            <Space>
            <UserOutlined />
            {text || `Customer ID: ${record.custID}`}
            </Space>
        ),
        },
        {
        title: 'Car',
        dataIndex: 'carModel',
        key: 'carModel',
        render: (text, record) => (
            <Space>
            <CarOutlined />
            {text || `Car ID: ${record.carID}`}
            </Space>
        ),
        },
        {
        title: 'Date Received',
        dataIndex: 'dateReceived',
        key: 'dateReceived',
        render: (text) => (
            <Space>
            <CalendarOutlined />
            {text || 'N/A'}
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
        width: 100,
        render: (_, record) => (
            <Space>
            <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleView(record)}
            >
                View
            </Button>
            </Space>
        ),
        },
    ];

    return (
        <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
            <Title level={2}>Service Tickets</Title>
            </Col>
            <Col>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
            >
                Create Service Ticket
            </Button>
            </Col>
        </Row>

        <Card>
            <Table
            columns={columns}
            dataSource={serviceTickets}
            loading={loading}
            rowKey="ticketID"
            pagination={{
                total: serviceTickets.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} service tickets`,
            }}
            scroll={{ x: 800 }}
            />
        </Card>

        <Modal
            title="Create Service Ticket"
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
                    name="custID"
                    label="Customer"
                    rules={[{ required: true, message: 'Please select a customer!' }]}
                >
                    <Select
                    placeholder="Select customer"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
                    {customers.map(customer => (
                        <Select.Option key={customer.custID} value={customer.custID}>
                        {customer.custName} - {customer.phone}
                        </Select.Option>
                    ))}
                    </Select>
                </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                <Form.Item
                    name="carID"
                    label="Car"
                    rules={[{ required: true, message: 'Please select a car!' }]}
                >
                    <Select
                    placeholder="Select car"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    >
                    {cars.map(car => (
                        <Select.Option key={car.carID} value={car.carID}>
                        {car.model} ({car.year}) - {car.serialNumber}
                        </Select.Option>
                    ))}
                    </Select>
                </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                <Form.Item
                    name="dateReceived"
                    label="Date Received"
                    rules={[{ required: true, message: 'Please select date!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                <Form.Item
                    name="priority"
                    label="Priority"
                    rules={[{ required: true, message: 'Please select priority!' }]}
                >
                    <Select placeholder="Select priority">
                    <Select.Option value="LOW">Low</Select.Option>
                    <Select.Option value="MEDIUM">Medium</Select.Option>
                    <Select.Option value="HIGH">High</Select.Option>
                    <Select.Option value="URGENT">Urgent</Select.Option>
                    </Select>
                </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter description!' }]}
            >
                <TextArea
                rows={4}
                placeholder="Enter service description"
                />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                <Button onClick={() => setModalVisible(false)}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                    Create
                </Button>
                </Space>
            </Form.Item>
            </Form>
        </Modal>

        <Modal
            title="Service Ticket Details"
            open={viewModalVisible}
            onCancel={() => setViewModalVisible(false)}
            footer={
            <Button type="primary" onClick={() => setViewModalVisible(false)}>
                Close
            </Button>
            }
            width={700}
        >
            {selectedTicket && (
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Ticket ID" span={1}>
                {selectedTicket.ticketID}
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={1}>
                {getStatusTag(selectedTicket.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Customer" span={1}>
                {selectedTicket.customerName || `ID: ${selectedTicket.custID}`}
                </Descriptions.Item>
                <Descriptions.Item label="Car" span={1}>
                {selectedTicket.carModel || `ID: ${selectedTicket.carID}`}
                </Descriptions.Item>
                <Descriptions.Item label="Date Received" span={1}>
                {selectedTicket.dateReceived || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Priority" span={1}>
                {selectedTicket.priority || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={2}>
                {selectedTicket.description || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Hours Worked" span={1}>
                {selectedTicket.hours || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Mechanic Comments" span={1}>
                {selectedTicket.comment || 'N/A'}
                </Descriptions.Item>
            </Descriptions>
            )}
        </Modal>
        </div>
    );
};

export default ServiceTickets;
