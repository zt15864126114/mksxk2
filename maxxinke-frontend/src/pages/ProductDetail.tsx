import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Spin, Typography, Divider, Table, Button } from 'antd';
import styled from 'styled-components';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { productService, Product, ProductSpecification } from '../services/productService';
import { productStatsService } from '../services/productStatsService';

const { Title, Paragraph } = Typography;

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled(Button)`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  
  .anticon {
    margin-right: 8px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductInfo = styled.div`
  padding: 24px;
`;

const SpecificationSection = styled.div`
  margin-top: 24px;

  .ant-table-thead > tr > th {
    background: #f7941d;
    color: white;
    font-weight: bold;
  }

  .ant-table-tbody > tr > td {
    padding: 12px 16px;
  }

  .ant-table {
    border: 1px solid #f0f0f0;
  }
`;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await productService.getProductById(Number(id));
        setProduct(data);
        // 记录产品访问
        await productStatsService.incrementViews(Number(id));
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBack = () => {
    navigate('/products');
  };

  const specColumns = [
    {
      title: '参数',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: '指标',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
      render: (text: string, record: ProductSpecification) => {
        if (record.unit) {
          return `${text} ${record.unit}`;
        }
        return text;
      },
    },
  ];

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Title level={3}>产品不存在</Title>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton icon={<ArrowLeftOutlined />} onClick={handleBack}>
        返回产品列表
      </BackButton>
      
      <Card bordered={false}>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <ProductImage 
              src={product.image || '/placeholder.png'} 
              alt={product.name} 
            />
          </Col>
          <Col xs={24} md={12}>
            <ProductInfo>
              <Title level={2}>{product.name}</Title>
              <Divider />
              <Paragraph>
                <strong>产品类别：</strong> {product.category}
              </Paragraph>
              <Divider />
              <Title level={4}>产品描述</Title>
              <Paragraph>{product.description}</Paragraph>

              <SpecificationSection>
                <Title level={4}>产品规格</Title>
                <Table
                  columns={specColumns}
                  dataSource={product.specifications || []}
                  pagination={false}
                  rowKey="name"
                  bordered
                />
              </SpecificationSection>

              <Divider />
              <Title level={4}>应用领域</Title>
              <Paragraph>{product.application}</Paragraph>
            </ProductInfo>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default ProductDetail; 