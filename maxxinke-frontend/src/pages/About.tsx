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
import { motion, AnimatePresence } from 'framer-motion';

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
const PageTitle = styled(motion.h1)`
  font-size: 42px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: #1890ff;
    border-radius: 2px;
  }
`;

// 区块标题
const SectionTitle = styled(motion.h2)`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1890ff;
  position: relative;
  padding-left: 16px;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
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

// 产品卡片样式
const ProductCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #1890ff;
  }
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    background-color: #f9f9f9;
  }
  
  .ant-card-head-title {
    font-size: 18px;
    font-weight: 600;
    color: #1890ff;
  }
  
  .product-feature {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;
    
    .anticon {
      font-size: 16px;
      color: #1890ff;
      margin-right: 10px;
      margin-top: 3px;
    }
    
    .feature-text {
      flex: 1;
    }
  }
`;

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

  // 解析产品优势为结构化数据
  const parseProductAdvantages = (text: string) => {
    const products: { [key: string]: string[] } = {};
    let currentProduct = '';
    
    text.split('\n').forEach(line => {
      if (line.match(/^\d+\./)) {
        currentProduct = line.replace(/^\d+\.\s+/, '');
        products[currentProduct] = [];
      } else if (line.startsWith('-') && currentProduct) {
        products[currentProduct].push(line.replace(/^-\s+/, ''));
      }
    });
    
    return products;
  };

  const applicationAreas = aboutUs ? parseAreas(aboutUs.applicationAreas) : {};
  const coreAdvantages = aboutUs ? parseAdvantages(aboutUs.coreAdvantages) : [];
  const productAdvantages = aboutUs ? parseProductAdvantages(aboutUs.productAdvantages) : {};

  return (
    <AboutWrapper>
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <PageTitle>关于我们</PageTitle>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Row gutter={[32, 32]} style={{ marginBottom: 64 }}>
              <Col xs={24} md={12}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <SectionTitle>公司简介</SectionTitle>
                  <SectionDescription>
                    {aboutUs?.companyIntro}
                  </SectionDescription>
                </motion.div>
              </Col>
              <Col xs={24} md={12}>
                <Row gutter={[16, 16]}>
                  <Col xs={12}>
                    <StatsCard>
                      <Statistic 
                        title="经验丰富"
                        value={10}
                        suffix="年+"
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
          </motion.div>

          {/* 核心优势 */}
          <motion.div variants={itemVariants}>
            <Row gutter={[32, 32]} style={{ marginBottom: 64 }}>
              <Col xs={24}>
                <SectionTitle>核心优势</SectionTitle>
              </Col>
              <AnimatePresence>
                {coreAdvantages.map((advantage, index) => {
                  const [title, description] = advantage.split('：');
                  return (
                    <Col xs={24} sm={12} md={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
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
              </AnimatePresence>
            </Row>
          </motion.div>

          {/* 产品优势 */}
          <motion.div variants={itemVariants}>
            <Row gutter={[32, 32]} style={{ marginBottom: 64 }}>
              <Col xs={24}>
                <SectionTitle>产品优势</SectionTitle>
              </Col>
              <AnimatePresence>
                {Object.entries(productAdvantages).map(([product, features], index) => (
                  <Col xs={24} md={12} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <ProductCard 
                        title={product}
                        extra={
                          index === 0 ? (
                            <motion.span
                              style={{ fontSize: 24, color: '#1890ff' }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2zm-4.17-6c.37 0 .67.26.74.62.41 2.22 2.28 2.98 3.64 2.87.43-.02.79.32.79.75 0 .4-.32.73-.72.75-2.13.13-4.62-1.09-5.19-4.12-.08-.45.28-.87.74-.87z" />
                              </svg>
                            </motion.span>
                          ) : (
                            <motion.span
                              style={{ fontSize: 24, color: '#52c41a' }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                              </svg>
                            </motion.span>
                          )
                        }
                      >
                        {features.map((feature, i) => (
                          <motion.div
                            className="product-feature"
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <CheckCircleOutlined className="anticon" />
                            <span className="feature-text">{feature}</span>
                          </motion.div>
                        ))}
                      </ProductCard>
                    </motion.div>
                  </Col>
                ))}
              </AnimatePresence>
            </Row>
          </motion.div>

          {/* 应用领域 */}
          <motion.div variants={itemVariants}>
            <Row gutter={[32, 32]}>
              <Col xs={24}>
                <SectionTitle>应用领域</SectionTitle>
              </Col>
              <AnimatePresence>
                {Object.entries(applicationAreas).map(([area, items], index) => (
                  <Col xs={24} md={8} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <AreaCard title={area}>
                        <ul>
                          {items.map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </AreaCard>
                    </motion.div>
                  </Col>
                ))}
              </AnimatePresence>
            </Row>
          </motion.div>
        </motion.div>
      </Container>
    </AboutWrapper>
  );
};

export default About; 