import React from 'react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemType: 'post' | 'project' | 'comment';
    itemName?: string;
    isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemType,
    itemName,
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="glass rounded-xl p-6 max-w-md w-full border border-red-500/30 shadow-glow-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-mono font-bold text-red-400">
                        Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                        disabled={isLoading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Warning Message */}
                <div className="mb-6">
                    <p className="text-slate-300 mb-2">
                        Are you sure you want to delete this {itemType}?
                    </p>
                    {itemName && (
                        <p className="text-electric-400 font-mono text-sm">
                            "{itemName}"
                        </p>
                    )}
                    <p className="text-red-400 text-sm mt-3">
                        ⚠️ This action cannot be undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-mono text-white transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-mono text-white transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
