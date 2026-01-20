/**
 * V2.x Scene 适配器
 */

import { ISceneAdapter } from '../../core/interfaces';

declare const Editor: any;

export class SceneAdapterV2 implements ISceneAdapter {
    async queryCurrentScene(): Promise<any> {
        return new Promise((resolve, reject) => {
            Editor.Ipc.sendToPanel('scene', 'scene:query-node', 'root', (error: any, node: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(node);
                }
            });
        });
    }

    async queryNode(uuid: string): Promise<any> {
        return new Promise((resolve, reject) => {
            Editor.Ipc.sendToPanel('scene', 'scene:query-node', uuid, (error: any, node: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(node);
                }
            });
        });
    }

    async executeSceneScript(methodName: string, ...args: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            Editor.Ipc.sendToPanel(
                'scene',
                'scene:execute-scene-script',
                methodName,
                ...args,
                (error: any, result: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }
}
