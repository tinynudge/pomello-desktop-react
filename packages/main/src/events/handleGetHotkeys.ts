import appendHotkeyLabels from '@/helpers/appendHotkeyLabels';
import getHotkeys from '@/helpers/getHotkeys';
import { LabeledHotkeys } from '@domain';

const handleGetHotkeys = async (): Promise<LabeledHotkeys> => {
  const hotkeys = getHotkeys();

  return appendHotkeyLabels(hotkeys.all());
};

export default handleGetHotkeys;
