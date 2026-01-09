// src/components/Kanban/Card.tsx

import React, { useState, useRef, useEffect } from 'react';
import type { CardProps } from '../../types/kanban';
import './Kanban.css';

const CardComponent: React.FC<CardProps> = ({
  card,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(card.title);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (editValue.trim() && editValue !== card.title) {
      onEdit(card.id, editValue.trim());
    } else {
      setEditValue(card.title);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${card.title}"?`)) {
      onDelete(card.id);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(card.title);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(card);
  };

  return (
    <div
      className="kanban-card"
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleEdit();
            }
            if (e.key === 'Escape') {
              setEditValue(card.title);
              setIsEditing(false);
            }
          }}
          className="card-edit-textarea"
          rows={3}
        />
      ) : (
        <>
          <div className="card-content" onDoubleClick={handleDoubleClick}>
            <p className="card-title">{card.title}</p>
          </div>
          <div className="card-actions">
            <button
              onClick={() => setIsEditing(true)}
              className="card-action-btn edit"
              title="Edit card"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="card-action-btn delete"
              title="Delete card"
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CardComponent;