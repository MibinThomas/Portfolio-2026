import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination, Parallax, EffectCreative } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';
import './VerticalSlider.css';
import { WebGLBackground } from './WebGLBackground';

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    title: 'M.T.',
    subtitle: 'Creative Developer',
    description: 'Crafting premium digital experiences through motion and interaction.',
    image: '/img/spiderman 1.png',
  },
  {
    id: 2,
    title: 'About',
    subtitle: 'The Vision',
    description: 'Bridging the gap between aesthetic design and robust engineering.',
    image: '/img/spiderman.png',
  },
  {
    id: 3,
    title: 'Work',
    subtitle: 'Selected Projects',
    description: 'A curated showcase of interactive web applications and digital products.',
    image: '/img/cool.png',
  },
  {
    id: 4,
    title: 'Connect',
    subtitle: 'Get In Touch',
    description: 'Available for freelance opportunities and exciting collaborations.',
    image: '/img/both.png',
  }
];

export function VerticalSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageUrls = slides.map(s => s.image);

  return (
    <div className="slider-container">
      <WebGLBackground images={imageUrls} activeIndex={activeIndex} />
      <Swiper
        direction={'horizontal'}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        slidesPerView={1}
        spaceBetween={0}
        mousewheel={true}
        parallax={true}
        effect={'creative'}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ['-20%', 0, -1],
            scale: 0.85,
            opacity: 0,
          },
          next: {
            translate: ['100%', 0, 0],
          },
        }}
        speed={1400} // Extra smooth fluid speed
        pagination={{
          clickable: true,
        }}
        loop={true}
        modules={[Mousewheel, Pagination, Parallax, EffectCreative]}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-content">
              <div className="content-wrapper">
                <span className="subtitle" data-swiper-parallax="-300">{slide.subtitle}</span>
                <h2 className="title" data-swiper-parallax="-500">{slide.title}</h2>
                <p className="description" data-swiper-parallax="-700">{slide.description}</p>
                <button className="explore-btn" data-swiper-parallax="-900">Explore</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
