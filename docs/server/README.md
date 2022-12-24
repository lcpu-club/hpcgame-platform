# HPCGamePlatform Server

确保完成了 MonoRepo 的环境配置。参考下文完成开发本包需要的环境配置。

## 开发环境配置

- 配置 MongoDB
- 配置 Minio
- 配置 NSQ

然后，按照`src/config/index.ts`中的描述设置对应的环境变量。您可以在这个包的根目录下创建`.env`文件，将环境变量写入其中。一个示例文件如下：

```env
HPC_DEV_MODE=true
```

## 包结构

- `src`：源代码
  - `config`：配置相关。所有配置都以环境变量的形式提供。
  - `db`：数据库相关。本项目使用 MongoDB。
  - `logger`：pino 的单例。
  - `mq`：消息队列相关。
  - `services`：诸服务。
    - `main`：主服务，负责提供包括鉴权、用户管理、题面、提交等功能的 RESTFul API。
    - `ranker`：排名服务，负责计算排名。
    - `proxy`：代理服务，负责代理用户启动的开发环境。
  - `storage`：Minio 相关的对象存储。
  - `utils`：工具函数。

## 常用开发命令

- `yarn build -w`：启动 watch 模式，监听文件变化并自动编译。
- `yarn start [-s <service>]`：启动服务。默认启动`main`服务。
- `yarn lint`：检查代码问题。
