import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext }  from '../../context/GlobalContext';
import { getJobAssignmentsByWorkerId } from '../../calls/JobAssignmentCalls';

const { Title, Text } = Typography;

const MainPage = () => {
  const { workerId } = useAppContext();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [ongoingJobs, setOngoingJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobAssignments = async () => {
      try {
        const jobAssignments = await getJobAssignmentsByWorkerId(workerId);
        console.log('Job assignments:', jobAssignments);
        const applied = [];
        const ongoing = [];
        const completed = [];

        jobAssignments.forEach(assignment => {
          switch (assignment.job.status) {
            case 'Open':
              applied.push(assignment);
              break;
            case 'In progress':
              ongoing.push(assignment);
              break;
            case 'Completed':
              completed.push(assignment);
              break;
            default:
              break;
          }
        });

        setAppliedJobs(applied.slice(0, 3));
        setOngoingJobs(ongoing.slice(0, 3));
        setCompletedJobs(completed.slice(0, 3));
      } catch (error) {
        console.error('Error fetching job assignments:', error);
      }
    };

    if (workerId) {
      fetchJobAssignments();
    }
  }, [workerId]);

  const renderJobAssignment = (assignment) => (
    <div className="p-4 mb-4 bg-white shadow rounded-lg">
      {/* <Link to={`/labor/work-status/${assignment.job._id}`} className="text-blue-600 hover:underline">
        <Title level={4}>{assignment.job.name}</Title>
      </Link> */}
      <Text><strong>Job Type:</strong> {assignment.job.jobType}</Text><br />
      <Text><strong>Location:</strong> {assignment.job.location}</Text><br />
      <Text><strong>Pay Rate:</strong> {assignment.job.payRate}</Text>
    </div>
  );

  const renderCardContent = (jobs, title, viewAllLink) => (
    <Card title={title} bordered={false} className="shadow-lg rounded-lg">
      {jobs.length > 0 ? jobs.map(renderJobAssignment) : 
        <div className="flex justify-center items-center h-24">
          <Text>No {title.toLowerCase()} projects.</Text>
        </div>}
      {jobs.length > 0 && (
        // <Button type="link" style={{ background: 'blue', color: 'white' }} onClick={() => navigate(viewAllLink)} className="text-blue-600 hover:underline">
        <Button type="link" style={{ background: 'blue', color: 'white' }} onClick={() => "namastey"} className="text-blue-600 hover:underline">
          View All {title}
        </Button>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Title level={2} className="text-center">Job Assignments</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderCardContent(appliedJobs, 'Applied Projects', '/labor/applied')}
          {renderCardContent(ongoingJobs, 'Ongoing Projects', '/labor/ongoing')}
          {renderCardContent(completedJobs, 'Completed Projects', '/labor/completed')}
        </div>
        {/* <Button type="primary" onClick={() => navigate('/labor/work-selection')} className="block mx-auto mt-6"> */}
        <Button type="primary" onClick={() => "namastey"} className="block mx-auto mt-6">
          Apply for New Job
        </Button>
      </div>
    </div>
  );
};

export default MainPage;
