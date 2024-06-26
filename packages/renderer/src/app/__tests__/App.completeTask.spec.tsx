import { vi } from 'vitest';
import { renderApp, screen, waitFor } from '../__fixtures__/renderApp';

describe('App - Complete Task', () => {
  it('should go to the select task view if there is no custom options', async () => {
    const { simulate, userEvent } = renderApp({
      mockService: {
        service: {
          getTaskCompleteItems: undefined,
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.showDialActions();
    await userEvent.click(screen.getByRole('button', { name: 'Complete task' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should go to the select task view if getting custom options returns nothing', async () => {
    const { simulate } = renderApp({
      mockService: {
        service: {
          getTaskCompleteItems: () => {},
        },
      },
    });

    await simulate.selectTask();
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should prompt the user for an action if there are custom options', async () => {
    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'task', label: 'My task' }]),
          getTaskCompleteItems: () => ({
            items: [{ id: 'option', label: 'Option' }],
          }),
        },
      },
    });

    await simulate.selectTask('task');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'My task' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: "Nice! What's next?" })).toBeInTheDocument();
    });
  });

  it('should call the custom option handler when an option is selected', async () => {
    const handleTaskComplete = vi.fn();

    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks: () => Promise.resolve([{ id: 'hello', label: 'World' }]),
          getTaskCompleteItems: () => ({
            items: [
              { id: 'foo', label: 'Foo' },
              { id: 'bar', label: 'Bar' },
            ],
          }),
          onTaskCompletePromptHandled: handleTaskComplete,
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('bar');

    await waitFor(() => {
      expect(handleTaskComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          optionId: 'bar',
          taskId: 'hello',
        })
      );
      expect(screen.getByRole('button', { name: 'Pick a task' })).toBeInTheDocument();
    });
  });

  it('should delay fetching the task if there is a mutation to update tasks', async () => {
    const fetchTasks = vi.fn(() => Promise.resolve([{ id: 'hello', label: 'World' }]));

    let resolveRemoveTask = () => {};

    const removeTask = () =>
      new Promise<void>(resolve => {
        resolveRemoveTask = resolve;
      });

    const { simulate } = renderApp({
      mockService: {
        service: {
          fetchTasks,
          getTaskCompleteItems: () => ({
            items: [{ id: 'bar', label: 'Bar' }],
          }),
          onTaskCompletePromptHandled: () => ({
            removeTask,
          }),
        },
      },
    });

    await simulate.selectTask('hello');
    await simulate.startTimer();
    await simulate.hotkey('completeTaskEarly');
    await simulate.selectOption('bar');
    await simulate.waitForSelectTaskView();

    expect(fetchTasks).toHaveBeenCalledOnce();

    resolveRemoveTask();

    await waitFor(() => {
      expect(fetchTasks).toHaveBeenCalledTimes(2);
    });
  });
});
