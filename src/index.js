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



function submit(event) {
    if (!form.elements.searchQuery.value.trim()) {
        return;
    }
    console.log("submit is runing")
    event.preventDefault();
    page = 1
    gallery.innerHTML = ""
    sendQuery()
}









async function sendQuery() {
    try {
        if (!form.elements.searchQuery.value.trim()) {
            return;
        }

        const response = await callForImgs(page)
        
        console.log(`Кількість відповідей: ${response.data.hits.length}`)


        if (response.data.totalHits === 0) {
            Notiflix.Notify.failure("Sorry, we didn't find any images for your request")
            console.log("Відповіді нема, нічого не робим")
        }
        if (response.data.totalHits === 1) {
            await renderImages(response.data.hits)
            Notiflix.Notify.success(`Hooray! We found 1 image.`)
        }
        if (response.data.totalHits > 1 && response.data.totalHits < 40) {
            await renderImages(response.data.hits)
            Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
        }
        if (response.data.totalHits > 40) {
            await renderImages(response.data.hits)
            loader.classList.add("visible")
            console.log("Лоадер видимий")
            Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
        }
        return response;

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
    
}

form.addEventListener("submit", submit)



async function loadMorePhotos(entries, observer) {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            page++;
            console.log("Дозавантажити картинки!")

            loader.classList.remove("visible")
            console.log("Лоадер невидимий")

            const response = await sendQuery();
            const images = response.data.hits;
            console.log(`Картинок: ${images.length}`)
            
            if (images.length === 0) {
                Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`)
                return;
            }

            renderImages(images);
        }
    });
}

const observer = new IntersectionObserver(loadMorePhotos);
observer.observe(loader);