function http () {
    return {
        get(url,cd) {
            try{
                const xhr = new XMLHttpRequest();
                xhr.open("GET", url)
                xhr.addEventListener("load", () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cd(`Error. Status code ${xhr.status}`);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText)
                    cd(null,response)
                })
                xhr.send()
            }catch(error) {
                cd(error)
            } 
        },
        post (url,body,headers,cd) {
            try{
                const xhr = new XMLHttpRequest();
                xhr.open("POST", url)
                xhr.addEventListener("load", () => {
                    if (Math.floor(xhr.status / 100) !== 2) {
                        cd(`Error. Status code ${xhr.status}`);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText)
                    cd(null,response)
                })
                xhr.send(JSON.stringify(body));
            }catch(error) {
                cd(error)
            } 
        }
    }
}

const myHttp = http();

const newsService = (function(){
    const apiKey = 'fe034206a33743d8b1423044c5589476',
          apiUrl = 'https://newsapi.org/v2/';

    return {
        topHeadlines(country = 'ru',cd) {
            myHttp.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`,cd)  
        },
        everything(query,cd) {
            myHttp.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`,cd) 
        }
    }
}())

document.addEventListener("DOMContentLoaded", () => {
    loadNews();
})

function loadNews() {
    newsService.topHeadlines('ru',onGetResponse)
}

function onGetResponse(err,res) {
    renderNews(res.articles)
}

function renderNews(news) {
    const newsContainer = document.querySelector(".news__content");
    let fragment = '';
    news.forEach(newsItem => {
        const el = newTemplate(newsItem)
        fragment += el
    });
    newsContainer.insertAdjacentHTML('afterbegin',fragment)
}

function newTemplate({urlToImage,title,url,description}) {
    return `
        <div class="card__news">
            <div class="card__image">
                <img src="${urlToImage}">
                <h3 class="card__title">${title || ''}</h3>
            </div>
            <div class="card__body">
                <p>${description}</p>
            </div>
            <div class="card__action">
            <a href="${url}">Читать больше....</a>
            </div>
        </div>
    `
}
