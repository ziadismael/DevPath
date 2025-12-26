import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { communityAPI } from '../api/community';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';
import ImageSlider from './ImageSlider';
import ImageUpload from './ImageUpload';

interface PostDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
    onPostUpdated: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ isOpen, onClose, post, onPostUpdated }) => {
    const { user } = useAuth();
    const [likes, setLikes] = useState(post?.likes || 0);
    const [isLiked, setIsLiked] = useState(post?.likedByCurrentUser || false);
    const [isLiking, setIsLiking] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editError, setEditError] = useState('');
    const [editFormData, setEditFormData] = useState({
        title: post?.title || '',
        bodyText: post?.bodyText || '',
        mediaURL: post?.mediaURL || [],
    });

    // Update state when post changes
    useEffect(() => {
        if (post) {
            setLikes(post.likes || 0);
            setIsLiked(post.likedByCurrentUser || false);
            setEditFormData({
                title: post.title || '',
                bodyText: post.bodyText || '',
                mediaURL: post.mediaURL || [],
            });
            setIsEditing(false);
        }
    }, [post]);

    const handleLike = async () => {
        if (!post?.postID && !post?.id) return;

        setIsLiking(true);
        try {
            const response = await communityAPI.likePost(post.postID || post.id?.toString() || '');
            // Toggle the liked state
            setIsLiked(!isLiked);
            // Update likes count from server response
            if (response.likes !== undefined) {
                setLikes(response.likes);
            }
            // Trigger refetch to update the post list
            onPostUpdated();
        } catch (err) {
            console.error('Error liking post:', err);
        } finally {
            setIsLiking(false);
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            // Reset form when entering edit mode
            setEditFormData({
                title: post?.title || '',
                bodyText: post?.bodyText || '',
                mediaURL: post?.mediaURL || [],
            });
        }
    };

    const handleSaveEdit = async () => {
        if (!post?.postID && !post?.id) return;

        setIsSaving(true);
        setEditError('');
        try {
            await communityAPI.updatePost(post.postID || post.id?.toString() || '', {
                title: editFormData.title,
                bodyText: editFormData.bodyText,
                mediaURL: editFormData.mediaURL,
            });
            setIsEditing(false);
            onPostUpdated();
        } catch (err: any) {
            console.error('Error updating post:', err);
            setEditError(err.response?.data?.message || err.message || 'Failed to update post');
        } finally {
            setIsSaving(false);
        }
    };

    const isPostOwner = user && post && (user.userID === post.userID || user.username === post.User?.username);

    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="glass rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 glass border-b border-white/10 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to={`/user/${post.User?.username || 'anonymous'}`}
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-600 to-electric-700 flex items-center justify-center text-lg font-bold text-white hover:scale-110 transition-transform"
                            >
                                {post.User?.username?.[0]?.toUpperCase() || 'U'}
                            </Link>
                            <div>
                                <Link
                                    to={`/user/${post.User?.username || 'anonymous'}`}
                                    className="block font-mono font-semibold text-white hover:text-electric-400 transition-colors"
                                >
                                    @{post.User?.username || 'anonymous'}
                                </Link>
                                <p className="text-xs text-slate-500">
                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isPostOwner && (
                                <button
                                    onClick={handleEditToggle}
                                    className="px-4 py-2 bg-electric-600/20 hover:bg-electric-600/30 text-electric-400 rounded-lg font-mono text-sm transition-colors"
                                >
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </button>
                            )}
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
                </div>

                {/* Post Content */}
                <div className="p-6">
                    {isEditing ? (
                        <div className="space-y-4 mb-6">
                            {editError && (
                                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                    {editError}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-electric-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-2">Content</label>
                                <textarea
                                    value={editFormData.bodyText}
                                    onChange={(e) => setEditFormData({ ...editFormData, bodyText: e.target.value })}
                                    rows={8}
                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-electric-500 transition-colors resize-none"
                                />
                            </div>
                            <ImageUpload
                                value={editFormData.mediaURL}
                                onChange={(value) => setEditFormData({ ...editFormData, mediaURL: value as string[] })}
                                label="Post Images (Optional)"
                                multiple={true}
                            />
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="w-full px-6 py-3 bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 rounded-lg font-mono font-semibold text-white shadow-glow-md hover:shadow-glow-lg transition-all disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-mono font-bold text-white mb-4">
                                {post.title}
                            </h2>
                            <p className="text-slate-300 mb-6 whitespace-pre-wrap">
                                {post.bodyText}
                            </p>

                            {/* Media */}
                            {post.mediaURL && post.mediaURL.length > 0 && (
                                <div className="mb-6">
                                    <ImageSlider images={post.mediaURL} />
                                </div>
                            )}
                        </>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                        <button
                            onClick={handleLike}
                            disabled={isLiking}
                            className={`flex items-center gap-2 transition-colors disabled:opacity-50 ${isLiked ? 'text-red-500 hover:text-red-400' : 'text-slate-400 hover:text-red-400'
                                }`}
                        >
                            <svg className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="font-mono font-semibold">{likes}</span>
                        </button>
                        <div className="flex items-center gap-2 text-slate-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="font-mono font-semibold">{post.comments?.length || post.Comments?.length || 0}</span>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-mono font-bold text-white mb-4">Comments</h3>
                        <CommentSection
                            postID={post.postID || post.id?.toString() || ''}
                            comments={post.comments || post.Comments || []}
                            onCommentAdded={onPostUpdated}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;
