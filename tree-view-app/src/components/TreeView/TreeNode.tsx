// src/components/TreeView/TreeNode.tsx

import React, { useState, useRef, useEffect } from 'react';
import type { TreeNodeProps } from '../../types/tree';
import './TreeView.css';

const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  level,
  onToggle,
  onAdd,
  onDelete,
  onEdit,
  onLoadChildren,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [isAdding, setIsAdding] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleToggle = () => {
    if (node.hasChildren && !node.children?.length && !node.isLoading) {
      onLoadChildren(node.id);
    }
    onToggle(node.id);
  };

  const handleEdit = () => {
    if (editValue.trim() && editValue !== node.name) {
      onEdit(node.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleAddNode = () => {
    if (newNodeName.trim()) {
      onAdd(node.id, newNodeName.trim());
      setNewNodeName('');
      setIsAdding(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${node.name}" and all its children?`)) {
      onDelete(node.id);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(node.name);
  };

  return (
    <div className="tree-node-wrapper" style={{ marginLeft: level * 20 }}>
      <div
        className="tree-node"
        draggable
        onDragStart={() => onDragStart(node.id)}
        onDragOver={(e) => onDragOver(e, node.id)}
        onDrop={(e) => onDrop(e, node.id)}
      >
        {/* Expand/Collapse Icon */}
        {(node.hasChildren || node.children?.length) ? (
          <button
            onClick={handleToggle}
            className="toggle-button"
            aria-label={node.isExpanded ? 'Collapse' : 'Expand'}
          >
            {node.isLoading ? '⏳' : node.isExpanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="spacer"></span>
        )}

        {/* Node Name - Editable */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEdit();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="edit-input"
          />
        ) : (
          <span
            onDoubleClick={handleDoubleClick}
            className="node-name"
          >
            📁 {node.name}
          </span>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={() => setIsEditing(true)}
            title="Edit"
            className="action-btn edit-btn"
          >
            ✏️
          </button>
          <button
            onClick={() => setIsAdding(true)}
            title="Add Child"
            className="action-btn add-btn"
          >
            ➕
          </button>
          <button
            onClick={handleDelete}
            title="Delete"
            className="action-btn delete-btn"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Add New Node Input */}
      {isAdding && (
        <div className="add-node-form">
          <input
            type="text"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddNode();
              if (e.key === 'Escape') setIsAdding(false);
            }}
            placeholder="Enter node name..."
            autoFocus
            className="add-input"
          />
          <button onClick={handleAddNode} className="btn-primary">
            Add
          </button>
          <button onClick={() => setIsAdding(false)} className="btn-secondary">
            Cancel
          </button>
        </div>
      )}

      {/* Render Children */}
      {node.isExpanded && node.children && (
        <div className="children">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onAdd={onAdd}
              onDelete={onDelete}
              onEdit={onEdit}
              onLoadChildren={onLoadChildren}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNodeComponent;