/**
 * V3.x IPC 适配器
 */

import { IIPCAdapter } from '../../core/interfaces';

declare const Editor: any;

export class IPCAdapterV3 implements IIPCAdapter {
    sendToMain(channel: string, ...args: any[]): void {
        Editor.Message.send('extension', channel, ...args);
    }

    sendToPanel(panelName: string, channel: string, ...args: any[]): void {
        Editor.Message.send(panelName, channel, ...args);
    }

    broadcast(channel: string, ...args: any[]): void {
        Editor.Message.broadcast(channel, ...args);
    }

    on(channel: string, callback: (...args: any[]) => void): void {
        // V3.x 中消息监听通常在 contributions.messages 中配置
        // 运行时监听需要使用 Editor.Message.addBroadcastListener
        if (Editor.Message?.addBroadcastListener) {
            Editor.Message.addBroadcastListener(channel, callback);
        }
    }

    off(channel: string, callback?: (...args: any[]) => void): void {
        if (Editor.Message?.removeBroadcastListener) {
            Editor.Message.removeBroadcastListener(channel, callback);
        }
    }
}
