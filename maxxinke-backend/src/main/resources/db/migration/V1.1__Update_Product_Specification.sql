-- 第1步：创建临时列存储JSON字符串
ALTER TABLE product
ADD COLUMN temp_specs TEXT DEFAULT '[]';

-- 第2步：将现有数据转换为JSON格式并存入临时列
UPDATE product 
SET temp_specs = CASE
    WHEN specification IS NULL OR specification = '' THEN '[]'
    WHEN specification LIKE '[%]' THEN specification
    ELSE CONCAT('[{"value":"', REPLACE(specification, '"', '\\"'), '"}]')
END;

-- 第3步：添加新的JSON列
ALTER TABLE product
ADD COLUMN specifications JSON DEFAULT ('[]') AFTER specification;

-- 第4步：将临时列的数据导入JSON列
UPDATE product 
SET specifications = temp_specs;

-- 第5步：删除临时列和旧列
ALTER TABLE product
DROP COLUMN temp_specs,
DROP COLUMN specification; 