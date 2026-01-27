# Cocos Creator 跨版本通用插件系统

## 📖 简介

本插件系统采用 **抽象接口 + 版本检测 + 工厂模式 + 适配器模式** 实现跨 Cocos Creator 2.x 和 3.x 版本的兼容。

### 核心特性

- ✅ **跨版本兼容** - 自动检测 Cocos Creator 版本，使用对应的 API
- ✅ **统一接口** - 提供一致的开发体验，无需编写版本判断代码
- ✅ **模块化设计** - 核心功能与业务逻辑分离，易于扩展维护
- ✅ **TypeScript 支持** - 完整的类型定义，开发更安全高效
- ✅ **Inspector 扩展** - 支持在资源管理器中显示自定义属性面板
- ✅ **日志管理系统** - 功能完善的日志管理，支持等级/类型过滤、开关控制
- ✅ **通用工具库** - 文件操作、双向同步等常用工具方法

### 工具库概览

| 工具类 | 位置 | 说明 |
|--------|------|------|
| LogManager | `assets/log/LogManager.ts` | 日志管理系统，支持等级、类型分类、开关控制 |
| Tools | `src/tools/Tools.ts` | 通用工具类，文件操作、目录同步等 |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 编译插件
npm run build

# 或分别编译
npm run build:v2  # 编译 Cocos 2.x 版本
npm run build:v3  # 编译 Cocos 3.x 版本
```

## 📁 目录结构

```
extensions_tools_universal/
├── package.json              # 主配置文件（v2 格式）
├── package.v3.json           # Cocos 3.x 专用配置
├── tsconfig.json             # TypeScript 基础配置
├── README.md                 # 本文档（简要说明）
├── 使用说明.md              # 详细使用文档
│
├── assets/                   # 游戏运行时工具类（V3 自动挂载，V2 双向同步）
│   ├── log/                  # 日志管理模块
│   │   └── LogManager.ts     # 日志管理器
│   └── utils/                # 通用工具（预留）
│
├── src/                      # 编辑器插件源代码
│   ├── index.ts              # 统一导出入口
│   ├── main.ts               # 插件主入口
│   │
│   ├── core/                 # 核心框架
│   │   ├── interfaces.ts     # 跨版本抽象接口
│   │   ├── version-detector.ts # 版本检测器
│   │   ├── factory.ts        # 适配器工厂
│   │   └── base-plugin.ts    # 基础插件类
│   │
│   ├── adapters/             # 版本适配器
│   │   ├── v2/               # Cocos 2.x 适配器
│   │   └── v3/               # Cocos 3.x 适配器
│   │
│   ├── tools/                # 通用工具类
│   │   └── Tools.ts          # 文件操作、双向同步等
│   │
│   ├── business/             # 业务功能模块
│   │   └── BundlePath.ts     # Bundle 路径映射工具
│   │
│   └── asset_directory/      # Inspector 扩展
│       └── index.ts          # 资源目录说明
│
├── dist/                     # 编译输出目录
│   ├── v2/                   # v2 编译产物
│   └── v3/                   # v3 编译产物
│
├── i18n/                     # 国际化
└── scripts/                  # 构建脚本
```

## 🔧 核心设计模式

### 1. 抽象接口 (interfaces.ts)
定义所有版本通用的接口，屏蔽版本差异。

### 2. 版本检测 (version-detector.ts)
自动检测当前 Cocos Creator 版本，决定使用哪套适配器。

### 3. 工厂模式 (factory.ts)
根据版本动态创建对应的适配器实例。

### 4. 适配器模式 (adapters/)
将不同版本的 API 统一为相同接口。

## 📝 工具类说明

### Tools 通用工具类

```typescript
import { Tools } from './tools/Tools';

// 文件/目录操作
Tools.CopyFileSync(src, dest);           // 复制文件
Tools.CopyDirSync(srcDir, destDir);      // 复制目录
Tools.WriteFileSync(file, data);         // 写入文件
Tools.ReadDir(dir, callback);            // 遍历目录

// 目录时间检测
Tools.GetDirectoryModifyTime(dir);       // 获取目录最新修改时间

// 文件删除
Tools.DeleteFilesByPattern(dir, ['.meta']); // 按模式删除文件

// 双向同步
Tools.BidirectionalSync(dirA, dirB, {
    ignorePatterns: ['.meta', '.git'],   // 忽略的文件
    deletePatterns: ['.meta'],            // 同步后删除的文件
    preferDir: 'auto',                    // 'auto' | 'A' | 'B'
    onLog: console.log
});
```

### LogManager 日志管理

```typescript
import { Logger, LogLevel, LogType } from './assets/log/LogManager';

// 基础用法
Logger.info("消息");
Logger.debug("调试", data);
Logger.warn("警告");
Logger.error("错误", error);

// 配置
Logger.setEnabled(true);              // 开关
Logger.setLevel(LogLevel.WARN);       // 等级
Logger.setTypeEnabled(LogType.NET, false); // 类型开关
```

## ✅ 版本兼容性

- ✅ Cocos Creator 2.4.x
- ✅ Cocos Creator 3.x (>=3.0.0)

## 📚 详细文档

请查看 [使用说明.md](使用说明.md) 获取完整的使用文档。

## 📝 版本历史

### v1.1.0 (2026-01-27)
- ✅ 新增日志管理系统（LogManager）
- ✅ 新增通用工具类（Tools）
- ✅ 新增双向同步功能（BidirectionalSync）
- ✅ 完善文档说明

### v1.0.0 (2026-01-21)
- ✅ 实现跨版本适配器框架
- ✅ 添加 Bundle 路径映射工具
- ✅ 实现资源目录说明 Inspector

## 📄 许可证

MIT License
