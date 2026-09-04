import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:fpdart/fpdart.dart';

import '../../../core/config/backend_config.dart';
import '../../../core/error/failure.dart';
import '../domain/community_post.dart';
import '../domain/community_repository.dart';
import 'mock_community_repository.dart';

/// Supabase PostgREST implementation of [CommunityRepository] with mock fallback.
class SupabaseCommunityRepository implements CommunityRepository {
  SupabaseCommunityRepository({Dio? dio})
      : _dio = dio ?? Dio(),
        _mock = MockCommunityRepository();

  final Dio _dio;
  final MockCommunityRepository _mock;

  @override
  Future<Result<List<CommunityPost>>> getPosts({String? category}) async {
    if (!BackendConfig.isConfigured) return _mock.getPosts(category: category);

    try {
      final query = <String, dynamic>{
        'select': '*,community_comments(*)',
        'order': 'created_at.desc',
      };
      if (category != null && category.isNotEmpty && category != 'All') {
        query['category'] = 'eq.$category';
      }

      final response = await _dio.get(
        '${BackendConfig.restBaseUrl}/community_posts',
        queryParameters: query,
        options: Options(headers: BackendConfig.headers),
      );

      final rows = response.data as List;
      if (rows.isEmpty) return _mock.getPosts(category: category);

      final posts = rows.map((r) {
        final commentRows = (r['community_comments'] as List? ?? []);
        final comments = commentRows.map((c) => CommunityComment(
              id: c['id'] as String,
              postId: c['post_id'] as String,
              authorName: c['author_name'] as String,
              authorRole: c['author_role'] as String? ?? 'Farmer',
              content: c['content'] as String,
              createdAt: DateTime.tryParse(c['created_at'] as String? ?? '') ?? DateTime.now(),
            )).toList();

        return CommunityPost(
          id: r['id'] as String,
          authorName: r['author_name'] as String,
          authorLocation: r['author_location'] as String? ?? 'Maharashtra',
          authorRole: r['author_role'] as String? ?? 'Farmer',
          title: r['title'] as String,
          content: r['content'] as String,
          category: r['category'] as String,
          likesCount: r['likes_count'] as int? ?? 0,
          commentsCount: comments.length,
          createdAt: DateTime.tryParse(r['created_at'] as String? ?? '') ?? DateTime.now(),
          isLiked: false,
          tags: List<String>.from(r['tags'] as List? ?? []),
          comments: comments,
        );
      }).toList();

      return right(posts);
    } catch (e) {
      debugPrint('[SupabaseCommunityRepository] getPosts error: $e');
      return _mock.getPosts(category: category);
    }
  }

  @override
  Future<Result<bool>> toggleLike(String postId) async {
    return _mock.toggleLike(postId);
  }

  @override
  Future<Result<CommunityComment>> addComment({
    required String postId,
    required String authorName,
    required String content,
  }) async {
    return _mock.addComment(
      postId: postId,
      authorName: authorName,
      content: content,
    );
  }

  @override
  Future<Result<CommunityPost>> createPost({
    required String title,
    required String content,
    required String category,
    required String authorName,
    required String authorLocation,
  }) async {
    return _mock.createPost(
      title: title,
      content: content,
      category: category,
      authorName: authorName,
      authorLocation: authorLocation,
    );
  }
}
