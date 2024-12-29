import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Button, Typography, Spin, Avatar, Empty } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getJobAssignmentsByJobId } from '../../calls/JobAssignmentCalls';
import { setJobAssignId } from '../../store/appSlice';

const { Title, Text } = Typography;

const ProjectApplications = () => {
  const projectId = useSelector((state) => state.app.projectId);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsData = await getJobAssignmentsByJobId(projectId);
        setApplications(applicationsData || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [projectId]);

  const handleEmployeeView = (assignmentId) => {
    dispatch(setJobAssignId(assignmentId));
    navigate(`/contractor/employee-details`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <Spin size="large" />
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <Card className="w-full max-w-2xl">
          <Title level={3} className="text-center">No Applications Available</Title>
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
          <Title level={3} className="text-center mb-6">Number of People Applied</Title>
          <List
            itemLayout="horizontal"
            dataSource={applications}
            renderItem={(application) => (
              <List.Item
                key={application._id}
                className="cursor-pointer hover:bg-gray-50 transition duration-300"
                onClick={() => handleEmployeeView(application._id)}
              >
                <List.Item.Meta
                  avatar={<Avatar src={`/${application.worker.workerImage}`} />}
                  title={<Text strong>{application.worker.userId.firstName} {application.worker.userId.lastName}</Text>}
                  description={<Text>Demanded Wage: {application.demandedWage}</Text>}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default ProjectApplications;