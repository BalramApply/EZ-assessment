// src/types/kanban.ts

export interface Card {
  id: string;
  title: string;
  columnId: string;
  order: number;
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface KanbanBoardData {
  columns: Column[];
}

export interface CardProps {
  card: Card;
  onEdit: (cardId: string, newTitle: string) => void;
  onDelete: (cardId: string) => void;
  onDragStart: (card: Card) => void;
  onDragEnd: () => void;
}

export interface ColumnProps {
  column: Column;
  onAddCard: (columnId: string, title: string) => void;
  onEditCard: (cardId: string, newTitle: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDragStart: (card: Card) => void;
  onDragOver: (e: React.DragEvent, columnId: string) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onDragEnd: () => void;
}

export type ColumnType = 'todo' | 'inProgress' | 'done';