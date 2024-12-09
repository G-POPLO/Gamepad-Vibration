// 获取所有按钮元素
const buttons = document.querySelectorAll('button');
let selectedIndex = 0;

// 初始化选中第一个按钮
buttons[selectedIndex].classList.add('selected');

function updateSelection(index) {
    // 移除当前选中的样式
    buttons[selectedIndex].classList.remove('selected');
    selectedIndex = index;
    // 应用新的选中样式
    buttons[selectedIndex].classList.add('selected');
}

let lastDirectionTime = 0;
const debounceDelay = 200; // 防抖动延迟时间，单位为毫秒

function gamepadInput() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    if (!gamepads) return;

    for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
            const currentTime = Date.now();
            let moved = false;

            // 检查D-pad up 或者 使用 axes
            if ((gamepad.axes[1] <= -0.5 || gamepad.buttons[12].pressed) && 
                (currentTime - lastDirectionTime > debounceDelay)) {
                if (selectedIndex > 0) {
                    updateSelection(selectedIndex - 1);
                    moved = true;
                }
                lastDirectionTime = currentTime;
            }

            // 检查D-pad down 或者 使用 axes
            if ((gamepad.axes[1] >= 0.5 || gamepad.buttons[13].pressed) &&
                (currentTime - lastDirectionTime > debounceDelay)) {
                if (selectedIndex < buttons.length - 1) {
                    updateSelection(selectedIndex + 1);
                    moved = true;
                }
                lastDirectionTime = currentTime;
            }

            // A按钮点击逻辑保持不变
            if (gamepad.buttons[0].pressed && !moved) {
                // 触发选中按钮的点击事件
                buttons[selectedIndex].click();
            }
        }
    }

    requestAnimationFrame(gamepadInput);
}

// 开始监听游戏手柄输入
gamepadInput();

// 为每个按钮添加点击事件处理程序
buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
        alert(`点击了按钮${index + 1}`);
    });
});