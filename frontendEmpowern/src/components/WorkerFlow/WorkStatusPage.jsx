// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, Button, Typography, Descriptions, message, Spin } from 'antd';
// import { useAppContext } from '../GlobalContext';
// import { getJobById } from '../../calls/jobCalls';
// import { deleteJobAssignment } from '../../calls/JobAssignmentCalls';

// const { Title } = Typography;

// const WorkStatusPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { projectId, JobAssignmentId } = useAppContext();
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const projectData = await getJobById(projectId);
//         setProject(projectData);
//       } catch (error) {
//         console.error('Error fetching project:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (projectId) {
//       fetchProject();
//     }
//   }, [projectId]);

//   const handleDelete = async () => {
//     setLoading(true);
//     try {
//       await deleteJobAssignment(JobAssignmentId);
//       message.success('Job assignment deleted successfully!');
//       navigate('/labor/main'); // Navigate to applied projects after deletion
//     } catch (error) {
//       message.error('Error deleting job assignment:', error);
//       console.error('Error deleting job assignment:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
//         <Card className="w-full max-w-md sm:max-w-2xl" bordered={false}>
//           <Title level={2} className="text-center">No details available</Title>
//           <Button 
//             type="primary" 
//             className="mt-6 w-full" 
//             onClick={() => navigate('/labor/main')}
//           >
//             Back to Main
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
//       <Card className="w-full max-w-md sm:max-w-2xl" bordered={false}>
//         <Title level={2} className="text-center mb-4 text-red-600">Work Status</Title>
//         <Descriptions title={project.name} bordered column={1} size="middle">
//           <Descriptions.Item label="Status">{project.status}</Descriptions.Item>
//           <Descriptions.Item label="Job Type">{project.jobType}</Descriptions.Item>
//           <Descriptions.Item label="Location">{project.location}</Descriptions.Item>
//           <Descriptions.Item label="Pay Rate">₹{project.payRate} per day</Descriptions.Item>
//           <Descriptions.Item label="Start Date">{new Date(project.startDate).toLocaleDateString()}</Descriptions.Item>
//           <Descriptions.Item label="End Date">{new Date(project.endDate).toLocaleDateString()}</Descriptions.Item>
//           <Descriptions.Item label="Skills Required">{project.skillsRequired}</Descriptions.Item>
//           <Descriptions.Item label="Workers Required">{project.workersRequired}</Descriptions.Item>
//           <Descriptions.Item label="Accommodation">{project.accomodation ? 'Yes' : 'No'}</Descriptions.Item>
//           <Descriptions.Item label="Transportation">{project.transportation ? 'Yes' : 'No'}</Descriptions.Item>
//           <Descriptions.Item label="Posted By">{project.postedBy && project.postedBy.userId ? `${project.postedBy.userId.firstName} ${project.postedBy.userId.lastName}` : 'N/A'}</Descriptions.Item>
//           <Descriptions.Item label="Mobile Number">{project.postedBy && project.postedBy.userId ? project.postedBy.userId.mobileNumber : 'N/A'}</Descriptions.Item>
//         </Descriptions>
//         {project.status === 'Open' && (
//           <Button 
//             type="primary" 
//             danger 
//             onClick={handleDelete}
//             loading={loading}
//             className="mt-4 w-full"
//           >
//             Delete Application
//           </Button>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default WorkStatusPage;
