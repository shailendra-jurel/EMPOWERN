import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, Row, Col, Space, Select, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../../calls/jobCalls';
import {useSelctor}  from 'react-redux';

const { Title, Text } = Typography;
const { Option } = Select;

const WorkSelectionPage = () => {
const [availableWorks, setAvailableWorks] = useState([]);
const [filteredWorks, setFilteredWorks] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [sortCriteria, setSortCriteria] = useState('date'); // Default sorting by date
const { setProjectId } = useSelctor((state) => stateapp.)
const navigate = useNavigate();

useEffect(() => {
const fetchAvailableWorks = async () => {
    try {
    const jobs = await getJobs();
    const openJobs = jobs.filter(job => job.status === 'Open');
    setAvailableWorks(openJobs);
    setFilteredWorks(openJobs);
    } catch (err) {
    setError('Failed to load available works. Please try again later.');
    } finally {
    setLoading(false);
    }
};
fetchAvailableWorks();
}, []);

const handleJobClick = (jobId) => {
setProjectId(jobId);
navigate('/labor/work-information');
};

const handleSortChange = (value) => {
setSortCriteria(value);
let sortedWorks = [...filteredWorks];
if (value === 'payRate') {
    sortedWorks.sort((a, b) => b.payRate - a.payRate);
} else if (value === 'location') {
    sortedWorks.sort((a, b) => a.location.localeCompare(b.location));
} else {
    sortedWorks.sort((a, b) => new Date(b.date) - new Date(a.date));
}
setFilteredWorks(sortedWorks);
};

if (loading) return <Spin className="w-full flex justify-center items-center h-screen" size="large" />;
if (error) return <Alert message={error} type="error" showIcon className="m-4" />;

return (
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="mb-8 text-center">
    <Title level={2} className="text-primary">Available Work Opportunities</Title>
    <Select
        value={sortCriteria}
        onChange={handleSortChange}
        className="w-40"
        placeholder="Sort by"
    >
        <Option value="date">Date</Option>
        <Option value="payRate">Pay Rate</Option>
        <Option value="location">Location</Option>
    </Select>
    </div>

    <Row gutter={[16, 16]} justify="center">
    {filteredWorks.map(work => (
        <Col key={work._id} xs={24} sm={12} md={8} lg={6}>
        <Card
            hoverable
            bordered={false}
            className="bg-white shadow-md rounded-lg h-full"
            bodyStyle={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
                <Title level={4} style={{ marginBottom: '10px' }}>{work.name}</Title>
                <Text><strong>Job Type:</strong> {work.jobType}</Text><br />
                <Text><strong>Location:</strong> {work.location}</Text><br />
                <Text><strong>Pay Rate:</strong> ₹{work.payRate} per day</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                type="primary"
                size="small"
                onClick={() => handleJobClick(work._id)}
                >
                View Details
                </Button>
            </div>
            </Space>
        </Card>
        </Col>
    ))}
    </Row>
</div>
);
};

export default WorkSelectionPage;
