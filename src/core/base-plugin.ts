/**
 * 基础插件类 - 提供跨版本的统一插件开发接口
 */

import { AdapterFactory } from './factory';
import {
    CocosVersion,
    IAdapterManager,
    IAssetAdapter,
    IEditorAdapter,
    IIPCAdapter,
    IPanelAdapter,
    IPluginMain,
    ISceneAdapter
} from './interfaces';
import { VersionDetector } from './version-detector';

/**
 * 基础插件抽象类
 * 继承此类来创建跨版本兼容的插件
 */
export abstract class BasePlugin implements IPluginMain {
    protected adapters: IAdapterManager;
    
    constructor() {
        this.adapters = AdapterFactory.getInstance();
    }

    // ==================== 便捷访问器 ====================
    
    protected get version(): CocosVersion {
        return this.adapters.version;
    }

    protected get editor(): IEditorAdapter {
        return this.adapters.editor;
    }

    protected get panel(): IPanelAdapter {
        return this.adapters.panel;
    }

    protected get ipc(): IIPCAdapter {
        return this.adapters.ipc;
    }

    protected get asset(): IAssetAdapter {
        return this.adapters.asset;
    }

    protected get scene(): ISceneAdapter {
        return this.adapters.scene;
    }

    protected get isV2(): boolean {
        return VersionDetector.isV2();
    }

    protected get isV3(): boolean {
        return VersionDetector.isV3();
    }

    // ==================== 生命周期方法 ====================

    /**
     * 插件加载时执行
     * 子类应重写此方法
     */
    abstract load(): void | Promise<void>;

    /**
     * 插件卸载时执行
     * 子类应重写此方法
     */
    abstract unload(): void | Promise<void>;

    // ==================== 消息/方法定义 ====================
    
    /**
     * V2.x 风格的消息处理器
     * 子类可重写此属性
     */
    messages?: { [key: string]: (...args: any[]) => any };

    /**
     * V3.x 风格的方法处理器
     * 子类可重写此属性
     */
    methods?: { [key: string]: (...args: any[]) => any };

    // ==================== 工具方法 ====================

    /**
     * 日志输出
     */
    protected log(message: string, ...args: any[]): void {
        this.editor.log(message, ...args);
    }

    protected warn(message: string, ...args: any[]): void {
        this.editor.warn(message, ...args);
    }

    protected error(message: string, ...args: any[]): void {
        this.editor.error(message, ...args);
    }

    /**
     * 打开面板
     */
    protected openPanel(panelName: string): void {
        this.panel.open(panelName);
    }

    /**
     * 关闭面板
     */
    protected closePanel(panelName: string): void {
        this.panel.close(panelName);
    }

    /**
     * 发送消息到面板
     */
    protected sendToPanel(panelName: string, channel: string, ...args: any[]): void {
        this.ipc.sendToPanel(panelName, channel, ...args);
    }

    /**
     * 广播消息
     */
    protected broadcast(channel: string, ...args: any[]): void {
        this.ipc.broadcast(channel, ...args);
    }
}

/**
 * 创建跨版本兼容的插件主模块
 */
export function createPluginMain(plugin: BasePlugin): any {
    const version = VersionDetector.detect();

    if (version === CocosVersion.V2) {
        // V2.x 格式: module.exports = { load, unload, messages }
        return {
            load: () => plugin.load(),
            unload: () => plugin.unload(),
            messages: plugin.messages || {},
        };
    } else if (version === CocosVersion.V3) {
        // V3.x 格式: export { load, unload, methods }
        return {
            load: () => plugin.load(),
            unload: () => plugin.unload(),
            methods: plugin.methods || {},
        };
    }

    throw new Error(`Unsupported Cocos Creator version: ${version}`);
}

/**
 * 装饰器：将方法同时注册为 message 和 method
 */
export function MessageMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    // 确保 messages 和 methods 对象存在
    if (!target.messages) target.messages = {};
    if (!target.methods) target.methods = {};
    
    // 注册到两个对象
    target.messages[propertyKey] = originalMethod;
    target.methods[propertyKey] = originalMethod;
    
    return descriptor;
}
