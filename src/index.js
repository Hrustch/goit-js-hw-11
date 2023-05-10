import SimpleLightbox from "simplelightbox";
import notiflix from "notiflix";
import "./style.css";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { callForImgs } from "./callForImgs";
import Notiflix from "notiflix";
let page = 1;
const gallery = document.querySelector('.gallery')
const loader = document.querySelector(".end-collection-text");
export const form = document.querySelector("#search-form");
const lightbox = new SimpleLightbox(".gallery a");

async function sendQuery(e) {
    try {
        if (!form.elements.searchQuery.value.trim()) {
            return;
        }

        e.preventDefault();
        gallery.innerHTML = ""

        const response = await callForImgs(page)
        await renderImages(response.data.hits)
        if (response.data.totalHits === 0) {
            Notiflix.Notify.failure("Sorry, we didn't find any images for your request")
        }
        if (response.data.totalHits === 1) {
            Notiflix.Notify.success(`Hooray! We found 1 image.`)
        }
        if (response.data.totalHits > 1) {
            Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
        }

    } catch {

    }
}



function renderImages(images) {
    const markup = images
        .map(image => {
            const {
                id,
                largeImageURL,
                webformatURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            } = image;

            return `
            <a class="gallery__link" href="${largeImageURL}">
            <div class="gallery__item" id="${id}">
            <img class="gallery-item_img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
            <p class="info-item"><b>Likes</b>${likes}</p>
                        <p class="info-item"><b>Views</b>${views}</p>
                        <p class="info-item"><b>Comments</b>${comments}</p>
                        <p class="info-item"><b>Downloads</b>${downloads}</p>
                        </div>
                        </div>
                        </a>
                        `;
        })
        .join('');

    gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh()
    loader.classList.add("visible")
}

form.addEventListener("submit", sendQuery)



async function loadMorePhotos(entries, observer) {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            page++;
            const response = await callForImgs(page);
            const images = response.data.hits;
            loader.classList.remove("visible")
            if (images.length === 0) {
                observer.unobserve(loader);
                Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`)
                return;
            }

            renderImages(images);
        }
    });
}

const observer = new IntersectionObserver(loadMorePhotos);
observer.observe(loader);