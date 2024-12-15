import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, Row, Col, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../../calls/jobCalls';
import { useAppContext } from '../GlobalContext';

const { Title, Text } = Typography;

const WorkSelectionPage = () => {
  const [availableWorks, setAvailableWorks] = useState([]);
  const { setProjectId } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableWorks = async () => {
      try {
        const jobs = await getJobs();
        const openJobs = jobs.filter(job => job.status === 'Open'); // Filter jobs with status 'Open'
        setAvailableWorks(openJobs);
      } catch (error) {
        console.error('Error fetching available works:', error);
      }
    };
    fetchAvailableWorks();
  }, []);

  const handleJobClick = (jobId) => {
    setProjectId(jobId);
    navigate('/labor/work-information');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Row justify="center" className="mb-8">
        <h1>Available Work Opportunities</h1>
      </Row>
      <Row justify="center" gutter={[16, 16]}>
        {availableWorks.map(work => (
          <Col key={work._id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              bordered={false}
              className="bg-white shadow-lg rounded-lg"
              style={{ borderRadius: '15px', height: '100%' }}
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
                    More
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
