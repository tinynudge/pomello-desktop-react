import { TaskTimerEndPromptHandledAction } from '@tinynudge/pomello-service';
import findOrFailTask from './helpers/findOrFailTask';
import isCheckItem from './helpers/isCheckItem';
import moveCardAndUpdateDoneList from './helpers/moveCardAndUpdateDoneList';
import { TrelloRuntime } from './TrelloRuntime';

const onTaskTimerEndPromptHandled = (
  runtime: TrelloRuntime,
  taskId: string,
  action: string
): TaskTimerEndPromptHandledAction => {
  const task = findOrFailTask(runtime.cache, taskId);

  if (isCheckItem(task)) {
    runtime.api.markCheckItemComplete(task);
  } else {
    moveCardAndUpdateDoneList(runtime, task, action);
  }

  return 'switchTask';
};

export default onTaskTimerEndPromptHandled;
