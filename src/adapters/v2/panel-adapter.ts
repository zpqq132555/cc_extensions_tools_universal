/**
 * V2.x Panel 适配器
 */

import { IPanelAdapter, IPanelConfig, IPanelHandlers } from '../../core/interfaces';

declare const Editor: any;

export class PanelAdapterV2 implements IPanelAdapter {
    open(panelName: string): void {
        Editor.Panel.open(panelName);
    }

    close(panelName: string): void {
        Editor.Panel.close(panelName);
    }

    /**
     * 定义面板 - V2.x 使用 Editor.Panel.extend
     */
    define(config: IPanelConfig, handlers: IPanelHandlers): any {
        const panelDefinition: any = {
            style: config.style || '',
            template: config.template,
            $: this.extractSelectors(config.template),
        };

        // 添加生命周期方法
        if (handlers.ready) {
            panelDefinition.ready = handlers.ready;
        }

        if (handlers.close) {
            panelDefinition.close = handlers.close;
        }

        // V2.x 没有 beforeClose，但可以在 close 中处理
        if (handlers.beforeClose && !handlers.close) {
            panelDefinition.close = handlers.beforeClose;
        }

        // 添加自定义方法
        if (handlers.methods) {
            Object.assign(panelDefinition, handlers.methods);
        }

        // 添加消息处理
        if (handlers.messages) {
            panelDefinition.messages = handlers.messages;
        }

        return Editor.Panel.extend(panelDefinition);
    }

    /**
     * 从模板中提取选择器（简单实现）
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
