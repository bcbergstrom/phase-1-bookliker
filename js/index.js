document.addEventListener("DOMContentLoaded", function() {
    const list = document.querySelector("ul#list")
    fetch("http://localhost:3000/books")
    .then((r) => r.json())
    .then((books) => {
        books.forEach((book)  =>{
            newBook(book)
        })
    });
});

function newBook(book){
    const listElement = document.createElement('li')
    listElement.textContent = book.title
    const userObj = {
        "id":1,
        "username":"pouros"
    }
    newBookPreview(book, userObj,listElement)
    list.append(listElement)

}

function newBookPreview(book, userObj,listElement){
    listElement.addEventListener("click",event => {
        const displayBooks = document.querySelector("div#show-panel")
        displayBooks.innerHTML = ""
        const bookLikeList = document.createElement("ul")
        bookLikeList.setAttribute("id","likeList")
        const bookImage = document.createElement("img")
        const bookDesc = document.createElement("p")
        const bookTitle = document.createElement("h1")
        const bookSubTitle = document.createElement("h2")
        const bookAuthor = document.createElement("h3")
        const bookLikes = renderReviews(book.users,bookLikeList);
        const button = document.createElement("button")
        let users = book.users
        bookImage.src = book.img_url
        bookTitle.textContent = book.title
        bookSubTitle.textContent = book.subtitle
        bookAuthor.textContent = book.author
        bookDesc.textContent = book.description
        button.textContent = "Delete/Add Like"
        button.addEventListener("click",event => {
            
            if(users.filter(user => user.id == userObj.id).length == 0){
                //append the user to the list
                users.push(userObj)
            } else {
                //pop the user from the lis
                users = users.filter(user => user.id != userObj.id)
            }
            fetch(`http://localhost:3000/books/${book.id}`,{
                method: "PATCH",
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    users:users
                })
            })
            .then(r => r.json())    
            .then(reviews => {
                bookLikeList.innerHTML = ""
                reviews.users.forEach((addToList) => {
                    const listAddition = document.createElement("li")
                    console.log(addToList.username)
                    listAddition.textContent = addToList.username
                    bookLikeList.append(listAddition)
            })
            users = reviews.users

        })

})
displayBooks.append(bookImage,bookTitle,bookSubTitle,bookAuthor, bookDesc,bookLikes, button)
})


}

function renderReviews(bookUsers, bookLikes){
    bookUsers.forEach((addToList) => {
        const bookLike = document.createElement("li")
        bookLike.textContent = addToList.username
        bookLikes.append(bookLike)
    })
    return bookLikes;
}