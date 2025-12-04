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
      className="medical-card border-t-4 border-t-blue-500"
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <QuestionCircleOutlined className="text-lg sm:text-xl md:text-2xl text-white" />
          </div>
          <span className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Soragy ýazyň
          </span>
        </div>
      }
    >
      {error && (
        <Alert
          message="Ýalňyşlyk"
          description={error}
          type="error"
          closable
          showIcon
          onClose={() => setError(null)}
          className="mb-3 sm:mb-4 text-xs sm:text-sm animate-fade-in"
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
          label={<span className="text-xs sm:text-sm font-medium">Näme kömek gerek?</span>}
          rules={[
            { required: true, message: 'Soragyňyzy ýazyň!' },
            { min: 10, message: 'Sorag azyndan 10 simwol bolmaly!' },
            { max: 1000, message: 'Sorag 1000 simwoldan köp bolmaly dä!' },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Mysal: Kelläm agyrýar we gyzzyrma bar, näme etmeli?"
            disabled={loading}
            showCount
            maxLength={1000}
            className="text-sm sm:text-base"
          />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Form.Item
            name="age"
            label={<span className="text-xs sm:text-sm font-medium">Ýaşyňyz (hökmän däl)</span>}
            className="mb-3 sm:mb-4"
          >
            <InputNumber
              min={0}
              max={150}
              placeholder="Mysal: 30"
              disabled={loading}
              prefix={<CalendarOutlined />}
              className="w-full text-sm sm:text-base"
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label={<span className="text-xs sm:text-sm font-medium">Jynsynyz (hökmän däl)</span>}
            className="mb-3 sm:mb-4"
          >
            <Select
              placeholder="Saýlaň"
              disabled={loading}
              suffixIcon={<UserOutlined />}
              className="text-sm sm:text-base"
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
            className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8"
          >
            {loading ? 'Garaşyň...' : 'Maslahat Al'}
          </Button>
        </Form.Item>
      </Form>

      {loading && (
        <div className="mt-4 text-center">
          <Spin tip="Maslahat taýýarlanýar..." size="large" />
        </div>
      )}
    </Card>
  );
};

export default QuestionForm;
