import Headroom from 'headroom.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import './modules/form';
import splitToLinesAndFadeUp from './modules/effects/splitLinesAndFadeUp';
import { lenis } from './modules/scroll/leniscroll';
import Swal from 'sweetalert2';

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    console.log(targetId);
    const targetElement = document.querySelector(targetId);
    console.log(targetElement);
    console.log(lenis);
    if (targetElement) {
      history.pushState(null, '', targetId);
      window.dispatchEvent(new Event('start-scroll'));
      lenis.scrollTo(targetId);
    } else {
      window.location.href = `/${targetId}`;
    }
  });
});

gsap.registerPlugin(ScrollTrigger);
gsap.core.globals('ScrollTrigger', ScrollTrigger);

const header = document.querySelector('.header');
const headroom = new Headroom(header, {});
headroom.init();
header.headroom = headroom;

//data-popup
function useState(initialValue) {
  let value = initialValue;
  const subscribers = [];

  function setValue(newValue) {
    value = newValue;
    subscribers.forEach(subscriber => subscriber(value));
  }

  function getState() {
    return value;
  }

  function subscribe(callback) {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  }

  return [getState, setValue, subscribe];
}

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  if (window.screen.width < 1025) return;
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});
window.addEventListener('resize-me', () => {
  if (window.screen.width > 1025) return;
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

splitToLinesAndFadeUp('[data-split-lines]', gsap);

document.querySelectorAll('.installment-block__img-wrap img').forEach(el => {
  // gsap.set(el, { scale: 1.05 });
  gsap
    .timeline({
      scrollTrigger: {
        trigger: el,
        scrub: 1,
      },
    })
    .to(el, { scale: 1.1, ease: 'none' });
});

function mobileMenuVisibilityHandler() {
  const [isOpen, setIsOpen, subscribeIsOpen] = useState(false);
  const popup = document.querySelector('[data-header-mobile]');
  document.body.addEventListener('click', function planningPopupOpen(evt) {
    const target = evt.target.closest('[data-header-mobile-open]');
    if (!target) {
      return;
    }
    setIsOpen(true);
  });

  document.body.addEventListener('click', function planningPopupClose(evt) {
    const target = evt.target.closest('[data-header-mobile-close]');
    if (!target) {
      return;
    }
    setIsOpen(false);
  });

  subscribeIsOpen(value => {
    if (value) {
      popup.classList.add('active');
      document.body.classList.add('popup-open');
      window.dispatchEvent(new Event('resize-me'));
    } else {
      popup.classList.remove('active');
      document.body.classList.remove('popup-open');
    }
  });

  return {
    isOpen,
    setIsOpen,
    subscribeIsOpen,
  };
}

mobileMenuVisibilityHandler();
