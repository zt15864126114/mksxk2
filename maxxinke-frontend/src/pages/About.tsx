import React from 'react';
import styled from 'styled-components';
import { Typography, Row, Col, Card } from 'antd';

const { Title, Paragraph } = Typography;

const AboutWrapper = styled.div`
  padding: 60px 0;
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px - 200px);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const StyledCard = styled(Card)`
  height: 100%;
  text-align: center;
  
  .ant-card-body {
    padding: 24px;
  }

  .icon {
    font-size: 48px;
    color: #1890ff;
    margin-bottom: 16px;
  }
`;

const About: React.FC = () => {
  return (
    <AboutWrapper>
      <Container>
        <Typography>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
            关于麦克斯鑫科
          </Title>
          
          <Paragraph style={{ fontSize: 16, marginBottom: 40 }}>
            麦克斯鑫科是一家专注于工业自动化设备研发和制造的高新技术企业。
            我们致力于为客户提供高质量、高效率的自动化解决方案，
            帮助企业实现智能制造转型升级。
          </Paragraph>

          <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
            <Col xs={24} sm={8}>
              <StyledCard>
                <div className="icon">🎯</div>
                <Title level={4}>企业愿景</Title>
                <Paragraph>
                  成为工业自动化领域的领军企业，
                  引领行业技术创新与发展
                </Paragraph>
              </StyledCard>
            </Col>
            <Col xs={24} sm={8}>
              <StyledCard>
                <div className="icon">🌟</div>
                <Title level={4}>企业使命</Title>
                <Paragraph>
                  以科技创新推动工业进步，
                  为客户创造更大价值
                </Paragraph>
              </StyledCard>
            </Col>
            <Col xs={24} sm={8}>
              <StyledCard>
                <div className="icon">💎</div>
                <Title level={4}>核心价值观</Title>
                <Paragraph>
                  诚信、创新、专业、共赢
                </Paragraph>
              </StyledCard>
            </Col>
          </Row>

          <Title level={3} style={{ marginBottom: 24 }}>
            企业优势
          </Title>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card title="研发实力">
                <Paragraph>
                  拥有专业的研发团队和先进的研发设备，
                  具备强大的技术创新能力和产品开发能力。
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="品质保证">
                <Paragraph>
                  严格的质量管理体系，确保产品的稳定性和可靠性，
                  为客户提供优质的产品和服务。
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="服务支持">
                <Paragraph>
                  完善的售前、售中、售后服务体系，
                  快速响应客户需求，提供专业的技术支持。
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="行业经验">
                <Paragraph>
                  多年的行业经验积累，深入了解客户需求，
                  能够提供最适合的解决方案。
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </Typography>
      </Container>
    </AboutWrapper>
  );
};

export default About; 