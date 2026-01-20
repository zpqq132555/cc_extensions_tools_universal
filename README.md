# Cocos Creator 跨版本通用插件系统

## 设计思路

本插件系统采用 **抽象接口 + 版本检测 + 工厂模式 + 适配器模式** 实现跨 Cocos Creator 2.x 和 3.x 版本的兼容。

## 目录结构

```
extensions_tools_universal/
├── package.json              # 统一入口配置
├── package.v2.json           # v2.x 专用配置（运行时复制）
├── package.v3.json           # v3.x 专用配置（运行时复制）
├── tsconfig.json             # TypeScript 配置
├── scripts/
│   └── install.js            # 安装脚本，检测版本并配置
├── src/
│   ├── index.ts              # 统一入口
│   ├── version-detector.ts   # 版本检测器
│   ├── core/
│   │   ├── interfaces.ts     # 抽象接口定义
│   │   ├── factory.ts        # 工厂模式实现
│   │   └── base-plugin.ts    # 基础插件类
│   ├── adapters/
│   │   ├── v2/
│   │   │   ├── editor-adapter.ts   # v2.x Editor API 适配器
│   │   │   ├── panel-adapter.ts    # v2.x Panel 适配器
│   │   │   └── ipc-adapter.ts      # v2.x IPC 适配器
│   │   └── v3/
│   │       ├── editor-adapter.ts   # v3.x Editor API 适配器
│   │       ├── panel-adapter.ts    # v3.x Panel 适配器
│   │       └── ipc-adapter.ts      # v3.x IPC 适配器
│   └── business/
│       └── my-feature.ts     # 业务逻辑（与版本无关）
├── dist/                     # 编译输出
│   ├── v2/                   # v2.x 编译产物
│   └── v3/                   # v3.x 编译产物
└── static/
    └── template/             # 公共模板资源
```

## 核心设计模式

### 1. 抽象接口 (interfaces.ts)
定义所有版本通用的接口，屏蔽版本差异。

### 2. 版本检测 (version-detector.ts)
自动检测当前 Cocos Creator 版本，决定使用哪套适配器。

### 3. 工厂模式 (factory.ts)
根据版本动态创建对应的适配器实例。

### 4. 适配器模式 (adapters/)
将不同版本的 API 统一为相同接口。

## 使用方法

1. 克隆本仓库到项目的插件目录
2. 运行 `npm install` 自动检测版本并配置
3. 开发时只需关注 `src/business/` 目录

## 版本兼容性

- ✅ Cocos Creator 2.4.x
- ✅ Cocos Creator 3.x (>=3.0.0)
