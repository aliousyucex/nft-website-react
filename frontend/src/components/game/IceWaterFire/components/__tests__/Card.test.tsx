import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Card from '../Card';
import { Card as CardType } from '../../types';

describe('Card Component', () => {
  const mockCard: CardType = {
    id: 'test-1',
    type: 'fire',
    value: 5,
  };

  it('should render card with correct type and value', () => {
    render(<Card card={mockCard} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('FIRE')).toBeInTheDocument();
  });

  it('should display fire emoji for fire type', () => {
    render(<Card card={mockCard} />);
    
    expect(screen.getByText('🔥')).toBeInTheDocument();
  });

  it('should display ice emoji for ice type', () => {
    const iceCard: CardType = { ...mockCard, type: 'ice' };
    render(<Card card={iceCard} />);
    
    expect(screen.getByText('❄️')).toBeInTheDocument();
  });

  it('should display water emoji for water type', () => {
    const waterCard: CardType = { ...mockCard, type: 'water' };
    render(<Card card={waterCard} />);
    
    expect(screen.getByText('💧')).toBeInTheDocument();
  });

  it('should call onSelect when clicked and not disabled', () => {
    const onSelect = vi.fn();
    render(<Card card={mockCard} onSelect={onSelect} />);
    
    const card = screen.getByText('5').closest('div');
    if (card) {
      fireEvent.click(card);
    }
    
    expect(onSelect).toHaveBeenCalledWith(mockCard);
  });

  it('should not call onSelect when disabled', () => {
    const onSelect = vi.fn();
    render(<Card card={mockCard} onSelect={onSelect} disabled />);
    
    const card = screen.getByText('5').closest('div');
    if (card) {
      fireEvent.click(card);
    }
    
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('should show selected indicator when isSelected is true', () => {
    const { container } = render(<Card card={mockCard} isSelected />);
    
    // Check for selected styles or indicator
    const cardWrapper = container.firstChild;
    expect(cardWrapper).toHaveStyle({ transform: expect.stringContaining('scale') });
  });

  it('should show card back for opponent when not revealed', () => {
    render(<Card card={mockCard} isOpponent />);
    
    expect(screen.getByText('🎴')).toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });

  it('should show card front for opponent when revealed', () => {
    render(<Card card={mockCard} isOpponent isRevealed />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('FIRE')).toBeInTheDocument();
  });
});

