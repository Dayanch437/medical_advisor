import { useState } from 'react';
import { Layout, Menu, Typography, Space, Tag } from 'antd';
import {
  MedicineBoxOutlined,
  HistoryOutlined,
  HeartOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import QuestionForm from './components/QuestionForm';
import AdviceDisplay from './components/AdviceDisplay';
import History from './components/History';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

// Home page component
const HomePage = () => {
  const [currentAdvice, setCurrentAdvice] = useState(null);

  const handleAdviceReceived = (advice) => {
    setCurrentAdvice(advice);
    // Scroll to advice display
    setTimeout(() => {
      document.getElementById('advice-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
        <div className="max-w-3xl">
          <Title level={1} className="!text-white !mb-4">
            🏥 Türkmen Lukmançylyk Maslahat
          </Title>
          <Text className="text-lg text-white opacity-90">
            Google Gemini AI ulanyp, türkmen dilinde lukmançylyk maslahaty
          </Text>
          <div className="mt-4 flex flex-wrap gap-2">
            <Tag color="green">AI Esasly</Tag>
            <Tag color="blue">Türkmen Dili</Tag>
            <Tag color="purple">Mugt</Tag>
          </div>
        </div>
      </div>

      {/* Question Form */}
      <QuestionForm onAdviceReceived={handleAdviceReceived} />

      {/* Advice Display */}
      {currentAdvice && (
        <div id="advice-section">
          <AdviceDisplay 
            advice={currentAdvice.advice} 
            disclaimer={currentAdvice.disclaimer} 
          />
        </div>
      )}
    </div>
  );
};

// Main App component
const AppContent = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  const menuItems = [
    {
      key: '/',
      icon: <MedicineBoxOutlined />,
      label: <Link to="/">Maslahat</Link>,
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: <Link to="/history">Taryh</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeartOutlined className="text-2xl text-red-500" />
            <Title level={4} className="!mb-0 !text-gray-800">
              Lukman AI
            </Title>
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={menuItems}
            className="flex-1 justify-end border-0"
            onClick={(e) => setSelectedKey(e.key)}
          />
        </div>
      </Header>

      <Content className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </Content>

      <Footer className="text-center bg-white border-t">
        <Space direction="vertical" size="small">
          <Text type="secondary">
            <HeartOutlined className="text-red-500" /> Made with love for Turkmenistan
          </Text>
          <Text type="secondary" className="text-xs">
            ⚠️ Bu programma professional lukmançylyk maslahaty däl. Hassalyk ýüze çyksa, lukman bilen maslahatlaşyň!
          </Text>
          <div>
            <a
              href="https://github.com/Dayanch437/medical_advisor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              <GithubOutlined className="text-xl" />
            </a>
          </div>
        </Space>
      </Footer>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
