// src/types/tree.ts

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  hasChildren?: boolean; // For lazy loading
  isLoading?: boolean;
}

export interface TreeViewProps {
  data: TreeNode[];
  onNodeUpdate?: (nodes: TreeNode[]) => void;
}

export interface TreeNodeProps {
  node: TreeNode;
  level: number;
  onToggle: (nodeId: string) => void;
  onAdd: (parentId: string, nodeName: string) => void;
  onDelete: (nodeId: string) => void;
  onEdit: (nodeId: string, newName: string) => void;
  onLoadChildren: (nodeId: string) => void;
  onDragStart: (nodeId: string) => void;
  onDragOver: (e: React.DragEvent, nodeId: string) => void;
  onDrop: (e: React.DragEvent, nodeId: string) => void;
}