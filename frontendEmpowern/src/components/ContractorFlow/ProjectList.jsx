import { useEffect, useState, useCallback } from 'react';
import { Button, List, Typography, Card, Spin, Empty, Modal, message, Tag, Input, Select, Space, Tooltip, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { jobService } from '../../calls/jobCalls';
import { setProjectId } from '../../store/appSlice';

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProjectList = () => {
  const contractorId = useSelector((state) => state.app.contractorId);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobById(contractorId);
      setProjects(data);
      setFilteredProjects(data);
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

  // Filter and sort projects
  useEffect(() => {
    let result = [...projects];

    // Apply search filter
    if (searchText) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.location.toLowerCase().includes(searchText.toLowerCase()) ||
        project.jobType.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(project => project.status.toLowerCase() === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.startDate) - new Date(a.startDate);
        case 'oldest':
          return new Date(a.startDate) - new Date(b.startDate);
        case 'payHighToLow':
          return b.payRate - a.payRate;
        case 'payLowToHigh':
          return a.payRate - b.payRate;
        default:
          return 0;
      }
    });

    setFilteredProjects(result);
  }, [projects, searchText, statusFilter, sortBy]);

  const handleDeleteProject = async (projectId) => {
    Modal.confirm({
      title: 'Delete Project',
      content: 'Are you sure you want to delete this project? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await jobService.delete(projectId);
          message.success('Project deleted successfully');
          loadProjects();
        } catch (error) {
          console.error('Error deleting project:', error);
          message.error('Failed to delete project');
        }
      },
    });
  };

  const handleEditProject = (projectId) => {
    dispatch(setProjectId(projectId));
    navigate('/contractor/edit-project');
  };

  const handleViewProject = (projectId) => {
    dispatch(setProjectId(projectId));
    navigate('/contractor/project-details');
  };

  const handleViewApplications = (projectId) => {
    dispatch(setProjectId(projectId));
    navigate('/contractor/project-applications');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'green';
      case 'in progress':
        return 'blue';
      case 'completed':
        return 'grey';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const renderProjectCard = (project) => {
    const applicationsCount = project.applications?.length || 0;
    
    return (
      <Badge count={applicationsCount > 0 ? `${applicationsCount} applications` : 0} offset={[-30, 0]}>
        <Card
          className="shadow-md rounded-lg hover:shadow-lg transition-shadow"
          actions={[
            <Tooltip key= "view" title="View Details">
              <EyeOutlined key="view" onClick={() => handleViewProject(project._id)} />
            </Tooltip>,
            <Tooltip key="edit" title="Edit Project">
              <EditOutlined onClick={() => handleEditProject(project._id)} />
            </Tooltip>,
            <Tooltip key="applications" title="View Applications">
              <UserOutlined key="applications" onClick={() => handleViewApplications(project._id)} />
            </Tooltip>,
            <Tooltip key="delete" title="Delete Project">
              <DeleteOutlined key="delete" onClick={() => handleDeleteProject(project._id)} />
            </Tooltip>,
          ]}
        >
          <Card.Meta
            title={
              <Space>
                {project.name}
                <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
              </Space>
            }
            description={
              <Space direction="vertical" className="w-full">
                <Text><strong>Job Type:</strong> {project.jobType}</Text>
                <Text><strong>Location:</strong> {project.location}</Text>
                <Text><strong>Pay Rate:</strong> ₹{project.payRate} per day</Text>
                <Text><strong>Workers Required:</strong> {project.workersRequired}</Text>
                <Text><strong>Duration:</strong> {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</Text>
                <Space>
                  {project.accomodation && <Tag color="blue">Accommodation</Tag>}
                  {project.transportation && <Tag color="blue">Transportation</Tag>}
                </Space>
              </Space>
            }
          />
        </Card>
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Title level={2}>Your Projects</Title>
          <Button type="primary" onClick={() => navigate('/contractor/add-project-step2')}>
            Add New Project
          </Button>
        </div>

        <Card className="mb-6">
          <Space direction="vertical" className="w-full">
            <Space wrap className="w-full justify-between">
              <Search
                placeholder="Search projects..."
                allowClear
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Space>
                <Select
                  placeholder="Filter by status"
                  onChange={value => setStatusFilter(value)}
                  defaultValue="all"
                  style={{ width: 150 }}
                >
                  <Option value="all">All Status</Option>
                  <Option value="open">Open</Option>
                  <Option value="in progress">In Progress</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
                <Select
                  placeholder="Sort by"
                  onChange={value => setSortBy(value)}
                  defaultValue="newest"
                  style={{ width: 150 }}
                >
                  <Option value="newest">Newest First</Option>
                  <Option value="oldest">Oldest First</Option>
                  <Option value="payHighToLow">Pay: High to Low</Option>
                  <Option value="payLowToHigh">Pay: Low to High</Option>
                </Select>
              </Space>
            </Space>
          </Space>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : filteredProjects.length > 0 ? (
          <List
            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
            dataSource={filteredProjects}
            renderItem={renderProjectCard}
          />
        ) : (
          <Empty
            description={
              <Space direction="vertical" align="center">
                <Text>No projects found</Text>
                <Button type="primary" onClick={() => navigate('/contractor/add-project-step2')}>
                  Create Your First Project
                </Button>
              </Space>
            }
          />
        )}
      </div>
    </div>
  );
};

export default ProjectList;