'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  PlusCircle,
  X,
  Send,
} from 'lucide-react';
import AppShellLayout from '@/components/layout/AppShell';
import { communityRepository } from '@/features/community/data/community-repository';
import type { CommunityPost, CommunityCategory } from '@/types';

const CATEGORIES: (CommunityCategory | 'All')[] = [
  'All',
  'Crop Management',
  'Market Discussion',
  'Irrigation',
  'Equipment',
  'Pest Management',
  'General Farming',
];

const emptySubscribe = () => () => {};
const useMounted = () => React.useSyncExternalStore(emptySubscribe, () => true, () => false);

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | 'All'>('All');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activePost, setActivePost] = useState<CommunityPost | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityCategory>('Crop Management');
  const [commentText, setCommentText] = useState('');
  const mounted = useMounted();

  useEffect(() => {
    communityRepository.getPosts().then(setPosts);
  }, []);

  const handleCategoryChange = async (cat: CommunityCategory | 'All') => {
    setSelectedCategory(cat);
    const result = await communityRepository.getPosts(cat);
    setPosts(result);
  };

  const handleToggleLike = async (postId: string) => {
    await communityRepository.toggleLike(postId);
    const updated = await communityRepository.getPosts(selectedCategory);
    setPosts(updated);
    if (activePost && activePost.id === postId) {
      const refreshedActive = updated.find((p) => p.id === postId);
      if (refreshedActive) setActivePost(refreshedActive);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    await communityRepository.addPost({
      userId: 'usr_me',
      authorName: 'Verified Grower',
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
    });

    const updated = await communityRepository.getPosts(selectedCategory);
    setPosts(updated);
    setIsCreatingPost(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !commentText.trim()) return;

    const updatedPost = await communityRepository.addComment(activePost.id, {
      authorName: 'Verified Grower',
      content: commentText.trim(),
    });

    if (updatedPost) {
      setActivePost({ ...updatedPost });
      const updated = await communityRepository.getPosts(selectedCategory);
      setPosts(updated);
      setCommentText('');
    }
  };

  if (!mounted) return null;

  return (
    <AppShellLayout>
      <div className="container-app" style={{ paddingBottom: 'var(--space-2xl)', maxWidth: 880 }}>
        {/* Breadcrumb & Header */}
        <div style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
            <Link href="/home" style={{ color: 'inherit', textDecoration: 'none' }}>Dashboard</Link>
            <span>/</span>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Farmer Knowledge Exchange</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="text-h1" style={{ margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Users size={26} style={{ color: 'var(--color-forest)' }} />
                Agricultural Knowledge Exchange
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                Field-tested agronomic practices, pest mitigation protocols, and real-time mandi updates shared by verified Indian producers
              </p>
            </div>

            <button
              onClick={() => setIsCreatingPost(true)}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '8px 16px' }}
            >
              <PlusCircle size={16} />
              Share Field Experience
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 24, paddingBottom: 4 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                fontWeight: selectedCategory === cat ? 600 : 500,
                background: selectedCategory === cat ? 'var(--color-forest)' : 'var(--color-surface)',
                color: selectedCategory === cat ? '#fff' : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--motion-fast) var(--ease-standard)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {posts.map((post) => (
            <div
              key={post.id}
              className="card-base"
              style={{
                padding: '20px 22px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--motion-fast) var(--ease-standard)',
              }}
            >
              {/* Post Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--color-forest)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {post.authorName[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {post.authorName}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-forest-50, #EAF6EF)',
                    color: 'var(--color-forest)',
                  }}
                >
                  {post.category}
                </span>
              </div>

              {/* Title & Body */}
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 8px', lineHeight: 1.35 }}>
                {post.title}
              </h3>
              <p style={{ fontSize: 13.5, color: 'var(--color-text-secondary)', margin: '0 0 16px', lineHeight: 1.55 }}>
                {post.content}
              </p>

              {/* Post Footer & Interactions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: 12,
                  fontSize: 13,
                  color: 'var(--color-text-tertiary)',
                }}
              >
                <button
                  onClick={() => handleToggleLike(post.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'transparent',
                    border: 'none',
                    color: post.isLiked ? 'var(--color-forest)' : 'inherit',
                    fontWeight: post.isLiked ? 600 : 500,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <ThumbsUp size={15} fill={post.isLiked ? 'currentColor' : 'none'} />
                  {post.likesCount} Helpful
                </button>

                <button
                  onClick={() => setActivePost(post)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <MessageSquare size={15} />
                  {post.commentsCount} Field Responses
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comments Modal / Drawer */}
        {activePost && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: 20,
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setActivePost(null)}
          >
            <div
              className="card-base"
              style={{
                width: '100%',
                maxWidth: 600,
                maxHeight: '85vh',
                overflowY: 'auto',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                boxShadow: 'var(--shadow-xl)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-forest)' }}>
                    {activePost.category}
                  </span>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)', margin: '4px 0 0' }}>
                    {activePost.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActivePost(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', padding: 4 }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Threaded Comments List */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14, marginBottom: 18 }}>
                <h4 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 12px' }}>
                  Farmer Responses ({activePost.comments?.length ?? 0})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(activePost.comments || []).map((c) => (
                    <div
                      key={c.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-variant)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {c.authorName}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.45 }}>
                        {c.content}
                      </p>
                    </div>
                  ))}
                  {(!activePost.comments || activePost.comments.length === 0) && (
                    <p style={{ fontSize: 13, color: 'var(--color-text-tertiary)', margin: 0 }}>
                      No replies yet. Be the first to share your field insight.
                    </p>
                  )}
                </div>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="Add your agronomic response..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    fontSize: 13,
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Send size={13} />
                  Reply
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Create Post Modal */}
        {isCreatingPost && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: 20,
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setIsCreatingPost(false)}
          >
            <div
              className="card-base"
              style={{
                width: '100%',
                maxWidth: 580,
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: 24,
                boxShadow: 'var(--shadow-xl)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                  Share Agricultural Insight
                </h3>
                <button
                  onClick={() => setIsCreatingPost(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', padding: 4 }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreatePost}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CommunityCategory)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      fontSize: 13,
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                    }}
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of field observation or advisory topic..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      fontSize: 13,
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                    Detailed Agronomic Observation
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide specific details: soil type, dosage applied, irrigation frequency, results..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      fontSize: 13,
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsCreatingPost(false)}
                    className="btn-outline"
                    style={{ fontSize: 13, padding: '7px 14px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newTitle.trim() || !newContent.trim()}
                    className="btn-primary"
                    style={{ fontSize: 13, padding: '7px 18px' }}
                  >
                    Publish Insight
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShellLayout>
  );
}
