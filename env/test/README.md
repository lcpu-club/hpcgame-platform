# 测试环境说明

测试环境直接将整个 Workspace 挂载到容器里。因此，对于部署者，你需要在本地安装好所有的依赖。

请参考文档中的工作区环境配置，并运行`yarn workspaces foreach run build`来构建所有的包。

然后，使用`docker compose up -d`来启动所有的服务。
