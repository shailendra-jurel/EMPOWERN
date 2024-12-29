import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Space, Spin, Row, Col } from 'antd';
import { useSelector } from 'react-redux';

import { jobService } from '../../calls/jobCalls';

const { Title, Text } = Typography;

const ProjectDetails = () => {
  const projectId = useSelector((state) => state.app.projectId);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await jobService.getJobById(projectId);
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md sm:max-w-lg">
          <Title level={3} className="text-center">Project Not Found</Title>
          <Button 
            type="primary" 
            className="mt-6 w-full"
            onClick={() => navigate('/contractor/project-list')}
          >
            Back to Projects
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg rounded-lg">
          <Title level={3} className="text-center mb-6">{project.name}</Title>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card className="shadow-md rounded-lg">
                  <Text strong>Job Type:</Text> {project.jobType}
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="shadow-md rounded-lg">
                  <Text strong>Location:</Text> {project.location}
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="shadow-md rounded-lg">
                  <Text strong>Pay Rate:</Text> ₹{project.payRate} per day
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="shadow-md rounded-lg">
                  <Text strong>Skills Required:</Text> {project.skillsRequired}
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="shadow-md rounded-lg">
                  <Text strong>Workers Required:</Text> {project.workersRequired}
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="shadow-md rounded-lg">
                  <Text strong>Accommodation Provided:</Text> {project.accomodation ? 'Yes' : 'No'}
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="shadow-md rounded-lg">
                  <Text strong>Transportation Provided:</Text> {project.transportation ? 'Yes' : 'No'}
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="shadow-md rounded-lg">
                  <Text strong>Start Date:</Text> {new Date(project.startDate).toLocaleDateString()}
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="shadow-md rounded-lg">
                  <Text strong>End Date:</Text> {new Date(project.endDate).toLocaleDateString()}
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="shadow-md rounded-lg">
                  <Text strong>Status:</Text> {project.status}
                </Card>
              </Col>
            </Row>
            <Button 
              type="primary" 
              className="mt-6 w-full"
              onClick={() => navigate('/contractor/project-applications')}
            >
              View Employees
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default ProjectDetails;