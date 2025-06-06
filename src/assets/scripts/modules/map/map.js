// import { fetchMarkersData } from './getMarkers';

import mapStyle from './map-style';

const mapContainers = document.querySelectorAll('.map');
export default function googleMap() {
  // window.initMap = function initMap() {
  //   mapContainers.forEach((mapElement, index) => {
  //     // ...
  //   });
  // };

  async function loadGoogleMapsScript() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      let key = '';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&language=ua`;
      script.async = true;
      script.defer = true;
      script.onerror = reject;
      window.initMap = () => resolve();
      document.head.appendChild(script);
    });
  }

  // const mapContainers = document.querySelectorAll('.map');
  const observerOptions = {
    rootMargin: '0px',
    threshold: 0.1,
  };

  mapContainers.forEach(container => {
    const observer = new IntersectionObserver(async (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          obs.unobserve(container);
          await loadGoogleMapsScript();
          createMap(container);
        }
      }
    }, observerOptions);

    observer.observe(container);

    // 🔽 Додаткова перевірка – чи вже елемент видимий при завантаженні
    if (isElementInViewport(container)) {
      observer.unobserve(container); // на випадок, якщо буде дублювання
      loadGoogleMapsScript().then(() => createMap(container));
    }
  });

  // 👇 Допоміжна функція
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function createMap(container) {
    const gmarkers = [];
    const center = {
      lat: 49.84140317887458,  lng: 24.000367442154594
    };

    const choosedCategories = new Set();
    choosedCategories.add('main');

    const filterItems = document.querySelectorAll('[data-marker]');
    const map = new google.maps.Map(container, {
      zoom: 15,
      center,
      scrollwheel: false,
      navigationControl: false,
      mapTypeControl: false,
      scaleControl: false,
      draggable: true,
      language: 'ua',
      styles: mapStyle(),
    });

    const filterMarkers = function(categoriesArray) {
      gmarkers.forEach(el => {
        if (categoriesArray.has(el.category) || categoriesArray.size === 1) {
          el.setMap(map);
          el.setAnimation(google.maps.Animation.DROP);
        } else {
          el.setMap(null);
        }
      });
    };
    document.querySelector('[data-category="all"]').classList.add('active');
    filterItems.forEach(item => {
      item.addEventListener('click', evt => {
        evt.stopImmediatePropagation();
        item.classList.toggle('active');
        if (!item.classList.contains('active')) {
          item.style.pointerEvents = 'none';
          setTimeout(() => {
            item.style.pointerEvents = '';
            
          }, 2000);
        }
        if (item.classList.contains('active') && item.dataset.category !== 'all') {
          choosedCategories.add(item.dataset.category);
        } else {
          choosedCategories.delete(item.dataset.category);
        }
        if (item.dataset.category === 'all' && item.classList.contains('active')) {
          document.querySelectorAll('[data-marker]').forEach(el => {
            el.classList.toggle('active', el === item);
            if (el !== item) {
              choosedCategories.delete(el.dataset.category);
            }
          });
        } else if (item.dataset.category !== 'all') {
          document.querySelector('[data-category="all"]').classList.remove('active');
        }
        
        if (choosedCategories.size === 1) {
          document.querySelector('[data-category="all"]').classList.add('active');
        }
        filterMarkers(choosedCategories);
        
      });
    });

    const baseFolder = window.location.href.match(/localhost/)
      ? './assets/images/map/'
      : '/wp-content/themes/3d/assets/images/map/';
    const defaultMarkerSize =
      document.documentElement.clientWidth < 1600
        ? new google.maps.Size(23, 40)
        : new google.maps.Size(28, 45);
    const buildLogoSize = new google.maps.Size(54,138);

    const markersAdresses = {
      main: `${baseFolder}main.svg`,
      mall: `${baseFolder}mall.svg`,
      park: `${baseFolder}park.svg`,
      garden: `${baseFolder}kinder.svg`,
      admin: `${baseFolder}admin.svg`,
      nature: `${baseFolder}nature.svg`,
      activities: `${baseFolder}activities.svg`,
      pharmacy: `${baseFolder}pharmacy.svg`,
      restaurant: `${baseFolder}restaurant.svg`,
      school: `${baseFolder}school.svg`,
      sport: `${baseFolder}sport.svg`,
      supermarket: `${baseFolder}supermarket.svg`,
      drivingSchool: `${baseFolder}driving-school.svg`,
      post: `${baseFolder}post.svg`,
      aquapark: `${baseFolder}aquapark.svg`,
      petrolStation: `${baseFolder}petrol-station.svg`,
      busStop: `${baseFolder}bus-stop.svg`,
      carWashing: `${baseFolder}car-washing.svg`,
    };

    const markersData = [
      {
          position: { lat: 49.84566325383819, lng: 23.99638091685124 },
          text: 'ІЗІУМ | Офтальмологічний центр | Львів',
          type: "pharmacy",
          icon: {
              url: markersAdresses.pharmacy,
              scaledSize: defaultMarkerSize,
          },
      },
      {
          position: { lat: 49.83866690255672, lng: 24.011226358806763 },
          text: "Шпиталь імені митрополита Шептицького", 
          type: "pharmacy",
          icon: {
              url: markersAdresses.pharmacy,
              scaledSize: defaultMarkerSize,
          },
      },
      {
          position: { lat: 49.84652568466018, lng: 24.005890726698603 },
          text: "Ojakhi | Оджахі - ресторан грузинської та української кухні", 
          type: "restaurant",
          icon: {
              url: markersAdresses.restaurant,
              scaledSize: defaultMarkerSize,
          },
      },
      {
          position: { lat: 49.842382931782005, lng: 24.00948163360373 },
          text: "Soprano roof terrace", 
          type: "restaurant",
          icon: {
              url: markersAdresses.restaurant,
              scaledSize: defaultMarkerSize,
          },
      },
      // {
      //     position: { lat: 49.84182153349779, lng: 24.000499933787157 },
      //     text: "ПАТ Концерн Електрон", 
      //     type: "school",
      //     icon: {
      //         url: markersAdresses.school,
      //         scaledSize: defaultMarkerSize,
      //     },
      // },
      {
          position: { lat: 49.841193783121824, lng: 24.00146742286963 },
          text: "Галицький районний суд міста Львова", 
          type: "admin",
          icon: {
              url: markersAdresses.admin,
              scaledSize: defaultMarkerSize,
          },
      },
      {
          position: { lat: 49.841449386910845, lng: 24.00160684055064 },
          text: "Сихівський районний суд міста Львова", 
          type: "admin",
          icon: {
              url: markersAdresses.admin,
              scaledSize: defaultMarkerSize,
          },
      },
      {
          position: { lat: 49.836414478853435, lng: 24.011374138034945 },
          text: "НУ 'Львівська політехніка'", 
          type: "school",
          icon: {
              url: markersAdresses.school,
              scaledSize: defaultMarkerSize,
          },
      },
      {
          position: { lat: 49.84578687460336, lng: 24.00890617713479 },
          text: "Сільпо ", 
          type: "supermarket",
          icon: {
              url: markersAdresses.supermarket,
              scaledSize: defaultMarkerSize,
          },
      },
      {
          position: { lat: 49.83844170258176, lng: 24.019693368657745 },
          text: "Парк ім. Івана Франка", 
          type: "nature",
          icon: {
              url: markersAdresses.nature,
              scaledSize: defaultMarkerSize,
          },
      },
      {
          position: { lat: 49.83488734775688, lng: 24.012297323907337 },
          text: "Львівська академічна гімназія при НУ «Львівська політехніка»", 
          type: "school",
          icon: {
              url: markersAdresses.school,
              scaledSize: defaultMarkerSize,
          },
      },
      {
          position: { lat: 49.84282269084846, lng: 23.99958154168597 },
          text: "FitMe", 
          type: "sport",
          icon: {
              url: markersAdresses.sport,
              scaledSize: defaultMarkerSize,
          },
      },
      {
          position: { lat: 49.8436232735019, lng: 24.00447745209317 },
          text: "Львівська школа Монтесорі", 
          type: "school",
          icon: {
              url: markersAdresses.school,
              scaledSize: defaultMarkerSize,
          },
      },
      {
          position: { lat: 49.84340574040089, lng: 23.999985652157793 },
          text: "Дитячий садок №1", 
          type: "garden",
          icon: {
              url: markersAdresses.garden,
              scaledSize: defaultMarkerSize,
          },
      },
      {
        type: 'main',
        icon: {
          url: markersAdresses.main,
          scaledSize: buildLogoSize,
        },
        position: { lat: 49.84140317887458,  lng: 24.000367442154594, },
        text: 'Harry - м. Львів, вул. Cтороженка 25А',
      },
    ];

    const infowindow = new google.maps.InfoWindow({
      maxWidth: 300,
    });
    markersData.forEach(marker => {
      
      if (container.getAttribute('data-only-main-marker') == 'true' && marker.type != 'main') {
        return; // Пропускаємо, якщо це не головний маркер
      }
      const mapMarker = new google.maps.Marker({
        map,
        category: marker.type,
        animation: google.maps.Animation.DROP,
        zIndex: marker.zIndex || 1,
        icon: marker.icon,
        cursor: 'grab',
        position: new google.maps.LatLng(marker.position.lat, marker.position.lng),
      });

      google.maps.event.addListener(mapMarker, 'click', function() {
        infowindow.setContent(marker.text);
        infowindow.open(map, mapMarker);
        map.panTo(this.getPosition());
      });

      mapMarker.name = marker.type;
      gmarkers.push(mapMarker);
    });
  }
}
const mapSingle = document.querySelector('.map-simple');
if (mapSingle) {
  await loadGoogleMapsScript();

  const singleMapCenter = { lat: 49.84140317887458,  lng: 24.000367442154594 };
  const singleMapZoom = 14;
  const singleMapText = 'РІЕЛ – відділ сервісу у Києві';

  const singleMap = new google.maps.Map(mapSingle, {
    zoom: singleMapZoom,
    center: singleMapCenter,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: true,
    styles: mapStyle(),
  });

  const singleMarkerIcon = {
    url: `${
      window.location.href.match(/localhost/)
        ? './assets/images/map/riel.svg'
        : './assets/images/map/riel.svg'
    }`,
    scaledSize:
      document.documentElement.clientWidth < 1600
        ? new google.maps.Size(80, 80)
        : new google.maps.Size(90, 90),
  };

  const singleMarker = new google.maps.Marker({
    position: singleMapCenter,
    map: singleMap,
    icon: singleMarkerIcon,
    animation: google.maps.Animation.DROP,
  });

  const singleInfoWindow = new google.maps.InfoWindow({
    content: singleMapText,
    maxWidth: 300,
  });

  singleMarker.addListener('click', function() {
    singleInfoWindow.open(singleMap, singleMarker);
    singleMap.panTo(singleMarker.getPosition());
  });
}
