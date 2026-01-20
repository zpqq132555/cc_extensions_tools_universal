/**
 * 默认面板入口
 */

import { getPanel, isV2 } from '../../index';

declare const Editor: any;

// 面板配置
const PANEL_CONFIG = {
    title: 'Extensions Tools',
    width: 600,
    height: 400,
};

// 模板和样式
const template = `
<div class="panel-container">
    <header>
        <h2>Extensions Tools</h2>
        <span id="version-badge" class="badge">--</span>
    </header>
    
    <section class="content">
        <div class="status-row">
            <label>Status:</label>
            <span id="status">Ready</span>
        </div>
        
        <div class="counter-row">
            <label>Counter:</label>
            <span id="counter">0</span>
            <div class="btn-group">
                <button id="btn-sub">-</button>
                <button id="btn-add">+</button>
            </div>
        </div>
    </section>
    
    <footer>
        <button id="btn-main" class="primary">Send To Main</button>
        <button id="btn-refresh">Refresh</button>
    </footer>
</div>
`;

const style = `
:host {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
}

.panel-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

header h2 {
    color: #f90;
    margin: 0;
}

.badge {
    background: #333;
    color: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.status-row, .counter-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.counter-row label {
    min-width: 60px;
}

.counter-row #counter {
    min-width: 40px;
    text-align: center;
    font-weight: bold;
}

.btn-group {
    display: flex;
    gap: 5px;
}

button {
    padding: 5px 15px;
    border: 1px solid #555;
    background: #444;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background: #555;
}

button.primary {
    background: #2196f3;
    border-color: #1976d2;
}

button.primary:hover {
    background: #1976d2;
}

footer {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #444;
}
`;

// 面板状态
let counter = 0;

// 获取面板适配器
const panelAdapter = getPanel();

// 定义面板
const panelDefinition = panelAdapter.define(
    {
        title: PANEL_CONFIG.title,
        template,
        style,
        width: PANEL_CONFIG.width,
        height: PANEL_CONFIG.height,
        type: 'dockable',
    },
    {
        ready() {
            const self = this as any;
            
            // 显示版本信息
            const versionBadge = self.$?.['version-badge'];
            if (versionBadge) {
                versionBadge.innerText = isV2() ? 'v2.x' : 'v3.x';
                versionBadge.style.background = isV2() ? '#ff9800' : '#4caf50';
            }

            // 绑定按钮事件
            bindButtonEvents(self);
        },

        show() {
            console.log('[Panel] show');
        },

        hide() {
            console.log('[Panel] hide');
        },

        methods: {
            hello() {
                const self = this as any;
                const statusEl = self.$?.status;
                if (statusEl) {
                    statusEl.innerText = 'Hello received!';
                }
            },

            updateCounter(value: number) {
                const self = this as any;
                counter = value;
                const counterEl = self.$?.counter;
                if (counterEl) {
                    counterEl.innerText = String(counter);
                }
            },
        },

        messages: {
            'extensions_tools:hello'() {
                const self = this as any;
                const statusEl = self.$?.status;
                if (statusEl) {
                    statusEl.innerText = 'Hello received!';
                }
            },
        },
    }
);

/**
 * 绑定按钮事件
 */
function bindButtonEvents(self: any) {
    const btnMain = self.$?.['btn-main'];
    const btnAdd = self.$?.['btn-add'];
    const btnSub = self.$?.['btn-sub'];
    const btnRefresh = self.$?.['btn-refresh'];

    if (btnMain) {
        btnMain.addEventListener('click', () => {
            sendToMain('clicked');
        });
    }

    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            counter++;
            updateCounterDisplay(self);
        });
    }

    if (btnSub) {
        btnSub.addEventListener('click', () => {
            counter--;
            updateCounterDisplay(self);
        });
    }

    if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
            counter = 0;
            updateCounterDisplay(self);
            const statusEl = self.$?.status;
            if (statusEl) {
                statusEl.innerText = 'Refreshed';
            }
        });
    }
}

/**
 * 更新计数器显示
 */
function updateCounterDisplay(self: any) {
    const counterEl = self.$?.counter;
    if (counterEl) {
        counterEl.innerText = String(counter);
    }
}

/**
 * 发送消息到主进程
 */
function sendToMain(message: string) {
    if (isV2()) {
        Editor.Ipc.sendToMain(`extensions_tools:${message}`);
    } else {
        Editor.Message.send('extensions_tools', message);
    }
}

// 导出面板定义
module.exports = panelDefinition;
