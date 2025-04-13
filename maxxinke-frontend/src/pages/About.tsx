import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const PageWrapper = styled.div`
  padding: 100px 20px 50px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled(Title)`
  text-align: center;
  margin-bottom: 50px !important;
`;

const SectionTitle = styled(Title)`
  margin-bottom: 24px !important;
`;

const StyledCard = styled(Card)`
  height: 100%;
  .ant-card-head-title {
    font-size: 18px;
  }
`;

const About: React.FC = () => {
  return (
    <PageWrapper>
      <PageTitle level={2}>关于我们</PageTitle>
      
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <StyledCard>
            <SectionTitle level={3}>公司简介</SectionTitle>
            <Paragraph>
              麦克斯鑫科（山东）新型材料科技有限公司是一家专业从事水处理产品和水泥外加剂的研发、设计、生产与销售的高新技术企业。公司致力于为客户提供高品质的水处理解决方案和水泥外加剂产品，以创新科技推动环保事业发展。
            </Paragraph>
          </StyledCard>
        </Col>

        <Col span={24}>
          <StyledCard>
            <SectionTitle level={3}>核心优势</SectionTitle>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card bordered={false} title="技术创新">
                  <ul>
                    <li>专业的研发团队</li>
                    <li>持续的技术创新</li>
                    <li>先进的生产工艺</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card bordered={false} title="品质保证">
                  <ul>
                    <li>严格的质量控制</li>
                    <li>完善的检测体系</li>
                    <li>可靠的产品性能</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card bordered={false} title="服务支持">
                  <ul>
                    <li>专业的技术团队</li>
                    <li>快速的响应机制</li>
                    <li>完善的售后服务</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </StyledCard>
        </Col>

        <Col span={24}>
          <StyledCard>
            <SectionTitle level={3}>产品优势</SectionTitle>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card bordered={false} title="水处理产品">
                  <Paragraph>
                    公司开发的水处理产品系列，包括絮凝剂、助滤剂、COD去除剂等，具有以下特点：
                  </Paragraph>
                  <ul>
                    <li>处理效果好，出水达标率高</li>
                    <li>使用成本低，性价比高</li>
                    <li>操作简单，适用性强</li>
                    <li>环保安全，无二次污染</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card bordered={false} title="水泥外加剂">
                  <Paragraph>
                    公司生产的水泥外加剂产品，包括减水剂、抑尘剂等，具有以下优势：
                  </Paragraph>
                  <ul>
                    <li>性能稳定，适应性强</li>
                    <li>减水率高，和易性好</li>
                    <li>抑尘效果显著</li>
                    <li>使用方便，经济实用</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </StyledCard>
        </Col>

        <Col span={24}>
          <StyledCard>
            <SectionTitle level={3}>应用领域</SectionTitle>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card bordered={false} title="工业领域">
                  <ul>
                    <li>污水处理厂</li>
                    <li>石油化工</li>
                    <li>电力行业</li>
                    <li>钢铁冶金</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card bordered={false} title="民用领域">
                  <ul>
                    <li>城镇供水</li>
                    <li>环保工程</li>
                    <li>市政工程</li>
                    <li>建筑工程</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card bordered={false} title="特种行业">
                  <ul>
                    <li>纺织印染</li>
                    <li>造纸行业</li>
                    <li>食品加工</li>
                    <li>屠宰行业</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </StyledCard>
        </Col>
      </Row>
    </PageWrapper>
  );
};

export default About; 