// src/utils/treeHelpers.ts

import type { TreeNode } from '../types/tree';

export class TreeHelpers {
  static findNode(nodes: TreeNode[], nodeId: string): TreeNode | null {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children) {
        const found = this.findNode(node.children, nodeId);
        if (found) return found;
      }
    }
    return null;
  }

  static updateNode(
    nodes: TreeNode[],
    nodeId: string,
    updates: Partial<TreeNode>
  ): TreeNode[] {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: this.updateNode(node.children, nodeId, updates)
        };
      }
      return node;
    });
  }

  static addNode(
    nodes: TreeNode[],
    parentId: string,
    newNode: TreeNode
  ): TreeNode[] {
    return nodes.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
          hasChildren: true,
          isExpanded: true
        };
      }
      if (node.children) {
        return {
          ...node,
          children: this.addNode(node.children, parentId, newNode)
        };
      }
      return node;
    });
  }

  static deleteNode(nodes: TreeNode[], nodeId: string): TreeNode[] {
    return nodes.filter(node => {
      if (node.id === nodeId) return false;
      if (node.children) {
        node.children = this.deleteNode(node.children, nodeId);
      }
      return true;
    });
  }

  static generateId(): string {
    return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Simulate API call for lazy loading
  static async fetchChildren(nodeId: string): Promise<TreeNode[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: `${nodeId}-child-1`,
            name: `Lazy Child 1`,
            children: []
          },
          {
            id: `${nodeId}-child-2`,
            name: `Lazy Child 2`,
            children: []
          }
        ]);
      }, 1000); // 1 second delay
    });
  }
}