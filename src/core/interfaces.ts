/**
 * 抽象接口定义 - 屏蔽 Cocos Creator 版本差异
 */

// ==================== 版本枚举 ====================
export enum CocosVersion {
    V2 = 'v2',
    V3 = 'v3',
    UNKNOWN = 'unknown'
}

// ==================== Editor 接口 ====================
export interface IEditorAdapter {
    /** 获取编辑器版本信息 */
    getVersion(): string;
    
    /** 获取大版本号 */
    getMajorVersion(): CocosVersion;
    
    /** 日志输出 */
    log(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    
    /** 获取项目路径 */
    getProjectPath(): string;
    
    /** 获取插件路径 */
    getPackagePath(packageName: string): string;
}

// ==================== Panel 接口 ====================
export interface IPanelConfig {
    /** 面板标题 */
    title: string;
    /** 面板样式 */
    style?: string;
    /** 面板模板 */
    template: string;
    /** 面板宽度 */
    width?: number;
    /** 面板高度 */
    height?: number;
    /** 面板类型 */
    type?: 'dockable' | 'floating' | 'simple';
}

export interface IPanelAdapter {
    /** 打开面板 */
    open(panelName: string): void;
    
    /** 关闭面板 */
    close(panelName: string): void;
    
    /** 定义面板 (返回特定版本的面板定义对象) */
    define(config: IPanelConfig, handlers: IPanelHandlers): any;
}

export interface IPanelHandlers {
    /** DOM 元素引用 (运行时由框架注入) */
    $?: { [key: string]: HTMLElement | null };
    /** 面板准备就绪 */
    ready?(): void;
    /** 面板关闭前 */
    beforeClose?(): void;
    /** 面板关闭 */
    close?(): void;
    /** 面板显示 */
    show?(): void;
    /** 面板隐藏 */
    hide?(): void;
    /** 自定义方法 */
    methods?: { [key: string]: (...args: any[]) => any };
    /** 消息处理 */
    messages?: { [key: string]: (...args: any[]) => any };
}

// ==================== IPC 接口 ====================
export interface IIPCAdapter {
    /** 发送消息到主进程 */
    sendToMain(channel: string, ...args: any[]): void;
    
    /** 发送消息到面板 */
    sendToPanel(panelName: string, channel: string, ...args: any[]): void;
    
    /** 发送广播消息 */
    broadcast(channel: string, ...args: any[]): void;
    
    /** 注册消息监听器 */
    on(channel: string, callback: (...args: any[]) => void): void;
    
    /** 移除消息监听器 */
    off(channel: string, callback?: (...args: any[]) => void): void;
}

// ==================== Menu 接口 ====================
export interface IMenuItem {
    /** 菜单路径 */
    path: string;
    /** 显示标签 */
    label: string;
    /** 触发消息 */
    message: string;
    /** 快捷键 */
    accelerator?: string;
    /** 图标 */
    icon?: string;
}

export interface IMenuAdapter {
    /** 添加菜单项 */
    addMenuItem(item: IMenuItem): void;
    
    /** 移除菜单项 */
    removeMenuItem(path: string): void;
}

// ==================== Asset 接口 ====================
export interface IAssetInfo {
    uuid: string;
    path: string;
    url: string;
    type: string;
    name: string;
}

export interface IAssetAdapter {
    /** 根据 UUID 获取资源信息 */
    queryAssetInfo(uuid: string): Promise<IAssetInfo | null>;
    
    /** 根据路径获取资源信息 */
    queryAssetByPath(path: string): Promise<IAssetInfo | null>;
    
    /** 刷新资源 */
    refresh(path: string): Promise<void>;
    
    /** 创建资源 */
    create(path: string, content: string): Promise<void>;
    
    /** 删除资源 */
    delete(path: string): Promise<void>;
}

// ==================== Scene 接口 ====================
export interface ISceneAdapter {
    /** 获取当前场景根节点 */
    queryCurrentScene(): Promise<any>;
    
    /** 查询节点 */
    queryNode(uuid: string): Promise<any>;
    
    /** 执行场景脚本 */
    executeSceneScript(methodName: string, ...args: any[]): Promise<any>;
}

// ==================== 插件主接口 ====================
export interface IPluginMain {
    /** 插件加载时执行 */
    load(): void | Promise<void>;
    
    /** 插件卸载时执行 */
    unload(): void | Promise<void>;
    
    /** 消息处理器（v2.x 风格） */
    messages?: { [key: string]: (...args: any[]) => any };
    
    /** 方法处理器（v3.x 风格） */
    methods?: { [key: string]: (...args: any[]) => any };
}

// ==================== 统一适配器管理器 ====================
export interface IAdapterManager {
    readonly version: CocosVersion;
    readonly editor: IEditorAdapter;
    readonly panel: IPanelAdapter;
    readonly ipc: IIPCAdapter;
    readonly asset: IAssetAdapter;
    readonly scene: ISceneAdapter;
}
