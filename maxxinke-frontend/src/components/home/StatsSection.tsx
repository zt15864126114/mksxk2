import React, { useState } from 'react';
import styled from 'styled-components';
import { Row, Col, Statistic } from 'antd';
import { 
  HistoryOutlined, 
  TeamOutlined, 
  ExperimentOutlined, 
  TrophyOutlined,
  GlobalOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { motion, useInView } from 'framer-motion';
// @ts-ignore
import CountUp from 'react-countup';

const StatsSectionWrapper = styled.section`
  background: #ffffff;
  padding: 80px 0;
  overflow: hidden;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 60px;
  
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

interface StatValueProps {
  value: string;
  suffix?: string;
}

// CountUp组件包装器，用于显示数字动画
const StatValue: React.FC<StatValueProps> = ({ value, suffix }) => {
  // 从字符串中提取数字部分
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
  
  return (
    <CountUp
      start={0}
      end={numericValue}
      duration={2.5}
      separator=","
      suffix={suffix}
      useEasing={true}
      enableScrollSpy={true}
      scrollSpyDelay={200}
    />
  );
};

const StatCard = styled(motion.div)`
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 20px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 10px 30px rgba(24, 144, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(24, 144, 255, 0.15);
  }
  
  .icon-wrapper {
    font-size: 46px;
    color: #1890ff;
    margin-bottom: 20px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .stat-value {
    font-size: 36px;
    font-weight: 600;
    color: #1890ff;
    margin-bottom: 8px;
  }
  
  .stat-title {
    font-size: 16px;
    color: #666;
    margin-bottom: 10px;
  }
  
  .description {
    font-size: 14px;
    color: #666;
    margin-top: 10px;
  }
`;

const statsVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
      delay: i * 0.1
    }
  })
};

const StatsSection: React.FC = () => {
  const stats = [
    {
      id: 1,
      icon: <HistoryOutlined />,
      title: "公司历史",
      value: "10+",
      suffix: "年",
      description: "专业研发生产水处理产品"
    },
    {
      id: 2,
      icon: <TeamOutlined />,
      title: "服务客户",
      value: "500+",
      suffix: "家",
      description: "钢铁、电力、水泥等行业"
    },
    {
      id: 3,
      icon: <ExperimentOutlined />,
      title: "产品种类",
      value: "50+",
      suffix: "种",
      description: "全方位水处理解决方案"
    },
    {
      id: 4,
      icon: <TrophyOutlined />,
      title: "技术专利",
      value: "20+",
      suffix: "项",
      description: "行业领先的技术创新"
    },
    {
      id: 5,
      icon: <GlobalOutlined />,
      title: "服务区域",
      value: "15+",
      suffix: "省市",
      description: "覆盖全国主要工业区域"
    },
    {
      id: 6,
      icon: <RocketOutlined />,
      title: "工程案例",
      value: "100+",
      suffix: "个",
      description: "成功实施的水处理工程"
    }
  ];

  return (
    <StatsSectionWrapper id="stats-section">
      <Container>
        <SectionTitle>
          <h2>公司实力</h2>
          <p>十余年专注水处理产品研发与制造，以专业技术和品质服务赢得客户信赖</p>
        </SectionTitle>
        
        <Row gutter={[30, 30]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={8} key={stat.id}>
              <motion.div
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                custom={index}
                variants={statsVariants}
              >
                <StatCard>
                  <div className="icon-wrapper">{stat.icon}</div>
                  <div className="stat-title">{stat.title}</div>
                  <div className="stat-value">
                    <StatValue value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="description">{stat.description}</div>
                </StatCard>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </StatsSectionWrapper>
  );
};

export default StatsSection; 