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

    // 收集所有标记了 @MessageMethod 的方法
    const collectMethods = (): Record<string, any> => {
        const methods: Record<string, any> = {};
        let proto = Object.getPrototypeOf(plugin);
        
        console.log('[Plugin] Collecting methods from prototype chain...');
        
        // 遍历原型链收集所有方法
        while (proto && proto !== Object.prototype) {
            console.log('[Plugin] Checking prototype:', proto.constructor?.name);
            
            // 从原型的 methods 或 messages 中收集
            if (proto.methods) {
                console.log('[Plugin] Found methods:', Object.keys(proto.methods));
                Object.assign(methods, proto.methods);
            }
            if (proto.messages) {
                console.log('[Plugin] Found messages:', Object.keys(proto.messages));
                Object.assign(methods, proto.messages);
            }
            proto = Object.getPrototypeOf(proto);
        }
        
        console.log('[Plugin] Total methods collected:', Object.keys(methods));
        
        // 绑定到实例
        const bound: Record<string, any> = {};
        for (const key of Object.keys(methods)) {
            const fn = methods[key];
            bound[key] = typeof fn === 'function' ? fn.bind(plugin) : fn;
        }
        return bound;
    };

    const allMethods = collectMethods();

    if (version === CocosVersion.V2) {
        // V2.x 格式: module.exports = { load, unload, messages }
        // V2 的 IPC 消息需要回调函数作为最后一个参数
        // 消息名称格式：table_tool:methodName
        const wrappedMethods: Record<string, any> = {};
        for (const [key, fn] of Object.entries(allMethods)) {
            // v2 消息 key 不需要包名前缀，Cocos v2 框架会自动路由
            wrappedMethods[key] = function(...args: any[]) {
                // v2 消息处理器签名：function(event, ...msgArgs)
                // event 对象包含 reply 方法用于发送回调
                // callback 不在参数列表中，而是由 IPC 框架管理
                const event = args[0];
                const actualArgs = args.slice(1);
                
                console.log(`[Plugin] v2 message: ${key}, hasReply: ${!!(event && event.reply)}, actualArgs:`, actualArgs);
                
                // 执行方法并通过 event.reply 返回结果
                Promise.resolve()
                    .then(() => fn.apply(plugin, actualArgs))
                    .then((result: any) => {
                        console.log(`[Plugin] v2 message ${key} - success, result:`, typeof result);
                        if (event && event.reply) {
                            event.reply(null, result);
                        }
                    })
                    .catch((error: any) => {
                        console.error(`[Plugin] v2 message ${key} - error:`, error);
                        if (event && event.reply) {
                            event.reply(error?.message || String(error));
                        }
                    });
            };
        }
        
        console.log('[Plugin] Registered v2 messages:', Object.keys(wrappedMethods));
        
        return {
            load: () => plugin.load(),
            unload: () => plugin.unload(),
            messages: wrappedMethods,
        };
    } else if (version === CocosVersion.V3) {
        // V3.x 格式: export { load, unload, methods }
        return {
            load: () => plugin.load(),
            unload: () => plugin.unload(),
            methods: allMethods,
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
