import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Select,
  InputNumber,
  message,
  Typography,
  Row,
  Col,
  Tag,
  Descriptions,
  Divider,
  Input
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { salespersonService } from '../../services/salespersonService';

const { Title } = Typography;

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invoicesRes, customersRes, carsRes] = await Promise.all([
        salespersonService.getInvoices(),
        salespersonService.getCustomers(),
        salespersonService.getCars()
      ]);
      
      setInvoices(invoicesRes.data || []);
      setCustomers(customersRes.data || []);
      setCars(carsRes.data || []);
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

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setViewModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      await salespersonService.createInvoice(values);
      message.success('Invoice created successfully');
      setModalVisible(false);
      loadData();
    } catch (error) {
      message.error('Failed to create invoice');
      console.error('Error creating invoice:', error);
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
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          {text || record.custName || 'N/A'}
        </Space>
      ),
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (date) => (
        <Space>
          <CalendarOutlined />
          {date ? new Date(date).toLocaleDateString() : 'N/A'}
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
          ${amount?.toLocaleString() || '0'}
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
      width: 120,
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
          <Title level={2}>Invoice Management</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Create Invoice
          </Button>
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
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title="Create New Invoice"
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
                rules={[
                  { required: true, message: 'Please select a customer!' },
                ]}
              >
                <Select
                  placeholder="Select customer"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                label="Car (Optional)"
              >
                <Select
                  placeholder="Select car"
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {cars.map(car => (
                    <Select.Option key={car.carID} value={car.carID}>
                      {car.model} - {car.year} ({car.serialNumber})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="totalAmount"
                label="Total Amount"
                rules={[
                  { required: true, message: 'Please enter total amount!' },
                  { type: 'number', min: 0, message: 'Amount must be positive!' }
                ]}
              >
                <InputNumber
                  placeholder="Enter total amount"
                  style={{ width: '100%' }}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="PENDING"
                rules={[{ required: true, message: 'Please select status!' }]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="PENDING">Pending</Select.Option>
                  <Select.Option value="PAID">Paid</Select.Option>
                  <Select.Option value="OVERDUE">Overdue</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter invoice description"
            />
          </Form.Item>

          <Divider />

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create Invoice
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Invoice Modal */}
      <Modal
        title="Invoice Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedInvoice && (
          <div style={{ marginTop: 16 }}>
            <Descriptions
              title="Invoice Information"
              bordered
              column={2}
              size="small"
            >
              <Descriptions.Item label="Invoice ID">
                <Space>
                  <FileTextOutlined />
                  {selectedInvoice.invoiceID}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(selectedInvoice.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                <Space>
                  <UserOutlined />
                  {selectedInvoice.customerName || selectedInvoice.custName || 'N/A'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Invoice Date">
                <Space>
                  <CalendarOutlined />
                  {selectedInvoice.invoiceDate ? 
                    new Date(selectedInvoice.invoiceDate).toLocaleDateString() : 
                    'N/A'
                  }
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount" span={2}>
                <Space>
                  <DollarOutlined />
                  <strong>${selectedInvoice.totalAmount?.toLocaleString() || '0'}</strong>
                </Space>
              </Descriptions.Item>
              {selectedInvoice.description && (
                <Descriptions.Item label="Description" span={2}>
                  {selectedInvoice.description}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Invoices;
