import React from 'react';
import { Row, Col } from 'antd';
import { 
  BulbOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const gradientText = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const Card = styled(motion.div)`
  height: 100%;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(24, 144, 255, 0.15);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1890ff, #69c0ff);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover:before {
    transform: scaleX(1);
  }
`;

const IconWrapper = styled.div`
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 16px;
  height: 40px;
  display: flex;
  align-items: center;

  .anticon {
    animation: ${float} 3s ease-in-out infinite;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
  background: linear-gradient(120deg, #1890ff, #69c0ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientText} 3s ease infinite;
`;

const Description = styled.div`
  color: #666;
  line-height: 1.6;
  flex: 1;
  display: flex;
  align-items: center;
`;

const advantages = [
  {
    icon: <BulbOutlined />,
    title: "技术创新",
    description: "拥有专业的研发团队和先进的生产设备"
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "品质保证",
    description: "严格的质量控制体系和完善的检测流程"
  },
  {
    icon: <CustomerServiceOutlined />,
    title: "服务支持",
    description: "专业的技术团队和快速的响应机制"
  },
  {
    icon: <TrophyOutlined />,
    title: "行业经验",
    description: "多年的行业经验和丰富的项目案例"
  }
];

const CoreAdvantages: React.FC = () => {
  return (
    <Row gutter={[24, 24]}>
      {advantages.map((advantage, index) => (
        <Col xs={24} sm={12} md={6} key={index}>
          <Card
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <IconWrapper>
              {advantage.icon}
            </IconWrapper>
            <Title>{advantage.title}</Title>
            <Description>{advantage.description}</Description>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CoreAdvantages;