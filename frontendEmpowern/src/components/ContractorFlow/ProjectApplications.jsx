import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Button, Typography, Spin, Avatar } from 'antd';
// import { useAppContext } from '../GlobalContext';
import { useSelector , useDispatch } from 'react-redux';
import { getJobAssignmentsByJobId } from '../../calls/JobAssignmentCalls';
import { updateJob } from '../../calls/jobCalls';

import { setJobAssignId } from '../../store/appSlice';

const { Title, Text } = Typography;

const ProjectApplications = () => {
// const { projectId, setJobAssignId } = useAppContext();
const projectId  = useSelector((state) => state.app.projectId);

const [applications, setApplications] = useState([]);
const [projectStatus, setProjectStatus] = useState('');
const [loading, setLoading] = useState(true);
const navigate = useNavigate();
const dispatch = useDispatch();

useEffect(() => {
const fetchApplications = async () => {
    try {
    const applicationsData = await getJobAssignmentsByJobId(projectId);
    console.log('Applications Data:', applicationsData); // Debugging log
    setApplications(applicationsData || []);
    setProjectStatus(applicationsData[0]?.job.status || '');
    } catch (error) {
    console.error('Error fetching applications:', error);
    } finally {
    setLoading(false);
    }
};
fetchApplications();
}, [projectId]);

const handleStatusChange = async (newStatus) => {
setLoading(true);
try {
    await updateJob(projectId, { status: newStatus });
    setProjectStatus(newStatus);
} catch (error) {
    console.error('Error updating job status:', error);
} finally {
    setLoading(false);
}
};

if (loading) {
return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
    <Spin size="large" />
    </div>
);
}

if (!Array.isArray(applications) || applications.length === 0) {
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

const handleEmployeeView = (assignmentId) => {
console.log('Navigating to employee with ID:', assignmentId); // Debugging log

dispatch( setJobAssignId(assignmentId))


navigate(`/contractor/employee-details`);
};

return (
<div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
    <Card className="w-full max-w-2xl">
    <Title level={3} className="text-center">Number of People Applied</Title>
    <div className="space-y-4">
        <List
        itemLayout="horizontal"
        dataSource={applications}
        renderItem={(application) => (
            <List.Item
            key={application._id}
            className="cursor-pointer hover:bg-gray-50 transition duration-300"
            onClick={() => handleEmployeeView(application._id)}
            >
            {console.log('Application:', application)}
            {console.log('applicationID :', application._id)} 
            <List.Item.Meta
                avatar={<Avatar src={`/${application.worker.workerImage}`} />}
                title={<Text strong>{application.worker.userId.firstName} {application.worker.userId.lastName}</Text>}
                description={<Text>Demanded Wage: {application.demandedWage}</Text>}
            />
            </List.Item>
        )}
        />
    </div>
    {projectStatus === 'Open' && (
        <Button 
        type="primary" 
        className="mt-6 w-full"
        onClick={() => handleStatusChange('In progress')}
        >
        Start the Project
        </Button>
    )}
    {projectStatus === 'In progress' && (
        <Button 
        type="primary" 
        className="mt-6 w-full"
        onClick={() => handleStatusChange('Completed')}
        >
        Mark as Completed
        </Button>
    )}
    </Card>
</div>
);
};

export default ProjectApplications;
