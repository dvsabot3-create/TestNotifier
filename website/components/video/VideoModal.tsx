import { X } from 'lucide-react';
import { useEffect } from 'react';
import { VideoPlayer } from './VideoPlayer';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  src?: string;
  youtubeId?: string;
  vimeoId?: string;
  title?: string;
  description?: string;
}

export function VideoModal({
  isOpen,
  onClose,
  src,
  youtubeId,
  vimeoId,
  title,
  description
}: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl flex items-center justify-center transition-all text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player */}
        <VideoPlayer
          src={src}
          youtubeId={youtubeId}
          vimeoId={vimeoId}
          title={title}
          description={description}
          autoplay={true}
          className="shadow-2xl"
        />

        {/* Video Info Below */}
        {(title || description) && (
          <div className="mt-6 text-center">
            {title && <h3 className="text-white text-2xl mb-2">{title}</h3>}
            {description && <p className="text-white/70 text-sm max-w-2xl mx-auto">{description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

