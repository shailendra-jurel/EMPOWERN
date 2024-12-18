import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { updateJob, getJobById } from '../../calls/jobCalls';
import { getContractorById } from '../../calls/contractorCalls';
// import { useAppContext } from '../GlobalContext';
import { useSelector } from 'react-redux';

const AddProjectStep3 = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
    const contractorId = useSelector((state) => state.user.id);
    const projectId = useSelector((state) => state.app.projectId);
  const [job, setJob] = useState(null);
  const [contractor, setContractor] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState({
    name: '',
    mobile: '',
    company: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const fetchedJob = await getJobById(projectId);
        setJob(fetchedJob);
      } catch (error) {
        console.error('Error fetching job:', error);
      }
    };

    if (projectId) {
      fetchJob();
    }
  }, [projectId]);

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const contractor = await getContractorById(contractorId);
        if (contractor && contractor.userId) {
          setContractor(contractor);
          console.log('Contractor:', contractor);
          const user = contractor.userId;
          setOwnerDetails({
            name: user.firstName + ' ' + user.lastName,
            mobile: user.mobileNumber,
            company: contractor.companyName || ''
          });
          form.setFieldsValue({
            name: user.firstName + ' ' + user.lastName,
            mobile: user.mobileNumber,
            company: contractor.companyName || ''
          });
        }
      } catch (error) {
        console.error('Error fetching contractor:', error);
      }
    };

    if (contractorId) {
      fetchContractor();
    }
  }, [contractorId, form]);

  const handleChange = (changedValues, allValues) => {
    setOwnerDetails(allValues);
  };

  const handleAddProject = async () => {
    try {
      const values = await form.validateFields();
      const updatedJobData = {
        ...job,
        postedBy: contractorId,
      };

      console.log('Updated job data:', updatedJobData);

      const updatedJob = await updateJob(job._id, updatedJobData);
      if (updatedJob) {
        message.success('Project added successfully!');
        console.log('Updated job:', updatedJob);
        navigate('/contractor/project-list');
      } else {
        message.error('Failed to add project. Please try again.');
      }
    } catch (error) {
      message.error('Failed to add project. Please try again.');
      console.error('Error adding project:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Owner Details</h2>
        <Form
          form={form}
          layout="vertical"
          initialValues={ownerDetails}
          onValuesChange={handleChange}
        >
          <Form.Item
            label="Owner Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter owner name' },
              { pattern: /^[a-zA-Z\s]+$/, message: 'Name should only contain alphabetic characters.' }
            ]}
          >
            <Input placeholder="Owner name" />
          </Form.Item>
          <Form.Item
            label="Owner Mobile Number"
            name="mobile"
            rules={[
              { required: true, message: 'Please enter owner mobile number' },
              { pattern: /^\d{10}$/, message: 'Mobile number should be 10 digits long.' }
            ]}
          >
            <Input placeholder="Owner mobile number" />
          </Form.Item>
          <Form.Item
            label="Company (if any)"
            name="company"
          >
            <Input placeholder="Company (if any)" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleAddProject}
              block
            >
              Add Project
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddProjectStep3;
