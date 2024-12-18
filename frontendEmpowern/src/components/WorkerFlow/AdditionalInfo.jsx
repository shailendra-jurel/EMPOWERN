import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const { Option } = Select;

const AdditionalInfo = ({ onSave }) => {
const [form] = Form.useForm();
const [previousWorks, setPreviousWorks] = useState([{ company: '', salary: '', duration: '', role: '' }]);
const navigate = useNavigate(); // Initialize useNavigate

const handlePreviousWorkChange = (index, field, value) => {
const updatedWorks = [...previousWorks];
updatedWorks[index][field] = value;
setPreviousWorks(updatedWorks);
};

const addPreviousWork = () => {
setPreviousWorks([...previousWorks, { company: '', salary: '', duration: '', role: '' }]);
};

const deletePreviousWork = (index) => {
const updatedWorks = previousWorks.filter((_, i) => i !== index);
setPreviousWorks(updatedWorks);
};

const saveAdditionalInfo = async (info, previousWorks) => {
try {
    const response = await fetch('/api/save-additional-info', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...info, previousWorks }),
    });

    if (!response.ok) {
    throw new Error('Failed to save additional info.');
    }

    return await response.json(); // Assuming the API returns JSON
} catch (error) {
    console.error("Error saving additional info:", error);
    throw error; // Re-throw to be caught in the calling function
}
};

const onFinish = async (values) => {
console.log("Additional Info:", values, previousWorks);

try {
    await saveAdditionalInfo(values, previousWorks); // Call the save function
    message.success("Information saved successfully!");

    // Navigate to Main Page after saving
    navigate('/labor/main-page'); 
} catch (error) {
    message.error("Failed to save information: " + error.message); // Display specific error
}
};

return (
<div className="p-6 max-w-3xl mx-auto bg-red-200 rounded-xl shadow-lg space-y-4">
    <h1 className="text-2xl font-bold mb-6 text-center mt-5 italic">Additional Information</h1>
    <Form form={form} layout="vertical" onFinish={onFinish}>
    <Form.Item
        label="Preferred Work Locations"
        name="preferredWorkLocations"
        rules={[{ required: true, message: "Preferred locations are required!" }]}
        className="mb-4"
    >
        <Select mode="multiple" placeholder="Select preferred work locations" className="rounded-lg">
        <Option value="location1">Agra</Option>
        <Option value="location2">Delhi</Option>
        <Option value="location3">Bangalore</Option>
        <Option value="location4">Hyderabad</Option>
        </Select>
    </Form.Item>

    <Form.Item
        label="Desired Work Types"
        name="workTypes"
        rules={[{ required: true, message: "Select at least one work type!" }]}
        className="mb-4"
    >
        <Select mode="multiple" placeholder="Select work types" className="rounded-lg">
        <Option value="farmer">Farmer</Option>
        <Option value="plumber">Plumber</Option>
        <Option value="gardner">Gardener</Option>
        <Option value="construction-worker">Construction</Option>
        <Option value="developer">Developer</Option>
        <Option value="designer">Designer</Option>
        <Option value="manager">Manager</Option>
        <Option value="analyst">Analyst</Option>
        </Select>
    </Form.Item>

    <h3 className="text-xl font-semibold mb-4">Previous Work Experience</h3>
    {previousWorks.map((work, index) => (
        <div key={index} className="mb-4 p-4 bg-orange-300 rounded-lg border-2 border-black max-w-11/12 mx-auto">
        <Form.Item label="Company Name" className="mb-4">
            <Input value={work.company} onChange={(e) => handlePreviousWorkChange(index, 'company', e.target.value)} placeholder="Enter company name" className="rounded-lg" />
        </Form.Item>
        <Form.Item label="Salary" className="mb-4">
            <Input value={work.salary} onChange={(e) => handlePreviousWorkChange(index, 'salary', e.target.value)} placeholder="Enter salary" className="rounded-lg" />
        </Form.Item>
        <Form.Item label="Working As" className="mb-4">
            <Input value={work.role} onChange={(e) => handlePreviousWorkChange(index, 'role', e.target.value)} placeholder="Enter your role" className="rounded-lg" />
        </Form.Item>
        <Form.Item label="Duration" className="mb-4">
            <Input value={work.duration} onChange={(e) => handlePreviousWorkChange(index, 'duration', e.target.value)} placeholder="Enter duration" className="rounded-lg" />
        </Form.Item>
        <Button type="danger" onClick={() => deletePreviousWork(index)} icon={<DeleteOutlined />} className=" justify-items-center p-2 rounded-lg bg-red-500 text-white" />
        </div>
    ))}
    <Button type="dashed" onClick={addPreviousWork} icon={<PlusOutlined />} className="w-full p-2 rounded-lg mb-6 bg-yellow-300 hover:bg-yellow-600 border-dashed border-2">
        Add Previous Work
    </Button>

    <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
        Save and Proceed
        </Button>
    </Form.Item>
    </Form>
</div>
);
};

export default AdditionalInfo;
