-- 创建系统配置表
CREATE TABLE IF NOT EXISTS `system_config` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` varchar(50) NOT NULL COMMENT '配置键',
  `config_value` text COMMENT '配置值',
  `description` varchar(255) DEFAULT NULL COMMENT '配置描述',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 初始化联系方式数据
INSERT INTO `system_config` (`config_key`, `config_value`, `description`, `create_time`, `update_time`) VALUES
('contact_tel', '0755-12345678', '电话号码', NOW(), NOW()),
('contact_mobile', '138 8888 8888', '手机号码', NOW(), NOW()),
('contact_email', 'info@maxxinke.com', '邮箱地址', NOW(), NOW()),
('contact_service_email', 'service@maxxinke.com', '客服邮箱', NOW(), NOW()),
('contact_address', '深圳市宝安区新安街道某某工业园A栋5楼', '公司地址', NOW(), NOW()),
('contact_postcode', '518000', '邮政编码', NOW(), NOW()),
('contact_website', 'www.maxxinke.com', '网站地址', NOW(), NOW()),
('contact_wechat', '麦克斯鑫科', '微信公众号', NOW(), NOW()); 