export enum LogLevel {
  DEBUG = 'DEBUG',
  UI = 'UI',
  WS = 'WS',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export const getLogLevel = async (): Promise<LogLevel> => {
  // @ts-ignore - window is defined in preload
  const config: string = await window.kotodama.file.getConfig()
  let logLevel = LogLevel.DEBUG
  try {
    logLevel = JSON.parse(config).logLevel
  } catch (e) {
    logLevel = LogLevel.DEBUG
  }
  return logLevel
}

export class Logger {
  private static instance: Logger
  private logTypeInfo: { [key in LogLevel]: string[] } = {
    [LogLevel.DEBUG]: ['3bd4bf', 'fff'],
    [LogLevel.UI]: ['858cf5', 'fff'],
    [LogLevel.WS]: ['f8cc30', 'fff'],
    [LogLevel.INFO]: ['46bdf6', 'fff'],
    [LogLevel.WARN]: ['f67329', 'fff'],
    [LogLevel.ERROR]: ['d9252e', 'fff']
  }

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public debug(message: string, data: unknown = null) {
    this.log(LogLevel.DEBUG, message, data)
  }
  public ui(message: string, data: unknown = null) {
    this.log(LogLevel.UI, message, data)
  }
  public ws(message: string, data: unknown = null) {
    this.log(LogLevel.WS, message, data)
  }
  public info(message: string, data: unknown = null) {
    this.log(LogLevel.INFO, message, data)
  }
  public warn(message: string, data: unknown = null) {
    this.log(LogLevel.WARN, message, data)
  }
  public error(message: string, data: unknown = null) {
    this.log(LogLevel.ERROR, message, data)
  }

  private async log(type: LogLevel, message: string, data: unknown) {
    // @ts-ignore - window is defined in preload
    const config: string = await window.kotodama.file.getConfig()
    let logLevel = LogLevel.DEBUG
    try {
      logLevel = JSON.parse(config).logLevel
    } catch (e) {
      logLevel = LogLevel.DEBUG
    }

    if (logLevel === LogLevel.DEBUG) {
      this.printLog(type, message, data)
    } else if (
      logLevel === LogLevel.INFO &&
      (type === LogLevel.INFO || type === LogLevel.WARN || type === LogLevel.ERROR)
    ) {
      this.printLog(type, message, data)
    } else if (logLevel === LogLevel.WARN && (type === LogLevel.WARN || type === LogLevel.ERROR)) {
      this.printLog(type, message, data)
    } else if (logLevel === LogLevel.ERROR && type === LogLevel.ERROR) {
      this.printLog(type, message, data)
    }
  }
  private printLog(type: LogLevel, message: string, data: unknown) {
    let typeString = type as string

    if (type === LogLevel.WS) {
      if (message.startsWith('GET')) {
        message = message.substring(4)
        typeString = '<<<'
      } else if (message.startsWith('PUT')) {
        message = message.substring(4)
        typeString = '>>>'
      }
    }

    console.log(
      `%c[${typeString}] %c${message}`,
      `background-color: ${this.logTypeInfo[type][0]}; color: ${this.logTypeInfo[type][1]}; border-radius:7px 0 0 7px;padding:2px 4px 2px 7px;margin-bottom:7px;`,
      'background:#e3e8ec;color:#000;padding:2px 7px 4px 4px;border-radius:0 7px 7px 0;margin-bottom:7px;',
      '',
      data
    )
  }
}
