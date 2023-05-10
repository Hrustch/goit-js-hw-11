import axios from "axios";
import { form } from "./index"
export async function callForImgs(page) {
    const params = new URLSearchParams({
        per_page: 40,
        key: '36224530-0ce46c8c70d6d91971a56eb8c',
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page: page,
        q: (form.elements.searchQuery.value).trim().replaceAll(" ", "+"),
    })
    const URL = `https://pixabay.com/api/?${params}`;
    const response = await axios.get(URL)
    return response;
}
/* (form.elements.searchQuery.value).replaceAll(" ", "+") */