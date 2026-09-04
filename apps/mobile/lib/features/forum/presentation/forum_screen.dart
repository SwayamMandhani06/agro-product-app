import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/design_system/app_colors.dart';
import '../../../core/design_system/app_radius.dart';
import '../../../core/design_system/app_spacing.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_empty_state.dart';
import '../../../core/widgets/app_error_state.dart';
import '../../../core/widgets/app_loading.dart';
import '../domain/community_post.dart';
import 'providers/community_providers.dart';

/// Full Agricultural Community & Knowledge Exchange screen.
class ForumScreen extends ConsumerStatefulWidget {
  const ForumScreen({super.key});

  @override
  ConsumerState<ForumScreen> createState() => _ForumScreenState();
}

class _ForumScreenState extends ConsumerState<ForumScreen> {
  static const List<String> _categories = [
    'All',
    'Pest Management',
    'Market Discussion',
    'Irrigation',
    'Crop Management',
    'Equipment',
  ];

  @override
  Widget build(BuildContext context) {
    final selectedCategory = ref.watch(selectedCommunityCategoryProvider);
    final postsAsync = ref.watch(communityProvider);

    return Scaffold(
      backgroundColor: AppColors.stitchCanvas,
      appBar: AppBar(
        title: const Text('Farmer Knowledge Hub'),
        backgroundColor: AppColors.stitchCanvas,
        elevation: 0,
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.stitchForestGreen,
        icon: const Icon(Icons.edit_note_rounded, color: Colors.white),
        label: const Text('Ask / Post', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
        onPressed: () => _showCreatePostSheet(context),
      ),
      body: Column(
        children: [
          // Category Filter Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
            child: Row(
              children: _categories.map((cat) {
                final isSelected = selectedCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    selected: isSelected,
                    label: Text(cat),
                    labelStyle: TextStyle(
                      fontSize: 12.5,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      color: isSelected ? Colors.white : AppColors.textPrimary,
                    ),
                    selectedColor: AppColors.stitchForestGreen,
                    backgroundColor: AppColors.surface,
                    checkmarkColor: Colors.white,
                    side: BorderSide(
                      color: isSelected ? AppColors.stitchForestGreen : AppColors.neutral200,
                    ),
                    onSelected: (_) {
                      ref.read(selectedCommunityCategoryProvider.notifier).state = cat;
                    },
                  ),
                );
              }).toList(),
            ),
          ),
          const Divider(height: 1, color: AppColors.neutral200),

          // Posts Feed
          Expanded(
            child: postsAsync.when(
              data: (posts) {
                if (posts.isEmpty) {
                  return AppEmptyState(
                    title: 'No Discussions Found',
                    message: 'Be the first farmer to start a discussion in this topic.',
                    icon: Icons.forum_outlined,
                    actionLabel: 'Create Post',
                    onAction: () => _showCreatePostSheet(context),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () => ref.read(communityProvider.notifier).loadPosts(),
                  color: AppColors.stitchForestGreen,
                  child: ListView.separated(
                    padding: const EdgeInsets.fromLTRB(AppSpacing.md, AppSpacing.md, AppSpacing.md, 80),
                    itemCount: posts.length,
                    separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
                    itemBuilder: (context, index) {
                      final post = posts[index];
                      return _buildPostCard(post);
                    },
                  ),
                );
              },
              loading: () => const Center(child: AppSpinner(size: 36)),
              error: (error, _) => Center(
                child: AppErrorState(
                  title: 'Failed to load community feed',
                  message: error.toString(),
                  onRetry: () => ref.read(communityProvider.notifier).loadPosts(),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPostCard(CommunityPost post) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppRadius.card,
        border: Border.all(color: AppColors.neutral200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author Header
          Row(
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: AppColors.stitchForestGreen.withValues(alpha: 0.12),
                child: Text(
                  post.authorName.isNotEmpty ? post.authorName[0] : 'F',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.stitchForestGreen,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      post.authorName,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      '${post.authorRole} • ${post.authorLocation}',
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.textTertiary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.neutral100,
                  borderRadius: BorderRadius.circular(AppRadius.xs),
                ),
                child: Text(
                  post.category,
                  style: const TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Title
          Text(
            post.title,
            style: const TextStyle(
              fontSize: 14.5,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 6),

          // Content
          Text(
            post.content,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.45,
            ),
          ),
          const SizedBox(height: 12),

          // Action bar (Like + Comments)
          Row(
            children: [
              InkWell(
                borderRadius: AppRadius.card,
                onTap: () {
                  ref.read(communityProvider.notifier).toggleLike(post.id);
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  child: Row(
                    children: [
                      Icon(
                        post.isLiked ? Icons.thumb_up_rounded : Icons.thumb_up_outlined,
                        size: 16,
                        color: post.isLiked ? AppColors.stitchForestGreen : AppColors.textTertiary,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '${post.likesCount}',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: post.isLiked ? AppColors.stitchForestGreen : AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 14),
              InkWell(
                borderRadius: AppRadius.card,
                onTap: () => _showCommentsSheet(context, post),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  child: Row(
                    children: [
                      const Icon(Icons.mode_comment_outlined, size: 16, color: AppColors.textTertiary),
                      const SizedBox(width: 6),
                      Text(
                        '${post.commentsCount} replies',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const Spacer(),
              Text(
                _formatDate(post.createdAt),
                style: const TextStyle(fontSize: 11, color: AppColors.textTertiary),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showCommentsSheet(BuildContext context, CommunityPost post) {
    final commentController = TextEditingController();

    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.75,
              padding: EdgeInsets.only(
                left: AppSpacing.md,
                right: AppSpacing.md,
                top: AppSpacing.md,
                bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.sm,
              ),
              decoration: const BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
              ),
              child: Column(
                children: [
                  // Handle
                  Center(
                    child: Container(
                      width: 36,
                      height: 4,
                      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                      decoration: BoxDecoration(
                        color: AppColors.neutral300,
                        borderRadius: BorderRadius.circular(AppRadius.full),
                      ),
                    ),
                  ),

                  // Header
                  Row(
                    children: [
                      Text(
                        'Discussion (${post.comments.length})',
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.close, size: 20),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ],
                  ),
                  const Divider(height: 1, color: AppColors.neutral200),

                  // Comments list
                  Expanded(
                    child: post.comments.isEmpty
                        ? const Center(
                            child: Text(
                              'No comments yet. Share your agronomic perspective!',
                              style: TextStyle(fontSize: 13, color: AppColors.textTertiary),
                            ),
                          )
                        : ListView.separated(
                            padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
                            itemCount: post.comments.length,
                            separatorBuilder: (_, __) => const Divider(height: 16, color: AppColors.neutral100),
                            itemBuilder: (context, index) {
                              final comment = post.comments[index];
                              return Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        comment.authorName,
                                        style: const TextStyle(
                                          fontSize: 12.5,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.textPrimary,
                                        ),
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        comment.authorRole,
                                        style: const TextStyle(
                                          fontSize: 11,
                                          color: AppColors.textTertiary,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    comment.content,
                                    style: const TextStyle(
                                      fontSize: 12.5,
                                      color: AppColors.textSecondary,
                                      height: 1.4,
                                    ),
                                  ),
                                ],
                              );
                            },
                          ),
                  ),

                  // Reply input
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: commentController,
                            decoration: const InputDecoration(
                              hintText: 'Add an agronomic reply...',
                              filled: true,
                              fillColor: AppColors.stitchCanvas,
                              contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              border: OutlineInputBorder(
                                borderRadius: AppRadius.input,
                                borderSide: BorderSide(color: AppColors.neutral200),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton(
                          style: IconButton.styleFrom(
                            backgroundColor: AppColors.stitchForestGreen,
                            foregroundColor: Colors.white,
                          ),
                          icon: const Icon(Icons.send_rounded, size: 18),
                          onPressed: () {
                            final text = commentController.text.trim();
                            if (text.isEmpty) return;
                            ref.read(communityProvider.notifier).addComment(post.id, text);
                            commentController.clear();
                            Navigator.of(context).pop();
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showCreatePostSheet(BuildContext context) {
    final titleController = TextEditingController();
    final contentController = TextEditingController();
    String category = 'Crop Management';

    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Container(
              padding: EdgeInsets.only(
                left: AppSpacing.lg,
                right: AppSpacing.lg,
                top: AppSpacing.lg,
                bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.xl,
              ),
              decoration: const BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.vertical(top: Radius.circular(AppRadius.xl)),
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Container(
                        width: 36,
                        height: 4,
                        margin: const EdgeInsets.only(bottom: AppSpacing.md),
                        decoration: BoxDecoration(
                          color: AppColors.neutral300,
                          borderRadius: BorderRadius.circular(AppRadius.full),
                        ),
                      ),
                    ),
                    const Text(
                      'Ask Farmers & Agronomists',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 14),

                    // Topic
                    const Text('Topic', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      initialValue: category,
                      decoration: const InputDecoration(
                        filled: true,
                        fillColor: AppColors.stitchCanvas,
                        border: OutlineInputBorder(
                          borderRadius: AppRadius.input,
                          borderSide: BorderSide(color: AppColors.neutral200),
                        ),
                        contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      ),
                      items: _categories.where((c) => c != 'All').map((c) {
                        return DropdownMenuItem(value: c, child: Text(c));
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setSheetState(() => category = val);
                      },
                    ),
                    const SizedBox(height: 14),

                    // Title
                    const Text('Question / Title', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: titleController,
                      decoration: const InputDecoration(
                        hintText: 'e.g. Recommended seed rate for late kharif chickpea?',
                        filled: true,
                        fillColor: AppColors.stitchCanvas,
                        border: OutlineInputBorder(
                          borderRadius: AppRadius.input,
                          borderSide: BorderSide(color: AppColors.neutral200),
                        ),
                        contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Details
                    const Text('Details & Field Context', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: contentController,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        hintText: 'Include soil condition, seed variety, previous crop, and region...',
                        filled: true,
                        fillColor: AppColors.stitchCanvas,
                        border: OutlineInputBorder(
                          borderRadius: AppRadius.input,
                          borderSide: BorderSide(color: AppColors.neutral200),
                        ),
                        contentPadding: EdgeInsets.all(AppSpacing.md),
                      ),
                    ),
                    const SizedBox(height: 20),

                    AppButton(
                      label: 'Post to Community',
                      onPressed: () {
                        final title = titleController.text.trim();
                        final content = contentController.text.trim();
                        if (title.isEmpty || content.isEmpty) return;

                        ref.read(communityProvider.notifier).createPost(
                              title: title,
                              content: content,
                              category: category,
                            );
                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  String _formatDate(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${dt.day}/${dt.month}/${dt.year}';
  }
}
