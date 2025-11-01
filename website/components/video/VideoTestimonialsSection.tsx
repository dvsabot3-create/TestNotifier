import { useState } from 'react';
import { PlayCircle, Quote } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { videos, getVideosByCategory } from '../../config/videoContent';

export function VideoTestimonialsSection() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const testimonialVideos = getVideosByCategory('testimonial');

  const openVideo = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const currentVideo = videos.find(v => v.id === selectedVideo);

  return (
    <section className="video-testimonials-section relative py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-green-700 text-sm mb-6">
            <Quote className="w-4 h-4" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-5xl lg:text-6xl text-gray-900 mb-6 tracking-tight">
            Hear From Our Users
            <span className="block text-[#1d70b8]">Real Results, Real People</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Watch video testimonials from learner drivers who secured their test slots faster with TestNotifier
          </p>
        </div>

        {/* Testimonial Videos Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonialVideos.map((video) => (
            <div
              key={video.id}
              className="group cursor-pointer"
              onClick={() => openVideo(video.id)}
            >
              {/* Video Card */}
              <div className="relative bg-white rounded-3xl overflow-hidden border-2 border-gray-200 hover:border-[#28a745] hover:shadow-2xl transition-all">
                {/* Video Thumbnail */}
                <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-800 to-gray-900">
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1d70b8]/40 to-[#28a745]/40"></div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50"></div>
                      <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl">
                        <PlayCircle className="w-10 h-10 text-[#28a745] ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Quote Icon */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Quote className="w-6 h-6 text-[#1d70b8]" />
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h4 className="text-xl text-gray-900 mb-2 group-hover:text-[#1d70b8] transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid md:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Happy Users' },
            { value: '95%', label: 'Success Rate' },
            { value: '8 weeks', label: 'Avg. Time Saved' },
            { value: '4.9/5', label: 'User Rating' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
              <div className="text-4xl text-[#1d70b8] mb-2">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={closeVideo}
        youtubeId={currentVideo?.youtubeId}
        vimeoId={currentVideo?.vimeoId}
        src={currentVideo?.src}
        title={currentVideo?.title}
        description={currentVideo?.description}
      />
    </section>
  );
}

