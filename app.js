const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');

const mongoose = require('mongoose');
const User = require('./models/user');

//set template engine to EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

//add this to make public folder available to serve static files, like css
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5e49b4c469ac8e20ab195a16')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})

app.use(bodyParser.urlencoded({exteneded: false}));
app.use(shopRoutes);
app.use('/admin', adminRoutes);
/*
app.get('/test', (req, res, next) => {
    res.send('<h1>testing</h1>');
});

app.get('/', (req, res, next) => {
    res.send('<h1>hello</h1>');
});
*/

mongoose
    .connect(
        'mongodb+srv://macho:7EfwuOmBNUmbjG2T@cluster0-gconm.mongodb.net/test?retryWrites=true&w=majority'
    )
    .then(
        result => {
            User.findOne().then(user => {
                if (!user) {
                    const user = new User({
                        name: "Michal",
                        email: "michal.machovic@gmail.com",
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            });
            app.listen(3000);
        }
    )
    .catch(
        error => {
            console.log(error);
        }
    )
