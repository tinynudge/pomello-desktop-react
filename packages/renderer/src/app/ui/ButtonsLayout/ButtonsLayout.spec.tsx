import { vi } from 'vitest';
import mountComponent, { screen } from '../__fixtures__/mountComponent';
import ButtonsLayout from './ButtonsLayout';

describe('UI - Buttons Layout', () => {
  it('should render properly', () => {
    mountComponent(
      <ButtonsLayout
        buttons={[
          { id: 'one', content: 'One', onClick: () => null },
          { id: 'two', content: 'Two', onClick: () => null },
        ]}
      >
        <h1>My heading</h1>
      </ButtonsLayout>
    );

    expect(screen.getByRole('heading', { name: 'My heading' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument();
  });

  it('should call a handler when a button is clicked', async () => {
    const handleButtonClick = vi.fn();

    const { userEvent } = mountComponent(
      <ButtonsLayout buttons={[{ id: 'one', content: 'Click me', onClick: handleButtonClick }]} />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));

    expect(handleButtonClick).toHaveBeenCalled();
  });
});
