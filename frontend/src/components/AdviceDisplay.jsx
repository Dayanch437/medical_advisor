import { Card, Alert, Divider, Typography, Space } from 'antd';
import { MedicineBoxOutlined, WarningOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AdviceDisplay = ({ advice, disclaimer }) => {
  if (!advice) return null;

  // Parse the advice text to structure it better
  const formatAdvice = (text) => {
    // Split by common patterns in the response
    const lines = text.split('\n').filter(line => line.trim());
    const sections = [];
    let currentSection = { title: '', content: [] };

    lines.forEach(line => {
      // Check if line is a numbered section (1., 2., etc.)
      const sectionMatch = line.match(/^(\d+)\.\s*\*\*(.+?)\*\*/);
      if (sectionMatch) {
        if (currentSection.title) {
          sections.push({ ...currentSection });
        }
        currentSection = { title: sectionMatch[2], content: [] };
      } else if (line.trim().startsWith('*')) {
        // It's a bullet point
        const cleanLine = line.replace(/^\s*[\*\-]\s*\*\*(.+?)\*\*:?\s*/, '').trim();
        currentSection.content.push({ type: 'bullet', text: cleanLine });
      } else if (line.trim()) {
        currentSection.content.push({ type: 'text', text: line.trim() });
      }
    });

    if (currentSection.title) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = formatAdvice(advice);

  return (
    <div className="space-y-4">
      <Card 
        className="medical-card border-l-4 border-l-green-500"
        title={
          <div className="flex items-center gap-2">
            <MedicineBoxOutlined className="text-2xl text-green-500" />
            <span className="text-lg">Lukmançylyk Maslahat</span>
          </div>
        }
      >
        <Space direction="vertical" size="large" className="w-full">
          {sections.length > 0 ? (
            sections.map((section, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-4">
                <Title level={5} className="!mb-3 text-blue-600 flex items-center gap-2">
                  <CheckCircleOutlined />
                  {section.title}
                </Title>
                <div className="space-y-2 ml-6">
                  {section.content.map((item, itemIdx) => (
                    <div key={itemIdx}>
                      {item.type === 'bullet' ? (
                        <div className="flex gap-2 items-start">
                          <span className="text-green-500 mt-1">•</span>
                          <Text className="flex-1">{item.text}</Text>
                        </div>
                      ) : (
                        <Paragraph className="!mb-2 text-gray-700">
                          {item.text}
                        </Paragraph>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Fallback for unstructured text
            <div className="prose max-w-none">
              <Paragraph className="text-base whitespace-pre-wrap text-gray-700 leading-relaxed">
                {advice}
              </Paragraph>
            </div>
          )}
        </Space>
      </Card>

      <Alert
        message={
          <div className="flex items-center gap-2">
            <WarningOutlined className="text-lg" />
            <Text strong className="text-base">MÖHÜM DUÝDURYŞ</Text>
          </div>
        }
        description={
          <div className="space-y-3 mt-2">
            <Paragraph className="!mb-2 text-sm leading-relaxed">
              <InfoCircleOutlined className="mr-2" />
              Bu maslahat diňe maglumat maksady bilen berilýär we hakyky lukmançylyk 
              diagnozyny ýa-da bejergini çalyşmaýar.
            </Paragraph>
            <Paragraph className="!mb-2 text-sm leading-relaxed font-semibold text-red-600">
              ⚠️ Hassalyk ýüze çyksa ýa-da alamatlaryňyz dowam etse, HÖKMANY SURATDA 
              ýerli lukmana ýa-da keselhanä ýüz tutuň.
            </Paragraph>
            <Paragraph className="!mb-0 text-sm leading-relaxed">
              🚨 Gyssagly ýagdaýlarda (güýçli agyry, dem alyş kynçylygy, ýokary gyzzyrma) 
              derrew tiz kömek çagyryň!
            </Paragraph>
          </div>
        }
        type="warning"
        showIcon
        icon={<WarningOutlined className="text-xl" />}
        className="border-l-4 border-l-orange-500"
      />
    </div>
  );
};

export default AdviceDisplay;
