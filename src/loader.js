import { page } from "./callForImgs"
import { callForImgs } from "./callForImgs"
const loader = document.querySelector(".end-collection-text")

export function addMorePhotos(entries, observer) {
    entries.forEach(element => {
        if (element.isIntersecting) {
            page++;
            return callForImgs();
        }
    });

}

const observer = new IntersectionObserver(addMorePhotos)
observer.observe(loader)