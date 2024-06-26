import { AppEvent, ThemeCss } from '@pomello-desktop/domain';
import { ipcRenderer, IpcRendererEvent } from 'electron';

type ThemeCssChangeListener = (themeCss: ThemeCss) => void;

export const onThemeCssChange = (callback: ThemeCssChangeListener) => {
  const handler = (_event: IpcRendererEvent, themeCss: ThemeCss) => callback(themeCss);

  ipcRenderer.on(AppEvent.ThemeCssChange, handler);
};
