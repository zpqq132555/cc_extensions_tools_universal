/**
 * @author OldPoint
 * @date 2026-02-11 11:47
 * @filePath assets\scripts\PromiseUtil.ts
 * @description 
 */
export class PromiseUtil {

    /**
     * 将一个 Promise 转换为始终 resolve 的元组形式，方便在 async/await 中使用而不抛出异常。
     *
     * 返回一个形如 [Error|null, T|null] 的 Promise：
     * - 当原始 promise resolve 时，返回 [null, data]
     * - 当原始 promise reject 时，返回 [err, null]
     * - 当未传入 promise 时，立即返回 [Error, null]
     *
     * 设计目的：避免在 async/await 中使用 try/catch，
     * 通过结构化的返回值统一处理成功/失败分支。
     *
     * 使用示例：
     * const [err, res] = await PromiseUtil.AwaitTo(someAsync());
     * if (err) { handle error } else { use res }
     *
     * @template T 返回值类型
     * @param promise 要包装的 Promise<T>
     * @returns Promise<[Error|null, T|null]>
     */
    public static AwaitTo<T>(promise: Promise<T>): Promise<[Error, T | null]> {
        if (promise) {
            return new Promise<[any, T | null]>((resolve, reject) => {
                promise.then((data: T) => {
                    // 成功：第一个元素为 null，第二个元素为数据
                    resolve([null, data]);
                }).catch((err: any) => {
                    // 失败：第一个元素为错误对象，第二个为 null
                    resolve([err, null]);
                });
            });
        }
        // 如果没有提供 promise，返回一个已 resolve 的错误元组，便于调用方统一处理
        return Promise.resolve([new Error("No promise provided"), null]);
    }

    /**
     * 并行执行一组 Promise，并在所有 Promise 成功时 resolve，任一失败时 reject。
     *
     * 与直接使用 `Promise.all` 的差别主要是对空数组/空引用的容错：
     * - 如果传入 `null` 或空数组，方法会立即 resolve。
     * - 否则行为等同于 `Promise.all(promises)`（全部成功则 resolve，任一失败则 reject）。
     *
     * 使用示例：
     * await PromiseUtil.Execute([p1, p2]); // 所有成功则继续，任一失败则抛出
     *
     * @param promises 要并行执行的 Promise 列表
     * @returns Promise<void> 在所有任务成功时 resolve，否则 reject
     */
    public static Execute(promises: Promise<any>[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (promises && promises.length != 0) {
                Promise.all(promises).then(() => {
                    resolve();
                }).catch(() => {
                    // 只暴露失败/成功的语义，不传回具体错误（保持调用方与 Promise.all 行为一致）
                    reject();
                });
            } else {
                // 空列表视为没有任务，立即完成
                resolve();
            }
        });
    }

}