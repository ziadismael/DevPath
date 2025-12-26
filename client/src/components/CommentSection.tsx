import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { communityAPI } from '../api/community';
import { Comment } from '../types';

interface CommentSectionProps {
    postID: string;
    comments: Comment[];
    onCommentAdded: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postID, comments, onCommentAdded }) => {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

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

            {error && (
                <p className="mt-2 text-xs text-red-400">{error}</p>
            )}
        </div>
    );
};

export default CommentSection;
