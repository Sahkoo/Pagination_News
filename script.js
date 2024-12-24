let API_KEY = "10db4e2351474845b3b7b8c927f57de6"
let API_URL = "https://newsapi.org/v2/everything"

let news = ""
let pages = 1
const PAGE_SIZE = 6
const MAX_PAGES = 10

let inpit = document.querySelector(".block__input")
let button = document.querySelector(".button__block")
let ul = document.querySelector(".block__news")
let span = document.querySelector(".spanchik")
let btnLeft = document.querySelector(".btn_1")
let btnRight = document.querySelector(".btn_2")


button.addEventListener("click", function () {
    let input = inpit.value.trim()
    if (input && input !== news) {
        news = input
        pages = 1
        span.classList.remove("hidden")
    }
    fetchNews()
})

function fetchNews() {
    if (!news) {
        let saveNews = localStorage.getItem("news")
        let savePage = localStorage.getItem("page")

        if (saveNews) {
            news = saveNews
            pages = parseInt(savePage, 10) || 1
            inpit.value = news
            span.classList.remove("hidden")
        }
    }


    
    let ask = `${API_URL}?q=${news}&page=${pages}&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
    fetch(ask)
        .then((Response) => {
            return Response.json()
        })
        .then((data) => {
            ul.innerHTML = ""
            console.log(data)

            data.articles.forEach((item) => {
                let newLi = document.createElement("li")
                newLi.classList.add("article-item")
                newLi.innerHTML = `
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer">
                        <article>
                            <img src="${item.urlToImage || 'https://via.placeholder.com/480'}" alt="${item.title}">
                            <h2>${item.title}</h2>
                            <p>Posted by: ${item.author || 'Unknown'}</p>
                            <p>${item.description || 'No description available'}</p>
                        </article>
                    </a>
                `
                ul.appendChild(newLi)
            })

            if (data.articles.length === 0) {
                ul.innerHTML = '<li>Новину не знайдено</li>'
            }

            Pagination(data.totalResults)
        })
        .catch((error) => {
            console.error(error)
            ul.innerHTML = '<li>Сталася помилка при завантаженні новин</li>'
        })
}

document.addEventListener("DOMContentLoaded", () => {
    fetchNews()
})

function Pagination(totalResults) {
    let totalAvailablePages = Math.ceil(totalResults / PAGE_SIZE)
    let totalPages = Math.min(totalAvailablePages, MAX_PAGES)

    span.textContent = `Сторінка ${pages} з ${totalPages}`

    btnLeft.disabled = pages === 1
    btnRight.disabled = pages === totalPages

    if (pages === 1) {
        btnLeft.style.display = "none"
    } else {
        btnLeft.style.display = "inline-block"
    }

    if (pages === totalPages) {
        btnRight.style.display = "none"
    } else {
        btnRight.style.display = "inline-block"
    }

    localStorage.setItem("news", news)
    localStorage.setItem("page", pages)
}







btnRight.addEventListener('click', function () {
    pages++
    fetchNews()
})

btnLeft.addEventListener('click', function () {
    if (pages > 1) {
        pages--
        fetchNews()
    }
})
