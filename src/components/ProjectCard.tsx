import { useState, useRef, useEffect } from 'preact/hooks';

interface ProjectCardProps {
  title: string;
  images: string[];
  github: string;
  url: string;
  description?: string;
  tags?: string[];
  baseUrl: string; // Passed from Astro to resolve paths correctly
}

export default function ProjectCard({
  title,
  images,
  github,
  url,
  description,
  tags,
  baseUrl,
}: ProjectCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const isCarousel = images.length > 1;

  // Sync active dot with scroll position
  const handleScroll = () => {
    if (!trackRef.current) return;
    const scrollLeft = trackRef.current.scrollLeft;
    const slideWidth = trackRef.current.clientWidth;
    // adding half slide width so it triggers the active state halfway through the swipe
    const newIndex = Math.floor((scrollLeft + slideWidth / 2) / slideWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const goToSlide = (index: number) => {
    if (!trackRef.current) return;
    const slideWidth = trackRef.current.clientWidth;
    trackRef.current.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
    setActiveIndex(index);
  };

  const nextSlide = () => {
    const nextIndex = (activeIndex + 1) % images.length;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (activeIndex - 1 + images.length) % images.length;
    goToSlide(prevIndex);
  };

  // Auto-play effect
  useEffect(() => {
    if (!isCarousel || isPaused) return;

    const interval = setInterval(() => {
      // Use function form to get latest activeIndex without putting it in dependency array
      // to avoid resetting interval on every manual slide change unless desired
      setActiveIndex((current) => {
        const nextIdx = (current + 1) % images.length;
        if (trackRef.current) {
           const slideWidth = trackRef.current.clientWidth;
           trackRef.current.scrollTo({ left: slideWidth * nextIdx, behavior: 'smooth' });
        }
        return nextIdx;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isCarousel, isPaused, images.length]);

  return (
    <div className="relative rounded-lg shadow-soft bg-elevated text-primary h-full flex flex-col">
      {/* Image Area */}
      {!isCarousel ? (
        <img
          className="w-full rounded-t-lg"
          src={`${baseUrl}${images[0]}`}
          alt={title}
          loading="lazy"
        />
      ) : (
        <div
          className="relative overflow-hidden group rounded-t-lg"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Scroll Track */}
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
          >
            {images.map((img, idx) => (
              <div key={idx} className="w-full flex-shrink-0 snap-center">
                <img
                  className="w-full object-cover"
                  src={`${baseUrl}${img}`}
                  alt={`${title} - image ${idx + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/60 text-white rounded-full p-1 z-10"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/60 text-white rounded-full p-1 z-10"
          >
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === i ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="px-6 py-4 mb-16 flex-grow">
        <div className="font-bold text-xl mb-2">{title}</div>

        {tags &&
          tags.map((tag, i) => (
            <div key={i} className="rounded-full chip-primary inline-block mr-2 mb-2 px-2 py-0.5 text-xs">
              {tag}
            </div>
          ))}

        {description && (
          <p
            className="text-secondary text-base leading-normal mt-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>

      {/* Footer / Buttons Area */}
      <div className="absolute inset-x-0 bottom-0 px-6 py-4 flex justify-center items-end">
        {url && url !== '' && (
          <a className="btn-primary font-bold rounded-full mx-2" href={url} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" className="text-4xl w-9 h-9">
              <path fill="currentColor" d="M8 5v14l11-7z" />
            </svg>
          </a>
        )}

        {github && github !== '' && (
          <a className="btn-primary font-bold rounded-full mx-2" href={github} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" className="text-4xl w-9 h-9">
              <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
