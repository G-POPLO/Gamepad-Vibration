// 获取第一个连接的游戏手柄。如果存在多个手柄，只返回第一个非空的手柄。
function getFirstConnectedGamepad() {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            return gamepads[i]; // 返回第一个找到的非空手柄
        }
    }
    return null; // 如果没有找到任何手柄，则返回null
}

// 尝试使游戏手柄震动。忽略任何发生的错误以避免影响用户体验。
function tryVibrateGamepad(gamepad) {
    if (!gamepad || !gamepad.vibrationActuator && !(gamepad.hapticActuators && gamepad.hapticActuators.length > 0)) {
        return; // 如果手柄不存在或不支持震动功能，直接退出函数
    }

    // 检查手柄是否支持标准的振动接口
    if (gamepad.vibrationActuator) {
        gamepad.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: 200, // 震动持续时间（毫秒）
            weakMagnitude: 1.0, // 弱电机强度
            strongMagnitude: 1.0 // 强电机强度
        }).catch(() => {}); // 忽略任何可能发生的错误
    } 
    // 或者检查手柄是否支持旧版的震动接口
    else if (gamepad.hapticActuators && gamepad.hapticActuators.length > 0) {
        gamepad.hapticActuators[0].pulse(1.0, 200).catch(() => {}); // 忽略任何可能发生的错误
    }
}

// 定义一个函数来检查手柄按键状态。当指定索引的按钮被按下时，触发页面上的震动按钮点击事件。
function checkGamepadButtons(buttonIndex) {
    const gamepad = getFirstConnectedGamepad();
    if (gamepad && gamepad.buttons[buttonIndex] && gamepad.buttons[buttonIndex].pressed) {
        document.getElementById('vibrateButton').click(); // 触发震动按钮点击事件
    }
}

// 设置一个定时器来定期检查手柄按键状态。这里我们假设Y键是索引为3的按钮。
function setupGamepadPolling() {
    setInterval(() => {
        checkGamepadButtons(3); // 每隔一段时间检查一次Y按钮的状态
    }, 100); // 每100毫秒检查一次
}

// 当页面加载完成时初始化必要的事件监听器。
document.addEventListener('DOMContentLoaded', () => {
    // 给页面中的震动按钮添加点击事件监听器，用于手动触发手柄震动。
    document.getElementById('vibrateButton').addEventListener('click', () => {
        tryVibrateGamepad(getFirstConnectedGamepad()); // 尝试使第一个连接的手柄震动
    });

    setupGamepadPolling(); // 开始轮询手柄按键状态

    // 监听手柄连接事件。确保只有在没有已连接的手柄时才处理新连接的手柄。
    window.addEventListener("gamepadconnected", function(e) {
        if (!getFirstConnectedGamepad()) { // 只有在没有手柄连接时才处理新的手柄
            tryVibrateGamepad(e.gamepad); // 尝试使新连接的手柄震动一次
        }
    });

    // 监听手柄断开事件。根据需要可以添加逻辑处理，但这里不做任何动作。
    window.addEventListener("gamepaddisconnected", function(e) {
        // 这里可以添加逻辑来处理手柄断开的情况，但当前实现中不做任何处理。
    });
});