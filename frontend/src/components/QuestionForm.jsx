import { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Alert, Spin } from 'antd';
import { SendOutlined, UserOutlined, CalendarOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { medicalAPI } from '../services/api';

const { TextArea } = Input;
const { Option } = Select;

const QuestionForm = ({ onAdviceReceived }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const response = await medicalAPI.getMedicalAdvice(
        values.question,
        values.age,
        values.gender
      );
      
      // Pass the response to parent component
      if (onAdviceReceived) {
        onAdviceReceived(response);
      }

      // Reset form after successful submission
      form.resetFields();
    } catch (err) {
      console.error('Error getting advice:', err);
      setError(
        err.response?.data?.detail || 
        'Ýalňyşlyk ýüze çykdy. Soňrak synanyşyň.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      className="medical-card border-l-4 border-l-blue-500"
      title={
        <div className="flex items-center gap-2">
          <QuestionCircleOutlined className="text-2xl text-blue-500" />
          <span className="text-lg">Soragy ýazyň</span>
        </div>
      }
    >
      {error && (
        <Alert
          message="Ýalňyşlyk"
          description={error}
          type="error"
          closable
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="question"
          label="Näme kömek gerek?"
          rules={[
            { required: true, message: 'Soragyňyzy ýazyň!' },
            { min: 10, message: 'Sorag azyndan 10 simwol bolmaly!' },
            { max: 1000, message: 'Sorag 1000 simwoldan köp bolmaly dä!' },
          ]}
        >
          <TextArea
            rows={5}
            placeholder="Mysal: Kelläm agyrýar we gyzzyrma bar, näme etmeli?"
            disabled={loading}
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="age"
            label="Ýaşyňyz (hökmän däl)"
          >
            <InputNumber
              min={0}
              max={150}
              placeholder="Mysal: 30"
              disabled={loading}
              prefix={<CalendarOutlined />}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Jynsynyz (hökmän däl)"
          >
            <Select
              placeholder="Saýlaň"
              disabled={loading}
              suffixIcon={<UserOutlined />}
            >
              <Option value="erkek">Erkek</Option>
              <Option value="aýal">Aýal</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SendOutlined />}
            size="large"
            className="w-full md:w-auto"
          >
            {loading ? 'Garaşyň...' : 'Maslahat Al'}
          </Button>
        </Form.Item>
      </Form>

      {loading && (
        <div className="mt-4 text-center">
          <Spin tip="AI maslahatyny taýýarlaýar..." size="large" />
        </div>
      )}
    </Card>
  );
};

export default QuestionForm;
