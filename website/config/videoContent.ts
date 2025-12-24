export interface VideoContent {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration?: string;
  youtubeId?: string;
  vimeoId?: string;
  src?: string;
  category: 'demo' | 'tutorial' | 'testimonial' | 'feature';
}

export const videos: VideoContent[] = [
  // Main Demo Video
  {
    id: 'main-demo',
    title: 'TestNotifier Demo - From Alert to Booking',
    description: 'Watch how TestNotifier detects available slots and sends instant notifications',
    duration: '2:15',
    category: 'demo',
    // Replace with your actual video IDs
    youtubeId: 'YOUR_YOUTUBE_ID_HERE',
    // or use: vimeoId: 'YOUR_VIMEO_ID_HERE',
    // or use: src: '/videos/main-demo.mp4',
    // thumbnail provided via public/images; leave undefined to avoid 404 if missing
    // thumbnail: '/images/demo-thumbnail.jpg'
  },

  // Tutorial Videos
  {
    id: 'tutorial-installation',
    title: 'How to Install TestNotifier',
    description: 'Step-by-step guide to installing the Chrome extension',
    duration: '1:30',
    category: 'tutorial',
    youtubeId: 'YOUR_YOUTUBE_ID_HERE',
    // thumbnail: '/images/tutorial-install.jpg'
  },
  {
    id: 'tutorial-setup',
    title: 'Setting Up Your First Monitor',
    description: 'Learn how to configure your test centres and notification preferences',
    duration: '2:45',
    category: 'tutorial',
    youtubeId: 'YOUR_YOUTUBE_ID_HERE',
    // thumbnail: '/images/tutorial-setup.jpg'
  },
  {
    id: 'tutorial-notifications',
    title: 'Managing Notifications',
    description: 'Customize your notification settings for SMS, email, and push alerts',
    duration: '1:50',
    category: 'tutorial',
    youtubeId: 'YOUR_YOUTUBE_ID_HERE',
    // thumbnail: '/images/tutorial-notifications.jpg'
  },
  {
    id: 'tutorial-advanced',
    title: 'Advanced Features & Tips',
    description: 'Master TestNotifier with advanced configuration and pro tips',
    duration: '3:20',
    category: 'tutorial',
    youtubeId: 'YOUR_YOUTUBE_ID_HERE',
    // thumbnail: '/images/tutorial-advanced.jpg'
  },

  // Feature Showcase Videos
  {
    id: 'feature-multi-centre',
    title: 'Multi-Centre Monitoring',
    description: 'Monitor up to 5 test centres simultaneously',
    duration: '1:15',
    category: 'feature',
    youtubeId: 'YOUR_YOUTUBE_ID_HERE',
    // thumbnail: '/images/feature-multi-centre.jpg'
  },
  {
    id: 'feature-instant-alerts',
    title: 'Instant Alerts System',
    description: 'Get notified within 30 seconds of slot availability',
    duration: '1:40',
    category: 'feature',
    youtubeId: 'YOUR_YOUTUBE_ID_HERE',
    // thumbnail: '/images/feature-alerts.jpg'
  },

  // Video Testimonials
  {
    id: 'testimonial-sarah',
    title: 'Sarah\'s Success Story',
    description: 'How Sarah booked her test 8 weeks earlier using TestNotifier',
    duration: '0:45',
    category: 'testimonial',
    youtubeId: 'YOUR_YOUTUBE_ID_HERE',
    // thumbnail: '/images/testimonial-sarah.jpg'
  },
  {
    id: 'testimonial-james',
    title: 'James\' Experience',
    description: 'From 6 month wait to booking in 2 weeks',
    duration: '0:50',
    category: 'testimonial',
    youtubeId: 'YOUR_YOUTUBE_ID_HERE',
    // thumbnail: '/images/testimonial-james.jpg'
  },
  {
    id: 'testimonial-emma',
    title: 'Emma\'s Testimonial',
    description: 'Saved months of waiting with instant notifications',
    duration: '0:55',
    category: 'testimonial',
    youtubeId: 'YOUR_YOUTUBE_ID_HERE',
    // thumbnail: '/images/testimonial-emma.jpg'
  }
];

export const getVideoById = (id: string): VideoContent | undefined => {
  return videos.find(video => video.id === id);
};

export const getVideosByCategory = (category: VideoContent['category']): VideoContent[] => {
  return videos.filter(video => video.category === category);
};

