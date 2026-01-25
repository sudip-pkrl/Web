// =======================
// DATA MODELS
// =======================
class Book {
    constructor(id, title, author, category, copies) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.category = category;
        this.totalCopies = copies;
        this.availableCopies = copies;
        this.timesBorrowed = 0;
    }
}

class Member {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.borrowedBooks = {};
    }
}

// =======================
// STORAGE
// =======================
let books = JSON.parse(localStorage.getItem("books")) || {};
let members = JSON.parse(localStorage.getItem("members")) || {};

function saveData() {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("members", JSON.stringify(members));
}

// =======================
// DARK MODE
// =======================
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// =======================
// MENU LOGIC
// =======================
function showSection(type) {
    const c = document.getElementById("content");

    if (type === "addBook") {
        c.innerHTML = `
        <h3>1. Add Book</h3>
        <input id="bid" placeholder="Book ID">
        <input id="title" placeholder="Title">
        <input id="author" placeholder="Author">
        <input id="category" placeholder="Category">
        <input id="copies" type="number" placeholder="Copies">
        <button onclick="addBook()">Add Book</button>`;
    }

    if (type === "listBooks") listBooks();

    if (type === "searchBook") {
        c.innerHTML = `
        <h3>3. Search Book</h3>
        <input id="key" placeholder="Keyword">
        <button onclick="searchBook()">Search</button>
        <div id="result"></div>`;
    }

    if (type === "addMember") {
        c.innerHTML = `
        <h3>4. Register Member</h3>
        <input id="mid" placeholder="Member ID">
        <input id="mname" placeholder="Member Name">
        <button onclick="addMember()">Register</button>`;
    }

    if (type === "listMembers") listMembers();

    if (type === "issueBook") {
        c.innerHTML = `
        <h3>6. Issue Book</h3>
        <input id="imid" placeholder="Member ID">
        <input id="ibid" placeholder="Book ID">
        <button onclick="issueBook()">Issue</button>`;
    }

    if (type === "returnBook") {
        c.innerHTML = `
        <h3>7. Return Book</h3>
        <input id="rmid" placeholder="Member ID">
        <input id="rbid" placeholder="Book ID">
        <button onclick="returnBook()">Return</button>`;
    }
}

// =======================
// CORE FUNCTIONS
// =======================
function addBook() {
    const bid = document.getElementById("bid").value.trim();
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const category = document.getElementById("category").value.trim();
    const copies = parseInt(document.getElementById("copies").value);

    if (!bid || !title || !author || !category || !copies) return alert("Fill all fields");
    if (books[bid]) return alert("Book exists");

    books[bid] = new Book(bid, title, author, category, copies);
    saveData();
    alert("Book added successfully");
}

function listBooks() {
    let out = "2. List Books\n\n";
    for (let b of Object.values(books)) {
        out += `${b.id} | ${b.title} | ${b.availableCopies}/${b.totalCopies}\n`;
    }
    document.getElementById("content").textContent = out || "No books available";
}

function searchBook() {
    const key = document.getElementById("key").value.trim().toLowerCase();
    let out = "";

    for (let b of Object.values(books)) {
        if (b.title.toLowerCase().includes(key) ||
            b.author.toLowerCase().includes(key) ||
            b.category.toLowerCase().includes(key)) {
            out += `${b.title} (${b.availableCopies} available)\n`;
        }
    }
    document.getElementById("result").textContent = out || "No match found";
}

function addMember() {
    const mid = document.getElementById("mid").value.trim();
    const mname = document.getElementById("mname").value.trim();
    if (!mid || !mname) return alert("Fill all fields");
    if (members[mid]) return alert("Member exists");

    members[mid] = new Member(mid, mname);
    saveData();
    alert("Member registered");
}

function listMembers() {
    let out = "5. List Members\n\n";
    for (let m of Object.values(members)) {
        out += `${m.id} | ${m.name} | Borrowed: ${Object.keys(m.borrowedBooks).length}\n`;
    }
    document.getElementById("content").textContent = out || "No members found";
}

function issueBook() {
    const mid = document.getElementById("imid").value.trim();
    const bid = document.getElementById("ibid").value.trim();

    let m = members[mid];
    let b = books[bid];

    if (!m || !b) return alert("Member or Book not found");
    if (b.availableCopies <= 0) return alert("No copies available");

    b.availableCopies--;
    b.timesBorrowed++;

    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(issueDate.getDate() + 14);
    m.borrowedBooks[b.id] = { issueDate: issueDate.toDateString(), dueDate: dueDate.toDateString() };

    saveData();
    alert(`Book issued! Due date: ${dueDate.toDateString()}`);
}

function returnBook() {
    const mid = document.getElementById("rmid").value.trim();
    const bid = document.getElementById("rbid").value.trim();

    let m = members[mid];
    let b = books[bid];

    if (!m || !b) return alert("Member or Book not found");
    if (!m.borrowedBooks[b.id]) return alert("Book not borrowed by this member");

    const today = new Date();
    const due = new Date(m.borrowedBooks[b.id].dueDate);
    let fine = 0;
    if (today > due) {
        const diffDays = Math.ceil((today - due) / (1000*60*60*24));
        fine = diffDays * 5;
        alert(`Book returned late! Fine: ${fine}`);
    }

    delete m.borrowedBooks[b.id];
    b.availableCopies++;
    saveData();
    alert("Book returned successfully");
}

// =======================
// REPORTS & CHARTS
// =======================
function showReports() {
    let out = "8. Reports\n\nBorrowed Books:\n";
    for (let m of Object.values(members)) {
        for (let id in m.borrowedBooks) {
            out += `${id} borrowed by ${m.name}\n`;
        }
    }
    document.getElementById("content").textContent = out || "No borrowed books";
    showChart();
}

function showStatistics() {
    let total = 0, available = 0;
    for (let b of Object.values(books)) {
        total += b.totalCopies;
        available += b.availableCopies;
    }
    document.getElementById("content").textContent = `9. Statistics\n\nTotal: ${total}\nAvailable: ${available}\nBorrowed: ${total - available}`;
    showChart();
}

function showHelp() {
    document.getElementById("content").textContent = `10. Help

1. Add Book
2. List Books
3. Search Book
4. Register Member
5. List Members
6. Issue Book
7. Return Book
8. Reports
9. Statistics
10. Help

Additional Features:
- Dark/Light Mode Toggle
- Due Date & Fine Calculation
- Charts for visual reports`;
}

function showChart() {
    document.getElementById("chartSection").style.display = "block";

    const borrowed = Object.values(books).reduce((acc,b) => acc + (b.totalCopies-b.availableCopies),0);
    const available = Object.values(books).reduce((acc,b) => acc + b.availableCopies,0);

    const ctx = document.getElementById('libraryChart').getContext('2d');
    if(window.libraryChart) window.libraryChart.destroy();

    window.libraryChart = new Chart(ctx,{
        type: 'doughnut',
        data: {
            labels:['Borrowed','Available'],
            datasets:[{
                data:[borrowed,available],
                backgroundColor:['#ef4444','#10b981']
            }]
        },
        options: {
            responsive:true,
            plugins:{legend:{position:'bottom'}}
        }
    });
}
