import { DialAction, NoteType } from '@pomello-desktop/domain';
import { PomelloState } from '@tinynudge/pomello-service';
import { ParentComponent, createContext, onCleanup, useContext } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { usePomelloService } from './PomelloContext';

type OverlayView = 'create-task' | NoteType;

interface Store {
  dialActions: DialAction[];
  isQuickTaskSelectEnabled: boolean;
  overlayView: OverlayView | null;
  pomelloState: PomelloState;
}

interface StoreActions {
  dialActionsSet(actions: DialAction[]): void;
  overlayViewCleared(): void;
  overlayViewSet(type: OverlayView): void;
  quickTaskEnabled(): void;
  quickTaskReset(): void;
}

const StoreContext = createContext<[Store, StoreActions]>();

export const useStore = (): Store => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return store[0];
};

export const useStoreActions = (): StoreActions => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStoreActions must be used within a StoreProvider');
  }

  return store[1];
};

export const StoreProvider: ParentComponent = props => {
  const pomelloService = usePomelloService();

  const [store, setStore] = createStore<Store>({
    dialActions: [],
    isQuickTaskSelectEnabled: false,
    overlayView: null,
    pomelloState: pomelloService.getState(),
  });

  const handlePomelloStateChange = (state: PomelloState) => {
    setStore('pomelloState', reconcile(state));
  };

  pomelloService.on('update', handlePomelloStateChange);

  onCleanup(() => {
    pomelloService.off('update', handlePomelloStateChange);
  });

  const dialActionsSet = (actions: DialAction[]) => {
    setStore('dialActions', actions);

    onCleanup(() => {
      setStore('dialActions', []);
    });
  };

  const overlayViewCleared = () => {
    setStore('overlayView', null);
  };

  const overlayViewSet = (type: NoteType) => {
    setStore('overlayView', type);
  };

  const quickTaskEnabled = () => {
    setStore('isQuickTaskSelectEnabled', true);
  };

  const quickTaskReset = () => {
    setStore('isQuickTaskSelectEnabled', false);
  };

  const actions: StoreActions = {
    dialActionsSet,
    overlayViewCleared,
    overlayViewSet,
    quickTaskEnabled,
    quickTaskReset,
  };

  return <StoreContext.Provider value={[store, actions]}>{props.children}</StoreContext.Provider>;
};
