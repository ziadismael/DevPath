import React, { useState } from 'react';
import { Post } from '../types';
import { communityAPI } from '../api/community';
import CommentSection from './CommentSection';

interface PostDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
    onPostUpdated: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ isOpen, onClose, post, onPostUpdated }) => {
    const [likes, setLikes] = useState(post?.likes || 0);
    const [isLiking, setIsLiking] = useState(false);

    const handleLike = async () => {
        if (!post?.postID && !post?.id) return;

        setIsLiking(true);
        try {
            await communityAPI.likePost(post.postID || post.id?.toString() || '');
            setLikes(prev => prev + 1);
        } catch (err) {
            console.error('Error liking post:', err);
        } finally {
            setIsLiking(false);
        }
    };

    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="glass rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 glass border-b border-white/10 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-lg font-bold text-white">
                                {post.user?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h3 className="font-mono font-semibold text-white">
                                    @{post.user?.username || 'anonymous'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                    <h2 className="text-2xl font-mono font-bold text-white mb-4">
                        {post.title}
                    </h2>
                    <p className="text-slate-300 mb-6 whitespace-pre-wrap">
                        {post.bodyText}
                    </p>

                    {/* Media */}
                    {post.mediaURL && (
                        <div className="mb-6">
                            <img
                                src={post.mediaURL}
                                alt="Post media"
                                className="rounded-lg w-full max-h-96 object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                        <button
                            onClick={handleLike}
                            disabled={isLiking}
                            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span className="font-mono font-semibold">{likes}</span>
                        </button>
                        <div className="flex items-center gap-2 text-slate-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="font-mono font-semibold">{post.comments?.length || 0}</span>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-mono font-bold text-white mb-4">Comments</h3>
                        <CommentSection
                            postID={post.postID || post.id?.toString() || ''}
                            comments={post.comments || []}
                            onCommentAdded={onPostUpdated}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;
