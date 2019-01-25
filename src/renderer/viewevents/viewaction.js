/**
 * 退出应用程序
 */
function leaveApplication() {
    const {ipcRenderer} = require('electron')
    ipcRenderer.sendSync('quit-application-immediately')
}