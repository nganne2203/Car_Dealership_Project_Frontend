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
    Descriptions
} from 'antd';
import {
    EyeOutlined,
    ShoppingCartOutlined,
    CalendarOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { customerService } from '../../services/customerService';

const { Title } = Typography;

const MyInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
        setLoading(true);
        const response = await customerService.getInvoices();
        setInvoices(response.data || []);
        } catch (error) {
        console.error('Error loading invoices:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleView = async (invoice) => {
        try {
        const response = await customerService.getInvoice(invoice.invoiceID);
        setSelectedInvoice(response.data);
        setViewModalVisible(true);
        } catch (error) {
        console.error('Error loading invoice details:', error);
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
        case 'PAID':
            return <Tag color="green">Paid</Tag>;
        case 'PENDING':
            return <Tag color="orange">Pending</Tag>;
        case 'OVERDUE':
            return <Tag color="red">Overdue</Tag>;
        default:
            return <Tag color="blue">{status || 'Unknown'}</Tag>;
        }
    };

    const columns = [
        {
        title: 'Invoice ID',
        dataIndex: 'invoiceID',
        key: 'invoiceID',
        width: 100,
        },
        {
        title: 'Invoice Date',
        dataIndex: 'invoiceDate',
        key: 'invoiceDate',
        render: (text) => (
            <Space>
            <CalendarOutlined />
            {text || 'N/A'}
            </Space>
        ),
        },
        {
        title: 'Due Date',
        dataIndex: 'dueDate',
        key: 'dueDate',
        render: (text) => (
            <Space>
            <CalendarOutlined />
            {text || 'N/A'}
            </Space>
        ),
        },
        {
        title: 'Total Amount',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        render: (amount) => (
            <Space>
            <DollarOutlined />
            ${amount?.toLocaleString() || 'N/A'}
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
            <Title level={2}>My Invoices</Title>
            </Col>
        </Row>

        <Card>
            <Table
            columns={columns}
            dataSource={invoices}
            loading={loading}
            rowKey="invoiceID"
            pagination={{
                total: invoices.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} invoices`,
            }}
            scroll={{ x: 600 }}
            />
        </Card>

        <Modal
            title="Invoice Details"
            open={viewModalVisible}
            onCancel={() => setViewModalVisible(false)}
            footer={
            <Button type="primary" onClick={() => setViewModalVisible(false)}>
                Close
            </Button>
            }
            width={800}
        >
            {selectedInvoice && (
            <div>
                <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
                <Descriptions.Item label="Invoice ID" span={1}>
                    {selectedInvoice.invoiceID}
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={1}>
                    {getStatusTag(selectedInvoice.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Invoice Date" span={1}>
                    {selectedInvoice.invoiceDate || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Due Date" span={1}>
                    {selectedInvoice.dueDate || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Customer" span={1}>
                    {selectedInvoice.customerName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Car" span={1}>
                    {selectedInvoice.carModel || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Service Ticket" span={2}>
                    {selectedInvoice.serviceTicketID ? `Ticket #${selectedInvoice.serviceTicketID}` : 'N/A'}
                </Descriptions.Item>
                </Descriptions>

                {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                <Card title="Invoice Items" size="small" style={{ marginBottom: 16 }}>
                    <Table
                    size="small"
                    dataSource={selectedInvoice.items}
                    pagination={false}
                    columns={[
                        {
                        title: 'Description',
                        dataIndex: 'description',
                        key: 'description',
                        },
                        {
                        title: 'Quantity',
                        dataIndex: 'quantity',
                        key: 'quantity',
                        width: 100,
                        },
                        {
                        title: 'Unit Price',
                        dataIndex: 'unitPrice',
                        key: 'unitPrice',
                        width: 120,
                        render: (price) => `$${price?.toLocaleString() || '0'}`,
                        },
                        {
                        title: 'Total',
                        dataIndex: 'total',
                        key: 'total',
                        width: 120,
                        render: (total, record) => 
                            `$${((record.quantity || 0) * (record.unitPrice || 0)).toLocaleString()}`,
                        },
                    ]}
                    />
                </Card>
                )}

                <Card size="small">
                <Row justify="end">
                    <Col span={8}>
                    <Descriptions column={1}>
                        <Descriptions.Item label="Subtotal">
                        ${selectedInvoice.subtotal?.toLocaleString() || selectedInvoice.totalAmount?.toLocaleString() || '0'}
                        </Descriptions.Item>
                        {selectedInvoice.tax && (
                        <Descriptions.Item label="Tax">
                            ${selectedInvoice.tax.toLocaleString()}
                        </Descriptions.Item>
                        )}
                        {selectedInvoice.discount && (
                        <Descriptions.Item label="Discount">
                            -${selectedInvoice.discount.toLocaleString()}
                        </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Total Amount">
                        <strong>${selectedInvoice.totalAmount?.toLocaleString() || '0'}</strong>
                        </Descriptions.Item>
                    </Descriptions>
                    </Col>
                </Row>
                </Card>

                {selectedInvoice.notes && (
                <Card title="Notes" size="small" style={{ marginTop: 16 }}>
                    <p>{selectedInvoice.notes}</p>
                </Card>
                )}
            </div>
            )}
        </Modal>
        </div>
    );
};

export default MyInvoices;
