import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Descriptions, Button, Spin } from 'antd';
// import { useAppContext } from '../GlobalContext';

import { useSelector } from 'react-redux';
import { getJobAssignmentById } from '../../calls/JobAssignmentCalls';

const { Title } = Typography;

const EmployeeDetails = () => {
const  JobAssignmentId  =  useSelector((state) => state.app.JobAssignmentId);
const navigate = useNavigate();
const [jobAssignment, setJobAssignment] = useState(null);
const [loading, setLoading] = useState(true);

console.log('JobAssignmentId:', JobAssignmentId);

useEffect(() => {
const fetchJobAssignmentDetails = async () => {
    try {
    const assignment = await getJobAssignmentById(JobAssignmentId);
    setJobAssignment(assignment);
    } catch (error) {
    console.error('Error fetching job assignment details:', error);
    } finally {
    setLoading(false);
    }
};

if (JobAssignmentId) {
    fetchJobAssignmentDetails();
} else {
    setLoading(false);
}
}, [JobAssignmentId]);

if (loading) {
return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
    <Spin size="large" />
    </div>
);
}

if (!jobAssignment) {
return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
    <Card className="w-full max-w-md sm:max-w-2xl">
        <Title level={3} className="text-center">Job Assignment not found</Title>
        <Button 
        type="primary" 
        className="mt-4 w-full"
        onClick={() => navigate('/contractor/project-applications')}
        >
        Back to Applications
        </Button>
    </Card>
    </div>
);
}

const { worker, job, demandedWage, extracontact, additionalExpectations, assignmentDate } = jobAssignment;

return (
<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
    <Card className="w-full max-w-md sm:max-w-2xl">
    <Title level={3} className="text-center">Applicant Details</Title>
    <Descriptions bordered column={1} size="small" className="mt-4">
        <Descriptions.Item label="Name">{worker.userId.firstName} {worker.userId.lastName}</Descriptions.Item>
        <Descriptions.Item label="Mobile Number">{worker.userId.mobileNumber}</Descriptions.Item>
        <Descriptions.Item label="Location">{worker.userId.location}</Descriptions.Item>
        <Descriptions.Item label="Demanded Wage">{demandedWage}</Descriptions.Item>
        <Descriptions.Item label="Specialization">{job.skillsRequired}</Descriptions.Item>
        <Descriptions.Item label="Rating">{worker.rating || 'No rating'}</Descriptions.Item>
        <Descriptions.Item label="Job Type">{job.jobType}</Descriptions.Item>
        <Descriptions.Item label="Job Location">{job.location}</Descriptions.Item>
        <Descriptions.Item label="Pay Rate">{job.payRate}</Descriptions.Item>
        <Descriptions.Item label="Start Date">{new Date(job.startDate).toLocaleDateString()}</Descriptions.Item>
        <Descriptions.Item label="End Date">{new Date(job.endDate).toLocaleDateString()}</Descriptions.Item>
        <Descriptions.Item label="Accommodation">{job.accomodation ? 'Yes' : 'No'}</Descriptions.Item>
        <Descriptions.Item label="Transportation">{job.transportation ? 'Yes' : 'No'}</Descriptions.Item>
        <Descriptions.Item label="Extra Contact">{extracontact}</Descriptions.Item>
        <Descriptions.Item label="Additional Expectations">{additionalExpectations}</Descriptions.Item>
        <Descriptions.Item label="Assignment Date">{new Date(assignmentDate).toLocaleDateString()}</Descriptions.Item>
    </Descriptions>
    <Button 
        type="primary" 
        className="mt-4 w-full"
        onClick={() => navigate('/contractor/project-applications')}
    >
        Back to Applications
    </Button>
    </Card>
</div>
);
};

export default EmployeeDetails;
