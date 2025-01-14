import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Select, Input, Button, Typography, message, DatePicker, Checkbox, Card } from 'antd';
import { jobService } from '../../calls/jobCalls';
import { setProjectId } from '../../store/appSlice';
import { useSelector, useDispatch } from 'react-redux';

const { Title } = Typography;
const { Option } = Select;

const AddProject = () => {
  const contractorId = useSelector((state) => state.app.contractorId);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      message.error('Authentication required');
      navigate('/login', { state: { from: '/contractor/add-project-step2' } });
    }
  }, [isAuthenticated, navigate]);

  const [form] = Form.useForm();
  
  const initialState = {
    jobType: '',
    name: '',
    location: '',
    workersRequired: '',
    payRate: '',
    skillsRequired: '',
    accomodation: false,
    transportation: false,
    startDate: null,
    endDate: null,
    status: 'open',
    postedBy: contractorId,
    contractDetails: {
      duration: '',
      terms: '',
      responsibilities: '',
      benefits: ''
    }
  };

  const [projectDetails, setDetails] = useState(initialState);

  const handleSubmit = async (values) => {
    try {
      const jobData = {
        ...values,
        payRate: parseFloat(values.payRate),
        workersRequired: parseInt(values.workersRequired, 10),
        postedBy: contractorId,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        status: 'Open'
      };

      const createdJob = await jobService.applyForJob(jobData);
      if (createdJob) {
        dispatch(setProjectId(createdJob._id));
        message.success('Project details saved successfully!');
        navigate('/contractor/add-project-step3');
      }
    } catch (error) {
      message.error('Failed to create project: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <Title level={2} className="text-center mb-6">Create New Project</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialState}
        >
          <Form.Item
            name="jobType"
            label="Job Type"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select job type">
              <Option value="construction">Construction</Option>
              <Option value="hospitality">Hospitality</Option>
              <Option value="agriculture">Agriculture</Option>
              <Option value="manufacturing">Manufacturing</Option>
              <Option value="logistics">Logistics</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="skillsRequired"
            label="Required Skills"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="List required skills and experience" />
          </Form.Item>

          <Form.Item
            name="workersRequired"
            label="Number of Workers"
            rules={[
              { required: true },
              { pattern: /^\d+$/, message: 'Please enter a valid number' }
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="payRate"
            label="Daily Pay Rate (₹)"
            rules={[
              { required: true },
              { pattern: /^\d+(\.\d{1,2})?$/, message: 'Please enter a valid amount' }
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="contractDetails.duration"
            label="Contract Duration"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g., 3 months, 6 months, 1 year" />
          </Form.Item>

          <Form.Item
            name="contractDetails.terms"
            label="Contract Terms"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Specify important contract terms and conditions" />
          </Form.Item>

          <Form.Item
            name="contractDetails.responsibilities"
            label="Worker Responsibilities"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="List key responsibilities and expectations" />
          </Form.Item>

          <Form.Item
            name="contractDetails.benefits"
            label="Additional Benefits"
          >
            <Input.TextArea placeholder="List any additional benefits provided" />
          </Form.Item>

          <Form.Item
            name="accomodation"
            valuePropName="checked"
          >
            <Checkbox>Accommodation Provided</Checkbox>
          </Form.Item>

          <Form.Item
            name="transportation"
            valuePropName="checked"
          >
            <Checkbox>Transportation Provided</Checkbox>
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Proceed to Next Step
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProject;