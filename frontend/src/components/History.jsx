import { useState, useEffect } from 'react';
import { Card, List, Tag, Typography, Spin, Alert, Button, Modal, Pagination } from 'antd';
import { HistoryOutlined, ClockCircleOutlined, UserOutlined, RobotOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { medicalAPI } from '../services/api';
import dayjs from 'dayjs';
import 'dayjs/locale/tk'; // Turkmen locale if available, fallback to default

const { Text, Paragraph } = Typography;

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchHistory = async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * pageSize;
      const response = await medicalAPI.getHistory(pageSize, offset);
      setHistory(response.queries);
      setPagination(prev => ({
        ...prev,
        current: page,
        total: response.total,
      }));
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Taryhy ýüklemekde ýalňyşlyk ýüze çykdy.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handlePageChange = (page, pageSize) => {
    fetchHistory(page, pageSize);
  };

  const showDetails = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD.MM.YYYY HH:mm');
  };

  if (loading && history.length === 0) {
    return (
      <Card className="medical-card">
        <div className="text-center py-8">
          <Spin size="large" tip="Taryh ýüklenýär..." />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="medical-card">
        <Alert message="Ýalňyşlyk" description={error} type="error" showIcon />
      </Card>
    );
  }

  return (
    <>
      <Card
        className="medical-card border-l-4 border-l-purple-500"
        title={
          <div className="flex items-center gap-2">
            <HistoryOutlined className="text-2xl text-purple-500" />
            <span className="text-lg">Soraglar Taryhy</span>
          </div>
        }
      >
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <HistoryOutlined className="text-4xl mb-2" />
            <p>Heniz sorag tapylmady</p>
          </div>
        ) : (
          <>
            <List
              dataSource={history}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors px-4 rounded"
                  onClick={() => showDetails(item)}
                >
                  <List.Item.Meta
                    avatar={<RobotOutlined className="text-2xl text-blue-500" />}
                    title={
                      <div className="flex items-center gap-2 flex-wrap">
                        <Text strong className="flex-1">
                          {item.question.substring(0, 100)}
                          {item.question.length > 100 ? '...' : ''}
                        </Text>
                        <Tag color="blue">#{item.id}</Tag>
                      </div>
                    }
                    description={
                      <div className="space-y-1">
                        <div className="flex items-center gap-4 flex-wrap text-xs">
                          <span>
                            <ClockCircleOutlined className="mr-1" />
                            {formatDate(item.created_at)}
                          </span>
                          {item.age && (
                            <span>
                              <UserOutlined className="mr-1" />
                              Ýaş: {item.age}
                            </span>
                          )}
                          {item.gender && (
                            <Tag color={item.gender === 'erkek' ? 'blue' : 'pink'}>
                              {item.gender}
                            </Tag>
                          )}
                          <Tag color="green">{item.ai_model}</Tag>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            
            <div className="mt-4 text-center">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total) => `Jemi: ${total} sorag`}
              />
            </div>
          </>
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <RobotOutlined className="text-xl text-blue-500" />
            <span className="text-lg">Sorag #{selectedItem?.id}</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setModalVisible(false)}>
            Ýap
          </Button>,
        ]}
        width={800}
      >
        {selectedItem && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-l-blue-500">
              <Text strong className="block mb-3 text-blue-700 text-base flex items-center gap-2">
                <QuestionCircleOutlined />
                Sorag:
              </Text>
              <Paragraph className="!mb-0 text-base leading-relaxed">
                {selectedItem.question}
              </Paragraph>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-l-green-500">
              <Text strong className="block mb-3 text-green-700 text-base flex items-center gap-2">
                <RobotOutlined />
                AI Maslahat:
              </Text>
              <div className="prose max-w-none">
                <Paragraph className="!mb-0 text-base whitespace-pre-wrap leading-relaxed text-gray-800">
                  {selectedItem.advice}
                </Paragraph>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Text strong className="block mb-3 text-gray-700">Maglumat:</Text>
              <div className="flex gap-4 flex-wrap">
                <Tag color="blue" className="px-3 py-1">
                  <ClockCircleOutlined className="mr-1" />
                  {formatDate(selectedItem.created_at)}
                </Tag>
                {selectedItem.age && (
                  <Tag color="cyan" className="px-3 py-1">
                    <UserOutlined className="mr-1" />
                    Ýaş: {selectedItem.age}
                  </Tag>
                )}
                {selectedItem.gender && (
                  <Tag color={selectedItem.gender === 'erkek' ? 'blue' : 'pink'} className="px-3 py-1">
                    {selectedItem.gender === 'erkek' ? '👨 Erkek' : '👩 Aýal'}
                  </Tag>
                )}
                <Tag color="green" className="px-3 py-1">
                  🤖 {selectedItem.ai_model}
                </Tag>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default History;
