import { Sound } from './Sound';

export interface Settings {
  alwaysOnTop: boolean;
  snapEdges: boolean;
  timeExpiredNotification: string;
  overtime: boolean;
  overtimeDelay: number;
  checkPomelloStatus: boolean;
  warnBeforeTaskCancel: boolean;
  warnBeforeAppQuit: boolean;
  taskTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  pomodoroSet: number;
  resetPomodoroSet: boolean;
  autoStartTasks: boolean;
  autoStartBreaks: boolean;
  titleMarker: string;
  titleFormat: string;
  completedTaskPosition: string;
  createdTaskPosition: string;
  productivityChartType: string;
  productivityChartDays: string[];
  betweenTasksGracePeriod: number;
  longBreakTimerEndSound: string;
  longBreakTimerEndVol: number | string;
  longBreakTimerStartSound: string;
  longBreakTimerStartVol: number | string;
  longBreakTimerTickSound: string;
  longBreakTimerTickVol: number | string;
  osxAllowMoveAnywhere: boolean;
  selectMaxRows: number;
  shortBreakTimerEndSound: string;
  shortBreakTimerEndVol: number | string;
  shortBreakTimerStartSound: string;
  shortBreakTimerStartVol: number | string;
  shortBreakTimerTickSound: string;
  shortBreakTimerTickVol: number | string;
  showAddNoteButton: boolean;
  showMenuButton: boolean;
  showPauseButton: boolean;
  showSwitchTaskButton: boolean;
  showTaskFinishedButton: boolean;
  showVoidTaskButton: boolean;
  taskTimerEndSound: string;
  taskTimerEndVol: number | string;
  taskTimerStartSound: string;
  taskTimerStartVol: number | string;
  taskTimerTickSound: string;
  taskTimerTickVol: number | string;
  sounds: Record<string, Sound>;
  timestamp?: number;
}
