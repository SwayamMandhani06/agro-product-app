/// Domain model for agricultural discussion posts in AgriTrade community.
class CommunityPost {
  const CommunityPost({
    required this.id,
    required this.authorName,
    required this.authorLocation,
    required this.authorRole,
    required this.title,
    required this.content,
    required this.category,
    required this.likesCount,
    required this.commentsCount,
    required this.createdAt,
    this.isLiked = false,
    this.tags = const [],
    this.comments = const [],
  });

  final String id;
  final String authorName;
  final String authorLocation;
  final String authorRole;
  final String title;
  final String content;
  final String category;
  final int likesCount;
  final int commentsCount;
  final DateTime createdAt;
  final bool isLiked;
  final List<String> tags;
  final List<CommunityComment> comments;

  CommunityPost copyWith({
    String? id,
    String? authorName,
    String? authorLocation,
    String? authorRole,
    String? title,
    String? content,
    String? category,
    int? likesCount,
    int? commentsCount,
    DateTime? createdAt,
    bool? isLiked,
    List<String>? tags,
    List<CommunityComment>? comments,
  }) {
    return CommunityPost(
      id: id ?? this.id,
      authorName: authorName ?? this.authorName,
      authorLocation: authorLocation ?? this.authorLocation,
      authorRole: authorRole ?? this.authorRole,
      title: title ?? this.title,
      content: content ?? this.content,
      category: category ?? this.category,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      createdAt: createdAt ?? this.createdAt,
      isLiked: isLiked ?? this.isLiked,
      tags: tags ?? this.tags,
      comments: comments ?? this.comments,
    );
  }
}

/// Comment inside an agricultural community post.
class CommunityComment {
  const CommunityComment({
    required this.id,
    required this.postId,
    required this.authorName,
    required this.authorRole,
    required this.content,
    required this.createdAt,
  });

  final String id;
  final String postId;
  final String authorName;
  final String authorRole;
  final String content;
  final DateTime createdAt;
}
