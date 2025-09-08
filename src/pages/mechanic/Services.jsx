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
  Tag,
  Descriptions
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { mechanicService } from '../../services/mechanicService';

const { Title } = Typography;
const { TextArea } = Input;

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await mechanicService.getServices();
      setServices(response.data || []);
    } catch (error) {
      message.error('Failed to load services');
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingService(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    form.setFieldsValue(service);
    setModalVisible(true);
  };

  const handleView = (service) => {
    setSelectedService(service);
    setViewModalVisible(true);
  };

  const handleDelete = async (serviceId) => {
    try {
      await mechanicService.deleteService(serviceId);
      message.success('Service deleted successfully');
      loadServices();
    } catch (error) {
      message.error('Failed to delete service');
      console.error('Error deleting service:', error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingService) {
        await mechanicService.updateService(editingService.serviceID, values);
        message.success('Service updated successfully');
      } else {
        await mechanicService.createService(values);
        message.success('Service created successfully');
      }
      setModalVisible(false);
      loadServices();
    } catch (error) {
      message.error(editingService ? 'Failed to update service' : 'Failed to create service');
      console.error('Error saving service:', error);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Tag color="green">Active</Tag>;
      case 'INACTIVE':
        return <Tag color="red">Inactive</Tag>;
      default:
        return <Tag color="blue">{status || 'Unknown'}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Service ID',
      dataIndex: 'serviceID',
      key: 'serviceID',
      width: 100,
    },
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      key: 'serviceName',
      render: (text) => (
        <Space>
          <ToolOutlined />
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
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost) => `$${cost?.toLocaleString() || 'N/A'}`,
    },
    {
      title: 'Duration (hours)',
      dataIndex: 'estimatedHours',
      key: 'estimatedHours',
      width: 120,
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
      width: 200,
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
            Edit
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.serviceID)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>Services Management</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add Service
          </Button>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={services}
          loading={loading}
          rowKey="serviceID"
          pagination={{
            total: services.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} services`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={editingService ? 'Edit Service' : 'Add New Service'}
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
                name="serviceName"
                label="Service Name"
                rules={[
                  { required: true, message: 'Please enter service name!' },
                ]}
              >
                <Input placeholder="Enter service name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="cost"
                label="Cost ($)"
                rules={[
                  { required: true, message: 'Please enter cost!' },
                  { type: 'number', min: 0, message: 'Cost must be positive!' }
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter service cost"
                  step="0.01"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="estimatedHours"
                label="Estimated Hours"
                rules={[
                  { required: true, message: 'Please enter estimated hours!' },
                  { type: 'number', min: 0, message: 'Hours must be positive!' }
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter estimated hours"
                  step="0.5"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status!' }]}
              >
                <Input placeholder="Enter status (e.g., ACTIVE, INACTIVE)" />
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
                {editingService ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Service Modal */}
      <Modal
        title="Service Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={
          <Button type="primary" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>
        }
        width={600}
      >
        {selectedService && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Service ID" span={1}>
              {selectedService.serviceID}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={1}>
              {getStatusTag(selectedService.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Service Name" span={2}>
              {selectedService.serviceName}
            </Descriptions.Item>
            <Descriptions.Item label="Cost" span={1}>
              ${selectedService.cost?.toLocaleString() || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Estimated Hours" span={1}>
              {selectedService.estimatedHours || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {selectedService.description || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Services;
