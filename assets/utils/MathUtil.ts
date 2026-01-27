/**
 * @author OldPoint
 * @date 2026-01-22 08:45
 * @filePath assets\scripts\utils\MathUtil.ts
 * @description 
 */
export class MathUtil {

    /**
     * 区间随机整数
     * @param min 最小值
     * @param max 最大值
     * @returns 区间随机数
     */
    public static RandomRangeInt(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min));
    }
    /**
     * 生成指定长度的随机字符串
     * @param length 字符串长度
     * @returns 随机字符串
     */
    public static RandomString(length: number): string {
        const baseCharacterSet = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        let numberString = "";
        for (let i = 0; i < length; i++) {
            numberString += baseCharacterSet.charAt(Math.floor(Math.random() * baseCharacterSet.length));
        }
        return numberString;
    }

    /**
     * 计算两点间距离
     * @param pointA 
     * @param pointB 
     * @returns 
     */
    public static GetDistance(pointA: { x: number, y: number }, pointB: { x: number, y: number }): number {
        if (!pointA || !pointB) return 10000;
        const deltaX = pointB.x - pointA.x;
        const deltaY = pointB.y - pointA.y;
        const squaredDistance = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
        return Math.sqrt(squaredDistance);
    }

    /**
     * 计算三角形的边长
     * @param angleInDegrees 角度（度）
     * @param adjacentLength 邻边长度
     * @param isOppositeCalculation 是否计算对边
     * @returns hypotenuse 斜边长度
     * @returns opposite 对边长度（如果 isOppositeCalculation 为 true 则返回）
     * @returns adjacent 邻边长度（如果 isOppositeCalculation 为 false 则返回）
     */
    public static CalculateTriangleSides(angleInDegrees: number, adjacentLength: number, isOppositeCalculation: boolean): { hypotenuse: number, opposite?: number, adjacent?: number } {
        const angleInRadians = angleInDegrees * (Math.PI / 180);
        const result: { hypotenuse: number, opposite?: number, adjacent?: number } = { hypotenuse: 0 };
        if (isOppositeCalculation) {
            result.hypotenuse = adjacentLength / Math.cos(angleInRadians);
            result.opposite = adjacentLength * Math.tan(angleInRadians);
        } else {
            result.hypotenuse = adjacentLength / Math.sin(angleInRadians);
            result.adjacent = adjacentLength / Math.tan(angleInRadians);
        }
        return result;
    }

    /**
     * 根据斜边长度计算直角三角形的对边和邻边
     * @description 已知直角三角形的一个锐角和斜边长度，计算对边和邻边的长度
     * @param angleInDegrees 锐角的角度值（单位：度）
     * @param hypotenuseLength 斜边长度
     * @returns 包含 opposite（对边）和 adjacent（邻边）的对象
     * @example
     * MathUtil.CalculateRightTriangleSides(30, 10); // { opposite: 5, adjacent: 8.66 }
     */
    public static CalculateRightTriangleSides(angleInDegrees: number, hypotenuseLength: number): { opposite: number; adjacent: number } {
        const angleInRadians = angleInDegrees * (Math.PI / 180);
        return {
            opposite: hypotenuseLength * Math.sin(angleInRadians),
            adjacent: hypotenuseLength * Math.cos(angleInRadians)
        };
    }

    /**
     * 区间随机浮点数
     * @description 生成指定范围内的随机浮点数（包含 min，不包含 max）
     * @param min 最小值（包含）
     * @param max 最大值（不包含）
     * @returns 区间内的随机浮点数
     * @example
     * MathUtil.RandomRangeFloat(0, 1); // 0.123456789
     * MathUtil.RandomRangeFloat(1.5, 3.5); // 2.789
     */
    public static RandomRangeFloat(min: number, max: number): number {
        return min + Math.random() * (max - min);
    }

    /**
     * 从数组中随机获取一个元素
     * @description 随机返回数组中的一个元素
     * @param arr 源数组
     * @returns 随机选中的数组元素
     * @example
     * MathUtil.RandomArray([1, 2, 3, 4, 5]); // 3 (随机)
     * MathUtil.RandomArray(['a', 'b', 'c']); // 'b' (随机)
     */
    public static RandomArray<T>(arr: Array<T>): T {
        return arr[this.RandomRangeInt(0, arr.length)];
    }

    /**
     * 生成指定范围内不重复的随机整数数组
     * @description 从 [min, max) 范围内随机选取指定数量的不重复整数
     * @param min 最小值（包含）
     * @param max 最大值（不包含）
     * @param count 需要生成的随机数个数
     * @returns 不重复的随机整数数组，如果参数无效则返回 null
     * @example
     * MathUtil.RandomIntBoth(0, 10, 5); // [3, 7, 1, 9, 4] (随机且不重复)
     */
    public static RandomIntBoth(min: number, max: number, count: number): number[] | null {
        min = Math.floor(min);
        max = Math.floor(max);

        if (min >= max || max - min < count || count === 0) {
            console.error("min >= max || max - min < count || count == 0");
            return null;
        }

        const pool: number[] = [];
        for (let i = min; i < max; i++) {
            pool.push(i);
        }

        // 简易洗牌
        for (let i = pool.length - 1; i > 0; i--) {
            const j = this.RandomRangeInt(0, i + 1);
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        const resultCount = Math.min(pool.length, count);
        const result: number[] = [];
        for (let i = 0; i < resultCount; i++) {
            result.push(pool[i]);
        }

        return result;
    }

    /**
     * 弧度转角度
     * @description 将弧度值转换为角度值
     * @param radian 弧度值
     * @returns 角度值
     * @example
     * MathUtil.GetAngle(Math.PI); // 180
     * MathUtil.GetAngle(Math.PI / 2); // 90
     */
    public static GetAngle(radian: number): number {
        return (180 * radian) / Math.PI;
    }

    /**
     * 角度转弧度
     * @description 将角度值转换为弧度值
     * @param angle 角度值
     * @returns 弧度值
     * @example
     * MathUtil.GetRadian(180); // Math.PI (≈3.14159)
     * MathUtil.GetRadian(90); // Math.PI / 2 (≈1.5708)
     */
    public static GetRadian(angle: number): number {
        return (angle / 180) * Math.PI;
    }

    /**
     * 计算两点之间的弧度
     * @description 计算从点 pointA 到点 pointB 的方向的弧度值
     * @param pointA 起始点坐标
     * @param pointB 目标点坐标
     * @returns 两点连线与 X 轴正方向的夹角（弧度）
     * @example
     * MathUtil.GetRadianTwoPoint({x: 0, y: 0}, {x: 1, y: 1}); // Math.PI / 4 (≈0.785)
     */
    public static GetRadianTwoPoint(pointA: { x: number; y: number }, pointB: { x: number; y: number }): number {
        const deltaX = pointB.x - pointA.x;
        const deltaY = pointB.y - pointA.y;
        return Math.atan2(deltaY, deltaX);
    }

    /**
     * 计算两点之间的角度
     * @description 计算从点 pointA 到点 pointB 的方向的角度值（0-360度）
     * @param pointA 起始点坐标
     * @param pointB 目标点坐标
     * @returns 两点连线与 X 轴正方向的夹角（角度，范围 0-360）
     * @example
     * MathUtil.GetAngleTwoPoint({x: 0, y: 0}, {x: 1, y: 1}); // 45
     * MathUtil.GetAngleTwoPoint({x: 0, y: 0}, {x: -1, y: 0}); // 180
     */
    public static GetAngleTwoPoint(pointA: { x: number; y: number }, pointB: { x: number; y: number }): number {
        const deltaY = pointB.y - pointA.y;
        const deltaX = pointB.x - pointA.x;

        if (deltaY === 0) {
            return deltaX < 0 ? 180 : 0;
        }

        if (deltaX === 0) {
            return deltaY > 0 ? 90 : 270;
        }

        let angle = this.GetAngle(Math.atan(Math.abs(deltaY) / Math.abs(deltaX)));

        if (deltaX > 0) {
            if (deltaY < 0) {
                angle = 360 - angle;
            }
        } else {
            angle = deltaY > 0 ? 180 - angle : 180 + angle;
        }

        return angle;
    }

    /**
     * 截取指定小数位数（向下取整）
     * @description 将数值截取到指定的小数位数，不进行四舍五入
     * @param value 需要截取的数值
     * @param decimals 保留的小数位数，默认为 0
     * @returns 截取后的数值
     * @example
     * MathUtil.ExactCount(3.14159, 2); // 3.14
     * MathUtil.ExactCount(3.99999, 0); // 3
     */
    public static ExactCount(value: number, decimals: number = 0): number {
        const multiplier = Math.pow(10, decimals);
        return ((value * multiplier) | 0) / multiplier;
    }

    /**
     * 计算二次贝塞尔曲线在指定点的切线角度
     * @description 根据二次贝塞尔曲线的三个控制点和参数 t，计算曲线在该点的切线方向角度
     * @param p0 起始点
     * @param p1 控制点
     * @param p2 结束点
     * @param t 曲线参数（0-1）
     * @returns 切线角度（角度值）
     * @example
     * MathUtil.GetBezierCutAngle({x:0,y:0}, {x:50,y:100}, {x:100,y:0}, 0.5); // 0
     */
    public static GetBezierCutAngle(
        p0: { x: number; y: number },
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        t: number
    ): number {
        const dx = 2 * (p0.x * (t - 1) + p1.x * (1 - 2 * t) + p2.x * t);
        const dy = 2 * (p0.y * (t - 1) + p1.y * (1 - 2 * t) + p2.y * t);
        return this.GetAngle(Math.atan2(dy, dx));
    }

    /**
     * 计算二次贝塞尔曲线上的点坐标
     * @description 根据二次贝塞尔曲线的三个控制点和参数 t，计算曲线上对应点的坐标
     * @param p0 起始点
     * @param p1 控制点
     * @param p2 结束点
     * @param t 曲线参数（0-1）
     * @param out 可选的输出对象，用于存储结果以减少内存分配
     * @returns 曲线上的点坐标
     * @example
     * MathUtil.GetBezierPoint({x:0,y:0}, {x:50,y:100}, {x:100,y:0}, 0.5); // {x:50, y:50}
     */
    public static GetBezierPoint(
        p0: { x: number; y: number },
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        t: number,
        out?: { x: number; y: number }
    ): { x: number; y: number } {
        if (!out) out = { x: 0, y: 0 };
        const oneMinusT = 1 - t;
        out.x = oneMinusT * oneMinusT * p0.x + 2 * t * oneMinusT * p1.x + t * t * p2.x;
        out.y = oneMinusT * oneMinusT * p0.y + 2 * t * oneMinusT * p1.y + t * t * p2.y;
        return out;
    }

    /**
     * 计算三次贝塞尔曲线上的点坐标
     * @description 根据三次贝塞尔曲线的四个控制点和参数 t，计算曲线上对应点的坐标
     * @param p0 起始点
     * @param p1 第一控制点
     * @param p2 第二控制点
     * @param p3 结束点
     * @param t 曲线参数（0-1）
     * @param out 可选的输出对象，用于存储结果以减少内存分配
     * @returns 曲线上的点坐标
     * @example
     * MathUtil.GetBezier3Point({x:0,y:0}, {x:30,y:60}, {x:70,y:60}, {x:100,y:0}, 0.5);
     */
    public static GetBezier3Point(
        p0: { x: number; y: number },
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        p3: { x: number; y: number },
        t: number,
        out?: { x: number; y: number }
    ): { x: number; y: number } {
        if (!out) out = { x: 0, y: 0 };

        const ax = 3 * (p1.x - p0.x);
        const bx = 3 * (p2.x - p1.x) - ax;
        const cx = p3.x - p0.x - ax - bx;

        const ay = 3 * (p1.y - p0.y);
        const by = 3 * (p2.y - p1.y) - ay;
        const cy = p3.y - p0.y - ay - by;

        out.x = cx * t * t * t + bx * t * t + ax * t + p0.x;
        out.y = cy * t * t * t + by * t * t + ay * t + p0.y;

        return out;
    }

    /**
     * 计算三次贝塞尔曲线在指定点的切线角度
     * @description 根据三次贝塞尔曲线的四个控制点和参数 t，计算曲线在该点的切线方向角度
     * @param p0 起始点
     * @param p1 第一控制点
     * @param p2 第二控制点
     * @param p3 结束点
     * @param t 曲线参数（0-1）
     * @returns 切线角度（角度值）
     * @example
     * MathUtil.GetBezier3CutAngle({x:0,y:0}, {x:30,y:60}, {x:70,y:60}, {x:100,y:0}, 0.5);
     */
    public static GetBezier3CutAngle(
        p0: { x: number; y: number },
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        p3: { x: number; y: number },
        t: number
    ): number {
        const oneMinusT = 1 - t;
        const dx =
            3 * p0.x * oneMinusT * oneMinusT * -1 +
            3 * p1.x * (oneMinusT * oneMinusT + 2 * t * oneMinusT * -1) +
            3 * p2.x * (2 * t * oneMinusT + t * t * -1) +
            3 * p3.x * t * t;
        const dy =
            3 * p0.y * oneMinusT * oneMinusT * -1 +
            3 * p1.y * (oneMinusT * oneMinusT + 2 * t * oneMinusT * -1) +
            3 * p2.y * (2 * t * oneMinusT + t * t * -1) +
            3 * p3.y * t * t;

        return this.GetAngle(Math.atan2(dy, dx));
    }

    /**
     * 判断数值是否在指定范围内
     * @description 检查一个数值是否在闭区间 [min, max] 内
     * @param min 范围最小值
     * @param max 范围最大值
     * @param value 需要检查的数值
     * @returns 如果数值在范围内返回 true，否则返回 false
     * @example
     * MathUtil.IsInRange(0, 10, 5);  // true
     * MathUtil.IsInRange(0, 10, 15); // false
     */
    public static IsInRange(min: number, max: number, value: number): boolean {
        return value >= min && value <= max;
    }

    /**
     * 绕中心点旋转坐标
     * @description 将一个点绕指定中心点旋转指定角度
     * @param point 需要旋转的点
     * @param angle 旋转角度（角度值）
     * @param center 旋转中心点，默认为原点 {x: 0, y: 0}
     * @param out 可选的输出对象，用于存储结果以减少内存分配
     * @returns 旋转后的点坐标
     * @example
     * MathUtil.RotatePoint({x: 1, y: 0}, 90); // {x: 0, y: 1}
     * MathUtil.RotatePoint({x: 1, y: 0}, 90, {x: 0, y: 0}); // {x: 0, y: 1}
     */
    public static RotatePoint(
        point: { x: number; y: number },
        angle: number,
        center: { x: number; y: number } = { x: 0, y: 0 },
        out?: { x: number; y: number }
    ): { x: number; y: number } {
        if (angle === 0) {
            return { x: point.x, y: point.y };
        }

        const radian = this.GetRadian(angle);
        const cosVal = Math.cos(radian);
        const sinVal = Math.sin(radian);

        const newX = (point.x - center.x) * cosVal - (point.y - center.y) * sinVal + center.x;
        const newY = (point.x - center.x) * sinVal + (point.y - center.y) * cosVal + center.y;

        if (out) {
            out.x = newX;
            out.y = newY;
            return out;
        }

        return { x: newX, y: newY };
    }

    /**
     * 复制三维向量
     * @description 将源向量的 x、y、z 值复制到目标向量
     * @param source 源向量
     * @param out 可选的输出向量对象
     * @returns 复制后的向量对象
     * @example
     * const v1 = {x: 1, y: 2, z: 3};
     * const v2 = MathUtil.V3Copy(v1); // {x: 1, y: 2, z: 3}
     */
    public static V3Copy(
        source: { x: number; y: number; z: number },
        out?: { x: number; y: number; z: number }
    ): { x: number; y: number; z: number } {
        if (!out) out = { x: 0, y: 0, z: 0 };
        out.x = source.x;
        out.y = source.y;
        out.z = source.z;
        return out;
    }

}