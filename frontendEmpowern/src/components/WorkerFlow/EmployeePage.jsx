// frontedEmpowern/src/components/WorkerFlow/EmployeePage.jsx
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Form, Image, Input, message, Upload } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { createLabourWorker } from "../../calls/employees"; // API call to save employee details

function EmployeePage({ contactNumber }) {
const [employee, setEmployee] = useState(null);
const [photo, setPhoto] = useState(null);
const [form] = Form.useForm();
const navigate = useNavigate(); // Initialize useNavigate

const validatePhoto = (file) => {
const isImage = file.type.startsWith('image/');
if (!isImage) {
    message.error('You can only upload image files!');
}
return isImage;
};

const validateAadhaar = (aadhaar) => {
const aadhaarRegex = /^[0-9]{12}$/; // 12-digit numeric Aadhaar
return aadhaarRegex.test(aadhaar);
};

const validateName = (name) => {
const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces
return nameRegex.test(name);
};

const onFinish = async (values) => {
if (!validateAadhaar(values.aadhaar)) {
    message.error("Invalid Aadhaar number! Must be 12 digits.");
    return;
}
if (!validateName(values.name) || !validateName(values.lastName)) {
    message.error("Names can only contain letters and spaces.");
    return;
}

try {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
    });
    if (photo && photo.originFileObj) {
    formData.append("photo", photo.originFileObj);
    }

    const response = await createLabourWorker(formData);
    if (response.success) {
    message.success(response.message);
    form.resetFields();
    setPhoto(null);
    setEmployee(response.data); // Update employee state with new data

    // Navigate to Additional Info page after successful registration
    navigate('/labor/additional-info');
    } else {
    message.error(response.message);
    }
} catch (error) {
    message.error(error.message);
}
};

const handlePhotoUpload = ({ file }) => {
if (validatePhoto(file)) {
    setPhoto(file);
} else {
    return Upload.LIST_IGNORE; // Prevent the file from being added to the upload list
}
};

const handleDeletePhoto = () => {
setPhoto(null);
};

return (
<div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto bg-gradient-to-br from-red-50 via-red-100 to-white rounded-xl shadow-lg space-y-6">
    <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-gray-700">Mention Yourself</h1>
    {employee ? (
    <div className="flex justify-center">
        <Card className="w-full max-w-md bg-white p-4 rounded-lg shadow-md border border-red-200">
        <Image
            width={200}
            src={employee.photoUrl}
            alt={`${employee.name}'s photo`}
            className="rounded-full border-2 border-red-300 shadow-md"
        />
        <div className="mt-4">
            <p className="text-red-600"><strong className="font-semibold">Name:</strong> {employee.name}</p>
            <p className="text-red-600"><strong className="font-semibold">Last Name:</strong> {employee.lastName}</p>
            <p className="text-red-600"><strong className="font-semibold">Aadhaar:</strong> {employee.aadhaar}</p>
            <p className="text-red-600"><strong className="font-semibold">Specialization (if any):</strong> {employee.specialization}</p>
            <p className="text-red-600"><strong className="font-semibold">Contact Number:</strong> {employee.contactNumber}</p>
        </div>
        </Card>
    </div>
    ) : (
    <div className="flex justify-center items-center">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 md:p-8 border border-red-200">
        <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 text-center">
            {photo ? (
                <div className="relative inline-block">
                <Image width={200} src={URL.createObjectURL(photo)} alt="Photo" className="rounded-lg border-2 border-red-300 shadow-md" />
                <Button
                    icon={<DeleteOutlined />}
                    onClick={handleDeletePhoto}
                    className="absolute top-0 right-0 bg-red-500 text-white border-none rounded-full shadow-md"
                />
                </div>
            ) : (
                <div className="p-4 bg-red-200 rounded-lg">
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
            >
                <Button icon={<UploadOutlined />} className="mt-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md">
                Upload Photo
                </Button>
            </Upload>
            </div>
            <div className="flex-grow">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ contactNumber }} // Auto-fill contact number
            >
                <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Name is required!" }]}
                >
                <Input placeholder="Enter your name" className="rounded-lg border-red-300" />
                </Form.Item>

                <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Last name is required!" }]}
                >
                <Input placeholder="Enter your last name" className="rounded-lg border-red-300" />
                </Form.Item>

                <Form.Item
                label="Aadhaar"
                name="aadhaar"
                rules={[{ required: true, message: "Aadhaar is required!" }]}
                >
                <Input placeholder="Enter your Aadhaar number" className="rounded-lg border-red-300" />
                </Form.Item>

                <Form.Item
                label="Specialization (if any)"
                name="specialization"
                rules={[{ required: true, message: "Specialization is required!" }]}
                >
                <Input placeholder="Enter the work you want to do" className="rounded-lg border-red-300" />
                </Form.Item>

                <Form.Item label="Contact Number" name="contactNumber">
                <Input value={contactNumber} disabled className="rounded-lg border-red-300" />
                </Form.Item>

                <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md">
                    Save and Proceed
                </Button>
                </Form.Item>
            </Form>
            </div>
        </div>
        </div>
    </div>
    )}
</div>
);
}

export default EmployeePage;
