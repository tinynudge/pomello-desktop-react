import { TrelloChecklist } from '../domain/TrelloChecklist';
import generateTrelloCheckItem from './generateTrelloCheckItem';

const generateTrelloChecklist = (values: Partial<TrelloChecklist> = {}): TrelloChecklist => ({
  checkItems: values.checkItems ?? [generateTrelloCheckItem()],
  id: values.id ?? 'TRELLO_CHECKLIST_ID',
  name: values.name ?? 'My test checklist',
  pos: values.pos ?? 0,
});

export default generateTrelloChecklist;
