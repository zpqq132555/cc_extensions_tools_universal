/**
 * 示例插件 - 展示如何使用跨版本插件系统
 */

import { BasePlugin, createPluginMain } from '../core/base-plugin';

// @ts-ignore
import packageJSON from '../../package.json';

class MyPlugin extends BasePlugin {
    private pluginName = packageJSON.name;

    /**
     * 插件加载
     */
    load(): void {
        this.log(`${this.pluginName} loaded!`);
        this.log(`Running on Cocos Creator ${this.isV2 ? '2.x' : '3.x'}`);
    }

    /**
     * 插件卸载
     */
    unload(): void {
        this.log(`${this.pluginName} unloaded!`);
    }

    /**
     * 消息/方法处理器
     * V2.x 会使用 messages，V3.x 会使用 methods
     */
    messages = {
        // V2.x: 'extensions_tools:open'
        'open': () => this.onOpen(),
        'say-hello': () => this.onSayHello(),
        'clicked': () => this.onClicked(),
    };

    methods = {
        // V3.x: contributions.messages 中配置的方法
        'openPanel': () => this.onOpen(),
        'sayHello': () => this.onSayHello(),
        'clicked': () => this.onClicked(),
    };

    // ==================== 业务逻辑 ====================

    private onOpen(): void {
        this.openPanel(this.pluginName);
    }

    private onSayHello(): void {
        this.log('Hello World!');
        
        // 跨版本发送消息到面板
        if (this.isV2) {
            this.sendToPanel(this.pluginName, `${this.pluginName}:hello`);
        } else {
            // V3.x 使用 default panel
            this.sendToPanel(`${this.pluginName}.default`, 'hello');
        }
    }

    private onClicked(): void {
        this.log('Button clicked!');
    }
}

// 创建插件实例并导出
const plugin = new MyPlugin();
const exportedModule = createPluginMain(plugin);

// 兼容两种模块系统
module.exports = exportedModule;
export const { load, unload, methods } = exportedModule;
