import useCurrentTask from '@/app/hooks/useCurrentTask';
import useHotkeys from '@/app/hooks/useHotkeys';
import useInvalidateTasksCache from '@/app/hooks/useInvalidateTasksCache';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useRemoveTaskFromCache from '@/app/hooks/useRemoveTaskFromCache/useRemoveTaskFromCache';
import useShowAddNoteView from '@/app/hooks/useShowAddNoteView';
import Heading from '@/app/ui/Heading';
import SelectField from '@/app/ui/SelectField';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem } from '@domain';
import produce from 'immer';
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';

const TaskTimerEndView: FC = () => {
  const { t } = useTranslation();
  const { getTaskTimerEndItems, onTaskTimerEndPromptHandled } = useService();
  const { taskTimerEndPromptHandled } = usePomelloActions();

  const { currentTask, currentTaskLabel } = useCurrentTask();

  const showAddNoteView = useShowAddNoteView();

  const customMoveTaskItemId = useRef<string>();

  const invalidateTasksCache = useInvalidateTasksCache();
  const removeTaskFromCache = useRemoveTaskFromCache();

  const handleActionSelect = useCallback(
    (id: string) => {
      if (id === 'continueTask' || id === 'switchTask' || id === 'voidTask') {
        taskTimerEndPromptHandled(id);
      } else if (id === 'addNote') {
        showAddNoteView('generalNote');
      } else {
        const response = onTaskTimerEndPromptHandled?.({
          invalidateTasksCache,
          optionId: id,
          taskId: currentTask.id,
        });

        if (response?.action) {
          taskTimerEndPromptHandled(response.action);
        }

        if (response?.shouldRemoveTaskFromCache) {
          removeTaskFromCache(currentTask.id);
        }
      }
    },
    [
      currentTask.id,
      invalidateTasksCache,
      onTaskTimerEndPromptHandled,
      removeTaskFromCache,
      showAddNoteView,
      taskTimerEndPromptHandled,
    ]
  );

  const handleTaskMove = useCallback(() => {
    if (customMoveTaskItemId.current) {
      handleActionSelect(customMoveTaskItemId.current);
    } else {
      taskTimerEndPromptHandled('switchTask');
    }
  }, [handleActionSelect, taskTimerEndPromptHandled]);

  const { getHotkeyLabel, registerHotkeys } = useHotkeys();
  useEffect(() => {
    return registerHotkeys({
      addNote: () => showAddNoteView('generalNote'),
      continueTask: () => taskTimerEndPromptHandled('continueTask'),
      moveTask: handleTaskMove,
      voidTask: () => taskTimerEndPromptHandled('voidTask'),
    });
  }, [handleTaskMove, registerHotkeys, showAddNoteView, taskTimerEndPromptHandled]);

  const items = useMemo(() => {
    let customItems: SelectItem[] = [];

    const taskTimerEndItems = getTaskTimerEndItems?.(currentTask.id);
    if (Array.isArray(taskTimerEndItems)) {
      customItems = taskTimerEndItems;
    } else if (taskTimerEndItems) {
      customItems = produce(taskTimerEndItems.items, draft => {
        if (!taskTimerEndItems.moveTaskItemId) {
          return;
        }

        let moveTaskOption: SelectItem | undefined;

        const itemsToSearch = [...draft];

        while (!moveTaskOption && itemsToSearch.length) {
          const item = itemsToSearch.shift()!;

          if (item.type === 'group' || item.type === 'customGroup') {
            itemsToSearch.unshift(...item.items);
          } else if (item.id === taskTimerEndItems.moveTaskItemId) {
            moveTaskOption = item;
          }
        }

        if (moveTaskOption) {
          customMoveTaskItemId.current = taskTimerEndItems.moveTaskItemId;
          moveTaskOption.hint = getHotkeyLabel('moveTask');
        }
      });
    }

    return [
      {
        hint: getHotkeyLabel('continueTask'),
        id: 'continueTask',
        label: t('taskTimerEndContinue'),
      },
      {
        hint: !customMoveTaskItemId.current ? getHotkeyLabel('moveTask') : undefined,
        id: 'switchTask',
        label: t('taskTimerEndSwitch'),
      },
      {
        hint: getHotkeyLabel('voidTask'),
        id: 'voidTask',
        label: t('taskTimerEndVoid'),
      },
      {
        hint: getHotkeyLabel('addNote'),
        id: 'addNote',
        label: t('taskTimerEndAddNote'),
      },
      ...customItems,
    ];
  }, [currentTask.id, getHotkeyLabel, getTaskTimerEndItems, t]);

  return (
    <>
      <Heading>{currentTaskLabel}</Heading>
      <SelectField
        items={items}
        onChange={handleActionSelect}
        placeholder={t('taskTimerEndPlaceholder')}
      />
    </>
  );
};

export default TaskTimerEndView;
