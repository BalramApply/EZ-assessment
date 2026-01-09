// src/components/TreeView/TreeView.tsx

import React, { useState } from 'react';
import type { TreeNode } from '../../types/tree';
import { TreeHelpers } from '../../utils/treeHelpers';
import TreeNodeComponent from './TreeNode';
import './TreeView.css';

const TreeView: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeNode[]>([
    {
      id: '1',
      name: 'Root',
      isExpanded: true,
      children: [
        {
          id: '1-1',
          name: 'Child 1',
          children: [
            { id: '1-1-1', name: 'Grandchild 1', children: [] },
            { id: '1-1-2', name: 'Grandchild 2', children: [] }
          ]
        },
        {
          id: '1-2',
          name: 'Child 2',
          hasChildren: true,
          isExpanded: false
        }
      ]
    },
    {
      id: '2',
      name: 'Second Root',
      hasChildren: true,
      isExpanded: false
    }
  ]);

  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const handleToggle = (nodeId: string) => {
    setTreeData(prevData =>
      TreeHelpers.updateNode(prevData, nodeId, {
        isExpanded: !TreeHelpers.findNode(prevData, nodeId)?.isExpanded
      })
    );
  };

  const handleAdd = (parentId: string, nodeName: string) => {
    const newNode: TreeNode = {
      id: TreeHelpers.generateId(),
      name: nodeName,
      children: []
    };
    setTreeData(prevData => TreeHelpers.addNode(prevData, parentId, newNode));
  };

  const handleDelete = (nodeId: string) => {
    setTreeData(prevData => TreeHelpers.deleteNode(prevData, nodeId));
  };

  const handleEdit = (nodeId: string, newName: string) => {
    setTreeData(prevData => TreeHelpers.updateNode(prevData, nodeId, { name: newName }));
  };

  const handleLoadChildren = (nodeId: string) => {
    // Set loading state
    setTreeData(prevData =>
      TreeHelpers.updateNode(prevData, nodeId, { isLoading: true })
    );

    // Simulate API call
    TreeHelpers.fetchChildren(nodeId).then((children) => {
      setTreeData(prevData =>
        TreeHelpers.updateNode(prevData, nodeId, {
          children,
          isLoading: false,
          hasChildren: false
        })
      );
    });
  };

  const handleDragStart = (nodeId: string) => {
    setDraggedNodeId(nodeId);
  };

  const handleDragOver = (e: React.DragEvent, _nodeId: string) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetNodeId: string) => {
    e.preventDefault();
    if (!draggedNodeId || draggedNodeId === targetNodeId) return;

    const draggedNode = TreeHelpers.findNode(treeData, draggedNodeId);
    if (!draggedNode) return;

    // Remove from original location
    let newData = TreeHelpers.deleteNode(treeData, draggedNodeId);
    // Add to new location
    newData = TreeHelpers.addNode(newData, targetNodeId, draggedNode);

    setTreeData(newData);
    setDraggedNodeId(null);
  };

  return (
    <div className="tree-view-container">
      <h1 className="tree-view-title">Tree View Component</h1>
      <div className="tree-view-content">
        {treeData.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            onToggle={handleToggle}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onLoadChildren={handleLoadChildren}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
      <div className="features-list">
        <h3>Features Implemented:</h3>
        <ul>
          <li>✅ Expand/Collapse nodes</li>
          <li>✅ Add new child nodes</li>
          <li>✅ Delete nodes with confirmation</li>
          <li>✅ Drag & drop support</li>
          <li>✅ Lazy loading (click on "Second Root")</li>
          <li>✅ Edit node name (double-click or edit button)</li>
        </ul>
      </div>
    </div>
  );
};

export default TreeView;