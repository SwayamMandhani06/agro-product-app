import 'package:fpdart/fpdart.dart';

import '../../../core/error/failure.dart';
import '../domain/community_post.dart';
import '../domain/community_repository.dart';

/// Mock community repository with rich realistic farmer posts and discussions.
class MockCommunityRepository implements CommunityRepository {
  MockCommunityRepository({List<CommunityPost>? initialPosts})
      : _posts = initialPosts != null
            ? List.from(initialPosts)
            : [
                CommunityPost(
                  id: 'post_1',
                  authorName: 'Ramesh Patil',
                  authorLocation: 'Solapur, Maharashtra',
                  authorRole: 'Pomegranate & Soybean Grower',
                  title: 'Managing Yellow Mosaic Virus in Late Kharif Sowing',
                  content:
                      'Has anyone tested Seed Treatment with Thiamethoxam 30 FS at 10ml/kg before sowing? Last season whitefly pressure spiked in August. Would love insights from farmers in dryland regions on systemic vector control.',
                  category: 'Pest Management',
                  likesCount: 28,
                  commentsCount: 2,
                  createdAt: DateTime.now().subtract(const Duration(hours: 3)),
                  isLiked: false,
                  tags: ['Soybean', 'Vector Control', 'Kharif 2026'],
                  comments: [
                    CommunityComment(
                      id: 'comm_1_1',
                      postId: 'post_1',
                      authorName: 'Dr. Anand Kulkarni',
                      authorRole: 'Agronomist, MPKV',
                      content:
                          'Thiamethoxam seed treatment guarantees 25–30 days vector protection. Combine with yellow sticky traps (15 traps/acre) on field borders.',
                      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
                    ),
                    CommunityComment(
                      id: 'comm_1_2',
                      postId: 'post_1',
                      authorName: 'Sunil Pawar',
                      authorRole: 'Farmer, Osmanabad',
                      content:
                          'We tried it last year. Germination was unaffected and early nymph infestation was 80% lower than untreated plots.',
                      createdAt: DateTime.now().subtract(const Duration(hours: 1)),
                    ),
                  ],
                ),
                CommunityPost(
                  id: 'post_2',
                  authorName: 'Deepak Deshmukh',
                  authorLocation: 'Latur, Maharashtra',
                  authorRole: 'Oilseed Producer',
                  title: 'Mandi Rate Outlook: Will Soybean Cross ₹4,800/qtl?',
                  content:
                      'NCDEX futures and local APMC arrivals indicate strong crusher demand. Local mandi opened at ₹4,680 today. Holding 60% of harvest in farm warehouse. Is it prudent to hold until mid-September?',
                  category: 'Market Discussion',
                  likesCount: 42,
                  commentsCount: 1,
                  createdAt: DateTime.now().subtract(const Duration(hours: 6)),
                  isLiked: true,
                  tags: ['Mandi Rates', 'Soybean', 'Pricing Strategy'],
                  comments: [
                    CommunityComment(
                      id: 'comm_2_1',
                      postId: 'post_2',
                      authorName: 'Praveen Ghadge',
                      authorRole: 'APMC Licensed Trader',
                      content:
                          'Arrivals are down 15% YoY. If moisture is under 10%, staggered selling across the next 3 weeks offers optimal price realization.',
                      createdAt: DateTime.now().subtract(const Duration(hours: 4)),
                    ),
                  ],
                ),
                CommunityPost(
                  id: 'post_3',
                  authorName: 'Balasaheb Shinde',
                  authorLocation: 'Nashik, Maharashtra',
                  authorRole: 'Horticulture & Vegetable Farmer',
                  title: 'Drip Fertigation Ratios for Tomato Fruit-Setting Stage',
                  content:
                      'Switching from 19:19:19 to 0:52:34 (MKP) plus calcium nitrate. What is the optimal injection interval per 1,000 liters of water in sandy loam soils?',
                  category: 'Irrigation',
                  likesCount: 19,
                  commentsCount: 0,
                  createdAt: DateTime.now().subtract(const Duration(hours: 14)),
                  isLiked: false,
                  tags: ['Tomato', 'Drip Fertigation', 'Plant Nutrition'],
                  comments: [],
                ),
              ];

  final List<CommunityPost> _posts;

  @override
  Future<Result<List<CommunityPost>>> getPosts({String? category}) async {
    if (category == null || category.isEmpty || category == 'All') {
      return right(List.unmodifiable(_posts));
    }
    final filtered = _posts.where((p) => p.category == category).toList();
    return right(filtered);
  }

  @override
  Future<Result<bool>> toggleLike(String postId) async {
    final index = _posts.indexWhere((p) => p.id == postId);
    if (index == -1) return right(false);

    final post = _posts[index];
    final isLiked = !post.isLiked;
    final newCount = isLiked ? post.likesCount + 1 : (post.likesCount - 1).clamp(0, 9999);

    _posts[index] = post.copyWith(isLiked: isLiked, likesCount: newCount);
    return right(isLiked);
  }

  @override
  Future<Result<CommunityComment>> addComment({
    required String postId,
    required String authorName,
    required String content,
  }) async {
    final comment = CommunityComment(
      id: 'comm_${DateTime.now().millisecondsSinceEpoch}',
      postId: postId,
      authorName: authorName,
      authorRole: 'Verified Farmer (You)',
      content: content,
      createdAt: DateTime.now(),
    );

    final index = _posts.indexWhere((p) => p.id == postId);
    if (index != -1) {
      final post = _posts[index];
      final updatedComments = [...post.comments, comment];
      _posts[index] = post.copyWith(
        comments: updatedComments,
        commentsCount: updatedComments.length,
      );
    }

    return right(comment);
  }

  @override
  Future<Result<CommunityPost>> createPost({
    required String title,
    required String content,
    required String category,
    required String authorName,
    required String authorLocation,
  }) async {
    final post = CommunityPost(
      id: 'post_${DateTime.now().millisecondsSinceEpoch}',
      authorName: authorName,
      authorLocation: authorLocation,
      authorRole: 'Verified Farmer (You)',
      title: title,
      content: content,
      category: category,
      likesCount: 0,
      commentsCount: 0,
      createdAt: DateTime.now(),
      isLiked: false,
      tags: [category],
      comments: [],
    );

    _posts.insert(0, post);
    return right(post);
  }
}
