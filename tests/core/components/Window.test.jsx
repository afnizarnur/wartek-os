import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Window } from '../../../src/core/components/Window';
import '@testing-library/jest-dom';

describe('Window', () => {
  it('renders title bar with given title', () => {
    render(<Window title="Test App" />);
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<Window title="Test App" />);
    expect(screen.getByRole('button', { name: /✕/ })).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<Window title="Test App" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /✕/ }));
    expect(onClose).toHaveBeenCalled();
  });
});
