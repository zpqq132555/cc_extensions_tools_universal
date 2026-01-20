/**
 * 示例面板 - 展示如何创建跨版本兼容的面板
 */

import { getPanel, isV2 } from '../index';

const panelAdapter = getPanel();

// 面板模板
const template = `
<div id="app">
    <h2>Extensions Tools</h2>
    <hr />
    <div>State: <span id="label">--</span></div>
    <div>Counter: <span id="counter">0</span></div>
    <hr />
    <button id="btn-main">Send To Main</button>
    <button id="btn-add">+1</button>
    <button id="btn-sub">-1</button>
</div>
`;

// 面板样式
const style = `
:host { margin: 5px; }
h2 { color: #f90; }
button { margin: 5px; padding: 5px 10px; }
`;

// 面板状态
let counter = 0;

// 使用适配器定义面板
const panelDefinition = panelAdapter.define(
    {
        title: 'Extensions Tools',
        template,
        style,
        width: 400,
        height: 300,
        type: 'dockable',
    },
    {
        ready() {
            // @ts-ignore
            const self = this;
            
            // 绑定按钮事件
            const btnMain = self.$?.['btn-main'] || document.getElementById('btn-main');
            const btnAdd = self.$?.['btn-add'] || document.getElementById('btn-add');
            const btnSub = self.$?.['btn-sub'] || document.getElementById('btn-sub');

            if (btnMain) {
                btnMain.addEventListener('click', () => {
                    if (isV2()) {
                        // V2.x
                        // @ts-ignore
                        Editor.Ipc.sendToMain('extensions_tools:clicked');
                    } else {
                        // V3.x
                        // @ts-ignore
                        Editor.Message.send('extensions_tools', 'clicked');
                    }
                });
            }

            if (btnAdd) {
                btnAdd.addEventListener('click', () => {
                    counter++;
                    updateCounter(self);
                });
            }

            if (btnSub) {
                btnSub.addEventListener('click', () => {
                    counter--;
                    updateCounter(self);
                });
            }
        },
        methods: {
            hello() {
                // @ts-ignore
                const label = this.$?.label || document.getElementById('label');
                if (label) {
                    label.innerText = 'Hello!';
                }
            },
        },
        messages: {
            'extensions_tools:hello'() {
                // @ts-ignore
                const label = this.$?.label || document.getElementById('label');
                if (label) {
                    label.innerText = 'Hello!';
                }
            },
        },
    }
);

function updateCounter(self: any) {
    const counterEl = self.$?.counter || document.getElementById('counter');
    if (counterEl) {
        counterEl.innerText = String(counter);
    }
}

module.exports = panelDefinition;
