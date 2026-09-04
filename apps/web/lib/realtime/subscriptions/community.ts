// ============================================================
// REALTIME COMMUNITY FORUM SUBSCRIPTION
// Subscribes to postgres_changes on community_posts & community_comments
// ============================================================

import { getSupabaseClient } from '@/lib/supabase/client';
import type { CommunityPost, CommunityComment, CommunityCategory } from '@/types';

export type PostListener = (post: CommunityPost) => void;
export type CommentListener = (comment: CommunityComment) => void;

export function subscribeToCommunity(
  onNewPost: PostListener,
  onNewComment: CommentListener
): () => void {
  const client = getSupabaseClient();

  if (client) {
    const channel = client
      .channel('realtime_community_feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.new) {
            const row = payload.new;
            const post: CommunityPost = {
              id: row.id,
              userId: row.user_id,
              authorName: row.author_name,
              category: row.category as CommunityCategory,
              title: row.title,
              content: row.content,
              likesCount: row.likes_count ?? 0,
              commentsCount: row.comments_count ?? 0,
              createdAt: row.created_at,
              comments: [],
            };
            onNewPost(post);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_comments',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.new) {
            const row = payload.new;
            const comment: CommunityComment = {
              id: row.id,
              postId: row.post_id,
              userId: row.user_id,
              authorName: row.author_name,
              content: row.content,
              createdAt: row.created_at,
            };
            onNewComment(comment);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  return () => {};
}
