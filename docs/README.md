# HPCGamePlatform MonoRepo

您好，亲爱的开发者。本文档将指导您参与到 HPCGame 平台的开发工作中。倘若您是使用者，也不要灰心。您依然可以在本文档中找到有用的信息。

请您先按照下文所述的步骤配置开发环境，之后再阅读对应部件的文档。

## 开发环境配置

推荐使用 [Visual Studio Code](https://code.visualstudio.com/) 作为开发工具。
请安装项目推荐的插件。

1. 安装 nvm: https://github.com/nvm-sh/nvm
2. 在项目根目录处运行`nvm use`，安装项目所需的 node 版本
3. 运行`corepack enable`
4. 运行`yarn --version`，确保 yarn 版本为 `3.3.0`
5. 运行`yarn`安装依赖

## 选择一个组件

接下来，您需要选择一个组件进行开发。所有的组件以包的形式拆分，均位于`packages/<name>`目录下。

目前，我们有如下组件：

- [`ui`](./ui/README.md): HPCGame 平台的前端组件
- [`server`](./server/README.md): HPCGame 平台的后端组件

请阅读对应的文档。
