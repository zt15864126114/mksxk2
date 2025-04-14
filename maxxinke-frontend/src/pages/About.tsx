import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Timeline, Statistic, Avatar, Spin, Typography, Divider, Button } from 'antd';
import { 
  TeamOutlined, 
  TrophyOutlined, 
  GlobalOutlined, 
  HeartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  AimOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  RightOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { aboutUsService, AboutUs } from '../services/aboutUsService';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

// 动画容器
const MotionDiv = motion.div;

// 页面容器
const AboutWrapper = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
    z-index: 0;
  }
`;

// 内容容器
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

// 页面标题
const PageTitle = styled.h1`
  font-size: 42px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// 区块标题
const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1890ff;
  position: relative;
  padding-bottom: 12px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: #1890ff;
    border-radius: 2px;
  }
`;

// 区块描述
const SectionDescription = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 24px;
  white-space: pre-line;
`;

// 统计卡片
const StatsCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .ant-statistic-title {
    font-size: 16px;
    color: #666;
  }
  
  .ant-statistic-content {
    font-size: 24px;
    color: #1890ff;
  }
`;

// 优势卡片
const AdvantageCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-bottom: 24px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }
  
  .ant-card-head-title {
    font-size: 18px;
    font-weight: 600;
    color: #1890ff;
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

// 应用领域卡片
const AreaCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-bottom: 24px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
    background: #f9f9f9;
  }
  
  .ant-card-head-title {
    font-size: 18px;
    font-weight: 600;
    color: #1890ff;
  }
  
  .ant-card-body {
    padding: 24px;
  }
  
  ul {
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 8px;
    color: #666;
  }
`;

// 联系信息卡片
const ContactCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-top: 40px;
  
  .ant-card-body {
    padding: 24px;
  }
`;

// 联系信息项
const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  .anticon {
    font-size: 20px;
    color: #1890ff;
    margin-right: 12px;
  }
  
  span {
    font-size: 16px;
    color: #333;
  }
`;

// 加载容器
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

// 动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const About: React.FC = () => {
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const data = await aboutUsService.getAboutUs();
        setAboutUs(data);
      } catch (error) {
        console.error('Error fetching about us data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  // 解析核心优势文本为数组
  const parseAdvantages = (text: string) => {
    return text.split('\n').filter(item => item.trim() !== '');
  };

  // 解析应用领域文本为对象
  const parseAreas = (text: string) => {
    const areas: { [key: string]: string[] } = {};
    let currentArea = '';
    
    text.split('\n').forEach(line => {
      if (line.match(/^\d+\./)) {
        currentArea = line.replace(/^\d+\.\s+/, '');
        areas[currentArea] = [];
      } else if (line.startsWith('-') && currentArea) {
        areas[currentArea].push(line.replace(/^-\s+/, ''));
      }
    });
    
    return areas;
  };

  const applicationAreas = aboutUs ? parseAreas(aboutUs.applicationAreas) : {};
  const coreAdvantages = aboutUs ? parseAdvantages(aboutUs.coreAdvantages) : [];

  return (
    <AboutWrapper>
      <Container>
        <PageTitle>关于我们</PageTitle>
        
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 公司简介 */}
          <MotionDiv variants={itemVariants}>
            <Row gutter={[32, 32]} style={{ marginBottom: 64 }}>
              <Col xs={24} md={12}>
                <SectionTitle>公司简介</SectionTitle>
                <SectionDescription>
                  {aboutUs?.companyIntro}
                </SectionDescription>
                <Button type="primary" icon={<RightOutlined />}>
                  了解更多
                </Button>
              </Col>
              <Col xs={24} md={12}>
                <Row gutter={[16, 16]}>
                  <Col xs={12}>
                    <StatsCard>
                      <Statistic 
                        title="成立年限" 
                        value={13} 
                        suffix="年" 
                        prefix={<ClockCircleOutlined />} 
                      />
                    </StatsCard>
                  </Col>
                  <Col xs={12}>
                    <StatsCard>
                      <Statistic 
                        title="服务客户" 
                        value={500} 
                        suffix="+" 
                        prefix={<TeamOutlined />} 
                      />
                    </StatsCard>
                  </Col>
                  <Col xs={12}>
                    <StatsCard>
                      <Statistic 
                        title="产品种类" 
                        value={30} 
                        suffix="+" 
                        prefix={<TrophyOutlined />} 
                      />
                    </StatsCard>
                  </Col>
                  <Col xs={12}>
                    <StatsCard>
                      <Statistic 
                        title="服务地区" 
                        value={20} 
                        suffix="+" 
                        prefix={<GlobalOutlined />} 
                      />
                    </StatsCard>
                  </Col>
                </Row>
              </Col>
            </Row>
          </MotionDiv>

          {/* 核心优势 */}
          <MotionDiv variants={itemVariants}>
            <Row gutter={[32, 32]} style={{ marginBottom: 64 }}>
              <Col xs={24}>
                <SectionTitle>核心优势</SectionTitle>
              </Col>
              {coreAdvantages.map((advantage, index) => {
                const [title, description] = advantage.split('：');
                return (
                  <Col xs={24} sm={12} md={6} key={index}>
                    <AdvantageCard
                      title={title}
                      extra={
                        index === 0 ? <BulbOutlined style={{ fontSize: 24, color: '#1890ff' }} /> :
                        index === 1 ? <CheckCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} /> :
                        index === 2 ? <HeartOutlined style={{ fontSize: 24, color: '#1890ff' }} /> :
                        <AimOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                      }
                    >
                      {description}
                    </AdvantageCard>
                  </Col>
                );
              })}
            </Row>
          </MotionDiv>

          {/* 产品优势 */}
          <MotionDiv variants={itemVariants}>
            <Row gutter={[32, 32]} style={{ marginBottom: 64 }}>
              <Col xs={24}>
                <SectionTitle>产品优势</SectionTitle>
              </Col>
              <Col xs={24}>
                <SectionDescription>
                  {aboutUs?.productAdvantages}
                </SectionDescription>
              </Col>
            </Row>
          </MotionDiv>

          {/* 应用领域 */}
          <MotionDiv variants={itemVariants}>
            <Row gutter={[32, 32]}>
              <Col xs={24}>
                <SectionTitle>应用领域</SectionTitle>
              </Col>
              {Object.entries(applicationAreas).map(([area, items], index) => (
                <Col xs={24} md={8} key={index}>
                  <AreaCard title={area}>
                    <ul>
                      {items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </AreaCard>
                </Col>
              ))}
            </Row>
          </MotionDiv>
        </MotionDiv>
      </Container>
    </AboutWrapper>
  );
};

export default About; 