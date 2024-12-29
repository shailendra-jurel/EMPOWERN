import React from 'react';
import { Button, Card, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ContractorMainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Title level={2} className="text-center mb-6">Contractor Dashboard</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card
              hoverable
              className="shadow-md rounded-lg"
              onClick={() => navigate('/contractor/project-list')}
            >
              <Title level={4}>View Projects</Title>
              <Text>Manage and view all your projects.</Text>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              hoverable
              className="shadow-md rounded-lg"
              onClick={() => navigate('/contractor/add-project-step2')}
            >
              <Title level={4}>Add New Project</Title>
              <Text>Create a new project and post job opportunities.</Text>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              hoverable
              className="shadow-md rounded-lg"
              onClick={() => navigate('/contractor/project-applications')}
            >
              <Title level={4}>View Applications</Title>
              <Text>Review and manage job applications.</Text>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              hoverable
              className="shadow-md rounded-lg"
              onClick={() => navigate('/contractor/employee-details')}
            >
              <Title level={4}>Employee Details</Title>
              <Text>View and manage employee details.</Text>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContractorMainPage;