/**
 * @author OldPoint
 * @date 2026-01-22 08:53
 * @filePath assets\scripts\utils\DateUtil.ts
 * @description 
 */
export class DateUtil {

    /**
     * 比较两个时间是否为同一天（年月日相同）
     * @description 比较两个时间戳或 Date 对象是否在同一天
     * @param time1 第一个时间（时间戳或 Date 对象）
     * @param time2 第二个时间（时间戳或 Date 对象）
     * @returns 如果两个时间在同一天返回 true，否则返回 false
     * @example
     * DateUtil.Compare(new Date('2026-01-25'), new Date('2026-01-25')); // true
     * DateUtil.Compare(1737763200000, 1737763200000); // true
     */
    public static Compare(time1: number | Date, time2: number | Date): boolean {
        if (time1 instanceof Date == false) {
            time1 = new Date(time1);
        }
        if (time2 instanceof Date == false) {
            time2 = new Date(time2);
        }
        console.log("compare", time1, time2);
        return time1.getFullYear() == time2.getFullYear() && time1.getMonth() == time2.getMonth() && time1.getDate() == time2.getDate();
    }

    /**
     * 格式化日期时间
     * @description 根据偏移天数获取格式化的日期时间字符串
     * @param offsetDays 相对于当前日期的偏移天数，正数表示未来，负数或0表示过去
     * @returns 格式化后的日期时间字符串，格式为 "YYYY/MM/DD HH:mm:ss"
     * @example
     * DateUtil.TimeFormat(0);  // "2026/01/25 12:30:45" (当前时间)
     * DateUtil.TimeFormat(1);  // "2026/01/26 12:30:45" (明天)
     * DateUtil.TimeFormat(-1); // "2026/01/24 12:30:45" (昨天)
     */
    public static TimeFormat(offsetDays: number = 0): string {
        const targetDate = offsetDays > 0
            ? new Date(new Date().getTime() + 86400000 * offsetDays)
            : new Date(Number(new Date()) - 86400000 * Math.abs(offsetDays));

        const month = ("0" + (targetDate.getMonth() + 1)).slice(-2);
        const day = ("0" + targetDate.getDate()).slice(-2);
        const hours = ("0" + targetDate.getHours()).slice(-2);
        const minutes = ("0" + targetDate.getMinutes()).slice(-2);
        const seconds = ("0" + targetDate.getSeconds()).slice(-2);

        return `${targetDate.getFullYear()}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * 将秒数转换为时分秒对象
     * @description 将总秒数分解为小时、分钟、秒的对象形式
     * @param totalSeconds 总秒数
     * @returns 包含 hour、minute、second 属性的对象
     * @example
     * DateUtil.SecondFormat(3661); // { hour: 1, minute: 1, second: 1 }
     * DateUtil.SecondFormat(90);   // { hour: 0, minute: 1, second: 30 }
     */
    public static SecondFormat(totalSeconds: number): { hour: number; minute: number; second: number } {
        let second = Math.floor(totalSeconds);
        let minute = 0;
        let hour = 0;

        if (second > 60) {
            minute = Math.floor(second / 60);
            second = Math.floor(second % 60);
            if (minute >= 60) {
                hour = Math.floor(minute / 60);
                minute = Math.floor(minute % 60);
            }
        }

        return { hour, minute, second };
    }

    /**
     * 将秒数格式化为时间字符串（简洁格式）
     * @description 将总秒数转换为 "HH:MM:SS" 或 "MM:SS" 格式的字符串
     * @param totalSeconds 总秒数
     * @returns 格式化后的时间字符串
     * @example
     * DateUtil.SecondFormatString(3661); // "01:01:01"
     * DateUtil.SecondFormatString(90);   // "01:30"
     * DateUtil.SecondFormatString(5);    // "00:05"
     */
    public static SecondFormatString(totalSeconds: number): string {
        let second = Math.ceil(totalSeconds);
        let minute = 0;
        let hour = 0;

        if (second >= 60) {
            minute = Math.floor(second / 60);
            second = Math.floor(second % 60);
            if (minute >= 60) {
                hour = Math.floor(minute / 60);
                minute = Math.floor(minute % 60);
            }
        }

        const pad = (num: number): string => (num < 10 ? "0" + num : num + "");

        return hour > 0
            ? `${pad(hour)}:${pad(minute)}:${pad(second)}`
            : `${pad(minute)}:${pad(second)}`;
    }

    /**
     * 将秒数格式化为中文时间描述
     * @description 将总秒数转换为易读的中文时间描述，如 "1天2时" "3时5分" "10分30秒"
     * @param totalSeconds 总秒数
     * @param showSeconds 当有小时时是否显示秒数，默认为 false
     * @returns 中文格式的时间描述字符串
     * @example
     * DateUtil.SecondFormatChinese(90000);        // "1天1时"
     * DateUtil.SecondFormatChinese(3661);         // "1时1分"
     * DateUtil.SecondFormatChinese(3661, true);   // "1时1分1秒"
     * DateUtil.SecondFormatChinese(90);           // "1分30秒"
     */
    public static SecondFormatChinese(totalSeconds: number, showSeconds: boolean = false): string {
        totalSeconds = Math.round(totalSeconds);
        if (totalSeconds <= 0) totalSeconds = 0;

        const timeObj = this.SecondFormat(totalSeconds);
        let result = "";

        if (timeObj.hour > 24) {
            result = Math.floor(timeObj.hour / 24) + "天" + (timeObj.hour % 24) + "时";
        } else if (timeObj.hour > 0) {
            result = timeObj.hour + "时" + timeObj.minute + "分";
            if (showSeconds) {
                result += timeObj.second + "秒";
            }
        } else if (timeObj.minute > 0) {
            result = timeObj.minute + "分" + timeObj.second + "秒";
        } else {
            result = timeObj.second + "秒";
        }

        return result;
    }

    /**
     * 计算两个时间之间的秒数差
     * @description 计算从 endTime 到 startTime 之间相差的秒数
     * @param startTime 开始时间（可以是时间戳、日期字符串或 Date 对象）
     * @param endTime 结束时间（可以是时间戳、日期字符串或 Date 对象）
     * @returns 两个时间之间的秒数差（startTime - endTime）
     * @example
     * DateUtil.GetSecond('2026-01-25 12:00:00', '2026-01-25 11:00:00'); // 3600
     */
    public static GetSecond(startTime: number | string | Date, endTime: number | string | Date): number {
        return (Number(new Date(startTime as any)) - Number(new Date(endTime as any))) / 1000;
    }

    /**
     * 计算两个时间之间的天数差
     * @description 计算从 startTime 到 endTime 之间相差的天数（向下取整）
     * @param startTime 开始时间（时间戳或 Date 对象）
     * @param endTime 结束时间（时间戳或 Date 对象）
     * @returns 两个时间之间的天数差
     * @example
     * DateUtil.GetDays(new Date('2026-01-25'), new Date('2026-01-20')); // 5
     */
    public static GetDays(startTime: number | Date, endTime: number | Date): number {
        return Math.floor((Number(startTime) - Number(endTime)) / 86400000);
    }

    /**
     * 比较两个版本号
     * @description 比较两个语义化版本号的大小关系
     * @param version1 第一个版本号，格式如 "1.0.0"
     * @param version2 第二个版本号，格式如 "1.0.1"
     * @returns 1 表示 version1 > version2，-1 表示 version1 < version2，0 表示相等
     * @example
     * DateUtil.CompareVersion("1.0.1", "1.0.0"); // 1
     * DateUtil.CompareVersion("1.0.0", "1.0.1"); // -1
     * DateUtil.CompareVersion("1.0.0", "1.0.0"); // 0
     * DateUtil.CompareVersion("1.0", "1.0.0");   // 0
     */
    public static CompareVersion(version1: string, version2: string): number {
        const v1Parts = version1.split(".");
        const v2Parts = version2.split(".");
        const maxLength = Math.max(v1Parts.length, v2Parts.length);

        while (v1Parts.length < maxLength) v1Parts.push("0");
        while (v2Parts.length < maxLength) v2Parts.push("0");

        for (let i = 0; i < maxLength; i++) {
            const num1 = parseInt(v1Parts[i]);
            const num2 = parseInt(v2Parts[i]);
            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }

        return 0;
    }

}