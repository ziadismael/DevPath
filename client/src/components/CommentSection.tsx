import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { communityAPI } from '../api/community';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import DeleteConfirmModal from './DeleteConfirmModal';

interface CommentSectionProps {
    postID: string;
    comments: Comment[];
    onCommentAdded: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postID, comments, onCommentAdded }) => {
    const { user } = useAuth();
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setError('');
        setIsSubmitting(true);

        try {
            await communityAPI.createComment(postID, commentText);
            setCommentText('');
            onCommentAdded();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (comment: Comment) => {
        setCommentToDelete(comment);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!commentToDelete) return;

        const commentID = commentToDelete.commentID || commentToDelete.id;
        if (!commentID) return;

        try {
            setIsDeleting(true);
            await communityAPI.deleteComment(postID, commentID.toString());
            setDeleteModalOpen(false);
            setCommentToDelete(null);
            onCommentAdded(); // Refresh comments
        } catch (err: any) {
            console.error('Error deleting comment:', err);
            alert(err.response?.data?.message || 'Failed to delete comment');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-white/10">
            {/* Comments List */}
            {comments && comments.length > 0 && (
                <div className="space-y-3 mb-4">
                    {comments.map((comment) => (
                        <div key={comment.commentID || comment.id} className="flex gap-3">
                            {/* Avatar */}
                            <Link
                                to={`/user/${comment.User?.username || comment.user?.username || 'anonymous'}`}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 hover:scale-110 transition-transform"
                            >
                                {comment.User?.username?.[0]?.toUpperCase() || comment.user?.username?.[0]?.toUpperCase() || 'U'}
                            </Link>

                            {/* Comment Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Link
                                        to={`/user/${comment.User?.username || comment.user?.username || 'anonymous'}`}
                                        className="text-sm font-mono font-semibold text-white hover:text-electric-400 transition-colors"
                                    >
                                        @{comment.User?.username || comment.user?.username || 'anonymous'}
                                    </Link>
                                    {/* Delete button - only show for comment owner */}
                                    {user && (user.username === comment.user?.username) && (
                                        <button
                                            onClick={() => handleDeleteClick(comment)}
                                            disabled={isDeleting && commentToDelete?.commentID === comment.commentID}
                                            className="ml-auto p-1 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
                                            title="Delete comment"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-slate-300">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 bg-void-900 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 transition-colors text-sm"
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !commentText.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white text-sm shadow-glow-sm hover:shadow-glow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </button>
            </form>

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setCommentToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                itemType="comment"
                itemName={commentToDelete?.text?.substring(0, 50)}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default CommentSection;
