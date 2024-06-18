let addpopup = document.getElementById("add-popup-button");
let overlay = document.querySelector(".popup-overlay");
let overlaypopup = document.querySelector(".overlay-popup");
let container = document.getElementById("books-container");
let addbook = document.getElementById("add-book");
let booktitleinput = document.getElementById("book-title-input");
let bookauthorinput = document.getElementById("book-author-input");
let shortdescriptioninput = document.getElementById("short-description-input");
let bookimageinput = document.getElementById("book-image-input");
let currentEditBook = null;

window.addEventListener('load', function() {
    let books = JSON.parse(localStorage.getItem('books'));
    if (books) {
        books.forEach(function(book) {
            addNewBookFromStorage(book);
        });
    }
});

addpopup.addEventListener("click", function() {
    overlay.style.display = "block";
    overlaypopup.style.display = "block";
    currentEditBook = null;
    clearInputs();
});

document.getElementById("cancel-popup").addEventListener("click", function(event) {
    event.preventDefault();
    overlay.style.display = "none";
    overlaypopup.style.display = "none";
    clearInputs();
});

addbook.addEventListener("click", async function(event) {
    event.preventDefault();
    if (currentEditBook) {
        updateBook(currentEditBook);
    } else {
        await addNewBook();
    }
    overlay.style.display = "none";
    overlaypopup.style.display = "none";
    clearInputs();
    saveBooksToStorage();
});

async function addNewBook() {
    let book = {
        title: booktitleinput.value,
        author: bookauthorinput.value,
        description: shortdescriptioninput.value,
        image: bookimageinput.files[0] ? await convertToDataURL(bookimageinput.files[0]) : null
    };
    let div = createBookDiv(book);
    container.append(div);
}

function addNewBookFromStorage(book) {
    let div = createBookDiv(book);
    container.append(div);
}

function updateBook(bookDiv) {
    bookDiv.querySelector("h2").innerText = booktitleinput.value;
    bookDiv.querySelector("h5").innerText = bookauthorinput.value;
    bookDiv.querySelector("p").innerText = shortdescriptioninput.value;
    // Update image if a new one is provided
    if (bookimageinput.files[0]) {
        bookDiv.querySelector("img").src = URL.createObjectURL(bookimageinput.files[0]);
    }
}

function deletebook(event) {
    event.target.parentElement.remove();
    saveBooksToStorage();
}

function editBook(event) {
    overlay.style.display = "block";
    overlaypopup.style.display = "block";
    currentEditBook = event.target.parentElement;
    booktitleinput.value = currentEditBook.querySelector("h2").innerText;
    bookauthorinput.value = currentEditBook.querySelector("h5").innerText;
    shortdescriptioninput.value = currentEditBook.querySelector("p").innerText;
  
}

function saveBooksToStorage() {
    let books = [];
    let bookDivs = document.querySelectorAll('.box-container');
    bookDivs.forEach(function(bookDiv) {
        let book = {
            title: bookDiv.querySelector("h2").innerText,
            author: bookDiv.querySelector("h5").innerText,
            description: bookDiv.querySelector("p").innerText,
            image: bookDiv.querySelector("img") ? bookDiv.querySelector("img").src : null
        };
        books.push(book);
    });
    localStorage.setItem('books', JSON.stringify(books));
}

function clearInputs() {
    booktitleinput.value = "";
    bookauthorinput.value = "";
    shortdescriptioninput.value = "";
    bookimageinput.value = "";
}

function createBookDiv(book) {
    let div = document.createElement("div");
    div.setAttribute("class", "box-container");
    div.innerHTML = `<h2>${book.title}</h2>
        <h5>${book.author}</h5>`;
    
    if (book.image) {
        let img = document.createElement("img");
        img.src = book.image;
        img.alt = "Book Cover";
        img.classList.add('book-image');
        div.appendChild(img);
    }

    div.innerHTML += `<p>${book.description}</p>
        <button class="delete-button" onclick="deletebook(event)">Delete</button>
        <button class="edit-button" onclick="editBook(event)">Edit</button>`;
    return div;
}

async function convertToDataURL(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
