import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Typography, Button,Spin,message,Modal,Tooltip, Empty, Dropdown,Menu } from 'antd';
import { 
  PlusOutlined, 
  ReloadOutlined, 
  FilterOutlined, 
  EllipsisOutlined 
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getJobAssignmentsByWorkerId } from '../../calls/JobAssignmentCalls';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

// Ant Design Typography components
const { Title, Text, Paragraph } = Typography;

/**
 * MainPage Component: A dashboard for workers to manage their job assignments.
 * 
 * Features:
 * - Fetches job assignments categorized into Applied, Ongoing, and Completed.
 * - Allows sorting and filtering of job listings.
 * - Displays jobs with hover effects, contextual menus, and a responsive layout.
 */
const MainPage = () => {
  // Fetch the worker ID from the global Redux store
  const { workerId } = useSelector((state) => state.app.workerId);

  const navigate = useNavigate(); // Navigation hook for routing

  // State to store categorized job data
  const [jobData, setJobData] = useState({
    applied: [],  // Jobs that the worker has applied for
    ongoing: [],  // Jobs that are currently in progress
    completed: [] // Jobs that are finished
  });

  // State for loading indicator and error messages
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filtering options (e.g., sorting by date or pay rate)
  const [filterOptions, setFilterOptions] = useState({
    sortBy: 'date', // Default sorting criteria
    orderBy: 'desc'  // Default sorting order (descending)
  });

  // useRef to track component mount status and prevent updates if unmounted
  const isMounted = useRef(true);
  const previousWorkerId = useRef(workerId); // Stores previous worker ID to detect changes

  /**
   * Fetch job assignments for the worker from the server.
   * - Categorizes jobs into Applied, Ongoing, and Completed.
   * - Handles errors and loading states.
   */
  const fetchJobAssignments = useCallback(async () => {
    if (!workerId) return;

    setIsLoading(true); // Show loading spinner
    setError(null); // Reset error state

    try {
      // API call to fetch job assignments for the current worker
      const jobAssignments = await getJobAssignmentsByWorkerId(workerId);

      if (!isMounted.current) return;

      // Categorize jobs into Applied, Ongoing, and Completed based on their status
      const categorizedJobs = jobAssignments.reduce((acc, assignment) => {
        switch (assignment.job.status) {
          case 'Open':
            acc.applied.push(assignment);
            break;
          case 'In progress':
            acc.ongoing.push(assignment);
            break;
          case 'Completed':
            acc.completed.push(assignment);
            break;
          default:
            break;
        }
        return acc;
      }, { applied: [], ongoing: [], completed: [] });

      // Sort and limit the number of jobs displayed
      const sortJobs = (jobs) => jobs
        .sort((a, b) => {
          // Sorting based on selected filter options
          switch (filterOptions.sortBy) {
            case 'payRate':
              return filterOptions.orderBy === 'asc' 
                ? a.job.payRate - b.job.payRate
                : b.job.payRate - a.job.payRate;
            default: // date
              return filterOptions.orderBy === 'asc' 
                ? new Date(a.job.createdAt) - new Date(b.job.createdAt)
                : new Date(b.job.createdAt) - new Date(a.job.createdAt);
          }
        })
        .slice(0, 5); // Show up to 5 jobs per category

      // Update job data state with sorted jobs
      setJobData({
        applied: sortJobs(categorizedJobs.applied),
        ongoing: sortJobs(categorizedJobs.ongoing),
        completed: sortJobs(categorizedJobs.completed)
      });
    } catch (error) {
      if (isMounted.current) {
        // Display error message if the API call fails
        const errorMessage = error.response?.data?.message || 'Network error occurred';
        setError(errorMessage);
        message.error(errorMessage, 3); // Show error notification
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false); // Hide loading spinner
      }
    }
  }, [workerId, filterOptions]);

  // Debounce the refresh action to avoid excessive API calls
  const debouncedRefresh = useCallback(
    debounce(() => fetchJobAssignments(), 300),
    [fetchJobAssignments]
  );

  // Effect to fetch job data whenever the worker ID or filter options change
  useEffect(() => {
    if (workerId !== previousWorkerId.current) {
      fetchJobAssignments();
      previousWorkerId.current = workerId; // Update the previous worker ID
    }

    // Cleanup function to mark component as unmounted
    return () => {
      isMounted.current = false;
    };
  }, [workerId, fetchJobAssignments]);

  /**
   * Render a single job assignment card with details and actions.
   * - Includes job name, type, location, and pay rate.
   * - Provides contextual actions via a dropdown menu.
   */
  const renderJobAssignment = useCallback((assignment) => {
    const jobMenu = (
      <Menu>
        <Menu.Item key="1">View Details</Menu.Item>
        <Menu.Item key="2">Contact Employer</Menu.Item>
      </Menu>
    );

    return (
      <Card
        key={assignment.job._id}
        hoverable
        extra={
          <Dropdown overlay={jobMenu} trigger={['click']}>
            <EllipsisOutlined />
          </Dropdown>
        }
        className="mb-4 transition-all duration-300 hover:shadow-lg"
      >
        <Card.Meta 
          title={assignment.job.name} // Job name
          description={
            <>
              <Paragraph ellipsis={{ rows: 2 }}>
                <Text strong>Job Type:</Text> {assignment.job.jobType}
              </Paragraph>
              <div className="flex justify-between">
                <Text type="secondary">
                  <Text strong>Location:</Text> {assignment.job.location}
                </Text>
                <Text type="success">
                  <Text strong>Pay:</Text> ${assignment.job.payRate}/hr
                </Text>
              </div>
            </>
          }
        />
      </Card>
    );
  }, []);

  /**
   * Render a category card (Applied, Ongoing, or Completed) with jobs.
   * - Includes sorting and filtering options.
   * - Displays jobs or an empty state if no jobs are available.
   */
  const renderCardContent = useCallback(({ jobs, title, viewAllLink }) => {
    const filterMenu = (
      <Menu>
        <Menu.Item key="date" onClick={() => setFilterOptions({ sortBy: 'date', orderBy: 'desc' })}>
          Sort by Date (Recent)
        </Menu.Item>
        <Menu.Item key="payRate" onClick={() => setFilterOptions({ sortBy: 'payRate', orderBy: 'desc' })}>
          Sort by Pay Rate (High to Low)
        </Menu.Item>
      </Menu>
    );

    return (
      <Card 
        title={
          <div className="flex justify-between items-center">
            {title} {/* Category title */}
            <Dropdown overlay={filterMenu} trigger={['click']}>
              <Tooltip title="Filter & Sort">
                <FilterOutlined className="cursor-pointer" />
              </Tooltip>
            </Dropdown>
          </div>
        }
        extra={
          <Button 
            type="link" 
            size="small"
            onClick={() => "View All"} // TODO: Implement navigation to full list
          >
            View All
          </Button>
        }
        className="shadow-md hover:shadow-xl transition-shadow duration-300"
        loading={isLoading}
      >
        {jobs.length > 0 ? (
          <>
            {jobs.map(renderJobAssignment)} {/* Render each job */}
            {jobs.length === 5 && (
              <Text type="secondary" className="text-center block mt-2">
                Showing top 5 jobs. Click 'View All' for more.
              </Text>
            )}
          </>
        ) : (
          <Empty 
            description={`No ${title.toLowerCase()} projects`} 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        )}
      </Card>
    );
  }, [isLoading, renderJobAssignment]);

  // Render error screen if there is an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="text-center p-8 shadow-xl">
          <Title level={4} type="danger">Oh Snap! Something went wrong</Title>
          <Paragraph>{error}</Paragraph>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={debouncedRefresh}
          >
            Retry Fetching
          </Button>
        </Card>
      </div>
    );
  }

  // Main dashboard UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <Title level={2} className="mb-0">Job Assignment Dashboard</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={() => navigate('/labor/work-selection')}
          >
            Apply for New Job
          </Button>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderCardContent({
            jobs: jobData.applied,
            title: 'Applied Projects',
            viewAllLink: '/labor/applied'
          })}
          {renderCardContent({
            jobs: jobData.ongoing,
            title: 'Ongoing Projects',
            viewAllLink: '/labor/ongoing'
          })}
          {renderCardContent({
            jobs: jobData.completed,
            title: 'Completed Projects',
            viewAllLink: '/labor/completed'
          })}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
