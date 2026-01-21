/**
 * 插件主入口文件
 * 这是一个兼容 v2.x 和 v3.x 的入口
 */

import { BundlePath } from './business/BundlePath';
import { BasePlugin, createPluginMain, MessageMethod } from './index';

/**
 * 主插件类
 */
class ExtensionsToolsPlugin extends BasePlugin {
    private pluginName: string;

    constructor() {
        super();
        this.pluginName = 'extensions_tools';
    }

    load(): void {
        this.log(`${this.pluginName} loaded successfully!`);
        this.log(`Cocos Creator Version: ${this.editor.getVersion()}`);
        this.log(`Running in ${this.isV2 ? 'v2.x' : 'v3.x'} mode`);
    }

    unload(): void {
        this.log(`${this.pluginName} unloaded.`);
    }

    // // V2.x 消息处理器
    // messages = {
    //     'open': () => this.handleOpen(),
    //     'say-hello': () => this.handleSayHello(),
    //     'clicked': () => this.handleClicked(),
    // };

    // // V3.x 方法处理器
    // methods = {
    //     openPanel: () => this.handleOpen(),
    //     sayHello: () => this.handleSayHello(),
    //     clicked: () => this.handleClicked(),
    // };

    // ==================== 业务逻辑 ====================
    /** 生成 Bundle 路径映射 */
    @MessageMethod
    private bundlePath(): void {
        BundlePath.run();
    }

    private handleOpen(): void {
        this.log('Opening panel...');
        this.openPanel(this.pluginName);
    }

    private handleSayHello(): void {
        this.log('Hello from Extensions Tools!');

        // 发送消息到面板
        if (this.isV2) {
            this.sendToPanel(this.pluginName, `${this.pluginName}:hello`);
        } else {
            // V3.x 使用 methods
            this.sendToPanel(`${this.pluginName}.default`, 'hello');
        }
    }

    private handleClicked(): void {
        this.log('Panel button clicked!');
    }
}

// 创建插件实例
const plugin = new ExtensionsToolsPlugin();
const exportedModule = createPluginMain(plugin);

// CommonJS 导出 (v2.x)
module.exports = exportedModule;

// ES Module 导出 (v3.x)
export const load = exportedModule.load;
export const unload = exportedModule.unload;
export const methods = exportedModule.methods;
