import React, { useState, useEffect } from 'react';
import {
    Card,
    Tabs,
    Table,
    Spin,
    Alert,
    Typography,
    Row,
    Col,
    Statistic,
    Space,
    Button
} from 'antd';
import {
    BarChartOutlined,
    DollarOutlined,
    CarOutlined,
    ToolOutlined,
    UserOutlined,
    DownloadOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { salespersonService } from '../../services/salespersonService';

const { Title } = Typography;
const { TabPane } = Tabs;

const Reports = () => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('cars-sold');
    const [reportData, setReportData] = useState({
        carsSoldByYear: [],
        carSalesRevenue: [],
        bestSellingModels: [],
        bestUsedParts: [],
        topMechanics: []
    });

    useEffect(() => {
        loadReportData();
    }, []);

    const loadReportData = async () => {
        try {
        setLoading(true);
        const [
            carsSoldRes,
            revenueRes,
            bestModelsRes,
            bestPartsRes,
            topMechanicsRes
        ] = await Promise.all([
            salespersonService.getCarsSoldByYear(),
            salespersonService.getCarSalesRevenueByYear(),
            salespersonService.getBestSellingCarModels(),
            salespersonService.getBestUsedParts(),
            salespersonService.getTopMechanics()
        ]);

        setReportData({
            carsSoldByYear: carsSoldRes.data || [],
            carSalesRevenue: revenueRes.data || [],
            bestSellingModels: bestModelsRes.data || [],
            bestUsedParts: bestPartsRes.data || [],
            topMechanics: topMechanicsRes.data || []
        });
        } catch (error) {
        console.error('Error loading report data:', error);
        } finally {
        setLoading(false);
        }
    };

    const carsSoldColumns = [
        {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
        render: (year) => <strong>{year}</strong>
        },
        {
        title: 'Cars Sold',
        dataIndex: 'count',
        key: 'count',
        render: (count) => (
            <Space>
            <CarOutlined />
            {count}
            </Space>
        )
        }
    ];

    const revenueColumns = [
        {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
        render: (year) => <strong>{year}</strong>
        },
        {
        title: 'Revenue',
        dataIndex: 'revenue',
        key: 'revenue',
        render: (revenue) => (
            <Space>
            <DollarOutlined />
            ${revenue?.toLocaleString() || '0'}
            </Space>
        )
        }
    ];

    const bestModelsColumns = [
        {
        title: 'Rank',
        key: 'rank',
        render: (_, __, index) => index + 1
        },
        {
        title: 'Car Model',
        dataIndex: 'model',
        key: 'model',
        render: (model) => (
            <Space>
            <CarOutlined />
            {model}
            </Space>
        )
        },
        {
        title: 'Units Sold',
        dataIndex: 'soldCount',
        key: 'soldCount'
        },
        {
        title: 'Total Revenue',
        dataIndex: 'totalRevenue',
        key: 'totalRevenue',
        render: (revenue) => (
            <Space>
            <DollarOutlined />
            ${revenue?.toLocaleString() || '0'}
            </Space>
        )
        }
    ];

    const bestPartsColumns = [
        {
        title: 'Rank',
        key: 'rank',
        render: (_, __, index) => index + 1
        },
        {
        title: 'Part Name',
        dataIndex: 'partName',
        key: 'partName',
        render: (partName) => (
            <Space>
            <ToolOutlined />
            {partName}
            </Space>
        )
        },
        {
        title: 'Times Used',
        dataIndex: 'usageCount',
        key: 'usageCount'
        },
        {
        title: 'Total Cost',
        dataIndex: 'totalCost',
        key: 'totalCost',
        render: (cost) => (
            <Space>
            <DollarOutlined />
            ${cost?.toLocaleString() || '0'}
            </Space>
        )
        }
    ];

    const topMechanicsColumns = [
        {
        title: 'Rank',
        key: 'rank',
        render: (_, __, index) => index + 1
        },
        {
        title: 'Mechanic Name',
        dataIndex: 'mechanicName',
        key: 'mechanicName',
        render: (name) => (
            <Space>
            <UserOutlined />
            {name}
            </Space>
        )
        },
        {
        title: 'Repairs Assigned',
        dataIndex: 'repairCount',
        key: 'repairCount'
        },
        {
        title: 'Total Hours',
        dataIndex: 'totalHours',
        key: 'totalHours',
        render: (hours) => `${hours || 0} hrs`
        },
        {
        title: 'Average Rating',
        dataIndex: 'averageRating',
        key: 'averageRating',
        render: (rating) => `${rating || 0}/5`
        }
    ];

    const handleExport = () => {
        console.log('Export functionality to be implemented');
    };

    const tabItems = [
        {
        key: 'cars-sold',
        label: 'Cars Sold by Year',
        children: (
            <Card>
            <div style={{ marginBottom: 16 }}>
                <Title level={4}>Cars Sold Statistics by Year</Title>
                <p>Overview of car sales performance across different years.</p>
            </div>
            <Table
                columns={carsSoldColumns}
                dataSource={reportData.carsSoldByYear}
                loading={loading}
                rowKey="year"
                pagination={false}
                size="small"
            />
            </Card>
        )
        },
        {
        key: 'revenue',
        label: 'Sales Revenue',
        children: (
            <Card>
            <div style={{ marginBottom: 16 }}>
                <Title level={4}>Car Sales Revenue by Year</Title>
                <p>Financial performance and revenue trends over time.</p>
            </div>
            <Table
                columns={revenueColumns}
                dataSource={reportData.carSalesRevenue}
                loading={loading}
                rowKey="year"
                pagination={false}
                size="small"
            />
            </Card>
        )
        },
        {
        key: 'best-selling',
        label: 'Best Selling Models',
        children: (
            <Card>
            <div style={{ marginBottom: 16 }}>
                <Title level={4}>Best Selling Car Models</Title>
                <p>Top performing car models ranked by sales volume and revenue.</p>
            </div>
            <Table
                columns={bestModelsColumns}
                dataSource={reportData.bestSellingModels}
                loading={loading}
                rowKey="model"
                pagination={false}
                size="small"
            />
            </Card>
        )
        },
        {
        key: 'best-parts',
        label: 'Most Used Parts',
        children: (
            <Card>
            <div style={{ marginBottom: 16 }}>
                <Title level={4}>Most Used Parts in Services</Title>
                <p>Parts inventory analysis showing most frequently used components.</p>
            </div>
            <Table
                columns={bestPartsColumns}
                dataSource={reportData.bestUsedParts}
                loading={loading}
                rowKey="partName"
                pagination={false}
                size="small"
            />
            </Card>
        )
        },
        {
        key: 'top-mechanics',
        label: 'Top Mechanics',
        children: (
            <Card>
            <div style={{ marginBottom: 16 }}>
                <Title level={4}>Top 3 Mechanics by Workload</Title>
                <p>Mechanics ranked by number of repairs assigned and performance metrics.</p>
            </div>
            <Table
                columns={topMechanicsColumns}
                dataSource={reportData.topMechanics.slice(0, 3)}
                loading={loading}
                rowKey="mechanicName"
                pagination={false}
                size="small"
            />
            </Card>
        )
        }
    ];

    return (
        <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
            <Title level={2}>Reports & Analytics</Title>
            </Col>
            <Col>
            <Space>
                <Button
                icon={<ReloadOutlined />}
                onClick={loadReportData}
                loading={loading}
                >
                Refresh
                </Button>
                <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExport}
                >
                Export
                </Button>
            </Space>
            </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
            <Card>
                <Statistic
                title="Total Models Tracked"
                value={reportData.bestSellingModels.length}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#1890ff' }}
                />
            </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
            <Card>
                <Statistic
                title="Parts Analyzed"
                value={reportData.bestUsedParts.length}
                prefix={<ToolOutlined />}
                valueStyle={{ color: '#52c41a' }}
                />
            </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
            <Card>
                <Statistic
                title="Active Mechanics"
                value={reportData.topMechanics.length}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
                />
            </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
            <Card>
                <Statistic
                title="Years of Data"
                value={reportData.carsSoldByYear.length}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#fa8c16' }}
                />
            </Card>
            </Col>
        </Row>

        {loading ? (
            <Card>
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <Spin size="large" />
                <p style={{ marginTop: 16 }}>Loading report data...</p>
            </div>
            </Card>
        ) : (
            <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            tabPosition="top"
            size="large"
            />
        )}

        {!loading && reportData.carsSoldByYear.length === 0 && (
            <Alert
            message="No Data Available"
            description="No report data is currently available. Please check if there is any data in the system or contact your administrator."
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
            />
        )}
        </div>
    );
};

export default Reports;
