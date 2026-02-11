/**
 * @author OldPoint
 * @date 2026-02-11 11:47
 * @filePath assets\scripts\PromiseUtil.ts
 * @description 
 */
export class PromiseUtil {

    public static awaitTo<T>(promise: Promise<T>): Promise<[Error, T | null]> {
        if (promise) {
            return new Promise<[any, T | null]>((resolve, reject) => {
                promise.then((data: T) => {
                    resolve([null, data]);
                }).catch((err: any) => {
                    resolve([err, null]);
                });
            });
        }
        return Promise.resolve([new Error("No promise provided"), null]);
    }

    public static execute(promises: Promise<any>[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (promises && promises.length != 0) {
                Promise.all(promises).then(() => {
                    resolve();
                }).catch(() => {
                    reject();
                });
            } else {
                resolve();
            }
        });
    }

}