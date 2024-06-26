import { AppEvent, LogLevel, LogMessage } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const logMessage = (level: LogLevel, message: LogMessage): Promise<void> =>
  ipcRenderer.invoke(AppEvent.LogMessage, level, message);
