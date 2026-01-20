/**
 * V3.x Scene 适配器
 */

import { ISceneAdapter } from '../../core/interfaces';

declare const Editor: any;

export class SceneAdapterV3 implements ISceneAdapter {
    async queryCurrentScene(): Promise<any> {
        try {
            return await Editor.Message.request('scene', 'query-node-tree');
        } catch (error) {
            console.error('[SceneAdapterV3] queryCurrentScene error:', error);
            throw error;
        }
    }

    async queryNode(uuid: string): Promise<any> {
        try {
            return await Editor.Message.request('scene', 'query-node', uuid);
        } catch (error) {
            console.error('[SceneAdapterV3] queryNode error:', error);
            throw error;
        }
    }

    async executeSceneScript(methodName: string, ...args: any[]): Promise<any> {
        try {
            return await Editor.Message.request('scene', 'execute-scene-script', {
                name: methodName,
                method: methodName,
                args: args,
            });
        } catch (error) {
            console.error('[SceneAdapterV3] executeSceneScript error:', error);
            throw error;
        }
    }
}
