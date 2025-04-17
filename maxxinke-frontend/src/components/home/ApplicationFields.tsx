import React from 'react';
import { Row, Col } from 'antd';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// 动画定义
const gradientText = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const textGlow = keyframes`
  0% { text-shadow: 0 0 8px rgba(24, 144, 255, 0); }
  50% { text-shadow: 0 0 12px rgba(24, 144, 255, 0.3); }
  100% { text-shadow: 0 0 8px rgba(24, 144, 255, 0); }
`;

const Container = styled(motion.div)`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: 100%;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(120deg, #1890ff, #69c0ff, #40a9ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientText} 3s ease infinite;
`;

const Description = styled(motion.div)`
  color: #666;
  margin: 8px 0;
  position: relative;
  cursor: pointer;
  padding-left: 20px;
  transition: all 0.3s ease;

  &:before {
    content: '•';
    color: #1890ff;
    position: absolute;
    left: 0;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #1890ff;
    animation: ${textGlow} 1.5s ease-in-out infinite;
    transform: translateX(10px);

    &:before {
      transform: scale(1.2);
    }

    &:after {
      width: 100%;
    }
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, #1890ff, #69c0ff);
    transition: width 0.3s ease;
  }
`;

interface ApplicationFieldsProps {
  data: {
    title: string;
    description: string[];
  }[];
}

const ApplicationFields: React.FC<ApplicationFieldsProps> = ({ data }) => {
  return (
    <Row gutter={[24, 24]}>
      {data?.map((field, index) => (
        <Col xs={24} md={8} key={index}>
          <Container
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Title>{field.title}</Title>
            {field.description?.map((desc, i) => (
              <Description
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {desc}
              </Description>
            ))}
          </Container>
        </Col>
      ))}
    </Row>
  );
};

export default ApplicationFields;