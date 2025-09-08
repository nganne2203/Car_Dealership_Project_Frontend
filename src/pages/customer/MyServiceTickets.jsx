import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Modal,
    Typography,
    Row,
    Col,
    Tag,
    Descriptions,
    Rate
} from 'antd';
import {
    EyeOutlined,
    FileTextOutlined,
    CalendarOutlined,
    CarOutlined
} from '@ant-design/icons';
import { customerService } from '../../services/customerService';

const { Title } = Typography;

const MyServiceTickets = () => {
    const [serviceTickets, setServiceTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        loadServiceTickets();
    }, []);

    const loadServiceTickets = async () => {
        try {
        setLoading(true);
        const response = await customerService.getServiceTickets();
        setServiceTickets(response.data || []);
        } catch (error) {
        console.error('Error loading service tickets:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleView = async (ticket) => {
        try {
        const response = await customerService.getServiceTicket(ticket.ticketID);
        setSelectedTicket(response.data);
        setViewModalVisible(true);
        } catch (error) {
        console.error('Error loading service ticket details:', error);
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
        title: 'Service',
        dataIndex: 'serviceName',
        key: 'serviceName',
        render: (text) => (
            <Space>
            <FileTextOutlined />
            {text || 'N/A'}
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
        title: 'Rating',
        dataIndex: 'rate',
        key: 'rate',
        render: (rate) => rate ? <Rate disabled value={rate} /> : 'N/A',
        },
        {
        title: 'Actions',
        key: 'actions',
        width: 100,
        render: (_, record) => (
            <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            >
            View
            </Button>
        ),
        },
    ];

    return (
        <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
            <Title level={2}>My Service Tickets</Title>
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
                <Descriptions.Item label="Service" span={1}>
                {selectedTicket.serviceName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Car" span={1}>
                {selectedTicket.carModel || `Car ID: ${selectedTicket.carID}`}
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
                <Descriptions.Item label="Service Rating" span={1}>
                {selectedTicket.rate ? <Rate disabled value={selectedTicket.rate} /> : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Mechanic Comments" span={2}>
                {selectedTicket.comment || 'No comments yet'}
                </Descriptions.Item>
                {selectedTicket.completedDate && (
                <Descriptions.Item label="Completed Date" span={1}>
                    {selectedTicket.completedDate}
                </Descriptions.Item>
                )}
                {selectedTicket.totalCost && (
                <Descriptions.Item label="Total Cost" span={1}>
                    ${selectedTicket.totalCost.toLocaleString()}
                </Descriptions.Item>
                )}
            </Descriptions>
            )}
        </Modal>
        </div>
    );
};

export default MyServiceTickets;
