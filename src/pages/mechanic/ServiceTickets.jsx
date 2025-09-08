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
    Input,
    DatePicker,
    Tag,
    Descriptions,
    InputNumber,
    Rate
} from 'antd';
import {
    EyeOutlined,
    EditOutlined,
    SearchOutlined,
    FileTextOutlined,
    CalendarOutlined,
    UserOutlined,
    CarOutlined
} from '@ant-design/icons';
import { mechanicService } from '../../services/mechanicService';

const { Title } = Typography;
const { TextArea } = Input;

const MechanicServiceTickets = () => {
    const [serviceTickets, setServiceTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [searchForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    useEffect(() => {
        loadServiceTickets();
    }, []);

    const loadServiceTickets = async () => {
        try {
        setLoading(true);
        const response = await mechanicService.getServiceTickets();
        setServiceTickets(response.data || []);
        } catch (error) {
        message.error('Failed to load service tickets');
        console.error('Error loading service tickets:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleSearch = async (values) => {
        try {
        setLoading(true);
        const searchParams = {};
        if (values.custID) searchParams.custID = values.custID;
        if (values.carID) searchParams.carID = values.carID;
        if (values.dateReceived) searchParams.dateReceived = values.dateReceived.format('YYYY-MM-DD');

        const response = await mechanicService.searchServiceTickets(searchParams);
        setServiceTickets(response.data || []);
        } catch (error) {
        message.error('Failed to search service tickets');
        console.error('Error searching service tickets:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleClearSearch = () => {
        searchForm.resetFields();
        loadServiceTickets();
    };

    const handleView = (ticket) => {
        setSelectedTicket(ticket);
        setViewModalVisible(true);
    };

    const handleEdit = (ticket) => {
        setSelectedTicket(ticket);
        updateForm.setFieldsValue({
        hours: ticket.hours,
        comment: ticket.comment,
        rate: ticket.rate
        });
        setEditModalVisible(true);
    };

    const handleUpdateWork = async (values) => {
        try {
        await mechanicService.updateServiceTicketWork(selectedTicket.ticketID, values);
        message.success('Service ticket updated successfully');
        setEditModalVisible(false);
        loadServiceTickets();
        } catch (error) {
        message.error('Failed to update service ticket');
        console.error('Error updating service ticket:', error);
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

    const getPriorityTag = (priority) => {
        switch (priority) {
        case 'URGENT':
            return <Tag color="red">Urgent</Tag>;
        case 'HIGH':
            return <Tag color="orange">High</Tag>;
        case 'MEDIUM':
            return <Tag color="blue">Medium</Tag>;
        case 'LOW':
        default:
            return <Tag color="green">Low</Tag>;
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
            {text || `ID: ${record.custID}`}
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
            {text || `ID: ${record.carID}`}
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
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        render: (priority) => getPriorityTag(priority),
        },
        {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => getStatusTag(status),
        },
        {
        title: 'Hours',
        dataIndex: 'hours',
        key: 'hours',
        width: 80,
        render: (hours) => hours || 'N/A',
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
                icon={<EyeOutlined />}
                onClick={() => handleView(record)}
            >
                View
            </Button>
            <Button
                type="default"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
            >
                Update
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
        </Row>

        <Card style={{ marginBottom: 16 }}>
            <Form
            form={searchForm}
            layout="inline"
            onFinish={handleSearch}
            >
            <Form.Item name="custID" label="Customer ID">
                <Input placeholder="Enter customer ID" />
            </Form.Item>
            <Form.Item name="carID" label="Car ID">
                <Input placeholder="Enter car ID" />
            </Form.Item>
            <Form.Item name="dateReceived" label="Date Received">
                <DatePicker />
            </Form.Item>
            <Form.Item>
                <Space>
                <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                >
                    Search
                </Button>
                <Button onClick={handleClearSearch}>
                    Clear
                </Button>
                </Space>
            </Form.Item>
            </Form>
        </Card>

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
            scroll={{ x: 1000 }}
            />
        </Card>

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
                {getPriorityTag(selectedTicket.priority)}
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={2}>
                {selectedTicket.description || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Hours Worked" span={1}>
                {selectedTicket.hours || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Rating" span={1}>
                {selectedTicket.rate ? <Rate disabled value={selectedTicket.rate} /> : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Mechanic Comments" span={2}>
                {selectedTicket.comment || 'N/A'}
                </Descriptions.Item>
            </Descriptions>
            )}
        </Modal>

        <Modal
            title="Update Work Progress"
            open={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            footer={null}
            width={500}
        >
            <Form
            form={updateForm}
            layout="vertical"
            onFinish={handleUpdateWork}
            style={{ marginTop: 16 }}
            >
            <Form.Item
                name="hours"
                label="Hours Worked"
                rules={[
                { required: true, message: 'Please enter hours worked!' },
                { type: 'number', min: 0, message: 'Hours must be positive!' }
                ]}
            >
                <InputNumber
                style={{ width: '100%' }}
                placeholder="Enter hours worked"
                step={0.5}
                min={0}
                />
            </Form.Item>

            <Form.Item
                name="comment"
                label="Comments"
                rules={[{ required: true, message: 'Please enter comments!' }]}
            >
                <TextArea
                rows={4}
                placeholder="Enter work comments and details"
                />
            </Form.Item>

            <Form.Item
                name="rate"
                label="Service Rating"
                rules={[{ required: true, message: 'Please provide a rating!' }]}
            >
                <Rate />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                <Button onClick={() => setEditModalVisible(false)}>
                    Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                    Update
                </Button>
                </Space>
            </Form.Item>
            </Form>
        </Modal>
        </div>
    );
};

export default MechanicServiceTickets;
