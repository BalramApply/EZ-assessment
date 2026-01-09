import React, { useState } from 'react';
import type { Column, Card } from '../../types/kanban';
import { KanbanHelpers } from '../../utils/kanbanHelpers';
import ColumnComponent from './Column';
import './Kanban.css';

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(
    KanbanHelpers.getInitialData()
  );
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);

  // ------------------------
  // Card Actions
  // ------------------------

  const handleAddCard = (columnId: string, title: string) => {
    const column = KanbanHelpers.findColumn(columns, columnId);
    if (!column) return;

    const newCard = KanbanHelpers.createCard(
      columnId,
      title,
      column.cards.length
    );

    setColumns(prev =>
      KanbanHelpers.addCard(prev, columnId, newCard)
    );
  };

  const handleEditCard = (cardId: string, newTitle: string) => {
    setColumns(prev =>
      KanbanHelpers.updateCard(prev, cardId, { title: newTitle })
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setColumns(prev =>
      KanbanHelpers.deleteCard(prev, cardId)
    );
  };

  // ------------------------
  // Drag & Drop
  // ------------------------

  const handleDragStart = (card: Card) => {
    setDraggedCard(card);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // required for drop
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedCard) return;

    const targetColumn = KanbanHelpers.findColumn(columns, targetColumnId);
    if (!targetColumn) return;

    setColumns(prev =>
      KanbanHelpers.moveCard(
        prev,
        draggedCard.id,
        draggedCard.columnId,
        targetColumnId,
        targetColumn.cards.length
      )
    );

    setDraggedCard(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
  };

  // ------------------------
  // Helpers
  // ------------------------

  const getTotalCards = () =>
    columns.reduce((total, column) => total + column.cards.length, 0);

  // ------------------------
  // Render
  // ------------------------

  return (
    <div className="kanban-board-container">
      {/* Header */}
      <div className="kanban-header">
        <h1 className="kanban-title">Kanban Board</h1>
        <span className="stat-badge">
          📊 Total Cards: <strong>{getTotalCards()}</strong>
        </span>
      </div>

      {/* Board */}
      <div className="kanban-board">
        {columns.map(column => (
          <ColumnComponent
            key={column.id}
            column={column}
            onAddCard={handleAddCard}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="kanban-footer">
        <div className="features-info">
          <h3>✨ Features</h3>
          <div className="feature-grid">
            <div className="feature-item">
              ✅ <strong>Drag & Drop</strong> - Move cards between columns
            </div>
            <div className="feature-item">
              ✏️ <strong>Edit Cards</strong> - Double-click or click edit button
            </div>
            <div className="feature-item">
              ➕ <strong>Add Cards</strong> - Click "+ Add Card" button
            </div>
            <div className="feature-item">
              🗑️ <strong>Delete Cards</strong> - Click delete button with confirmation
            </div>
            <div className="feature-item">
              📱 <strong>Responsive</strong> - Works on desktop and mobile
            </div>
            <div className="feature-item">
              🎨 <strong>Clean UI</strong> - Modern, intuitive design
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
