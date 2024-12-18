import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Upload, message, Card, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import { useAppContext } from '../GlobalContext';
import { useSelector } from 'react-redux';
import { getLabourWorkerById } from '../../calls/employees';
import { createJobAssignment } from '../../calls/JobAssignmentCalls';
import { getJobById } from '../../calls/jobCalls';

// Inline phone number validation function
const validatePhoneNumber = (number) => {
  const phoneRegex = /^[+]*[0-9]{10,15}$/; // Adjust regex as needed
  return phoneRegex.test(number);
};

const ApplyPage = () => {
  const [form] = Form.useForm();
  const [photo, setPhoto] = useState(null);
  const [extraContact, setExtraContact] = useState('');
  const navigate = useNavigate();
const workerId = useSelector((state) =>  state.app.workerId)
const projectId = useSelector((state) =>  state.app.projectId)

  const [worker, setWorker] = useState(null);
  const [project, setProject] = useState(null);

  const handlePhotoUpload = ({ file }) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    setPhoto(file);
    return false; // Prevent automatic upload
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
  };

  const onFinish = async (values) => {
    if (!validatePhoneNumber(values.additionalMobile)) {
      message.error('Invalid mobile number!');
      return;
    }

    const assignment = {
      worker: workerId,
      job: projectId,
      demandedWage: values.demandedWage,
      extracontact: values.extraContact,
      additionalExpectations: values.expectations
    };

    try {
      await createJobAssignment(assignment);
      message.success('Job assignment created successfully!');
      navigate('/labor/main');
    } catch (error) {
      message.error('Error creating job assignment:', error);
      console.error('Error creating job assignment:', error);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getJobById(projectId);
        setProject(projectData);
        console.log('Project fetched in the apply page:', projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const workerData = await getLabourWorkerById(workerId);
        setWorker(workerData);
        console.log('Worker fetched in the apply page:', workerData);
        // Set form fields with worker's existing data
        form.setFieldsValue({
          name: workerData.userId.firstName || '',
          lastName: workerData.userId.lastName || '',
          aadhaar: '', // Replace with worker's aadhaar if available
          specialization: '', // Replace with worker's specialization if available
          demandedWage: '', // Replace with worker's demanded wage if available
          extraContact: '', // Replace with worker's extra contact if available
          additionalMobile: workerData.userId.mobileNumber || '',
        });

        setPhoto(workerData.workerImage);
      } catch (error) {
        console.error('Error fetching worker:', error);
      }
    };
    fetchWorker();
  }, [workerId, form]);

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-3xl mx-auto bg-gradient-to-br from-gray-50 via-gray-100 to-white rounded-xl shadow-lg space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-gray-800">Apply for the Job</h1>
      <div className="flex justify-center">
        <Card className="w-full max-w-md bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-center mb-4 relative">
            {photo ? (
              <div className="relative inline-block w-full">
                <Image
                  width={100}
                  src={photo}
                  alt="Profile"
                  className="rounded-full border-2 border-gray-300 shadow-md"
                />
                <Button
                  icon={<DeleteOutlined />}
                  onClick={handleDeletePhoto}
                  className="absolute top-0 right-0 bg-red-500 text-white border-none rounded-full shadow-md"
                  size="small"
                />
              </div>
            ) : (
              <div className="p-4 bg-gray-200 rounded-lg flex justify-center items-center">
                <Image width={50} src="/placeholder.png" alt="Placeholder" className="rounded-lg" />
              </div>
            )}
            <Upload
              name="photo"
              listType="picture"
              beforeUpload={() => false} // Disable automatic upload
              onChange={handlePhotoUpload}
              maxCount={1}
              showUploadList={false} // Disable showing uploaded file list
              className="mt-2"
            >
              <Button icon={<UploadOutlined />} className="bg-[#e96f4c] text-white rounded-lg hover:bg-[#f28d6f] shadow-md">
                Upload Photo
              </Button>
            </Upload>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Name is required!' }]}
            >
              <Input placeholder="Enter your name" className="rounded-lg border-gray-300" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Last name is required!' }]}
            >
              <Input placeholder="Enter your last name" className="rounded-lg border-gray-300" />
            </Form.Item>

            <Form.Item
              label="Aadhaar"
              name="aadhaar"
              rules={[{ required: true, message: 'Aadhaar is required!' }]}
            >
              <Input placeholder="Enter your Aadhaar number" className="rounded-lg border-gray-300" />
            </Form.Item>

            <Form.Item
              label="Skills"
              name="specialization"
              rules={[{ required: true, message: 'Specialization is required!' }]}
            >
              <Input placeholder="Enter your specialization" className="rounded-lg border-gray-300" />
            </Form.Item>

            <Form.Item
              label="Demanded Wage"
              name="demandedWage"
              rules={[{ required: true, message: 'Demanded wage is required!' }]}
            >
              <Input placeholder="Enter your demanded wage" type="number" className="rounded-lg border-gray-300" />
            </Form.Item>

            <Form.Item
              label="Extra Contact Information"
              name="extraContact"
            >
              <Input placeholder="Enter extra contact information" value={extraContact} onChange={(e) => setExtraContact(e.target.value)} className="rounded-lg border-gray-300" />
            </Form.Item>

            <Form.Item
              label="Additional Expectations"
              name="expectations"
            >
              <Input.TextArea placeholder="Enter any additional expectations" className="rounded-lg border-gray-300" />
            </Form.Item>

            <Form.Item
              label="Additional Mobile Number"
              name="additionalMobile"
            >
              <PhoneInput
                country={'us'}
                value={extraContact}
                onChange={setExtraContact}
                placeholder="Enter another mobile number"
                inputStyle={{ width: '100%', borderRadius: '8px', borderColor: '#d1d5db' }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-auto bg-[#e96f4c] justify-center text-white rounded-lg hover:bg-[#f28d6f] shadow-md">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ApplyPage;
