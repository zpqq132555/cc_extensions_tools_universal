/**
 * 日志等级枚举
 * 数值越小，优先级越高
 */
export enum LogLevel {
    /** 关闭所有日志 */
    OFF = 0,
    /** 致命错误 */
    FATAL = 1,
    /** 错误 */
    ERROR = 2,
    /** 警告 */
    WARN = 3,
    /** 信息 */
    INFO = 4,
    /** 调试 */
    DEBUG = 5,
    /** 追踪（最详细） */
    TRACE = 6,
    /** 全部日志 */
    ALL = 7
}

/**
 * 日志类型枚举
 * 用于区分不同模块/功能的日志
 */
export enum LogType {
    /** 默认/通用 */
    DEFAULT = "DEFAULT",
    /** 网络相关 */
    NET = "NET",
    /** UI相关 */
    UI = "UI",
    /** 游戏逻辑 */
    GAME = "GAME",
    /** 资源加载 */
    RES = "RES",
    /** 音效 */
    AUDIO = "AUDIO",
    /** 数据存储 */
    STORAGE = "STORAGE",
    /** 平台相关 */
    PLATFORM = "PLATFORM",
    /** 事件系统 */
    EVENT = "EVENT",
    /** 性能监控 */
    PERFORMANCE = "PERFORMANCE"
}

/**
 * 日志配置接口
 */
export interface ILogConfig {
    /** 是否启用日志 */
    enabled: boolean;
    /** 全局日志等级 */
    level: LogLevel;
    /** 是否显示时间戳 */
    showTimestamp: boolean;
    /** 是否显示日志类型标签 */
    showTypeTag: boolean;
    /** 是否显示调用堆栈 */
    showStack: boolean;
    /** 各类型日志的独立开关 */
    typeEnabled: Map<LogType, boolean>;
    /** 各类型日志的独立等级 */
    typeLevel: Map<LogType, LogLevel>;
}

/**
 * 日志条目接口
 */
export interface ILogEntry {
    /** 时间戳 */
    timestamp: number;
    /** 日志等级 */
    level: LogLevel;
    /** 日志类型 */
    type: LogType;
    /** 日志消息 */
    message: string;
    /** 附加数据 */
    data?: any[];
}

/**
 * 日志颜色配置
 */
const LogColors: Record<LogLevel, string> = {
    [LogLevel.OFF]: "",
    [LogLevel.FATAL]: "#FF0000",  // 红色
    [LogLevel.ERROR]: "#FF4444",  // 浅红色
    [LogLevel.WARN]: "#FFAA00",   // 橙色
    [LogLevel.INFO]: "#00AA00",   // 绿色
    [LogLevel.DEBUG]: "#0088FF",  // 蓝色
    [LogLevel.TRACE]: "#888888",  // 灰色
    [LogLevel.ALL]: "#FFFFFF"     // 白色
};

/**
 * 日志等级名称
 */
const LogLevelNames: Record<LogLevel, string> = {
    [LogLevel.OFF]: "OFF",
    [LogLevel.FATAL]: "FATAL",
    [LogLevel.ERROR]: "ERROR",
    [LogLevel.WARN]: "WARN",
    [LogLevel.INFO]: "INFO",
    [LogLevel.DEBUG]: "DEBUG",
    [LogLevel.TRACE]: "TRACE",
    [LogLevel.ALL]: "ALL"
};

/**
 * @author OldPoint
 * @date 2026-01-27 08:45
 * @filePath assets\extensionScripts\log\LogManager.ts
 * @description 日志管理系统 - 支持日志等级、类型分类、开关控制
 * 单例模式，统一管理所有日志输出
 */
export class LogManager {
    /* 单例 */
    private static _instance: LogManager = null!;
    public static get instance(): LogManager { return LogManager._instance || (LogManager._instance = new LogManager()); }

    /** 日志配置 */
    private _config: ILogConfig;

    /** 日志历史记录 */
    private _logHistory: ILogEntry[] = [];

    /** 历史记录最大条数 */
    private _maxHistorySize: number = 1000;

    /** 日志监听器 */
    private _listeners: ((entry: ILogEntry) => void)[] = [];

    private constructor() {
        this._config = this.getDefaultConfig();
    }

    /**
     * 获取默认配置
     */
    private getDefaultConfig(): ILogConfig {
        const typeEnabled = new Map<LogType, boolean>();
        const typeLevel = new Map<LogType, LogLevel>();

        // 默认所有类型都启用
        Object.values(LogType).forEach(type => {
            typeEnabled.set(type as LogType, true);
            typeLevel.set(type as LogType, LogLevel.ALL);
        });

        return {
            enabled: true,
            level: LogLevel.ALL,
            showTimestamp: true,
            showTypeTag: true,
            showStack: false,
            typeEnabled,
            typeLevel
        };
    }

    // ==================== 配置方法 ====================

    /**
     * 设置全局日志开关
     * @param enabled 是否启用
     */
    public setEnabled(enabled: boolean): void {
        this._config.enabled = enabled;
    }

    /**
     * 获取全局日志开关状态
     */
    public isEnabled(): boolean {
        return this._config.enabled;
    }

    /**
     * 设置全局日志等级
     * @param level 日志等级
     */
    public setLevel(level: LogLevel): void {
        this._config.level = level;
    }

    /**
     * 获取全局日志等级
     */
    public getLevel(): LogLevel {
        return this._config.level;
    }

    /**
     * 设置是否显示时间戳
     * @param show 是否显示
     */
    public setShowTimestamp(show: boolean): void {
        this._config.showTimestamp = show;
    }

    /**
     * 设置是否显示类型标签
     * @param show 是否显示
     */
    public setShowTypeTag(show: boolean): void {
        this._config.showTypeTag = show;
    }

    /**
     * 设置是否显示调用堆栈
     * @param show 是否显示
     */
    public setShowStack(show: boolean): void {
        this._config.showStack = show;
    }

    /**
     * 设置某个日志类型的开关
     * @param type 日志类型
     * @param enabled 是否启用
     */
    public setTypeEnabled(type: LogType, enabled: boolean): void {
        this._config.typeEnabled.set(type, enabled);
    }

    /**
     * 获取某个日志类型的开关状态
     * @param type 日志类型
     */
    public isTypeEnabled(type: LogType): boolean {
        return this._config.typeEnabled.get(type) ?? true;
    }

    /**
     * 设置某个日志类型的等级
     * @param type 日志类型
     * @param level 日志等级
     */
    public setTypeLevel(type: LogType, level: LogLevel): void {
        this._config.typeLevel.set(type, level);
    }

    /**
     * 获取某个日志类型的等级
     * @param type 日志类型
     */
    public getTypeLevel(type: LogType): LogLevel {
        return this._config.typeLevel.get(type) ?? LogLevel.ALL;
    }

    /**
     * 批量配置
     * @param config 配置对象
     */
    public configure(config: Partial<ILogConfig>): void {
        Object.assign(this._config, config);
    }

    /**
     * 重置为默认配置
     */
    public resetConfig(): void {
        this._config = this.getDefaultConfig();
    }

    // ==================== 日志输出方法 ====================

    /**
     * 输出 FATAL 级别日志
     */
    public fatal(message: string, ...args: any[]): void;
    public fatal(type: LogType, message: string, ...args: any[]): void;
    public fatal(typeOrMessage: LogType | string, ...args: any[]): void {
        this.log(LogLevel.FATAL, typeOrMessage, ...args);
    }

    /**
     * 输出 ERROR 级别日志
     */
    public error(message: string, ...args: any[]): void;
    public error(type: LogType, message: string, ...args: any[]): void;
    public error(typeOrMessage: LogType | string, ...args: any[]): void {
        this.log(LogLevel.ERROR, typeOrMessage, ...args);
    }

    /**
     * 输出 WARN 级别日志
     */
    public warn(message: string, ...args: any[]): void;
    public warn(type: LogType, message: string, ...args: any[]): void;
    public warn(typeOrMessage: LogType | string, ...args: any[]): void {
        this.log(LogLevel.WARN, typeOrMessage, ...args);
    }

    /**
     * 输出 INFO 级别日志
     */
    public info(message: string, ...args: any[]): void;
    public info(type: LogType, message: string, ...args: any[]): void;
    public info(typeOrMessage: LogType | string, ...args: any[]): void {
        this.log(LogLevel.INFO, typeOrMessage, ...args);
    }

    /**
     * 输出 DEBUG 级别日志
     */
    public debug(message: string, ...args: any[]): void;
    public debug(type: LogType, message: string, ...args: any[]): void;
    public debug(typeOrMessage: LogType | string, ...args: any[]): void {
        this.log(LogLevel.DEBUG, typeOrMessage, ...args);
    }

    /**
     * 输出 TRACE 级别日志
     */
    public trace(message: string, ...args: any[]): void;
    public trace(type: LogType, message: string, ...args: any[]): void;
    public trace(typeOrMessage: LogType | string, ...args: any[]): void {
        this.log(LogLevel.TRACE, typeOrMessage, ...args);
    }

    /**
     * 核心日志输出方法
     */
    private log(level: LogLevel, typeOrMessage: LogType | string, ...args: any[]): void {
        // 检查全局开关
        if (!this._config.enabled) return;

        // 检查全局等级
        if (level > this._config.level) return;

        // 解析参数
        let type: LogType;
        let message: string;
        let data: any[];

        if (Object.values(LogType).includes(typeOrMessage as LogType)) {
            type = typeOrMessage as LogType;
            message = args[0] as string;
            data = args.slice(1);
        } else {
            type = LogType.DEFAULT;
            message = typeOrMessage as string;
            data = args;
        }

        // 检查类型开关
        if (!this.isTypeEnabled(type)) return;

        // 检查类型等级
        if (level > this.getTypeLevel(type)) return;

        // 创建日志条目
        const entry: ILogEntry = {
            timestamp: Date.now(),
            level,
            type,
            message,
            data: data.length > 0 ? data : undefined
        };

        // 保存到历史记录
        this.saveToHistory(entry);

        // 通知监听器
        this.notifyListeners(entry);

        // 输出到控制台
        this.outputToConsole(entry);
    }

    /**
     * 输出到控制台
     */
    private outputToConsole(entry: ILogEntry): void {
        const prefix = this.formatPrefix(entry);
        const color = LogColors[entry.level];
        const style = `color: ${color}; font-weight: bold;`;

        let consoleMethod: (...args: any[]) => void;
        switch (entry.level) {
            case LogLevel.FATAL:
            case LogLevel.ERROR:
                consoleMethod = console.error;
                break;
            case LogLevel.WARN:
                consoleMethod = console.warn;
                break;
            case LogLevel.DEBUG:
            case LogLevel.TRACE:
                consoleMethod = console.debug;
                break;
            default:
                consoleMethod = console.log;
        }

        if (entry.data && entry.data.length > 0) {
            consoleMethod(`%c${prefix}${entry.message}`, style, ...entry.data);
        } else {
            consoleMethod(`%c${prefix}${entry.message}`, style);
        }

        // 输出堆栈信息
        if (this._config.showStack && entry.level <= LogLevel.ERROR) {
            console.trace();
        }
    }

    /**
     * 格式化日志前缀
     */
    private formatPrefix(entry: ILogEntry): string {
        const parts: string[] = [];

        if (this._config.showTimestamp) {
            parts.push(`[${this.formatTime(entry.timestamp)}]`);
        }

        parts.push(`[${LogLevelNames[entry.level]}]`);

        if (this._config.showTypeTag) {
            parts.push(`[${entry.type}]`);
        }

        return parts.join(" ") + " ";
    }

    /**
     * 格式化时间
     */
    private formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        const ms = date.getMilliseconds().toString().padStart(3, "0");
        return `${hours}:${minutes}:${seconds}.${ms}`;
    }

    // ==================== 历史记录方法 ====================

    /**
     * 保存到历史记录
     */
    private saveToHistory(entry: ILogEntry): void {
        this._logHistory.push(entry);
        if (this._logHistory.length > this._maxHistorySize) {
            this._logHistory.shift();
        }
    }

    /**
     * 获取日志历史记录
     * @param filter 过滤条件
     */
    public getHistory(filter?: {
        level?: LogLevel;
        type?: LogType;
        startTime?: number;
        endTime?: number;
        keyword?: string;
    }): ILogEntry[] {
        if (!filter) return [...this._logHistory];

        return this._logHistory.filter(entry => {
            if (filter.level !== undefined && entry.level > filter.level) return false;
            if (filter.type !== undefined && entry.type !== filter.type) return false;
            if (filter.startTime !== undefined && entry.timestamp < filter.startTime) return false;
            if (filter.endTime !== undefined && entry.timestamp > filter.endTime) return false;
            if (filter.keyword !== undefined && !entry.message.includes(filter.keyword)) return false;
            return true;
        });
    }

    /**
     * 清空历史记录
     */
    public clearHistory(): void {
        this._logHistory = [];
    }

    /**
     * 设置历史记录最大条数
     */
    public setMaxHistorySize(size: number): void {
        this._maxHistorySize = size;
        while (this._logHistory.length > this._maxHistorySize) {
            this._logHistory.shift();
        }
    }

    /**
     * 导出历史记录为字符串
     */
    public exportHistory(): string {
        return this._logHistory.map(entry => {
            const prefix = this.formatPrefix(entry);
            const dataStr = entry.data ? " " + JSON.stringify(entry.data) : "";
            return `${prefix}${entry.message}${dataStr}`;
        }).join("\n");
    }

    // ==================== 监听器方法 ====================

    /**
     * 添加日志监听器
     * @param listener 监听器回调函数
     */
    public addListener(listener: (entry: ILogEntry) => void): void {
        if (!this._listeners.includes(listener)) {
            this._listeners.push(listener);
        }
    }

    /**
     * 移除日志监听器
     * @param listener 监听器回调函数
     */
    public removeListener(listener: (entry: ILogEntry) => void): void {
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
    }

    /**
     * 通知所有监听器
     */
    private notifyListeners(entry: ILogEntry): void {
        for (const listener of this._listeners) {
            try {
                listener(entry);
            } catch (e) {
                console.error("Log listener error:", e);
            }
        }
    }
}

// ==================== 便捷全局方法 ====================

/** 日志管理器实例的简写 */
export const Logger = LogManager.instance;

/**
 * 创建指定类型的日志器
 * @param type 日志类型
 */
export function createLogger(type: LogType) {
    const manager = LogManager.instance;
    return {
        fatal: (message: string, ...args: any[]) => manager.fatal(type, message, ...args),
        error: (message: string, ...args: any[]) => manager.error(type, message, ...args),
        warn: (message: string, ...args: any[]) => manager.warn(type, message, ...args),
        info: (message: string, ...args: any[]) => manager.info(type, message, ...args),
        debug: (message: string, ...args: any[]) => manager.debug(type, message, ...args),
        trace: (message: string, ...args: any[]) => manager.trace(type, message, ...args),
        setEnabled: (enabled: boolean) => manager.setTypeEnabled(type, enabled),
        setLevel: (level: LogLevel) => manager.setTypeLevel(type, level)
    };
}

// ==================== 预定义的类型日志器 ====================

/** 网络日志器 */
export const NetLogger = createLogger(LogType.NET);

/** UI日志器 */
export const UILogger = createLogger(LogType.UI);

/** 游戏逻辑日志器 */
export const GameLogger = createLogger(LogType.GAME);

/** 资源日志器 */
export const ResLogger = createLogger(LogType.RES);

/** 音频日志器 */
export const AudioLogger = createLogger(LogType.AUDIO);

/** 存储日志器 */
export const StorageLogger = createLogger(LogType.STORAGE);

/** 平台日志器 */
export const PlatformLogger = createLogger(LogType.PLATFORM);

/** 事件日志器 */
export const EventLogger = createLogger(LogType.EVENT);

/** 性能日志器 */
export const PerformanceLogger = createLogger(LogType.PERFORMANCE);