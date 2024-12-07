// 获取所有连接的游戏手柄并查找第一个非空的手柄
function getFirstConnectedGamepad() {
    const gamepads = navigator.getGamepads();
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            return gamepads[i];
        }
    }
    return null;
}

// 尝试使手柄震动
function tryVibrateGamepad(gamepad) {
    if (!gamepad) {
        console.warn("没有检测到已连接的游戏手柄。");
        alert("未检测到已连接的游戏手柄。");
        return;
    }

    // 检查手柄是否支持振动
    if (gamepad.vibrationActuator) {
        try {
            gamepad.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 200,  // 震动持续时间200毫秒
                weakMagnitude: 1.0,  // 弱电机强度
                strongMagnitude: 1.0  // 强电机强度
            }).then(() => {
                console.log("手柄成功震动！");
            }).catch((error) => {
                console.error("无法使手柄震动:", error);
                alert("无法使手柄震动: " + error.message);
            });
        } catch (error) {
            console.error("发生错误:", error);
            alert("发生错误: " + error.message);
        }
    } else if (gamepad.hapticActuators && gamepad.hapticActuators.length > 0) {
        try {
            gamepad.hapticActuators[0].pulse(1.0, 200).then(() => {
                console.log("手柄成功震动！");
            }).catch((error) => {
                console.error("无法使手柄震动:", error);
                alert("无法使手柄震动: " + error.message);
            });
        } catch (error) {
            console.error("发生错误:", error);
            alert("发生错误: " + error.message);
        }
    } else {
        console.warn("当前手柄不支持振动功能。");
        alert("当前手柄不支持振动功能。");
    }
}

// 定义一个函数来检查手柄按键状态
function checkGamepadButtons(buttonIndex) {
    const gamepad = getFirstConnectedGamepad();
    if (gamepad) {
        const button = gamepad.buttons[buttonIndex];
        if (button.pressed) {
            document.getElementById('vibrateButton').click(); // 触发按钮点击事件
        }
    }
}

// 设置一个定时器来定期检查手柄按键状态
function setupGamepadPolling() {
    // Y键通常是索引为3的按钮
    const Y_BUTTON_INDEX = 3;

    // 每隔一段时间检查一次手柄按键状态
    setInterval(() => {
        checkGamepadButtons(Y_BUTTON_INDEX);
    }, 100); // 每100毫秒检查一次
}

// 当页面加载完成时初始化
document.addEventListener('DOMContentLoaded', () => {
    // 给按钮添加点击事件监听器
    document.getElementById('vibrateButton').addEventListener('click', () => {
        const gamepad = getFirstConnectedGamepad();
        tryVibrateGamepad(gamepad);
    });

    // 开始轮询手柄按键状态
    setupGamepadPolling();

    // 监听手柄连接和断开事件
    window.addEventListener("gamepadconnected", function(e) {
        console.log("Gamepad connected at index %d: %s.", e.gamepad.index, e.gamepad.id);
        alert(`游戏手柄已连接，索引 ${e.gamepad.index}: ${e.gamepad.id}`);
    });

    window.addEventListener("gamepaddisconnected", function(e) {
        console.log("Gamepad disconnected from index %d: %s.", e.gamepad.index, e.gamepad.id);
        alert(`游戏手柄已断开，索引 ${e.gamepad.index}: ${e.gamepad.id}`);
    });
});