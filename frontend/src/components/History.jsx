import { useState, useEffect } from 'react';
import { Card, List, Tag, Typography, Spin, Alert, Button, Modal, Pagination } from 'antd';
import { HistoryOutlined, ClockCircleOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { medicalAPI } from '../services/api';
import dayjs from 'dayjs';

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

  const getTextLength = () => {
    if (typeof window === 'undefined') return 100;
    if (window.innerWidth < 640) return 50;
    if (window.innerWidth < 1024) return 80;
    return 100;
  };

  const getModalWidth = () => {
    if (typeof window === 'undefined') return 700;
    if (window.innerWidth < 640) return '95%';
    if (window.innerWidth < 768) return '85%';
    return 700;
  };

  if (loading && history.length === 0) {
    return (
      <Card className="medical-card">
        <div className="text-center py-6 sm:py-8">
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
            <HistoryOutlined className="text-lg sm:text-xl md:text-2xl text-purple-500" />
            <span className="text-base sm:text-lg">Soraglar Taryhy</span>
          </div>
        }
      >
        {history.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <HistoryOutlined className="text-3xl sm:text-4xl mb-2" />
            <p className="text-sm sm:text-base">Heniz sorag tapylmady</p>
          </div>
        ) : (
          <>
            <List
              dataSource={history}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors px-2 sm:px-4 py-3 rounded"
                  onClick={() => showDetails(item)}
                >
                  <List.Item.Meta
                    avatar={<RobotOutlined className="text-xl sm:text-2xl text-blue-500" />}
                    title={
                      <div className="flex items-center gap-2 flex-wrap">
                        <Text strong className="flex-1 text-xs sm:text-sm md:text-base">
                          {item.question.substring(0, getTextLength())}
                          {item.question.length > getTextLength() ? '...' : ''}
                        </Text>
                        <Tag color="blue" className="text-xs">#{item.id}</Tag>
                      </div>
                    }
                    description={
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-xs">
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
                            <Tag color={item.gender === 'erkek' ? 'blue' : 'pink'} className="text-xs">
                              {item.gender}
                            </Tag>
                          )}
                          <Tag color="green" className="text-xs hidden sm:inline">{item.ai_model}</Tag>
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
                simple={typeof window !== 'undefined' && window.innerWidth < 640}
                size={typeof window !== 'undefined' && window.innerWidth < 640 ? 'small' : 'default'}
              />
            </div>
          </>
        )}
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <RobotOutlined className="text-blue-500" />
            <span className="text-sm sm:text-base">Sorag #{selectedItem?.id}</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)} className="text-xs sm:text-sm">
            Ýap
          </Button>,
        ]}
        width={getModalWidth()}
        centered={typeof window !== 'undefined' && window.innerWidth < 640}
      >
        {selectedItem && (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <Text strong className="block mb-2 text-xs sm:text-sm">Sorag:</Text>
              <Paragraph className="bg-gray-50 p-2 sm:p-3 rounded text-xs sm:text-sm">
                {selectedItem.question}
              </Paragraph>
            </div>

            <div>
              <Text strong className="block mb-2 text-xs sm:text-sm">Maslahat:</Text>
              <Paragraph className="bg-blue-50 p-2 sm:p-3 rounded whitespace-pre-wrap text-xs sm:text-sm max-h-60 sm:max-h-96 overflow-y-auto">
                {selectedItem.advice}
              </Paragraph>
            </div>

            <div className="flex gap-2 sm:gap-4 flex-wrap text-xs">
              <span>
                <ClockCircleOutlined className="mr-1" />
                {formatDate(selectedItem.created_at)}
              </span>
              {selectedItem.age && (
                <span>
                  <UserOutlined className="mr-1" />
                  Ýaş: {selectedItem.age}
                </span>
              )}
              {selectedItem.gender && (
                <Tag color={selectedItem.gender === 'erkek' ? 'blue' : 'pink'} className="text-xs">
                  {selectedItem.gender}
                </Tag>
              )}
              <Tag color="green" className="text-xs">{selectedItem.ai_model}</Tag>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default History;
