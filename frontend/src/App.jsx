import { useState, lazy, Suspense } from 'react';
import { Layout, Menu, Typography, Space, Tag, Spin, Button } from 'antd';
import {
  MedicineBoxOutlined,
  HistoryOutlined,
  HeartOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import QuestionForm from './components/QuestionForm';
import AdviceDisplay from './components/AdviceDisplay';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const History = lazy(() => import('./components/History'));

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
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-2xl p-6 sm:p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="max-w-3xl relative z-10">
          <Title level={1} className="!text-white !mb-3 sm:!mb-4 !text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl !font-bold">
            🏥 Türkmen Lukmançylyk Maslahat
          </Title>
          <Text className="text-sm sm:text-base md:text-lg text-white opacity-95 block mb-4">
            Türkmen dilinde professional lukmançylyk maslahaty almak
          </Text>
          <div className="mt-4 md:mt-5 flex flex-wrap gap-2 sm:gap-3">
            <Tag className="text-xs sm:text-sm px-3 py-1 bg-white bg-opacity-20 border-white border-opacity-40 text-white font-medium">
              ⚡ Çalt Jogap
            </Tag>
            <Tag className="text-xs sm:text-sm px-3 py-1 bg-white bg-opacity-20 border-white border-opacity-40 text-white font-medium">
              🇹🇲 Türkmen Dili
            </Tag>
            <Tag className="text-xs sm:text-sm px-3 py-1 bg-white bg-opacity-20 border-white border-opacity-40 text-white font-medium">
              💯 Mugt
            </Tag>
            <Tag className="text-xs sm:text-sm px-3 py-1 bg-white bg-opacity-20 border-white border-opacity-40 text-white font-medium">
              🔒 Ygtybarly
            </Tag>
          </div>
        </div>
      </div>

      <div className="animate-slide-up">
        <QuestionForm onAdviceReceived={handleAdviceReceived} />
      </div>

      {currentAdvice && (
        <div id="advice-section" className="animate-fade-in">
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
  const { isDark, toggleTheme } = useTheme();

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
    <Layout className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header className="shadow-md sticky top-0 z-50 px-2 sm:px-4" style={{ 
        background: 'var(--bg-card)',
        borderBottom: `1px solid var(--border-color)`
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <HeartOutlined className="text-xl sm:text-2xl text-red-500" />
            <Title level={4} className="!mb-0 !text-base sm:!text-lg md:!text-xl" style={{ color: 'var(--text-primary)' }}>
              Lukman Maslahat
            </Title>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              type="text"
              icon={isDark ? <BulbFilled className="text-yellow-400" /> : <BulbOutlined />}
              onClick={toggleTheme}
              className="flex items-center justify-center"
              style={{ color: 'var(--text-primary)' }}
              title={isDark ? "Açyk tema" : "Garaňky tema"}
            />
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={menuItems}
              className="border-0 min-w-0"
              style={{ background: 'transparent' }}
              onClick={(e) => setSelectedKey(e.key)}
            />
          </div>
        </div>
      </Header>

      <Content style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <Suspense fallback={
            <div className="text-center py-12">
              <Spin size="large" tip="Ýüklenýär..." />
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Suspense>
        </div>
      </Content>

      <Footer className="text-center border-t py-4 sm:py-6 px-3" style={{ 
        background: 'var(--bg-card)',
        borderTop: `1px solid var(--border-color)`
      }}>
        <Space direction="vertical" size="small" className="w-full">
          <Text type="secondary" className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
            <HeartOutlined className="text-red-500" /> Made with love for Turkmenistan
          </Text>
          <Text type="secondary" className="text-xs leading-relaxed max-w-2xl mx-auto block" style={{ color: 'var(--text-tertiary)' }}>
            ⚠️ Bu programma professional lukmançylyk maslahaty däl. Hassalyk ýüze çyksa, lukman bilen maslahatlaşyň!
          </Text>
        </Space>
      </Footer>
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
