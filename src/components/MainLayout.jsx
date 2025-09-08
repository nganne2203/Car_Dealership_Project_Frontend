import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  Space,
  Button,
  theme
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  CarOutlined,
  FileTextOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  ToolOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const getMenuItems = () => {
    const commonItems = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => navigate('/dashboard')
      }
    ];

    switch (user?.role) {
      case 'SALESPERSON':
        return [
          ...commonItems,
          {
            key: 'customers',
            icon: <TeamOutlined />,
            label: 'Customers',
            onClick: () => navigate('/customers')
          },
          {
            key: 'cars',
            icon: <CarOutlined />,
            label: 'Cars',
            onClick: () => navigate('/cars')
          },
          {
            key: 'service-tickets',
            icon: <FileTextOutlined />,
            label: 'Service Tickets',
            onClick: () => navigate('/service-tickets')
          },
          {
            key: 'parts',
            icon: <SettingOutlined />,
            label: 'Parts',
            onClick: () => navigate('/parts')
          },
          {
            key: 'invoices',
            icon: <ShoppingCartOutlined />,
            label: 'Invoices',
            onClick: () => navigate('/invoices')
          },
          {
            key: 'reports',
            icon: <BarChartOutlined />,
            label: 'Reports',
            onClick: () => navigate('/reports')
          }
        ];

      case 'MECHANIC':
        return [
          ...commonItems,
          {
            key: 'service-tickets',
            icon: <FileTextOutlined />,
            label: 'Service Tickets',
            onClick: () => navigate('/service-tickets')
          },
          {
            key: 'services',
            icon: <ToolOutlined />,
            label: 'Services',
            onClick: () => navigate('/services')
          }
        ];

      case 'CUSTOMER':
        return [
          ...commonItems,
          {
            key: 'my-service-tickets',
            icon: <FileTextOutlined />,
            label: 'My Service Tickets',
            onClick: () => navigate('/my-service-tickets')
          },
          {
            key: 'my-invoices',
            icon: <ShoppingCartOutlined />,
            label: 'My Invoices',
            onClick: () => navigate('/my-invoices')
          },
          {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: 'Profile',
            onClick: () => navigate('/profile')
          }
        ];

      default:
        return commonItems;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {collapsed ? 'CDM' : 'Car Dealership'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={getMenuItems()}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: '24px'
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          
          <Space>
            <Title level={5} style={{ margin: 0, color: '#666' }}>
              Welcome, {user?.username}
            </Title>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Avatar 
                size="large" 
                icon={<UserOutlined />} 
                style={{ cursor: 'pointer' }}
              />
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
