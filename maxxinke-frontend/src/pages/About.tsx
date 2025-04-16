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
  RightOutlined,
  MobileOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  ToolOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { aboutUsService, AboutUs } from '../services/aboutUsService';
import { getContactInfo, ContactInfo } from '../services/systemService';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

const { Title, Paragraph } = Typography;

// 添加动画关键帧
const bounceKeyframes = `
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0);
    }
    50% {
      transform: translateY(-15px) rotate(2deg);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 8px 30px rgba(24, 144, 255, 0.2);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 4px 20px rgba(24, 144, 255, 0.1);
    }
    50% {
      box-shadow: 0 8px 30px rgba(24, 144, 255, 0.3);
    }
  }
`;

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.2
    }
  }
};

const statItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 50,
    x: i % 2 === 0 ? -30 : 30,
    scale: 0.9
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

// 页面容器
const AboutWrapper = styled.section`
  padding: 0;
  background: linear-gradient(to bottom, #f8f9fa, #f0f2f5);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

// 头部区域
const HeaderSection = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 100px 0 160px;
  margin-bottom: -90px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
      radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    z-index: 1;
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -50px;
    left: 0;
    right: 0;
    height: 100px;
    background: #f8f9fa;
    transform: skewY(-3deg);
    z-index: 2;
  }
`;

// 内容容器
const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

// 页面标题
const PageTitle = styled(motion.h1)`
  text-align: center;
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 24px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to right, #ffffff, #e6f7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

// 页面副标题
const PageSubtitle = styled(motion.p)`
  text-align: center;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.95);
  max-width: 800px;
  margin: 0 auto 40px;
  line-height: 1.8;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

// 统计信息容器
const StatsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 60px;
  position: relative;
  z-index: 3;
`;

// 更新卡片基础样式
const CardBase = styled(motion.div)`
  ${bounceKeyframes}
  position: relative;
  overflow: hidden;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  animation: float 6s ease-in-out infinite;
  cursor: pointer;
  
  &:hover {
    animation: pulse 1s ease-in-out infinite;
    transform: translateY(-10px);
    box-shadow: 0 8px 30px rgba(24, 144, 255, 0.15);
  }
`;

// 更新统计卡片样式
const StatItem = styled(CardBase)`
  text-align: center;
  color: white;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: float 6s ease-in-out infinite;
  
  &:nth-child(2) {
    animation-delay: -1s;
  }
  
  &:nth-child(3) {
    animation-delay: -2s;
  }
  
  &:hover {
    animation: pulse 1s ease-in-out infinite;
  }
  
  .stat-value {
    font-size: 42px;
    font-weight: 800;
    margin-bottom: 12px;
    background: linear-gradient(to right, #ffffff, #e6f7ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 2px;
      background: linear-gradient(to right, transparent, #ffffff, transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }
  
  &:hover .stat-value:after {
    opacity: 1;
  }
  
  .stat-label {
    font-size: 16px;
    opacity: 0.95;
    letter-spacing: 1px;
    position: relative;
    
    &:before {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 2px;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5), transparent);
    }
  }
  
  .stat-icon {
    font-size: 24px;
    margin-bottom: 12px;
    color: #e6f7ff;
    animation: bounce 3s ease-in-out infinite;
  }
`;

// 区块标题
const SectionTitle = styled(motion.h2)`
  font-size: 36px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 32px;
  position: relative;
  padding-left: 20px;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 36px;
    background: linear-gradient(to bottom, #1890ff, #69c0ff);
    border-radius: 3px;
  }
`;

// 更新优势卡片样式
const AdvantageCard = styled(motion(Card))`
  ${bounceKeyframes}
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: none;
  overflow: hidden;
  background: white;
  position: relative;
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 24px;
    background: linear-gradient(to right, #f8f9fa, #ffffff);
    position: relative;
    overflow: hidden;
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(24, 144, 255, 0.1), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s;
    }
    
    &:hover:before {
      transform: translateX(100%);
    }
  }
  
  .ant-card-head-title {
    font-size: 20px;
    font-weight: 600;
    color: #1890ff;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s ease;
    
    .anticon {
      font-size: 24px;
      background: linear-gradient(135deg, #1890ff, #69c0ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transition: all 0.3s ease;
    }
    
    &:hover {
      transform: translateX(5px);
      
      .anticon {
        transform: scale(1.2) rotate(360deg);
      }
    }
  }
  
  .ant-card-body {
    padding: 28px;
    position: relative;
    overflow: hidden;
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, rgba(24, 144, 255, 0.05), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover:before {
      opacity: 1;
    }
  }
`;

// 主要内容区域
const MainContent = styled(motion.div)`
  padding: 60px 0;
  position: relative;
  z-index: 3;
`;

// 加载容器
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa, #f0f2f5);
`;

const BusinessSolutions = styled.section`
  padding: 80px 0;
  background: #f5f5f5;
`;

const SolutionTitle = styled(motion.h2)`
  font-size: 36px;
  margin-bottom: 40px;
  text-align: center;
  color: #1890ff;
`;

// 更新解决方案卡片样式
const SolutionCard = styled(CardBase)`
  padding: 30px;
  text-align: center;
  
  .solution-icon {
    font-size: 36px;
    color: #1890ff;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      background: radial-gradient(circle at center, rgba(24, 144, 255, 0.1), transparent 70%);
      border-radius: 50%;
      opacity: 0;
      transition: all 0.3s ease;
    }
  }
  
  &:hover .solution-icon {
    transform: scale(1.2) rotate(360deg);
    
    &:after {
      opacity: 1;
      transform: translateX(-50%) scale(1.2);
    }
  }
  
  .solution-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #1890ff;
    transition: all 0.3s ease;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 2px;
      background: linear-gradient(to right, transparent, #1890ff, transparent);
      opacity: 0;
      transition: all 0.3s ease;
    }
  }
  
  &:hover .solution-title {
    color: #096dd9;
    
    &:after {
      opacity: 1;
      width: 100px;
    }
  }
  
  .solution-features {
    text-align: left;
    margin-bottom: 20px;
    
    li {
      margin-bottom: 8px;
      color: #666;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      position: relative;
      
      &:before {
        content: '•';
        color: #1890ff;
        font-size: 20px;
        line-height: 1;
        transition: all 0.3s ease;
      }
      
      &:hover {
        transform: translateX(5px);
        color: #1890ff;
        
        &:before {
          transform: scale(1.5);
        }
      }
    }
  }
  
  .solution-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    
    .ant-tag {
      margin: 0;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transform: translateX(-100%);
        transition: transform 0.6s;
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
        
        &:before {
          transform: translateX(100%);
        }
      }
    }
  }
`;

const TeamSection = styled.section`
  padding: 80px 0;
  background: #fff;
`;

const TeamTitle = styled(motion.h2)`
  font-size: 36px;
  margin-bottom: 40px;
  text-align: center;
  color: #1890ff;
`;

// 更新团队卡片样式
const TeamCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  
  .ant-card-cover {
    padding: 20px;
    background: #f5f5f5;
    position: relative;
    overflow: hidden;
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(24, 144, 255, 0.2), transparent);
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    &:after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at center, rgba(24, 144, 255, 0.1), transparent 70%);
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    &:hover {
      &:before, &:after {
        opacity: 1;
      }
    }
  }
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .member-name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #1890ff;
    transition: all 0.3s ease;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 50px;
      height: 2px;
      background: linear-gradient(to right, #1890ff, transparent);
      opacity: 0;
      transition: all 0.3s ease;
    }
  }
  
  &:hover .member-name {
    color: #096dd9;
    
    &:after {
      opacity: 1;
      width: 100px;
    }
  }
  
  .member-title {
    font-size: 16px;
    color: #666;
    margin-bottom: 16px;
    transition: all 0.3s ease;
  }
  
  &:hover .member-title {
    color: #1890ff;
  }
  
  .member-description {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    transition: all 0.3s ease;
  }
  
  &:hover .member-description {
    color: #1890ff;
  }
`;

const ContactSection = styled.section`
  padding: 80px 0;
  background: #f5f5f5;
`;

const ContactTitle = styled(motion.h2)`
  font-size: 36px;
  margin-bottom: 40px;
  text-align: center;
  color: #1890ff;
`;

// 更新联系卡片样式
const ContactCard = styled(CardBase)`
  padding: 30px;
  text-align: center;
  
  .contact-icon {
    font-size: 36px;
    color: #1890ff;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      background: radial-gradient(circle at center, rgba(24, 144, 255, 0.1), transparent 70%);
      border-radius: 50%;
      opacity: 0;
      transition: all 0.3s ease;
    }
  }
  
  &:hover .contact-icon {
    transform: scale(1.2) rotate(360deg);
    
    &:after {
      opacity: 1;
      transform: translateX(-50%) scale(1.2);
    }
  }
  
  .contact-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #1890ff;
    transition: all 0.3s ease;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 2px;
      background: linear-gradient(to right, transparent, #1890ff, transparent);
      opacity: 0;
      transition: all 0.3s ease;
    }
  }
  
  &:hover .contact-title {
    color: #096dd9;
    
    &:after {
      opacity: 1;
      width: 100px;
    }
  }
  
  .contact-content {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
    transition: all 0.3s ease;
  }
  
  &:hover .contact-content {
    color: #1890ff;
  }
`;

const About: React.FC = () => {
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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

  const parseAdvantages = (text: string) => {
    return text.split('\n').filter(item => item.trim() !== '');
  };

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

  const coreAdvantages = aboutUs ? parseAdvantages(aboutUs.coreAdvantages) : [];
  const applicationAreas = aboutUs ? parseAreas(aboutUs.applicationAreas) : {};

  return (
    <AboutWrapper>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: '#1890ff',
          transformOrigin: '0%',
          scaleX,
          zIndex: 1000
        }}
      />
      
      <HeaderSection>
        <Container
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <PageTitle variants={titleVariants}>
            关于我们
          </PageTitle>
          <PageSubtitle variants={subtitleVariants}>
            {aboutUs?.companyIntro || '专注于水处理技术研发与创新，为客户提供专业的水处理解决方案'}
          </PageSubtitle>
          
          <StatsContainer>
            <StatItem variants={statItemVariants} whileHover={{ scale: 1.05 }}>
              <GlobalOutlined className="stat-icon" />
              <div className="stat-value">10+</div>
              <div className="stat-label">年行业经验</div>
            </StatItem>
            <StatItem variants={statItemVariants} whileHover={{ scale: 1.05 }}>
              <TeamOutlined className="stat-icon" />
              <div className="stat-value">500+</div>
              <div className="stat-label">服务客户</div>
            </StatItem>
            <StatItem variants={statItemVariants} whileHover={{ scale: 1.05 }}>
              <HeartOutlined className="stat-icon" />
              <div className="stat-value">100%</div>
              <div className="stat-label">客户满意度</div>
            </StatItem>
          </StatsContainer>
        </Container>
      </HeaderSection>

      <MainContent>
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {/* 核心优势 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <SectionTitle>核心优势</SectionTitle>
              <Row gutter={[24, 24]}>
                {coreAdvantages.map((advantage, index) => {
                  const [title, description] = advantage.split('：');
                  return (
                    <Col xs={24} sm={12} md={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
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
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>
            </motion.div>

            {/* 应用领域 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              style={{ marginTop: '64px' }}
            >
              <SectionTitle>应用领域</SectionTitle>
              <Row gutter={[24, 24]}>
                {Object.entries(applicationAreas).map(([area, items], index) => (
                  <Col xs={24} md={8} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AdvantageCard
                        title={area}
                        extra={<GlobalOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                      >
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          {items.map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              style={{ marginBottom: '8px', color: '#666' }}
                            >
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </AdvantageCard>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </motion.div>
        </Container>
      </MainContent>
    </AboutWrapper>
  );
};

export default About; 