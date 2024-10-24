# General-Project

## 一：项目介绍
七牛云 1024 后端项目

### (1) 基础组件库

这里包含了服务模块所需的基础代码，方便微服务的快速编程

### (2) 基础用户服务模块

这里包含了用户服务的基础操作，每个功能模块都进行了代码优化和性能提升和预估风险处理

### (3) 网关服务

使用 nacos 注册中心将请求路由到各个服务中，并进行 Auth 检验和限流风控

### (4) 聚合服务

为了减少本地启动内存压力以及服务器部署压力，将各个微服务项目进行了聚合，启动一个服务即可享受项目的全部功能，在正式生产环境中不会采用。想跑微服务全流程，需依次启动用户服务模块和后续将要开发的微服务服务模块。



## 二：项目运行说明
> **注意：** 项目默认使用聚合服务的方式启动项目，减少本地启动内存压力以及服务器部署压力，这里只做 aggregation-service 和 gateway-service 的启动说明，如需启动其他服务，请参考 aggregation-service 的启动说明。

### (1). 克隆项目到本地

```
git clone git@github.com:Team-DuiDuiDui/GeniusRank.git
```

### (2). 导入到 IDE

```
IDEA 导入 Maven 项目，等待依赖下载完成。( jdk 版本要求为17，maven 版本要求为3.9.6+)
```

### (3). 配置 Mysql 数据库

```
1. 在 gateway-service，aggregation-service，包下修改 shardingsphere-config-dev.yaml 中配置 mysql 数据库连接信息

2. 执行 resources/database 包 project.sql 初始化数据库表结构。
```

### (4). 配置 Redis 服务

```
在 gateway，aggregation 包下修改 application.yml 中配置 redis 连接信息
```

### (5). 配置第三方服务（都可不选，默认都不开启）
### 5.1 配置 QQ-Mail 服务

```
mail:
    enable: false #是否开启邮箱验证码服务
    host: smtp.qq.com #邮箱服务器地址
    username:  #发送者邮箱
    password:  #发送者邮箱授权码
    project-name: General-Project #项目名称
```

### 5.2 配置 AliOSS 服务
```
alioss:
    enable: false #是否开启阿里云 OSS 服务，如不开启则采用本地存储
    endpoint:  #阿里云 OSS（对象存储服务）的访问域名
    access-key-id: #用于访问 OSS 的标识用户的唯一标识符
    access-key-secret:  #用于访问 OSS 的配对密钥
    bucket-name:  #OSS 中的存储空间名称
    domain: 127.0.0.1:9000 #本地存储空间域名，如不采用 alioss，则该存储空间为兜底
```

### (6). 启动项目

```
1. 首先先在本地启动 redis，nacos，rocketmq 服务

2. 然后再依次启动 aggregation-service, gateway-service 这两个服务即可。
```

## 三：技术架构

选择了基于 Spring Boot 3 和 JDK17 进行底层建设，同时组件库的版本大多也是最新的。这样做既能享受新技术带来的性能提升，也能体验到新特性带来的惊喜。

技术架构涵盖了 SpringBoot 3、SpringCloudAlibaba、Nacos、Sentinel、Skywalking、RocketMQ 5.x、Redis、MySQL、EasyExcel、Redisson 等技术。

框架技术和版本号关系如下表格所示。

|      | 技术                | 名称               | 版本           | 官网                                            |
| ---- | ------------------- | ------------------ | -------------- | ----------------------------------------------- |
| 1    | Spring Boot         | 基础框架           | 3.0.7          | https://spring.io/projects/spring-boot          |
| 2    | SpringCloud Alibaba | 分布式框架         | 2022.0.0.0-RC2 | https://github.com/alibaba/spring-cloud-alibaba |
| 3    | SpringCloud Gateway | 网关框架           | 2022.0.3       | https://spring.io/projects/spring-cloud-gateway |
| 4    | MyBatis-Plus        | 持久层框架         | 3.5.7          | https://baomidou.com                            |
| 5    | MySQL               | OLTP 关系型数据库  | 5.7.36         | https://www.mysql.com/cn                        |
| 6    | Redis               | 分布式缓存数据库   | Latest         | https://redis.io                                |
| 7    | RocketMQ            | 消息队列           | 2.3.0          | https://rocketmq.apache.org                     |
| 8    | ShardingSphere      | 数据库生态系统     | 5.3.2          | https://shardingsphere.apache.org               |
| 9    | FastJson2           | JSON 序列化工具    | 2.0.36         | https://github.com/alibaba/fastjson2            |
| 10   | Canal               | BinLog 订阅组件    | 1.1.6          | https://github.com/alibaba/canal                |
| 11   | HuTool              | 小而全的工具集项目 | 5.8.27         | https://hutool.cn                               |
| 12   | Maven               | 项目构建管理       | 3.9.1          | http://maven.apache.org                         |
| 13   | Redisson            | Redis Java 客户端  | 3.27.2         | [https://redisson.org](https://redisson.org/)   |
| 14   | Sentinel            | 流控防护框架       | 1.8.6          | https://github.com/alibaba/Sentine              |


## 四：核心服务

### (1) 网关服务

### (2) 用户服务
