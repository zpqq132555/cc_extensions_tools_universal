/**
 * V2.x IPC 适配器
 */

import { IIPCAdapter } from '../../core/interfaces';

declare const Editor: any;

export class IPCAdapterV2 implements IIPCAdapter {
    sendToMain(channel: string, ...args: any[]): void {
        Editor.Ipc.sendToMain(channel, ...args);
    }

    sendToPanel(panelName: string, channel: string, ...args: any[]): void {
        Editor.Ipc.sendToPanel(panelName, channel, ...args);
    }

    broadcast(channel: string, ...args: any[]): void {
        Editor.Ipc.sendToAll(channel, ...args);
    }

    on(channel: string, callback: (...args: any[]) => void): void {
        // V2.x 中消息监听通常在 messages 对象中定义
        // 这里提供一个运行时注册的方式
        if (Editor.Ipc.on) {
            Editor.Ipc.on(channel, callback);
        }
    }

    off(channel: string, callback?: (...args: any[]) => void): void {
        if (Editor.Ipc.off) {
            Editor.Ipc.off(channel, callback);
        }
    }
}
