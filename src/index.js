const electron = require('electron')
const { app, BrowserWindow } = electron
const glob = require('glob')
const path = require('path')

let mainWindow = null
const debug = true

function initialize() {
  // 检查是否已经生成了实例
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  }

  loadOtherJs()

  function loadWindow(__display_area) {
    console.log('the screen display size :',__display_area)
    // 窗口选项
    const windowOption = {
    //   width: __display_area.width * .7,
    //   height: __display_area.height * .8,
      height: 768,
      width: 1240,
      title: 'Helper',
      icon: path.resolve(__dirname, 'favicon.ico'),
      frame: false,
      useContentSize: true,
    }
    // 实例化窗口
    mainWindow = new BrowserWindow(windowOption)
    mainWindow.loadURL(path.resolve(__dirname, 'index.html'))
    // 如果测试则打开测试工具栏目
    if (debug) {
      openDevTools()
    }
    // 监听窗口关闭
    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }

  function queryDisplayScreen() {
    return electron.screen.getPrimaryDisplay().workAreaSize
  }
  /**
   * i. 打开测试相关的
   */
  function openDevTools() {
    mainWindow.webContents.openDevTools()
    require('devtron').install()
  }

  app.on('ready', () => {
    // 检测屏幕
    const __display_area = queryDisplayScreen()
    loadWindow(__display_area)
  })

  app.on('window-all-closed', () => {
    console.log('app quit.....')
    app.quit()
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      loadWindow(queryDisplayScreen())
    }
  })

  /**
   * i. 当有第二个app实例创建时应该关闭
   */
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.siMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })
}

function loadOtherJs() {
  console.log('load other main process script...')
  const files = glob.sync(path.join(__dirname,'main-process/**/*.js'))
  if(files) {
    files.forEach((file)=>{require(file)})
  }
}

initialize()