
import '../../../core/error/failure.dart';
import 'community_post.dart';

/// Contract for farmer community posts and interactions.
abstract class CommunityRepository {
  Future<Result<List<CommunityPost>>> getPosts({String? category});
  Future<Result<bool>> toggleLike(String postId);
  Future<Result<CommunityComment>> addComment({
    required String postId,
    required String authorName,
    required String content,
  });
  Future<Result<CommunityPost>> createPost({
    required String title,
    required String content,
    required String category,
    required String authorName,
    required String authorLocation,
  });
}
