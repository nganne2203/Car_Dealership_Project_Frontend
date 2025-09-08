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
  InputNumber,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  SettingOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { salespersonService } from '../../services/salespersonService';

const { Title } = Typography;
const { Search } = Input;

const Parts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      setLoading(true);
      const response = await salespersonService.getParts();
      setParts(response.data || []);
    } catch (error) {
      message.error('Failed to load parts');
      console.error('Error loading parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    if (!value.trim()) {
      loadParts();
      return;
    }

    try {
      setLoading(true);
      const response = await salespersonService.searchParts(value);
      setParts(response.data || []);
    } catch (error) {
      message.error('Failed to search parts');
      console.error('Error searching parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPart(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (part) => {
    setEditingPart(part);
    form.setFieldsValue(part);
    setModalVisible(true);
  };

  const handleDelete = async (partId) => {
    try {
      await salespersonService.deletePart(partId);
      message.success('Part deleted successfully');
      loadParts();
    } catch (error) {
      message.error('Failed to delete part');
      console.error('Error deleting part:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingPart) {
        await salespersonService.updatePart(editingPart.partID, values);
        message.success('Part updated successfully');
      } else {
        await salespersonService.createPart(values);
        message.success('Part created successfully');
      }
      setModalVisible(false);
      loadParts();
    } catch (error) {
      message.error(editingPart ? 'Failed to update part' : 'Failed to create part');
      console.error('Error saving part:', error);
    }
  };

  const columns = [
    {
      title: 'Part ID',
      dataIndex: 'partID',
      key: 'partID',
      width: 80,
    },
    {
      title: 'Part Name',
      dataIndex: 'partName',
      key: 'partName',
      render: (text) => (
        <Space>
          <SettingOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
      title: 'Stock Quantity',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      width: 120,
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
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
            title="Are you sure you want to delete this part?"
            onConfirm={() => handleDelete(record.partID)}
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
          <Title level={2}>Parts Management</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add Part
          </Button>
        </Col>
      </Row>

      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search parts by name"
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
          dataSource={parts}
          loading={loading}
          rowKey="partID"
          pagination={{
            total: parts.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} parts`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={editingPart ? 'Edit Part' : 'Add New Part'}
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
                name="partName"
                label="Part Name"
                rules={[
                  { required: true, message: 'Please enter part name!' },
                ]}
              >
                <Input
                  prefix={<SettingOutlined />}
                  placeholder="Enter part name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="supplier"
                label="Supplier"
                rules={[
                  { required: true, message: 'Please enter supplier!' },
                ]}
              >
                <Input placeholder="Enter supplier name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter part description"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
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
            <Col xs={24} sm={12}>
              <Form.Item
                name="stockQuantity"
                label="Stock Quantity"
                rules={[
                  { required: true, message: 'Please enter stock quantity!' },
                  { type: 'number', min: 0, message: 'Quantity must be positive!' }
                ]}
              >
                <InputNumber
                  placeholder="Enter stock quantity"
                  style={{ width: '100%' }}
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
                {editingPart ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Parts;
