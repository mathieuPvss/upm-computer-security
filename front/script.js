let currentPage = 1;
const limit = 10;
const maxVisiblePages = 5;

function loadArticles(page = 1) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch(`http://localhost:8000/articles?page=${page}&limit=${limit}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
            const articlesList = document.getElementById("articles-list");
            articlesList.innerHTML = "";

            data.articles.forEach((article) => {
                const listItem = document.createElement("li");
                const link = document.createElement("a");

                link.href = `./article/index.html?id=${article.id}`;
                link.textContent = article.heading;

                listItem.appendChild(link);
                articlesList.appendChild(listItem);
            });

            updatePagination(data.page, data.total, data.limit);
        })
        .catch((error) => console.error("Error fetching articles:", error));
}

function updatePagination(currentPage, totalItems, limit) {
    const totalPages = Math.ceil(totalItems / limit);
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // button "Previous"
    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "←";
        prevButton.addEventListener("click", () => loadArticles(currentPage - 1));
        paginationContainer.appendChild(prevButton);
    }

    // Buttons visible pages
    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.disabled = i === currentPage;
        button.addEventListener("click", () => loadArticles(i));
        paginationContainer.appendChild(button);
    }

    // button "next"
    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "→";
        nextButton.addEventListener("click", () => loadArticles(currentPage + 1));
        paginationContainer.appendChild(nextButton);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadArticles(currentPage);
});
