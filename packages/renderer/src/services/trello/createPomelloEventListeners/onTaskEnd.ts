import { PomelloEvent } from '@tinynudge/pomello-service';
import { findOrFailTask } from '../helpers/findOrFailTask';
import { isCheckItem } from '../helpers/isCheckItem';
import { updateTaskNamePomodoros } from '../helpers/updateTaskNamePomodoros';
import { TrelloRuntime } from '../domain';

export const onTaskEnd = (runtime: TrelloRuntime, event: PomelloEvent): void => {
  const { cache, translate } = runtime;
  const log = cache.store.log;
  const preferences = cache.store.preferences;

  if (log && event.taskId && event.timer) {
    const task = findOrFailTask(cache, event.taskId);

    if (preferences.addChecks) {
      updateTaskNamePomodoros(runtime, task.id, event.timer);
    }

    if (preferences.keepLogs) {
      const time = event.timer.adjustedTotalTime - event.timer.time;
      const entry = isCheckItem(task) ? 'commentLogCheckItemStop' : 'commentLogTaskStop';

      log.addEntry(translate(entry)).updateTimeSpent(time).save();
    }
  }
};
