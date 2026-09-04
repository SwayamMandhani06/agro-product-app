import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/config/backend_config.dart';
import '../../data/mock_community_repository.dart';
import '../../data/supabase_community_repository.dart';
import '../../domain/community_post.dart';
import '../../domain/community_repository.dart';

/// Community repository provider.
final communityRepositoryProvider = Provider<CommunityRepository>((ref) {
  if (BackendConfig.isConfigured) {
    return SupabaseCommunityRepository();
  }
  return MockCommunityRepository();
});

/// Selected topic filter in the community feed.
final selectedCommunityCategoryProvider = StateProvider<String>((ref) => 'All');

/// StateNotifier that manages post lists, like toggles, and comments.
class CommunityNotifier extends StateNotifier<AsyncValue<List<CommunityPost>>> {
  CommunityNotifier(this._repository, this._category) : super(const AsyncValue.loading()) {
    loadPosts();
  }

  final CommunityRepository _repository;
  final String _category;

  Future<void> loadPosts() async {
    state = const AsyncValue.loading();
    final result = await _repository.getPosts(category: _category);
    result.fold(
      (failure) => state = AsyncValue.error(failure, StackTrace.current),
      (posts) => state = AsyncValue.data(posts),
    );
  }

  Future<void> toggleLike(String postId) async {
    final current = state.value ?? [];
    final updated = current.map((p) {
      if (p.id == postId) {
        final nowLiked = !p.isLiked;
        final newCount = nowLiked ? p.likesCount + 1 : (p.likesCount - 1).clamp(0, 9999);
        return p.copyWith(isLiked: nowLiked, likesCount: newCount);
      }
      return p;
    }).toList();
    state = AsyncValue.data(updated);
    await _repository.toggleLike(postId);
  }

  Future<void> addComment(String postId, String text) async {
    final commentResult = await _repository.addComment(
      postId: postId,
      authorName: 'Verified Farmer (You)',
      content: text,
    );

    commentResult.fold(
      (_) {},
      (newComment) {
        final current = state.value ?? [];
        final updated = current.map((p) {
          if (p.id == postId) {
            final newComments = [...p.comments, newComment];
            return p.copyWith(
              comments: newComments,
              commentsCount: newComments.length,
            );
          }
          return p;
        }).toList();
        state = AsyncValue.data(updated);
      },
    );
  }

  Future<void> createPost({
    required String title,
    required String content,
    required String category,
  }) async {
    final result = await _repository.createPost(
      title: title,
      content: content,
      category: category,
      authorName: 'Verified Farmer (You)',
      authorLocation: 'Maharashtra',
    );

    result.fold(
      (_) {},
      (newPost) {
        final current = state.value ?? [];
        state = AsyncValue.data([newPost, ...current]);
      },
    );
  }
}

/// Provider for the community notifier, automatically re-created when the category filter changes.
final communityProvider =
    StateNotifierProvider<CommunityNotifier, AsyncValue<List<CommunityPost>>>((ref) {
  final repo = ref.watch(communityRepositoryProvider);
  final category = ref.watch(selectedCommunityCategoryProvider);
  return CommunityNotifier(repo, category);
});
