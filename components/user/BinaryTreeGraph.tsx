"use client";

import { useGetBinaryTree } from "@/hooks/use-users";
import { Loader } from "../ui/loader";

// Interfaces for binary tree
interface BinaryTreeNode {
    userId: number;
    name: string;
    position: number;
    leftVolume: number;
    rightVolume: number;
    totalLeftVolume: number;
    totalRightVolume: number;
    isEmpty: boolean;
    left: {
        userId: number;
        name: string;
        isEmpty: boolean;
    };
    right: {
        userId: number;
        name: string;
        isEmpty: boolean;
    };
}

interface BinaryTreeResponse {
    status: string;
    data: {
        binaryTree: BinaryTreeNode;
    };
}

export function BinaryTreeGraph() {
    const { data, isLoading, error } = useGetBinaryTree();

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-red-500">Failed to load binary tree data.</div>;
    }

    const renderNode = (node: BinaryTreeNode | null) => {
        if (!node || node.isEmpty) {
            return <div className="p-4 bg-gray-200 rounded-lg text-center">Empty</div>;
        }

        return (
            <div className="p-4 bg-purple-100 rounded-lg text-center">
                <p className="font-bold">{node.name || "Unnamed"}</p>
                <p className="text-sm text-gray-600">Left Volume: {node.leftVolume}</p>
                <p className="text-sm text-gray-600">Right Volume: {node.rightVolume}</p>
                <p className="text-sm text-gray-600">Total Left: {node.totalLeftVolume}</p>
                <p className="text-sm text-gray-600">Total Right: {node.totalRightVolume}</p>
            </div>
        );
    };

    const { binaryTree } = data || {};

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Binary Tree</h2>
            <div className="flex flex-col items-center gap-4">
                {renderNode(binaryTree || null)}
                <div className="flex gap-4">
                    {renderNode(binaryTree?.left as BinaryTreeNode)}
                    {renderNode(binaryTree?.right as BinaryTreeNode)}
                </div>
            </div>
        </div>
    );
}
