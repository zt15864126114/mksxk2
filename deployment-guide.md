# 阿里云2核2G服务器部署指南（前后端分离应用）

本指南将帮助您在2核2G的阿里云服务器上部署前后端分离的应用，包括后端服务、前台网站和管理后台。

## 目录
- [第一步：连接服务器并更新系统](#第一步连接服务器并更新系统)
- [第二步：安装必要软件](#第二步安装必要软件)
- [第三步：优化服务器配置](#第三步优化服务器配置)
- [第四步：配置MySQL](#第四步配置mysql)
- [第五步：准备应用目录](#第五步准备应用目录)
- [第六步：部署后端应用](#第六步部署后端应用)
- [第七步：部署前端应用](#第七步部署前端应用)
- [第八步：部署管理后台](#第八步部署管理后台)
- [第九步：配置Nginx](#第九步配置nginx)
- [第十步：创建维护脚本](#第十步创建维护脚本)
- [第十一步：安全设置](#第十一步安全设置)
- [第十二步：测试应用](#第十二步测试应用)
- [第十三步：设置启动自动运行](#第十三步设置启动自动运行)
- [第十四步：添加域名和SSL证书](#第十四步添加域名和ssl证书可选)
- [日常维护](#日常维护)

## 第一步：连接服务器并更新系统

```bash
# 使用SSH连接到服务器
ssh root@您的服务器IP

# 更新系统包
apt update && apt upgrade -y   # Ubuntu系统
# 或
yum update -y   # CentOS系统
```

## 第二步：安装必要软件

```bash
# 安装Java 8
apt install openjdk-8-jdk -y   # Ubuntu
# 或
yum install java-1.8.0-openjdk-devel -y   # CentOS

# 验证Java安装
java -version

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt install -y nodejs   # Ubuntu
# 或
curl -fsSL https://rpm.nodesource.com/setup_14.x | sudo bash -
yum install -y nodejs   # CentOS

# 验证Node.js安装
node -v
npm -v

# 安装Nginx
apt install nginx -y   # Ubuntu
# 或
yum install nginx -y   # CentOS

# 启动Nginx
systemctl start nginx
systemctl enable nginx

# 安装MySQL
apt install mysql-server -y   # Ubuntu
# 或
yum install mysql-server -y   # CentOS
systemctl start mysqld
systemctl enable mysqld
```

## 第三步：优化服务器配置

```bash
# 创建交换空间以防止内存不足
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# 设置开机自动启用交换空间
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# 优化交换空间参数
echo 'vm.swappiness=10' >> /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.conf
sysctl -p

# 检查交换空间是否生效
free -h
```

## 第四步：配置MySQL

```bash
# 安全配置
mysql_secure_installation
# 按照提示设置root密码，移除匿名用户，禁止root远程登录等

# 登录MySQL
mysql -u root -p

# 创建数据库和用户
CREATE DATABASE maxxinke CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'maxxinke_user'@'localhost' IDENTIFIED BY '设置一个安全密码';
GRANT ALL PRIVILEGES ON maxxinke.* TO 'maxxinke_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 优化MySQL配置
nano /etc/mysql/mysql.conf.d/mysqld.cnf   # Ubuntu
# 或
nano /etc/my.cnf   # CentOS
```

添加以下配置到[mysqld]部分：
```
[mysqld]
innodb_buffer_pool_size = 128M
innodb_log_buffer_size = 8M
max_connections = 50
key_buffer_size = 16M
thread_cache_size = 8
table_open_cache = 256
```

```bash
# 重启MySQL应用配置
systemctl restart mysql
```

## 第五步：准备应用目录

```bash
# 创建应用目录
mkdir -p /opt/apps/maxxinke-backend
mkdir -p /var/www/maxxinke-frontend
mkdir -p /var/www/maxxinke-admin
mkdir -p /opt/scripts
mkdir -p /opt/backups

# 设置目录权限
chown -R root:root /opt/apps
chown -R www-data:www-data /var/www   # Ubuntu
# 或
chown -R nginx:nginx /var/www   # CentOS
```

## 第六步：部署后端应用

首先在本地构建后端项目：

```bash
# 本地操作
cd maxxinke-backend
./mvnw clean package -DskipTests
```

然后将JAR文件上传到服务器：

```bash
# 本地操作，使用scp上传
scp target/maxxinke-0.0.1-SNAPSHOT.jar root@您的服务器IP:/opt/apps/maxxinke-backend/
```

在服务器上配置后端应用：

```bash
# 登录服务器
ssh root@您的服务器IP

# 创建配置文件
nano /opt/apps/maxxinke-backend/application.properties
```

添加以下内容：
```properties
# 服务器端口
server.port=3002

# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/maxxinke?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
spring.datasource.username=maxxinke_user
spring.datasource.password=您设置的密码

# JPA配置
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

# 文件上传配置
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# 日志配置
logging.level.root=WARN
logging.level.com.maxxinke=INFO

# 服务器优化
server.tomcat.max-threads=50
server.tomcat.min-spare-threads=10
```

创建启动脚本：

```bash
nano /opt/apps/maxxinke-backend/start.sh
```

添加以下内容：
```bash
#!/bin/bash
cd /opt/apps/maxxinke-backend
java -Xms256m -Xmx512m -jar maxxinke-0.0.1-SNAPSHOT.jar --spring.config.location=file:./application.properties > app.log 2>&1 &
echo $! > app.pid
echo "后端应用已启动，PID: $(cat app.pid)"
```

创建停止脚本：

```bash
nano /opt/apps/maxxinke-backend/stop.sh
```

添加以下内容：
```bash
#!/bin/bash
cd /opt/apps/maxxinke-backend
if [ -f app.pid ]; then
  kill $(cat app.pid)
  rm app.pid
  echo "后端应用已停止"
else
  echo "后端应用未运行"
fi
```

设置脚本权限并启动应用：

```bash
chmod +x /opt/apps/maxxinke-backend/*.sh
cd /opt/apps/maxxinke-backend
./start.sh

# 检查应用是否正常运行
ps aux | grep java
tail -f app.log
```

## 第七步：部署前端应用

首先在本地构建前端项目：

```bash
# 本地操作
cd maxxinke-frontend

# 确保.env文件配置正确
echo "REACT_APP_API_BASE_URL=http://您的域名或IP/api" > .env.production

npm install
npm run build
```

然后将构建文件上传到服务器：

```bash
# 本地操作，使用scp上传
scp -r build/* root@您的服务器IP:/var/www/maxxinke-frontend/
```

## 第八步：部署管理后台

首先在本地构建管理后台项目：

```bash
# 本地操作
cd maxxinke-admin

# 确保环境变量配置正确
echo "VITE_API_URL=http://您的域名或IP/api" > .env.production

npm install
npm run build
```

然后将构建文件上传到服务器：

```bash
# 本地操作，使用scp上传
scp -r dist/* root@您的服务器IP:/var/www/maxxinke-admin/
```

## 第九步：配置Nginx

创建Nginx配置文件：

```bash
# 登录服务器
ssh root@您的服务器IP

# 创建配置文件
nano /etc/nginx/conf.d/maxxinke.conf
```

添加以下内容（使用子路径方式合并部署，节省资源）：
```nginx
server {
    listen 80;
    server_name 您的域名或IP;

    # 启用gzip压缩
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_types
        application/javascript
        application/json
        application/xml
        text/css
        text/plain
        text/xml;

    # 前端站点
    location / {
        root /var/www/maxxinke-frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # 静态资源缓存
        location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
            expires 7d;
            add_header Cache-Control "public, max-age=604800";
        }
    }

    # 管理后台
    location /admin {
        alias /var/www/maxxinke-admin;
        try_files $uri $uri/ /admin/index.html;
    }

    # 后端API代理
    location /api {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 上传文件存储位置
    location /uploads {
        alias /opt/apps/maxxinke-backend/uploads;
    }
}
```

创建上传目录并设置权限：

```bash
mkdir -p /opt/apps/maxxinke-backend/uploads
chmod 755 /opt/apps/maxxinke-backend/uploads
```

检查Nginx配置并重启：

```bash
nginx -t
systemctl restart nginx
```

## 第十步：创建维护脚本

创建服务检查脚本：

```bash
nano /opt/scripts/check-services.sh
```

添加以下内容：
```bash
#!/bin/bash
LOG_FILE="/var/log/services-check.log"

echo "$(date): 检查服务状态..." >> $LOG_FILE

# 检查后端应用
if ! pgrep -f "maxxinke-0.0.1-SNAPSHOT.jar" > /dev/null; then
    echo "$(date): 后端服务已停止，重新启动..." >> $LOG_FILE
    cd /opt/apps/maxxinke-backend && ./start.sh
fi

# 检查MySQL
if ! systemctl is-active --quiet mysql; then
    echo "$(date): MySQL已停止，重新启动..." >> $LOG_FILE
    systemctl start mysql
fi

# 检查Nginx
if ! systemctl is-active --quiet nginx; then
    echo "$(date): Nginx已停止，重新启动..." >> $LOG_FILE
    systemctl start nginx
fi

# 检查内存使用
MEM_FREE=$(free -m | grep Mem | awk '{print $4}')
if [ $MEM_FREE -lt 100 ]; then
    echo "$(date): 内存不足警告: 仅剩${MEM_FREE}MB可用" >> $LOG_FILE
fi
```

创建数据库备份脚本：

```bash
nano /opt/scripts/backup-db.sh
```

添加以下内容：
```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/opt/backups"

mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -u maxxinke_user -p'您设置的密码' maxxinke > $BACKUP_DIR/maxxinke_$TIMESTAMP.sql

# 压缩备份
gzip $BACKUP_DIR/maxxinke_$TIMESTAMP.sql

# 删除7天前的备份
find $BACKUP_DIR -name "maxxinke_*.sql.gz" -type f -mtime +7 -delete

echo "数据库备份完成: maxxinke_$TIMESTAMP.sql.gz"
```

设置脚本权限并添加定时任务：

```bash
chmod +x /opt/scripts/*.sh

# 设置定时任务
crontab -e
```

添加以下内容：
```
# 每5分钟检查服务状态
*/5 * * * * /opt/scripts/check-services.sh

# 每天凌晨2点备份数据库
0 2 * * * /opt/scripts/backup-db.sh
```

## 第十一步：安全设置

```bash
# 配置防火墙
apt install ufw -y   # Ubuntu
ufw allow ssh
ufw allow http
ufw allow https
ufw enable

# CentOS系统防火墙配置
# yum install firewalld -y
# systemctl start firewalld
# systemctl enable firewalld
# firewall-cmd --permanent --add-service=ssh
# firewall-cmd --permanent --add-service=http
# firewall-cmd --permanent --add-service=https
# firewall-cmd --reload
```

## 第十二步：测试应用

```bash
# 测试后端API
curl http://localhost:3002/api/system/health

# 通过浏览器访问前端站点
http://您的服务器IP

# 通过浏览器访问管理后台
http://您的服务器IP/admin
```

## 第十三步：设置启动自动运行

创建服务启动脚本：

```bash
nano /opt/scripts/startup.sh
```

添加以下内容：
```bash
#!/bin/bash
# 启动后端应用
cd /opt/apps/maxxinke-backend && ./start.sh

# 确保日志目录存在
mkdir -p /var/log
touch /var/log/services-check.log

echo "服务已启动"
```

设置权限：
```bash
chmod +x /opt/scripts/startup.sh
```

添加到启动项：
```bash
# Ubuntu系统
nano /etc/rc.local

# 添加以下内容（确保文件开头有 #!/bin/sh -e）
#!/bin/sh -e
/opt/scripts/startup.sh
exit 0

# 设置权限
chmod +x /etc/rc.local

# CentOS系统
nano /etc/rc.d/rc.local

# 添加以下内容
/opt/scripts/startup.sh

# 设置权限
chmod +x /etc/rc.d/rc.local
```

## 第十四步：添加域名和SSL证书（可选）

如果您有域名，可以配置SSL证书提高安全性：

```bash
# 安装certbot
apt install certbot python3-certbot-nginx -y   # Ubuntu
# 或
yum install certbot python3-certbot-nginx -y   # CentOS

# 获取并安装证书
certbot --nginx -d 您的域名

# 测试自动续期
certbot renew --dry-run
```

## 日常维护

### 1. 查看日志

```bash
# 查看后端日志
tail -f /opt/apps/maxxinke-backend/app.log

# 查看Nginx访问日志
tail -f /var/log/nginx/access.log

# 查看服务状态检查日志
tail -f /var/log/services-check.log
```

### 2. 重启服务

```bash
# 重启后端
cd /opt/apps/maxxinke-backend
./stop.sh
./start.sh

# 重启Nginx
systemctl restart nginx

# 重启MySQL
systemctl restart mysql
```

### 3. 更新应用

```bash
# 停止后端
cd /opt/apps/maxxinke-backend
./stop.sh

# 备份当前JAR
cp maxxinke-0.0.1-SNAPSHOT.jar maxxinke-0.0.1-SNAPSHOT.jar.bak

# 上传新JAR（在本地执行）
scp target/maxxinke-0.0.1-SNAPSHOT.jar root@您的服务器IP:/opt/apps/maxxinke-backend/

# 启动后端
cd /opt/apps/maxxinke-backend
./start.sh
```

### 4. 监控系统资源

```bash
# 查看CPU和内存使用情况
top

# 查看磁盘使用情况
df -h

# 查看进程占用
ps aux | grep java
```

### 5. 备份恢复

```bash
# 手动备份数据库
/opt/scripts/backup-db.sh

# 恢复数据库
gunzip -c /opt/backups/maxxinke_xxx.sql.gz | mysql -u maxxinke_user -p maxxinke
```

---

以上就是在2核2G阿里云服务器上部署前后端分离应用的完整指南。根据实际情况，您可能需要调整一些配置参数以适应特定需求。 