import "../src/sass/main.scss"                            
import getPhoto from './js/getImage';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const ref = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  load: document.querySelector('.load-more'),
  body: document.querySelector('body'),
};
let page = 1;
let value = null;
const per_page = 40;

ref.form.addEventListener('submit', onSearch);
ref.load.addEventListener('click', onLoad);

async function onSearch(e) {
  e.preventDefault();
  ref.gallery.innerHTML = '';

  value = e.currentTarget.searchQuery.value;
  page = 1;
  const res = await getPhoto(value, page, per_page);
  const picturesArr = res.data.hits;
  const totalHits = res.data.totalHits;

  if (picturesArr.length > 0) {
    ref.load.classList.remove('visually-hidden');
    Notify.success(`Hooray! We found ${totalHits} images.`);
  } else {
    ref.load.classList.add('visually-hidden');
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  }

  addMarkup(picturesArr); 
}

async function onLoad() {
  page += 1;
  const res = await getPhoto(value, page, per_page);
  const picturesArr = res.data.hits;
  const sumPages = page * per_page;

  if (res.data.totalHits <= sumPages) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    ref.load.classList.add('visually-hidden');    
  }
  addMarkup(picturesArr);
}

function createMarkup(photo) {  
  const galleryItemMarkup = `<li class="photo-card">
          <a class='gallery__link' href="${photo.largeImageURL}">
            <img class="gallery__img" src="${photo.webformatURL}" alt="${photo.tags}"/>
            </a>
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                <span class="info-item__value">${photo.likes}</span>
              </p>
              <p class="info-item"><b>Views</b><span class="info-item__value">${photo.views}</span></p>
              <p class="info-item"><b>Comments</b><span class="info-item__value">${photo.comments}</span></p>
              <p class="info-item"><b>Downloads</b><span class="info-item__value">${photo.downloads}</span></p>
            </div>
          </li>`;
  return galleryItemMarkup;  
}

function addMarkup(pictures) {
  const galleryMarkup = pictures.map(createMarkup).join('');
  ref.gallery.insertAdjacentHTML('beforeend', galleryMarkup);
  const lightbox = new SimpleLightbox('.gallery a', {
     captionsData: 'alt',
     captionDelay: 250,
  });
}