import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col } from 'antd';

const Container = styled.div`
  padding: 100px 50px 50px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 30px;
  text-align: center;
`;

const ContactCard = styled(Card)`
  margin-bottom: 20px;
  .ant-card-head-title {
    font-size: 18px;
  }
`;

const Contact: React.FC = () => {
  return (
    <Container>
      <Title>联系我们</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <ContactCard title="公司地址">
            <p>浙江省杭州市滨江区</p>
            <p>科技园区创新大厦A座15楼</p>
          </ContactCard>
        </Col>
        <Col xs={24} md={12}>
          <ContactCard title="联系方式">
            <p>电话：0571-88888888</p>
            <p>邮箱：contact@maxxinke.com</p>
          </ContactCard>
        </Col>
        <Col xs={24}>
          <ContactCard title="工作时间">
            <p>周一至周五：9:00 - 18:00</p>
            <p>周六、周日：休息</p>
          </ContactCard>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact; 