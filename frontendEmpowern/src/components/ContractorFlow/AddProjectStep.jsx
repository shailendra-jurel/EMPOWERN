import React, { useEffect, useState } from 'react';
import { Button, List, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../calls/jobCalls';

import {useSelector }  from 'react-redux';

// import { useAppContext } from '../GlobalContext';

const { Text, Title } = Typography;

const ProjectList = () => {
// const { setProjectId, contractorId } = useAppContext();


const contractorId = useSelector((state) => state.user.id);

const [projects, setProjects] = useState([]);
const navigate = useNavigate();

useEffect(() => {
const fetchProjects = async () => {
    try {
    const projectsData = await jobService.getJobById(contractorId);
    setProjects(projectsData);
    } catch (error) {
    console.error('Error fetching jobs:', error);
    }
};

fetchProjects();
}, [contractorId]);

const handleProjectClick = (index) => {
setProjectId(projects[index]._id);
navigate(`/contractor/project-details`);
};

const handleAddProject = () => {
navigate('/contractor/add-project-step2');
};

return (
<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f0f2f5', padding: '24px' }}>
    <Card style={{ flex: 1, overflow: 'auto', borderRadius: '8px' }}>
    <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>Your Projects</Title>
    {projects.length > 0 ? (
        <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={projects}
        renderItem={(project, index) => (
            <List.Item>
            <Card
                hoverable
                onClick={() => handleProjectClick(index)}
                style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            >
                <Title level={4} style={{ color: '#1890ff' }}>{project.name}</Title>
                <div><Text strong>Job Type:</Text> {project.jobType}</div>
                <div><Text strong>Location:</Text> {project.location}</div>
                <div><Text strong>Pay Rate:</Text> ₹{project.payRate}</div>
                <Text
                style={{
                    backgroundColor: project.status === 'In progress' ? '#faad14' : project.status === 'Open' ? '#1890ff' : '#52c41a',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    marginTop: '12px',
                    display: 'inline-block',
                }}
                >
                {project.status}
                </Text>
            </Card>
            </List.Item>
        )}
        />
    ) : (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>No projects found.</div>
    )}
    </Card>
    <div style={{ padding: '16px', backgroundColor: '#fff', borderTop: '1px solid #e8e8e8', borderRadius: '8px', marginTop: '24px' }}>
    <Button
        type="primary"
        style={{ width: '100%' }}
        onClick={handleAddProject}
    >
        Add Project
    </Button>
    </div>
</div>
);
};

export default ProjectList;
