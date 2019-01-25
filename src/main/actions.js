const { ipcMain, app} = require('electron')

/**
 * 退出应用程序
 */
ipcMain.on('quit-application-immediately',(event,args)=> {
    leaveApplication()
})

function leaveApplication() {
    app.exit()
}