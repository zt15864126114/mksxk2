import React from 'react';
import styled from 'styled-components';
import { Row, Col, Card } from 'antd';
import { 
  SafetyCertificateOutlined, 
  ExperimentOutlined, 
  CustomerServiceOutlined, 
  SettingOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const AdvantagesSectionWrapper = styled.section`
  padding: 80px 0;
  background: #fff;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 80px;
  
  h2 {
    font-size: 36px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #1a1a1a;
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #1890ff 0%, #69c0ff 100%);
      border-radius: 2px;
    }
  }
  
  p {
    font-size: 18px;
    color: #666;
    max-width: 700px;
    margin: 0 auto;
  }
`;

const AdvantageCard = styled(Card)`
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  .ant-card-body {
    height: 100%;
    padding: 32px;
    display: flex;
    flex-direction: column;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 380px;
`;

const IconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1890ff 0%, #69c0ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 32px;
  color: #fff;
  flex-shrink: 0;
`;

const CardTitle = styled(motion.h3)`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
  flex-shrink: 0;
`;

const CardDescription = styled(motion.p)`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
  flex: 1;
`;

const CardPoints = styled(motion.ul)`
  padding-left: 20px;
  margin: 0;
  flex-shrink: 0;
  
  li {
    color: #666;
    margin-bottom: 8px;
    line-height: 1.5;
    position: relative;
    
    &:last-child {
      margin-bottom: 0;
    }

    &:before {
      content: '';
      position: absolute;
      left: -20px;
      top: 8px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #1890ff;
    }
  }
`;

const cardVariants = {
  offscreen: { 
    y: 60, 
    opacity: 0 
  },
  onscreen: (i: number) => ({ 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      duration: 1,
      delay: i * 0.2 
    } 
  })
};

// 图标动画变体
const iconVariants = {
  hidden: { 
    scale: 0.5,
    rotate: -10,
    opacity: 0 
  },
  visible: { 
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 260,
      damping: 20,
      delay: 0.2
    } 
  }
};

// 标题动画变体
const titleVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.6,
      delay: 0.4
    } 
  }
};

// 描述动画变体
const descriptionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.6,
      delay: 0.6
    } 
  }
};

// 列表动画变体
const listVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.8
    } 
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      type: "spring",
      stiffness: 100
    } 
  }
};

const AdvantagesSection: React.FC = () => {
  const advantages = [
    {
      id: 1,
      icon: <SafetyCertificateOutlined />,
      title: "优质产品",
      description: "采用先进技术和优质原材料，确保产品性能卓越、使用寿命长",
      keyPoints: [
        "通过ISO9001质量管理体系认证",
        "严格的质量控制与测试流程",
        "环保节能，符合国家环保标准"
      ]
    },
    {
      id: 2,
      icon: <ExperimentOutlined />,
      title: "技术创新",
      description: "持续研发创新，掌握行业领先的核心技术，为客户提供最佳解决方案",
      keyPoints: [
        "拥有多项自主知识产权和专利技术",
        "专业研发团队持续技术创新",
        "定制化产品研发能力"
      ]
    },
    {
      id: 3,
      icon: <CustomerServiceOutlined />,
      title: "专业服务",
      description: "提供从咨询、设计到安装、维护的全流程专业服务，解决客户后顾之忧",
      keyPoints: [
        "7*24小时技术支持响应",
        "专业工程师现场服务",
        "定期回访与维护保养"
      ]
    },
    {
      id: 4,
      icon: <SettingOutlined />,
      title: "系统解决方案",
      description: "根据客户需求，提供全面的水处理系统解决方案，实现一站式服务",
      keyPoints: [
        "针对不同行业定制解决方案",
        "产品与工程紧密结合",
        "全面的技术支持与培训"
      ]
    }
  ];

  return (
    <AdvantagesSectionWrapper>
      <Container>
        <SectionTitle>
          <h2>我们的优势</h2>
          <p>专注水处理产品研发与制造，以专业能力为客户创造持久价值</p>
        </SectionTitle>
        
        <Row gutter={[30, 30]}>
          {advantages.map((advantage, index) => (
            <Col xs={24} sm={12} md={12} lg={6} key={advantage.id}>
              <motion.div
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                custom={index}
                variants={cardVariants}
                style={{ height: '100%' }}
              >
                <AdvantageCard>
                  <CardContent>
                    <IconWrapper
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={iconVariants}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 10,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                    >
                      {advantage.icon}
                    </IconWrapper>
                    
                    <CardTitle
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={titleVariants}
                    >
                      {advantage.title}
                    </CardTitle>
                    
                    <CardDescription
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={descriptionVariants}
                    >
                      {advantage.description}
                    </CardDescription>
                    
                    <CardPoints
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={listVariants}
                    >
                      {advantage.keyPoints.map((point, pointIndex) => (
                        <motion.li 
                          key={pointIndex}
                          variants={listItemVariants}
                        >
                          {point}
                        </motion.li>
                      ))}
                    </CardPoints>
                  </CardContent>
                </AdvantageCard>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </AdvantagesSectionWrapper>
  );
};

export default AdvantagesSection; 