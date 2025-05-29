import Swiper, { EffectFade, Mousewheel, Navigation, Autoplay, FreeMode } from 'swiper';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { pad, useState } from './modules/helpers/helpers';
import splitToLinesAndFadeUp from './modules/effects/splitLinesAndFadeUp';
import popupFormPlanning from './modules/popup-form-planning/popup-form-planning';
import googleMap from './modules/map/map';
import customSelect from 'custom-select';
import Swal from 'sweetalert2';


customSelect('.select');

document.querySelectorAll('.custom-select-container').forEach(el => {
  el.setAttribute('data-lenis-prevent', '')
})

gsap.registerPlugin(ScrollTrigger);
gsap.core.globals('ScrollTrigger', ScrollTrigger);

Swiper.use([Mousewheel, Navigation, FreeMode]);

function frontScreenHandler() {
  const frontScreenImg = document.querySelector('[data-front-screen-img]');
  if (!frontScreenImg) return;
  gsap.set(frontScreenImg, { opacity: 1, clipPath: 'polygon(0% 0%, 0% 0%, 0% 10%, 0% 10%)'});
  let tl = gsap.timeline({
    paused: true,
  })
  .fromTo('.front-screen__content', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, stagger: 0.25, ease: 'power2.out' }, '<')
  .to(frontScreenImg, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 10%, 0% 10%)', duration: 1, ease: 'power2.out' },'<')
  .to(frontScreenImg, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.75, ease: 'power2.out' })
  window.addEventListener('load', ()=>{
    document.querySelector('.front-screen__content').classList.remove('ready-to-animate');
    tl.play();
  }, { once: true });
}

frontScreenHandler();

const slider = new Swiper('[data-slides-slider]', {
  navigation: {
    nextEl: '[data-slides-slider-next]',
    prevEl: '[data-slides-slider-prev]',
  },
  on: {
    init: function() {
      handleIframes(this); // Запускаємо для першого активного слайду
    },
    slideChange: function() {
      handleIframes(this);
    },
  },
});

const slider2 = new Swiper('[data-slides2-slider]', {
  navigation: {
    nextEl: '[data-slides2-slider-next]',
    prevEl: '[data-slides2-slider-prev]',
  },
  slidesPerView: 1,
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 60,
    },
  }
});

function handleIframes(swiper) {
  if (/localhost/.test(window.location.href)) return;
  swiper.slides.forEach((slide, index) => {
    const iframe = slide.querySelector('iframe');
    if (!iframe) return;
    // console.log(iframe);
    if (index === swiper.activeIndex) {
      // Активний слайд: додаємо src, якщо його ще немає
      // console.log(iframe.src, iframe.dataset.src);

      iframe.src = iframe.dataset.src;
    } else {
      // Неактивні слайди: видаляємо src, щоб зупинити відео/контент
      iframe.src = '';
    }
  });
}

function advantagesTabsHandler() {
  const tabs = document.querySelectorAll('[data-advantage-tab]');
  const containers = document.querySelectorAll('[data-advantage-tab-container]');
  const [currentTab, setCurrentTab, subscribeCurrentTab] = useState(null);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      const dataset = tab.dataset.advantageTab;
      setCurrentTab(dataset);
    });
  });

  subscribeCurrentTab(value => {
    containers.forEach((container, i) => {
      const dataset = container.dataset.advantageTabContainer;
      if (value == dataset) {
        container.classList.add('active');
        gsap.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      } else {
        gsap.fromTo(container, { opacity: 1 }, { opacity: 0, duration: 0.5 });
        container.classList.remove('active');
      }
    });

    tabs.forEach((tab, i) => {
      const dataset = tab.dataset.advantageTab;
      if (dataset == value) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  });

  tabs.forEach(el => {
    if (el.classList.contains('active')) {
      const dataset = el.dataset.advantageTab;
      setCurrentTab(dataset);
    }
  });
}

advantagesTabsHandler();
googleMap();
function gallerySliderHandler() {
  const images = {
    renovation: [
      './assets/images/gallery/renovation/13.1.jpg',  
      './assets/images/gallery/renovation/20.1.jpg',  
      './assets/images/gallery/renovation/21.1.jpg',  
      './assets/images/gallery/renovation/22.1.jpg',

    ],
    sad: [
        './assets/images/gallery/sad/11.1.jpg',  
        './assets/images/gallery/sad/12.1.jpg',  
        './assets/images/gallery/sad/13.1.jpg',  
        './assets/images/gallery/sad/14.1.jpg',  
        './assets/images/gallery/sad/16.1.jpg',  
        './assets/images/gallery/sad/17.1.jpg',

    ],
    club: [
      './assets/images/gallery/club/10.1.jpg',
      './assets/images/gallery/club/11.1.jpg',
      './assets/images/gallery/club/12.1.jpg',
    ],
    poverh: [
        './assets/images/gallery/poverh/1.1.jpg',  
        './assets/images/gallery/poverh/4.1.jpg',  
        './assets/images/gallery/poverh/6.1.jpg',  
        './assets/images/gallery/poverh/7.1.jpg',

    ],
    parking: [
      './assets/images/gallery/parking/troy-t-YoGzQqqWZP0-unsplash.jpg',
    ],
    ukrytia: [
      './assets/images/gallery/ukrytia/63a6f8bb89a7ca1a804e496ce7aee41fd45cd451.jpg',
    ],
  };

  const [galleryFilter, setGalleryFilter, subscribeGalleryFilter] = useState('territoriya');

  document.querySelectorAll('[data-gallery-filter-button]').forEach(button => {
    button.addEventListener('click', () => {
      const dataset = button.dataset.galleryFilterButton;
      setGalleryFilter(dataset);
    });
  });

  // let fullTick = document.querySelectorAll('[data-gallery-slider] .swiper-slide').length - 1;
  // fullTick = fullTick * 315 + 695;
  // const oneTick = 315;

  // const convertedTick = gsap.utils.mapRange(0, fullTick, 0, 1, oneTick);

  // console.log('convertedTick', convertedTick);

  const swiper = new Swiper('[data-gallery-slider]', {
    // loop: true,
    slidesPerView: 1,
    spaceBetween: 16,
    simulateTouch: false,
    speed: 800,
    navigation: {
      nextEl: '[data-gallery-slider-next]',
      prevEl: '[data-gallery-slider-prev]',
    },
    breakpoints: {
      767: {
        slidesPerView: 3,
        spaceBetween: 30,
        simulateTouch: true,
      },
    },
    on: {
      slideChangeTransitionEnd: swiper => {
        // swiper.update();
      },
    },
  });
  

  // document.querySelector('[data-gallery-slider-next]').addEventListener('click', () => {
  //   swiper.setProgress(swiper.progress + convertedTick, 800);
  // });
  // document.querySelector('[data-gallery-slider-prev]').addEventListener('click', () => {
  //   swiper.setProgress(swiper.progress - convertedTick, 800);
  // });

  subscribeGalleryFilter(value => {
    document.querySelectorAll('[data-gallery-filter-button]').forEach(button => {
      const dataset = button.dataset.galleryFilterButton;
      if (dataset == value) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    const newGallery = images[value];
    const swiperWrapper = swiper.wrapperEl;

    swiper.wrapperEl.innerHTML = newGallery
      .map((image, index) => {
        const url = document.documentElement.dataset.base ? document.documentElement.dataset.base + image.replace('./assets', '/assets') : image;
        return `
        <div class="swiper-slide">
          <div class="gallery__img">
            <img src="${url}" alt="gallery image">
          </div>
        </div>
      `;
      })
      .join('');
    swiper.update();
    swiper.slideTo(0, 0); // Прокрутка до першого слайду
  });
  setGalleryFilter('renovation');
}

gallerySliderHandler();



function constructionSliderHandler() {
  return new Swiper('[data-construction-slider]', {
    slidesPerView: 1,
    spaceBetween: 0,
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
    navigation: {
      nextEl: '[data-construction-slider-next]',
      prevEl: '[data-construction-slider-prev]',
    },
  });
}

const constructionSlider = constructionSliderHandler();

function constructionFilterHandler(slider) {
  const [constructionFilter, setConstructionFilter, subscribeConstructionFilter] = useState({});

  const filters = document.querySelectorAll('[data-construction-filter]');


  const initialState = {};
  filters.forEach(filter => {
    const key = filter.dataset.constructionFilter;

    initialState[key] = filter.value;
  });

  setConstructionFilter(initialState);

  applyFilter(initialState);

  filters.forEach(filter => {
    filter.addEventListener('change', function(evt) {
      const key = evt.target.dataset.constructionFilter;
      const value = evt.target.value;
      const newState = {
        ...constructionFilter(),
        [key]: value,
      };
      setConstructionFilter(newState);
      applyFilter(newState); 
      
    });
  });

  // 4. Функція фільтрації
  function applyFilter(value) {
    const cards = document.querySelectorAll('[data-construction-card]');
    cards.forEach(card => {
      let isShow = true;
      Object.entries(value).forEach(([key, val]) => {
        const cardValue = card.dataset[key];
        if (cardValue != val) {
          isShow = false;
        }
      });
      card.style.display = isShow ? '' : 'none';
    });

    // Прокрутка до початку та оновлення слайдера
    slider.slideTo(0);
    slider.update();
  }
}

constructionFilterHandler(constructionSlider);

popupFormPlanning();

function formSuccessHandler() {
  const [formSuccess, setFormSuccess, subscribeFormSuccess] = useState(false);
  window.addEventListener('formSuccess', () => {
    setFormSuccess(true);
  });
  const popup = document.querySelector('[data-form-success-popup]');
  document.body.addEventListener('click', function successPopupOpen(evt) {
    const target = evt.target.closest('[data-form-success-popup-open]');
    if (!target) {
      return;
    }
    setFormSuccess(true);
  });

  document.body.addEventListener('click', function successPopupClose(evt) {
    const target = evt.target.closest('[data-form-success-popup-close]');
    if (!target) {
      return;
    }
    setFormSuccess(false);
  });

  subscribeFormSuccess(value => {
    if (value) {
      popup.classList.add('active');
      document.body.classList.add('popup-open');
      window.dispatchEvent(new Event('resize-me'));
    } else {
      popup.classList.remove('active');
      document.body.classList.remove('popup-open');
    }
  });
}
formSuccessHandler();

function callbackPopupHandler() {
  const [formSuccess, setFormSuccess, subscribeFormSuccess] = useState(false);
  const popup = document.querySelector('[data-callback-popup]');
  document.body.addEventListener('click', function successPopupOpen(evt) {
    const target = evt.target.closest('[data-callback-popup-open]');
    if (!target) {
      return;
    }
    setFormSuccess(true);
  });

  document.body.addEventListener('click', function popupClose(evt) {
    const target = evt.target.closest('[data-callback-popup-close]');
    if (!target) {
      return;
    }
    evt.preventDefault();
    evt.stopPropagation();
    setFormSuccess(false);
  });

  subscribeFormSuccess(value => {
    if (value) {
      popup.classList.add('active');
      document.body.classList.add('popup-open');
      window.dispatchEvent(new Event('resize-me'));
    } else {
      popup.classList.remove('active');
      document.body.classList.remove('popup-open');
    }
  });
}

callbackPopupHandler();

function mobileNewsHandler() {
  if (window.screen.width > 767) {
    return;
  }
  const hiddenNews = document.querySelectorAll('[data-news-hidden-on-mobile]');

  //data-news-hidden-on-mobile
  //data-news-reveal-mobile

  hiddenNews.forEach(el => {
    el.style.display = 'none';
  });

  document.querySelectorAll('[data-news-reveal-mobile]').forEach(el => {
    el.addEventListener('click', evt => {
      hiddenNews.forEach(el => {
        el.style.display = '';
      });
      el.remove();
    });
  });
}

mobileNewsHandler();


function aboutVideoHandler() {
  const playButton = document.querySelector('[data-play-video="about-video"]');
  const video = document.querySelector('[data-video="about-video"]');
  
  const [ videoState, setVideo, subscribeVideo ] = useState(video.paused);

  subscribeVideo(value => {
    playButton.style.display = value ? 'none' : '';
    if (value) {
      video.play();
      return;
    }
    if (!value) {
      video.pause();
      return;
    }
  });
  playButton.addEventListener('click', () => {
    setVideo(true);
  });

  video.addEventListener('pause', () => {
    setVideo(false);
  });
  video.addEventListener('playing', () => {
    setVideo(true);
  });

  // video.add

}
aboutVideoHandler()


function planningsSlider() {
  new Swiper('[data-plannings-slider]', {
    slidesPerView: 1,
    navigation: {
      nextEl: '[data-plannings-slider-next]',
      prevEl: '[data-plannings-slider-prev]',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1360: {
        slidesPerView: 4,
        spaceBetween: 60,
      },
    },
  });
}
function planningsCardsHandler() {
  //data-flat-card-expand
  document.querySelectorAll('[data-flat-card]').forEach(el => {
    el.addEventListener('click',function(evt){
      if (evt.target.closest('[data-flat-card-expand]')) {
        return el.classList.add('active');
      }
      if (evt.target.closest('[data-flat-card-hide]')) {
        return el.classList.remove('active');
      }
    });
  })
}
planningsCardsHandler();
planningsSlider();



function constructionVideoHandler() {
  document.body.addEventListener('click', function(evt) {
    const target = evt.target.closest('[data-popup-video]');
    if (!target) {
      return;
    }
    const videoUrl = target.dataset.popupVideo;
    openVideoPopup(videoUrl);
  })
}

constructionVideoHandler();



function openVideoPopup(videoUrl) {
  const checkIfImage = /\.(jpg|jpeg|png|gif)$/i.test(videoUrl);
  const html = checkIfImage ? 
    `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
        <img src="${videoUrl}" 
                style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;">
        </img>
      </div>`:
    `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
        <iframe src="${videoUrl}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen 
                style="position:absolute;top:0;left:0;width:100%;height:100%;">
        </iframe>
      </div>`;
  Swal.fire({
    html: html,
    width: window.innerWidth > 768 ? '100%' : '100%',
    showCloseButton: true,
    showConfirmButton: false,
    padding: '1rem',
    background: '#000',
  });
}

function newsSlider() {
  new Swiper('[data-news-slider]', {
    slidesPerView: 1,
    navigation: {
      nextEl: '[data-news-slider-next]',
      prevEl: '[data-news-slider-prev]',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1360: {
        slidesPerView: 4,
        spaceBetween: 60,
      },
    },
  } );
}

newsSlider();


function paralax() {
  document.querySelectorAll('[data-paralax-wrap]').forEach(el => {
    const paralax = el.dataset.paralax;
    const paralaxSpeed = el.dataset.paralaxSpeed || 0.5;
    const paralaxOffset = el.dataset.paralaxOffset || 0;
    const img = el.querySelector('img');
    gsap.set(img, { scale: 1.1 });
    gsap.set(el, { overflow: 'hidden' });
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scrub: true,
        markers: false,
      },
    })
      .fromTo(
        img,
        { y: -50 },
        {
          y: 50
        },
      )
      .progress(0);
    })
}

paralax();

function parkingLinesAnimation() {
  document.querySelectorAll('[data-anim-line-entry]').forEach(el => {
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        once: true,
      }
    })
    .fromTo(el, {
      scaleX: 0,
      transformOrigin: 'left center',
    }, {
      scaleX: 1,
      duration: 0.5,
      ease: 'power2.out',
    })
  })
}
parkingLinesAnimation();



function fadeUpAnimation() {
  document.querySelectorAll('[data-fade-up]').forEach(el => {
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      }
    })
    .fromTo(el, {
      y: 50,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  });
}

fadeUpAnimation();


function constructionMobileAccordeonsHandler() {
  document.querySelectorAll('[data-construction-table-group]').forEach(el => {
    el.addEventListener('click', function(evt) {
      if (!evt.target.closest('[data-construction-table-group-open]') || window.innerWidth > 767) return;
      el.classList.toggle('js-collapsed');
      
    });
  });
}

constructionMobileAccordeonsHandler();