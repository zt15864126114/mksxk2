-- 创建关于我们表
-- 该表用于存储公司的基本信息，包括公司简介、核心优势、产品优势和应用领域等
CREATE TABLE about_us (
    -- 主键ID
    -- 用于唯一标识每条记录
    -- 类型：BIGINT，自增
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID，自增字段，用于唯一标识记录',
    
    -- 公司简介
    -- 存储公司的详细介绍和背景信息
    -- 类型：TEXT，可存储大量文本
    -- 包含：公司成立时间、主营业务、发展历程等
    company_intro TEXT COMMENT '公司简介，包含公司成立背景、主营业务、发展历程等详细信息',
    
    -- 核心优势
    -- 描述公司的核心竞争力和主要优势
    -- 类型：TEXT，可存储大量文本
    -- 包含：技术创新、品质保证、服务支持等方面
    core_advantages TEXT COMMENT '核心优势，描述公司在技术创新、品质保证、服务支持等方面的核心竞争力',
    
    -- 产品优势
    -- 描述公司产品的主要特点和优势
    -- 类型：TEXT，可存储大量文本
    -- 包含：产品性能、使用效果、性价比等
    product_advantages TEXT COMMENT '产品优势，详细描述产品的性能特点、使用效果、性价比等优势',
    
    -- 应用领域
    -- 描述公司产品的主要应用领域和场景
    -- 类型：TEXT，可存储大量文本
    -- 包含：工业、民用、特种行业等应用场景
    application_areas TEXT COMMENT '应用领域，列举产品在工业、民用、特种行业等领域的应用场景',
    
    -- 创建时间
    -- 记录数据创建的时间戳
    -- 类型：DATETIME，自动设置为当前时间
    -- 用途：追踪记录的创建时间
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间，记录数据创建的时间戳，自动设置为当前时间',
    
    -- 更新时间
    -- 记录数据最后更新的时间戳
    -- 类型：DATETIME，自动更新为当前时间
    -- 用途：追踪记录的最后修改时间
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间，记录数据最后更新的时间戳，自动更新为当前时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='关于我们信息表，存储公司的基本信息和介绍';

-- 插入初始数据
-- 添加公司的基本信息
INSERT INTO about_us (
    company_intro,
    core_advantages,
    product_advantages,
    application_areas
) VALUES (
    -- 公司简介：介绍公司背景和主营业务
    '麦克斯鑫科（山东）新型材料科技有限公司是一家专业从事水处理产品和水泥外加剂的研发、设计、生产与销售的高新技术企业。公司致力于为客户提供高品质的水处理解决方案和水泥外加剂产品，以创新科技推动环保事业发展。',
    
    -- 核心优势：列举公司的四大核心优势
    '1. 技术创新：拥有专业的研发团队和先进的生产设备\n2. 品质保证：严格的质量控制体系和完善的检测流程\n3. 服务支持：专业的技术团队和快速的响应机制\n4. 行业经验：多年的行业经验和丰富的项目案例',
    
    -- 产品优势：分别介绍水处理产品和水泥外加剂的优势
    '1. 水处理产品：\n- 处理效果好，出水达标率高\n- 使用成本低，性价比高\n- 操作简单，适用性强\n- 环保安全，无二次污染\n\n2. 水泥外加剂：\n- 性能稳定，适应性强\n- 减水率高，和易性好\n- 抑尘效果显著\n- 使用方便，经济实用',
    
    -- 应用领域：列举三大领域的应用场景
    '1. 工业领域：\n- 污水处理厂\n- 石油化工\n- 电力行业\n- 钢铁冶金\n\n2. 民用领域：\n- 城镇供水\n- 环保工程\n- 市政工程\n- 建筑工程\n\n3. 特种行业：\n- 纺织印染\n- 造纸行业\n- 食品加工\n- 屠宰行业'
); 