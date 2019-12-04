const BOOK_STACKS = 6;
const BOOKS_PER_STACK = 4;
const OUTER_STARS_HEIGHT = 50;
const MAX_RATING = 5;

let bookShelf = new Array(BOOK_STACKS).fill(null).map((v) => Array(0));

class BookTitle extends HTMLElement {
    constructor() {
        super();
    }
}

class BookAuthor extends HTMLElement {
    constructor() {
        super();
    }
}

customElements.define('book-title',BookTitle);
customElements.define('book-author',BookAuthor);

var Book = function(title,author,numPages = '',hasRead = false,summary = '',rating = 1) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.hasRead = hasRead;
    this.summary = summary;
    this.rating = rating;
}

var createRandomNum = function(min,max) {
    return Math.random() * (max - min) + min;
}

var randomizeBookType = function(types,weights) {
    let totalWeight = weights.reduce((sum,currVal) => sum += currVal,0);
    let weightSum = 0;
    let randomNum = createRandomNum(0,totalWeight);

    for(let i = 0; i < weights.length; i++) {
        weightSum += +weights[i].toFixed(2);

        if(randomNum <= weightSum) {
            return types[i];
        }
    }
}

var getBookRating = function(rating_selectors) {
    for(let rating of rating_selectors) {
        if(rating.checked === true) {
            return rating.value;
        }
    }

    return 1;
}

var parseID = function(idString) {
    let location = {type: null, stack: null, book: null};

    let temp = idString.split('-');

    if(temp[0] === 's') {
        location.type = 's';
        location.stack = temp[1];
    } else {
        location.type = 'b';

        temp = temp[1].split('_');
        location.stack = temp[0];
        location.book = temp[1];
    }

    return location;
}

var addBookToShelf = function(book,stackID) {
    let bookType = randomizeBookType([1,2,3,4],[.15,.15,.35,.35]);

    let newBook = document.createElement('div');
    let newBookID = bookShelf[stackID].length - 1;

    newBook.id = 'b-' + stackID + '_' + newBookID;
    newBook.classList.add('book');
    newBook.classList.add(`book_type${bookType}`);

    let newBookTitle = document.createElement('book-title');
    let newBookAuthor = document.createElement('book-author');
    newBookTitle.innerText = book.title;
    newBookAuthor.innerText = book.author;

    let newBookOuterStars = document.createElement('div');
    let newBookInnerStars = document.createElement('div');
    newBookOuterStars.classList.add('stars_wrapper');
    newBookInnerStars.classList.add('stars_inner');
    newBookOuterStars.appendChild(newBookInnerStars);

    let bookDelButton = document.createElement('a');
    bookDelButton.classList.add('delete_book');
    bookDelButton.addEventListener('click',(event) => {
        event.stopPropagation();
        bookDelButton.parentNode.remove();
        bookShelf[stackID].splice(newBookID,1);
    });

    newBook.appendChild(newBookTitle);
    newBook.appendChild(newBookAuthor);
    newBook.appendChild(newBookOuterStars);
    newBook.appendChild(bookDelButton);

    newBook.addEventListener('click',(event) => {
        event.stopPropagation();
        editFormTitle.innerText = 'Update Book';
        selectedElement.value = newBook.id;

        bookTitle.value = book.title;
        bookAuthor.value = book.author;
        bookPages.value = book.numPages;
        bookSummary.value = book.summary;
        hasRead.checked = book.hasRead;
        bookRating[book.rating - 1].checked = true;

        editForm.classList.add('show');
    });

    let stack = document.querySelector(`#s-${stackID}`);
    stack.prepend(newBook);

    newBookInnerStars.style.height = OUTER_STARS_HEIGHT * book.rating / MAX_RATING + 'px';
}

var updateBook = function(book,bookID) {
    let bookSelector = document.querySelector(`#${bookID}`);

    let bookTitle = bookSelector.getElementsByTagName('book-title')[0];
    bookTitle.innerText = book.title;

    let bookAuthor = bookSelector.getElementsByTagName('book-author')[0];
    bookAuthor.innerText = book.author;

    let bookRating = bookSelector.querySelector('.stars_inner');
    bookRating.style.height = OUTER_STARS_HEIGHT * book.rating / MAX_RATING + 'px';
}


let selectedElement = document.querySelector('#selected');
let editForm = document.querySelector('#edit_form');
let editFormTitle = document.querySelector('#edit_form_title');
let bookTitle = document.querySelector('#book_title');
let bookAuthor = document.querySelector('#book_author');
let bookPages = document.querySelector('#book_pages');
let bookSummary = document.querySelector('#book_summary');
let bookRating = document.getElementsByName('book_rating');
let hasRead = document.querySelector('#has_read');



let cancelButton = document.querySelector('#cancel');
cancelButton.addEventListener('click',() => {
    editForm.classList.remove('show');
});

let stacks = document.querySelectorAll('.shelf_stack');
stacks.forEach((stack) => {
    stack.addEventListener('click',() => {
        editForm.reset();
        selectedElement.value = stack.id;
        editFormTitle.innerText = 'New Book';
        editForm.classList.add('show');
    });
});

editForm.addEventListener('submit',(event) => {
    event.preventDefault();
    let instructions = selectedElement.value.split('-');
    
    if(instructions.length > 0) {
        let action = instructions[0];
        let actionID = instructions[1];

        if(action === 's') {
            if(bookShelf[+actionID].length === BOOKS_PER_STACK) {
                alert('Sorry, that stack is full.');
            } else {
                let newBook = new Book(bookTitle.value,
                    bookAuthor.value,
                    bookPages.value,
                    hasRead.checked,
                    bookSummary.value,
                    getBookRating(bookRating));

                bookShelf[+actionID].push(newBook);

                addBookToShelf(newBook,+actionID)
            }
        } else if(action === 'b') {
            let bookLocation = actionID.split('_');
            let shelfID = bookLocation[0];
            let bookID = bookLocation[1];

            bookShelf[shelfID][bookID].title = bookTitle.value;
            bookShelf[shelfID][bookID].author = bookAuthor.value;
            bookShelf[shelfID][bookID].numPages = bookPages.value;
            bookShelf[shelfID][bookID].hasRead = hasRead.checked;
            bookShelf[shelfID][bookID].summary = bookSummary.value;
            bookShelf[shelfID][bookID].rating = getBookRating(bookRating);

            updateBook(bookShelf[shelfID][bookID],`b-${shelfID}_${bookID}`);
        }

        editForm.reset();
        editForm.classList.remove('show');
    }

});

let bookTest = new Book('Code: The Hidden Language of Computer Hardware and Software and a bunch of','Charles Petzold');
bookShelf[0].push(bookTest);
addBookToShelf(bookTest,0);
bookTest = new Book('The Hidden Language of Computer','Robert C. Martin',340,true,'',5);
bookShelf[0].push(bookTest);
addBookToShelf(bookTest,0);
bookTest = new Book('Clean Code','Robert C. Martin',200,false,'',1);
bookShelf[1].push(bookTest);
addBookToShelf(bookTest,1);
bookTest = new Book('Clean Code','Robert C. Martin',500,true,'so boring',5);
bookShelf[1].push(bookTest);
addBookToShelf(bookTest,1);
bookTest = new Book('Code:','Robert C. Martin');
bookShelf[2].push(bookTest);
addBookToShelf(bookTest,2);

