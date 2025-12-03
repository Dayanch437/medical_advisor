import { Card, Alert, Divider, Typography, Space } from 'antd';
import { MedicineBoxOutlined, WarningOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AdviceDisplay = ({ advice, disclaimer }) => {
  if (!advice) return null;

  // Parse the advice text to structure it better
  const formatAdvice = (text) => {
    // Helper function to remove all markdown formatting
    const removeMarkdown = (str) => {
      return str
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/\*/g, '')   // Remove italic markers
        .replace(/^#+\s*/gm, '') // Remove heading markers
        .replace(/`/g, '')    // Remove code markers
        .trim();
    };

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
        // Remove markdown from section title
        currentSection = { title: removeMarkdown(sectionMatch[2]), content: [] };
      } else if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        // It's a bullet point - remove all markdown
        const cleanLine = removeMarkdown(
          line.replace(/^\s*[\*\-]\s*/, '') // Remove bullet marker first
        );
        if (cleanLine) {
          currentSection.content.push({ type: 'bullet', text: cleanLine });
        }
      } else if (line.trim()) {
        // Regular text - remove markdown
        const cleanLine = removeMarkdown(line);
        if (cleanLine) {
          currentSection.content.push({ type: 'text', text: cleanLine });
        }
      }
    });

    if (currentSection.title) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = formatAdvice(advice);

  return (
    <div className="space-y-3 sm:space-y-4">
      <Card 
        className="medical-card border-l-4 border-l-green-500"
        title={
          <div className="flex items-center gap-2">
            <MedicineBoxOutlined className="text-lg sm:text-xl md:text-2xl text-green-500" />
            <span className="text-base sm:text-lg">Lukmançylyk Maslahat</span>
          </div>
        }
      >
        <Space direction="vertical" size="large" className="w-full">
          {sections.length > 0 ? (
            sections.map((section, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <Title level={5} className="!mb-2 sm:!mb-3 text-blue-600 flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircleOutlined className="text-base sm:text-lg" />
                  {section.title}
                </Title>
                <div className="space-y-2 ml-4 sm:ml-6">
                  {section.content.map((item, itemIdx) => (
                    <div key={itemIdx}>
                      {item.type === 'bullet' ? (
                        <div className="flex gap-2 items-start">
                          <span className="text-green-500 mt-1 text-sm sm:text-base">•</span>
                          <Text className="flex-1 text-xs sm:text-sm">{item.text}</Text>
                        </div>
                      ) : (
                        <Paragraph className="!mb-2 text-gray-700 text-xs sm:text-sm">
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
                {advice.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '')}
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
          <div className="space-y-2 sm:space-y-3 mt-2">
            <Paragraph className="!mb-2 text-xs sm:text-sm leading-relaxed">
              <InfoCircleOutlined className="mr-2" />
              Bu maslahat diňe maglumat maksady bilen berilýär we hakyky lukmançylyk 
              diagnozyny ýa-da bejergini çalyşmaýar.
            </Paragraph>
            <Paragraph className="!mb-2 text-xs sm:text-sm leading-relaxed font-semibold text-red-600">
              ⚠️ Hassalyk ýüze çyksa ýa-da alamatlaryňyz dowam etse, HÖKMANY SURATDA 
              ýerli lukmana ýa-da keselhanä ýüz tutuň.
            </Paragraph>
            <Paragraph className="!mb-0 text-xs sm:text-sm leading-relaxed">
              🚨 Gyssagly ýagdaýlarda (güýçli agyry, dem alyş kynçylygy, ýokary gyzzyrma) 
              derrew tiz kömek çagyryň!
            </Paragraph>
          </div>
        }
        type="warning"
        showIcon
        icon={<WarningOutlined className="text-lg sm:text-xl" />}
        className="border-l-4 border-l-orange-500"
      />
    </div>
  );
};

export default AdviceDisplay;
