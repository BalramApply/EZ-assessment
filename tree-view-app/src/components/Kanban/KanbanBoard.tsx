// src/components/Kanban/KanbanBoard.tsx

import React, { useState } from 'react';
import type { Column, Card } from '../../types/kanban';
import { KanbanHelpers } from '../../utils/kanbanHelpers';
import ColumnComponent from './Column';
import './Kanban.css';

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(KanbanHelpers.getInitialData());
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleAddCard = (columnId: string, title: string) => {
    const column = KanbanHelpers.findColumn(columns, columnId);
    if (!column) return;

    const newCard = KanbanHelpers.createCard(
      columnId,
      title,
      column.cards.length
    );

    setColumns(prevColumns =>
      KanbanHelpers.addCard(prevColumns, columnId, newCard)
    );
  };

  const handleEditCard = (cardId: string, newTitle: string) => {
    setColumns(prevColumns =>
      KanbanHelpers.updateCard(prevColumns, cardId, { title: newTitle })
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setColumns(prevColumns =>
      KanbanHelpers.deleteCard(prevColumns, cardId)
    );
  };

  const handleDragStart = (card: Card) => {
    setDraggedCard(card);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();

    if (!draggedCard) return;

    const sourceColumnId = draggedCard.columnId;
    const targetColumn = KanbanHelpers.findColumn(columns, targetColumnId);

    if (!targetColumn) return;

    // Calculate drop position
    const targetIndex = targetColumn.cards.length;

    // Move the card
    setColumns(prevColumns =>
      KanbanHelpers.moveCard(
        prevColumns,
        draggedCard.id,
        sourceColumnId,
        targetColumnId,
        targetIndex
      )
    );

    handleDragEnd();
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverColumn(null);
  };

  const getTotalCards = () => {
    return columns.reduce((total, column) => total + column.cards.length, 0);
  };

  return (
    <div className="kanban-board-container">
      <div className="kanban-header">
        <h1 className="kanban-title">Kanban Board</h1>
        <div className="kanban-stats">
          <span className="stat-badge">
            📊 Total Cards: <strong>{getTotalCards()}</strong>
          </span>
        </div>
      </div>

      <div className="kanban-board">
        {columns.map((column) => (
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