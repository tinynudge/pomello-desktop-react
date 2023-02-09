import { selectIsTimerActive } from '@/app/appSlice';
import useDialActions from '@/app/hooks/useDialActions';
import usePauseDialAction from '@/app/hooks/usePauseDialAction';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useTasksCacheKey from '@/app/hooks/useTasksCacheKey';
import Heading from '@/app/ui/Heading';
import SelectField from '@/app/ui/SelectField';
import assertNonNullish from '@/shared/helpers/assertNonNullish';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

const SelectTaskContents: FC = () => {
  const { fetchTasks, getSelectTaskHeading, onTaskSelect, SelectTaskView } = useService();
  const { t } = useTranslation();

  const { selectTask } = usePomelloActions();

  const tasksCacheKey = useTasksCacheKey();
  const { data: tasks } = useQuery(tasksCacheKey, fetchTasks, {
    cacheTime: Infinity,
    suspense: true,
  });

  const isTimerActive = useSelector(selectIsTimerActive);
  const { registerDialActions } = useDialActions();
  const pauseDialAction = usePauseDialAction();

  useEffect(() => {
    if (isTimerActive) {
      return registerDialActions([pauseDialAction]);
    }
  }, [isTimerActive, pauseDialAction, registerDialActions]);

  assertNonNullish(tasks, 'Unable to get tasks');

  const handleTaskSelect = (id: string) => {
    const response = onTaskSelect?.(id);

    if (response !== false) {
      selectTask(id);
    }
  };

  return !SelectTaskView ? (
    <>
      {getSelectTaskHeading && <Heading>{getSelectTaskHeading()}</Heading>}
      <SelectField
        defaultOpen={isTimerActive}
        items={tasks}
        noResultsMessage={t('noTasksFound')}
        onChange={handleTaskSelect}
        placeholder={t('selectTaskPlaceholder')}
      />
    </>
  ) : (
    <SelectTaskView selectTask={selectTask} />
  );
};

export default SelectTaskContents;
