import { useState } from 'react';
import { PlayCircle, Clock, GraduationCap } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { videos, getVideosByCategory } from '../../config/videoContent';

export function VideoTutorialsSection() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const tutorialVideos = getVideosByCategory('tutorial');
  const featureVideos = getVideosByCategory('feature');

  const openVideo = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const currentVideo = videos.find(v => v.id === selectedVideo);

  return (
    <section className="video-tutorials-section relative py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 text-blue-700 text-sm mb-6">
            <GraduationCap className="w-4 h-4" />
            <span>Video Tutorials</span>
          </div>
          <h2 className="text-5xl lg:text-6xl text-gray-900 mb-6 tracking-tight">
            Master TestNotifier
            <span className="block text-[#1d70b8]">Step by Step</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Watch our comprehensive video guides to get the most out of TestNotifier
          </p>
        </div>

        {/* Tutorial Videos Grid */}
        <div className="mb-16">
          <h3 className="text-3xl text-gray-900 mb-8">Getting Started Tutorials</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutorialVideos.map((video, index) => (
              <div
                key={video.id}
                className="group cursor-pointer"
                onClick={() => openVideo(video.id)}
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden mb-4">
                  {/* Thumbnail */}
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1d70b8]/40 to-[#2e8bc0]/40"></div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-xl">
                      <PlayCircle className="w-8 h-8 text-[#1d70b8] ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {video.duration && (
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                  )}

                  {/* Step Number */}
                  <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1d70b8] text-sm font-medium shadow-lg">
                    {index + 1}
                  </div>
                </div>

                {/* Video Info */}
                <h4 className="text-lg text-gray-900 mb-2 group-hover:text-[#1d70b8] transition-colors">
                  {video.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {video.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Videos */}
        <div>
          <h3 className="text-3xl text-gray-900 mb-8">Feature Highlights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {featureVideos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer"
                onClick={() => openVideo(video.id)}
              >
                <div className="flex gap-6 bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#1d70b8] hover:shadow-xl transition-all">
                  {/* Video Thumbnail */}
                  <div className="relative w-48 aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden flex-shrink-0">
                    {video.thumbnail ? (
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1d70b8]/40 to-[#2e8bc0]/40"></div>
                    )}

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                        <PlayCircle className="w-6 h-6 text-[#1d70b8] ml-0.5" />
                      </div>
                    </div>

                    {/* Duration */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded px-2 py-0.5 text-white text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="flex-1">
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
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-br from-[#1d70b8]/5 via-[#2e8bc0]/5 to-[#1d70b8]/5 rounded-3xl p-12 border border-[#1d70b8]/20 text-center">
          <h3 className="text-3xl text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Install TestNotifier now and start monitoring test availability in minutes
          </p>
          <button className="bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all text-lg">
            Install Extension Free
          </button>
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

