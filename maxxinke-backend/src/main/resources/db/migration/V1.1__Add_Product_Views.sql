-- 添加产品访问量字段
ALTER TABLE product ADD COLUMN views BIGINT NOT NULL DEFAULT 0 AFTER status; 