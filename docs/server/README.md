# HPCGamePlatform Server

确保完成了 MonoRepo 的环境配置。参考下文完成开发本包需要的环境配置。

## 开发环境配置

- 配置 MongoDB
  - `docker run --rm --name hpc-mongo -p 27017:27017 -d mongo`
- 配置 Minio
  - `docker run --rm --name hpc-minio -p 9000:9000 -p 9090:9090 -e "MINIO_ROOT_USER=HPC" -e "MINIO_ROOT_PASSWORD=HPCGAMEOSS" minio/minio server /data --console-address ":9090"`
- 配置 NSQ
  - `docker run --rm --name hpc-lookupd -p 4160:4160 -p 4161:4161 -d nsqio/nsq /nsqlookupd`
  - `docker run --rm --name hpc-nsqd -p 4150:4150 -p 4151:4151 -d nsqio/nsq /nsqd --broadcast-address=172.17.0.1 --lookupd-tcp-address=172.17.0.1:4160`

注意，上述 docker 命令均没有进行数据持久化。在开发过程中，这并不是必要的。

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
