import { selectOverlayView, setOverlayView } from '@/app/appSlice';
import usePomelloActions from '@/app/hooks/usePomelloActions';
import useService from '@/shared/hooks/useService';
import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TaskVoidView: FC = () => {
  const dispatch = useDispatch();

  const { onNoteCreate } = useService();

  const { voidPromptHandled } = usePomelloActions();

  useEffect(() => {
    if (!onNoteCreate) {
      voidPromptHandled();
    } else {
      dispatch(setOverlayView('externalDistraction'));
    }
  }, [dispatch, onNoteCreate, voidPromptHandled]);

  const didShowAddNoteView = useRef(false);
  const overlayView = useSelector(selectOverlayView);

  useEffect(() => {
    if (overlayView) {
      didShowAddNoteView.current = true;
    } else if (!overlayView && didShowAddNoteView.current) {
      voidPromptHandled();
    }
  }, [overlayView, voidPromptHandled]);

  return null;
};

export default TaskVoidView;
