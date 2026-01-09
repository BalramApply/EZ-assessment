// src/utils/kanbanHelpers.ts

import type { Card, Column } from '../types/kanban';

export class KanbanHelpers {
  static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static createCard(columnId: string, title: string, order: number): Card {
    return {
      id: this.generateId(),
      title,
      columnId,
      order,
      createdAt: new Date()
    };
  }

  static findCard(columns: Column[], cardId: string): Card | null {
    for (const column of columns) {
      const card = column.cards.find(c => c.id === cardId);
      if (card) return card;
    }
    return null;
  }

  static findColumn(columns: Column[], columnId: string): Column | null {
    return columns.find(col => col.id === columnId) || null;
  }

  static addCard(columns: Column[], columnId: string, card: Card): Column[] {
    return columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: [...column.cards, card]
        };
      }
      return column;
    });
  }

  static deleteCard(columns: Column[], cardId: string): Column[] {
    return columns.map(column => ({
      ...column,
      cards: column.cards.filter(card => card.id !== cardId)
    }));
  }

  static updateCard(columns: Column[], cardId: string, updates: Partial<Card>): Column[] {
    return columns.map(column => ({
      ...column,
      cards: column.cards.map(card =>
        card.id === cardId ? { ...card, ...updates } : card
      )
    }));
  }

  static moveCard(
    columns: Column[],
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    targetIndex: number
  ): Column[] {
    // Find the card
    const card = this.findCard(columns, cardId);
    if (!card) return columns;

    // Remove card from source column
    let newColumns = columns.map(column => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          cards: column.cards.filter(c => c.id !== cardId)
        };
      }
      return column;
    });

    // Add card to target column at specific index
    newColumns = newColumns.map(column => {
      if (column.id === targetColumnId) {
        const updatedCard = { ...card, columnId: targetColumnId };
        const newCards = [...column.cards];
        newCards.splice(targetIndex, 0, updatedCard);
        
        // Update order for all cards
        return {
          ...column,
          cards: newCards.map((c, idx) => ({ ...c, order: idx }))
        };
      }
      return column;
    });

    return newColumns;
  }

  static reorderCards(columns: Column[], columnId: string): Column[] {
    return columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: column.cards.map((card, index) => ({ ...card, order: index }))
        };
      }
      return column;
    });
  }

  static getInitialData(): Column[] {
    return [
      {
        id: 'todo',
        title: 'To Do',
        cards: [
          {
            id: 'card-1',
            title: 'Design new landing page',
            columnId: 'todo',
            order: 0,
            createdAt: new Date()
          },
          {
            id: 'card-2',
            title: 'Setup project repository',
            columnId: 'todo',
            order: 1,
            createdAt: new Date()
          },
          {
            id: 'card-3',
            title: 'Write API documentation',
            columnId: 'todo',
            order: 2,
            createdAt: new Date()
          }
        ]
      },
      {
        id: 'inProgress',
        title: 'In Progress',
        cards: [
          {
            id: 'card-4',
            title: 'Implement user authentication',
            columnId: 'inProgress',
            order: 0,
            createdAt: new Date()
          },
          {
            id: 'card-5',
            title: 'Create database schema',
            columnId: 'inProgress',
            order: 1,
            createdAt: new Date()
          }
        ]
      },
      {
        id: 'done',
        title: 'Done',
        cards: [
          {
            id: 'card-6',
            title: 'Setup development environment',
            columnId: 'done',
            order: 0,
            createdAt: new Date()
          },
          {
            id: 'card-7',
            title: 'Initial project planning',
            columnId: 'done',
            order: 1,
            createdAt: new Date()
          }
        ]
      }
    ];
  }
}