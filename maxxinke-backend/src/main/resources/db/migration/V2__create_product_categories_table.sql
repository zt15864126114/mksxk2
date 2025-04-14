-- 创建产品类别表
CREATE TABLE IF NOT EXISTS `product_categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '类别ID',
  `name` varchar(100) NOT NULL COMMENT '类别名称',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '排序值，值越大排序越靠前',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_category_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品类别表';

-- 插入初始数据
INSERT INTO `product_categories` (`name`, `sort`, `status`, `create_time`, `update_time`) VALUES
('工业自动化设备', 100, 1, NOW(), NOW()),
('智能控制系统', 90, 1, NOW(), NOW()),
('精密加工设备', 80, 1, NOW(), NOW()),
('检测设备', 70, 1, NOW(), NOW()),
('机器人系统', 60, 1, NOW(), NOW()),
('其他设备', 50, 1, NOW(), NOW()); 