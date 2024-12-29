import  { useState, useEffect } from 'react';
import { Button, Form, Input, Upload, message, Card, Typography, Steps, Select, Tooltip } from 'antd';
import { FiCamera, FiUpload, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getLabourWorkerById } from '../../calls/employees';
// import { getJobById } from '../../calls/jobCalls';
import { jobService } from '../../calls/jobCalls';

const { Title } = Typography;

// Validation functions
const validatePhoneNumber = (number) => /^[+]*[0-9]{10,15}$/.test(number);
const validateAadhaar = (number) => /^\d{12}$/.test(number);

const ApplyPage = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const workerId = useSelector((state) => state.app.workerId);
  const projectId = useSelector((state) => state.app.projectId);

  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, workerData] = await Promise.all([
          jobService.getJobById(projectId),
          getLabourWorkerById(workerId),
        ]);
        setProject(projectData);
        // Prefill form
        form.setFieldsValue({
          name: workerData.userId.firstName || '',
          lastName: workerData.userId.lastName || '',
          aadhaar: workerData.aadhaar || '',
          specialization: workerData.specialization || '',
          demandedWage: workerData.expectedWage || '',
          additionalMobile: workerData.userId.mobileNumber || '',
          experience: workerData.experience || '',
          availability: workerData.availability || 'full-time',
          preferredWorkHours: workerData.preferredWorkHours || '',
          linkedInProfile: workerData.linkedInProfile || '',
        });

        setPhoto(workerData.workerImage);
      } catch (error) {
        message.error('Error fetching data');
        console.error(error);
      }
    };
    fetchData();
  }, [workerId, projectId, form]);

  const handlePhotoUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      message.error('Please upload an image file');
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      message.error('Image size should not exceed 2MB');
      return false;
    }
    setPhoto(URL.createObjectURL(file));
    return false;
  };

  const steps = [
    {
      title: 'Basic Information',
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="relative inline-block">
              {photo ? (
                <div className="relative w-24 h-24 mx-auto">
                  <img
                    src={photo}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <Button
                    danger
                    shape="circle"
                    icon={<FiTrash2 />}
                    className="absolute -top-2 -right-2"
                    onClick={() => setPhoto(null)}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <FiCamera className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={handlePhotoUpload}
              >
                <Button className="mt-2">
                  <FiUpload className="mr-2" /> Update Photo
                </Button>
              </Upload>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="First Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="Enter your first name" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
              <Input placeholder="Enter your last name" />
            </Form.Item>
          </div>

          <Form.Item
            label="Aadhaar Number"
            name="aadhaar"
            rules={[
              { required: true },
              {
                validator: (_, value) =>
                  validateAadhaar(value)
                    ? Promise.resolve()
                    : Promise.reject('Invalid Aadhaar number'),
              },
            ]}
          >
            <Input maxLength={12} placeholder="Enter your Aadhaar number" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Mobile Number" name="additionalMobile" rules={[
                          { required: true },
                          {
                            validator: (_, value) => validatePhoneNumber(value)
                              ? Promise.resolve()
                              : Promise.reject('Invalid phone number'),
                          },
                        ]}>
                          <Input placeholder="Enter your mobile number" />
                        </Form.Item>
            <Form.Item label="Alternative Contact" name="extraContact">
              <Input placeholder="Enter alternative contact number" />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      title: 'Work Details',
      content: (
        <div className="space-y-4">
          <Form.Item
            label="Skills/Specialization"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              placeholder="Select your skills"
              options={[
                { value: 'masonry', label: 'Masonry' },
                { value: 'carpentry', label: 'Carpentry' },
                { value: 'plumbing', label: 'Plumbing' },
                { value: 'electrical', label: 'Electrical' },
                { value: 'painting', label: 'Painting' },
              ]}
            />
          </Form.Item>

          <Form.Item label="LinkedIn Profile (Optional)" name="linkedInProfile">
            <Input placeholder="Enter your LinkedIn profile link" />
          </Form.Item>

          <Form.Item
            label="Expected Daily Wage (₹)"
            name="demandedWage"
            rules={[{ required: true }]}
          >
            <Input type="number" min={0} placeholder="Enter your expected wage" />
          </Form.Item>

          <Form.Item label="Additional Notes" name="expectations">
            <Input.TextArea rows={3} placeholder="Any additional information you'd like to share..." />
          </Form.Item>
        </div>
      ),
    },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      navigate('/labor/contract-page', {
        state: { ...values, workerId, projectId, photo, projectDetails: project },
      });
    } catch (error) {
      message.error('Error submitting application');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6">
      <Card className="max-w-3xl mx-auto">
        <Title level={4} className="text-center">
          Apply for {project?.name || 'Job'}
        </Title>
        <Steps current={currentStep} items={steps.map((step) => ({ title: step.title }))} className="mb-8" />
        <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-6">
          {steps[currentStep].content}
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep((prev) => prev - 1)}>Previous</Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => setCurrentStep((prev) => prev + 1)}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ApplyPage;
