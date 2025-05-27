import express from "express";
import { create } from "express-handlebars";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

//nhi
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

//const books = JSON.parse(fs.readFileSync("./public/library.json", "utf-8"));

const books = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'library.json'), "utf-8"));



const hbs = create({
    helpers: {
        formatDate: function (dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        stars: function (rating) {
            if (!rating) return '';
            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += i < rating ? '★' : '☆';
            }
            return stars;
        }
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'public')));


// Main feed route
app.get('/', (req, res) => {
    res.render('feed', { books });
});

app.get('/reviews/:bookId', (req, res) => {
    const bookId = parseInt(req.params.bookId);
    const book = books.find(b => b.book_id === bookId);

    if (!book) {
        return res.status(404).render('404', { message: 'Book not found' });
    }

    // Transform reviews with formatted dates
    const transformedReviews = book.reviews ? book.reviews.map(review => {
        const reviewDate = new Date(review.review_date);
        const formattedDate = reviewDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return {
            ...review,
            formatted_date: formattedDate,
            stars: '★'.repeat(review.review_rating) + '☆'.repeat(5 - review.review_rating),
            avatar: getRandomAvatar()
        };
    }) : [];

    res.render('reviews', {
        book: {
            ...book,
            reviews: transformedReviews,
            link: `https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.author)}`
        }
    });
});


// Default reviews route (first book)
app.get('/reviews', (req, res) => {
    res.redirect(`/reviews/${books[0].book_id}`);
});





function getRandomAvatar() {
    const avatars = [
        "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(2).webp",
        "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(31).webp",
        "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp"
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);

    // Debug: List all routes after server is ready
    console.log('Available routes:');
    app._router.stack.forEach((r) => {
        if (r.route && r.route.path) {
            console.log(r.route.path);
        }
    });
});
