// src/components/Kanban/Column.tsx

import React, { useState } from 'react';
import type { ColumnProps } from '../../types/kanban';
import CardComponent from './Card';
import './Kanban.css';

const ColumnComponent: React.FC<ColumnProps> = ({
  column,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle.trim());
      setNewCardTitle('');
      setIsAdding(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    onDragOver(e, column.id);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set isDragOver to false if we're leaving the column entirely
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, column.id);
  };

  const getColumnColor = () => {
    switch (column.id) {
      case 'todo':
        return '#6366f1'; // Indigo
      case 'inProgress':
        return '#f59e0b'; // Amber
      case 'done':
        return '#10b981'; // Green
      default:
        return '#64748b'; // Slate
    }
  };

  return (
    <div className="kanban-column">
      <div className="column-header" style={{ backgroundColor: getColumnColor() }}>
        <h2 className="column-title">{column.title}</h2>
        <span className="card-count">{column.cards.length}</span>
      </div>

      <div
        className={`column-content ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {column.cards.length === 0 && !isAdding && (
          <div className="empty-state">
            <p>No cards yet</p>
            <p className="empty-state-hint">Drop cards here or add new ones</p>
          </div>
        )}

        {column.cards
          .sort((a, b) => a.order - b.order)
          .map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}

        {isAdding && (
          <div className="add-card-form">
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCard();
                }
                if (e.key === 'Escape') {
                  setIsAdding(false);
                  setNewCardTitle('');
                }
              }}
              placeholder="Enter card title..."
              autoFocus
              className="add-card-textarea"
              rows={3}
            />
            <div className="add-card-actions">
              <button onClick={handleAddCard} className="btn-add">
                Add Card
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewCardTitle('');
                }}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsAdding(true)}
        className="add-card-button"
        disabled={isAdding}
      >
        + Add Card
      </button>
    </div>
  );
};

export default ColumnComponent;