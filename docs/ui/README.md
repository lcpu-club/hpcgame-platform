# HPCGamePlatform UI

确保完成了 MonoRepo 的环境配置。您还需要配置好 Server 的所有环境。

## 配置文件

下面是示例的开发配置文件。请将其保存为包根目录下的`.env`文件。

```env
VITE_DEV_MODE=true
VITE_MAIN_API=http://localhost:10721
VITE_GRAVATAR_URL=https://cravatar.cn/avatar/
```

## 包结构

- `public`：将直接暴露在公网的资源。
- `src`：源代码
  - `api`：和 Server 交互的 API。
  - `assets`：需要编译期确定位置的资源。
  - `components`：组件。
  - `layouts`：页面布局。目前仅需一个默认布局，无需更改。
  - `router`：前端路由。
  - `styles`：样式表。注意尽量使用 WindiCSS 类，能不写自定义类就别写。
  - `utils`：工具函数。
  - `views`：页面。

## 常用开发命令

- `yarn dev`：启动 Dev Server。
- `yarn lint`：检查代码问题。
