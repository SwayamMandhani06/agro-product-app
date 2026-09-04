import type { CommunityPost, CommunityCategory } from '@/types';

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    userId: 'usr_10',
    authorName: 'Balaram More (Satara)',
    category: 'Crop Management',
    title: 'Best practices for managing Yellow Mosaic Virus in early Kharif soybean',
    content: 'For farmers experiencing early vector infestation: ensure seed treatment with Thiamethoxam 30 FS at 10ml/kg before sowing. Avoid excessive urea in the first 25 days as soft vegetative flush attracts whiteflies. Intercropping with pigeon pea or maize has reduced our vector spread by over 40% this season.',
    likesCount: 38,
    commentsCount: 7,
    isLiked: false,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    comments: [
      {
        id: 'c_1',
        postId: 'post_1',
        userId: 'usr_02',
        authorName: 'Rajesh Deshmukh',
        content: 'Agreed on seed treatment. We used the certified hybrid soybean from the catalog and germination was above 95% with zero viral symptoms.',
        createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
      },
      {
        id: 'c_2',
        postId: 'post_1',
        userId: 'usr_03',
        authorName: 'Vikas Ghadge',
        content: 'Yellow sticky traps (15 traps per acre) placed at canopy height gave us early warning before whiteflies multiplied.',
        createdAt: new Date(Date.now() - 14 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'post_2',
    userId: 'usr_11',
    authorName: 'Mahesh Kadam (Nashik)',
    category: 'Market Discussion',
    title: 'Lasalgaon onion arrivals steady, export quota dynamics overview',
    content: 'With summer storage stocks depleting and red onion arrivals picking up in Lasalgaon APMC, modal rates are consolidating between ₹1,800 to ₹1,950 per quintal. Traders report consistent demand from South Indian terminal markets. Recommended to stagger warehouse releases over the next 3 weeks rather than distress sales.',
    likesCount: 29,
    commentsCount: 4,
    isLiked: true,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    comments: [
      {
        id: 'c_3',
        postId: 'post_2',
        userId: 'usr_15',
        authorName: 'Sanjay Pawar',
        content: 'Pimpalgaon market is offering ₹40 higher for super-medium grade lots. Transport cost difference is negligible.',
        createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'post_3',
    userId: 'usr_12',
    authorName: 'Dnyaneshwar Shinde (Baramati)',
    category: 'Irrigation',
    title: 'Transitioning sugarcane to inline drip with sub-surface fertigation',
    content: 'After shifting 8 acres of ratoon sugarcane from flood furrow to 16mm inline pressure-compensating drip (0.4m emitter spacing), water consumption dropped by 45% and electricity costs were reduced by half. We also inject 19:19:19 and liquid potash directly during peak elongation.',
    likesCount: 52,
    commentsCount: 11,
    isLiked: false,
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    comments: [
      {
        id: 'c_4',
        postId: 'post_3',
        userId: 'usr_16',
        authorName: 'Prakash Jagtap',
        content: 'Which filter mesh rating are you running? We faced sand clogging issues on canal lift irrigation until installing a dual-disc filter.',
        createdAt: new Date(Date.now() - 60 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'post_4',
    userId: 'usr_13',
    authorName: 'Ganesh Shirole (Kolhapur)',
    category: 'Pest Management',
    title: 'Fall Armyworm scouting in sweet corn and grain maize',
    content: 'Check the central whorl of 15 to 25-day-old corn plants for sawdust-like frass. Biological sprays of Bacillus thuringiensis (Bt) or Beauveria bassiana during late evening hours provided effective early control without harming beneficial predatory ladybird beetles.',
    likesCount: 34,
    commentsCount: 5,
    isLiked: false,
    createdAt: new Date(Date.now() - 96 * 3600000).toISOString(),
  },
  {
    id: 'post_5',
    userId: 'usr_14',
    authorName: 'Chandrakant Patil (Jalgaon)',
    category: 'Equipment',
    title: 'Battery vs Manual knapsack sprayers for cotton and chili acreage',
    content: 'The 12V 12Ah 2-in-1 sprayer saves enormous manual pumping fatigue. A single battery charge comfortably covers 18 to 20 tanks (approx 4 acres) in half the time. Essential investment for row crops.',
    likesCount: 41,
    commentsCount: 3,
    isLiked: false,
    createdAt: new Date(Date.now() - 120 * 3600000).toISOString(),
  },
];

export interface CommunityRepository {
  getPosts(category?: CommunityCategory | 'All'): Promise<CommunityPost[]>;
  toggleLike(postId: string): Promise<boolean>;
  addPost(post: Omit<CommunityPost, 'id' | 'likesCount' | 'commentsCount' | 'createdAt'>): Promise<CommunityPost>;
  addComment(postId: string, comment: { authorName: string; content: string }): Promise<CommunityPost | null>;
}

export class MockCommunityRepository implements CommunityRepository {
  private posts: CommunityPost[] = [...MOCK_COMMUNITY_POSTS];

  async getPosts(category?: CommunityCategory | 'All'): Promise<CommunityPost[]> {
    if (!category || category === 'All') {
      return [...this.posts];
    }
    return this.posts.filter((p) => p.category === category);
  }

  async toggleLike(postId: string): Promise<boolean> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return false;

    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;
    return post.isLiked;
  }

  async addPost(postData: Omit<CommunityPost, 'id' | 'likesCount' | 'commentsCount' | 'createdAt'>): Promise<CommunityPost> {
    const newPost: CommunityPost = {
      ...postData,
      id: `post_${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  async addComment(postId: string, commentData: { authorName: string; content: string }): Promise<CommunityPost | null> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return null;

    const newComment = {
      id: `c_${Date.now()}`,
      postId,
      userId: 'usr_current',
      authorName: commentData.authorName,
      content: commentData.content,
      createdAt: new Date().toISOString(),
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    post.commentsCount++;
    return post;
  }
}

export const communityRepository: CommunityRepository = new MockCommunityRepository();
