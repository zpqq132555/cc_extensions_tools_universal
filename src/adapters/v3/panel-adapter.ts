/**
 * V3.x Panel 适配器
 */

import { IPanelAdapter, IPanelConfig, IPanelHandlers } from '../../core/interfaces';

declare const Editor: any;

export class PanelAdapterV3 implements IPanelAdapter {
    open(panelName: string): void {
        Editor.Panel.open(panelName);
    }

    close(panelName: string): void {
        Editor.Panel.close(panelName);
    }

    /**
     * 定义面板 - V3.x 使用 Editor.Panel.define
     */
    define(config: IPanelConfig, handlers: IPanelHandlers): any {
        const panelDefinition: any = {
            template: config.template,
            style: config.style || '',
            $: this.extractSelectors(config.template),
            methods: {},
            listeners: {},
        };

        // 添加 listeners
        if (handlers.show) {
            panelDefinition.listeners.show = handlers.show;
        }
        if (handlers.hide) {
            panelDefinition.listeners.hide = handlers.hide;
        }

        // 添加生命周期方法
        if (handlers.ready) {
            panelDefinition.ready = handlers.ready;
        }
        if (handlers.beforeClose) {
            panelDefinition.beforeClose = handlers.beforeClose;
        }
        if (handlers.close) {
            panelDefinition.close = handlers.close;
        }

        // 添加自定义方法
        if (handlers.methods) {
            panelDefinition.methods = { ...panelDefinition.methods, ...handlers.methods };
        }

        // V3.x 消息通过 contributions 配置，这里的 messages 转换为 methods
        if (handlers.messages) {
            for (const [key, fn] of Object.entries(handlers.messages)) {
                // 将消息名转换为方法名（移除包名前缀）
                const methodName = key.includes(':') ? key.split(':').pop()! : key;
                panelDefinition.methods[methodName] = fn;
            }
        }

        return Editor.Panel.define(panelDefinition);
    }

    /**
     * 从模板中提取选择器
     */
    private extractSelectors(template: string): { [key: string]: string } {
        const selectors: { [key: string]: string } = {};
        const idRegex = /id=["']([^"']+)["']/g;
        let match;

        while ((match = idRegex.exec(template)) !== null) {
            const id = match[1];
            selectors[id] = `#${id}`;
        }

        return selectors;
    }
}
