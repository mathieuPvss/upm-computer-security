const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");

if (!articleId) {
    alert("No article ID provided in URL.");
    throw new Error("Missing article ID.");
}

const requestOptions = {
    method: "GET",
    redirect: "follow"
};

// get article
fetch(`http://localhost:8000/article?id=${articleId}`, requestOptions)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Error when retrieving the article.");
        }
        return response.json();
    })
    .then((article) => {
        document.getElementById("heading").textContent = article[0].heading;
        document.getElementById("date").textContent = `Date : ${article[0].date}`;
        document.getElementById("newstype").textContent = `Type : ${article[0].newstype}`;
        document.getElementById("content").textContent = article[0].article;
    })
    .catch((error) => {
        console.error("Erreur :", error);
        alert("Unable to load article.");
    });

// fetch comments
fetch(`http://localhost:8000/comments?article_id=${articleId}`, { method: "GET" })
    .then((response) => response.json())
    .then((comments) => {
        const commentsList = document.getElementById("comments-list");

        comments.forEach((comment) => {
            const listItem = document.createElement("div");
            listItem.innerHTML = `<strong>${new Date(comment.comment_date).toLocaleDateString()}</strong>: ${comment.content}`;
            commentsList.appendChild(listItem);

            // need to do this cause the baliase script is not executed
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = comment.content;
            const scriptTags = tempDiv.querySelectorAll("script");

            scriptTags.forEach((script) => {
                const newScript = document.createElement("script");

                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            });
        });
    })
    .catch((error) => {
        console.error("Error retrieving comments :", error);
    });

// Function to clean the content
function cleanContent(content) {
    const div = document.createElement("div");
    div.textContent = content;
    return div.innerHTML;
}

// add new comment
const commentForm = document.getElementById("comment-form");
const protectionServerSideSwitch = document.getElementById("protection-switch-server");
const protectionClientSideSwitch = document.getElementById("protection-switch-client");

commentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let commentContent = document.getElementById("comment-content").value;

    if (!commentContent.trim()) {
        alert("The comment cant be empty.");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // if the protection client side switch is on, clean the content
    if (protectionClientSideSwitch.checked) {
        commentContent = cleanContent(commentContent);
    }

    const raw = JSON.stringify({
        article_id: articleId,
        content: commentContent
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    const apiUrl = protectionServerSideSwitch.checked
        ? "http://localhost:8000/commentsClean"
        : "http://localhost:8000/comments";

    fetch(apiUrl, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error adding comment.");
            }
            return response.text();
        })
        .then(() => {
            alert("Comment successfully added!");
            location.reload();
        })
        .catch((error) => {
            console.error("Error adding comment :", error);
            alert("Unable to add comment.");
        });
});