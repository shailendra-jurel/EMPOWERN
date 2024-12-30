import { useEffect, useState, useCallback } from 'react';
import { Button, List, Typography, Card, Spin, Empty, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { getJobsByPostedById, deleteJob } from '../../calls/jobCalls';
import { jobService } from '../../calls/jobCalls';
import { setProjectId } from '../../store/appSlice';

const { Text, Title } = Typography;

const ProjectList = () => {
  const contractorId = useSelector((state) => state.app.contractorId);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

          const loadProjects = useCallback(async () => {
            try {
              const data = await jobService.getJobById(contractorId);  // it is saying getJobByPostedId   but i have to use getJobById
              setProjects(data);
            } catch (error) {
              console.error('Error loading projects:', error);
              message.error('Failed to load projects');
            } finally {
              setLoading(false);
            }
          }, [contractorId]);
  useEffect(() => {
    if (contractorId) {
      loadProjects();
    }
  }, [contractorId, loadProjects]);

  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const projectsData = await getJobsByPostedById(contractorId);
  //       setProjects(projectsData);
  //     } catch (error) {
  //       console.error('Error fetching jobs:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProjects();
  // }, [contractorId]);

  const handleDeleteProject = async (projectId) => {
    Modal.confirm({
      title: 'Delete Project',
      content: 'Are you sure you want to delete this project?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          await jobService.delete(projectId);    //deleteJobById
          message.success('Project deleted successfully');
          loadProjects();
        } catch (error) {
          console.error('Error deleting project:', error);
          message.error('Failed to delete project');
        }
      },
    });
  };

  const handleProjectClick = (index) => {
    dispatch(setProjectId(projects[index]._id));
    navigate(`/contractor/project-details`);
  };

  const handleAddProject = () => {
    navigate('/contractor/add-project-step2');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Title level={2} className="text-center mb-6">Your Projects</Title>
        {projects.length > 0 ? (
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={projects}
            renderItem={(project, index) => (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => handleProjectClick(index)}
                  className="shadow-md rounded-lg"
                >
                  <Title level={4}>{project.name}</Title>
                  <Text><strong>Job Type:</strong> {project.jobType}</Text><br />
                  <Text><strong>Location:</strong> {project.location}</Text><br />
                  <Text><strong>Pay Rate:</strong> ₹{project.payRate} per day</Text><br />
                  <Text><strong>Status:</strong> {project.status}</Text>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No projects found." />
        )}
        <div className="text-center mt-6">
          <Button type="primary" onClick={handleAddProject}>
            Add Project
          </Button>
          

          <Button type="primary" onClick={handleDeleteProject}> Delete Project </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;