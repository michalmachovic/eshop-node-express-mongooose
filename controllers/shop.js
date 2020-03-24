const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('product-add', {
        pageTitle: 'Add product',
        path: '/'
    });
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(
        {
            title: req.body.title,
            description: req.body.description, 
            price: req.body.price, 
            imageUrl: req.body.imageUrl,
            userId: req.user._id
        }
    );
    product.save();
    res.redirect('/');
}

exports.getProducts =  (req, res, next) => {
    Product.find()
        .populate('userId')
        .then(products => {
            console.log(products);
            res.render('shop', {
                products: products,
                pageTitle: 'shop',
                path: '/',
                hasProducts: products.length > 0,
                activeShop: true
            });
        });
}

exports.getProduct = (req, res, next) => {
    Product.findById(req.params.productId)
        .then(product => {
            res.render('product', {
                product: product,
                pageTitle: 'product'
            });
        });
}

exports.getEditProduct = (req, res, next) => {
    Product.findById(req.params.productId)
        .then(product => {
            res.render('product-edit', {
                product: product,
                pageTitle: 'product'
            });
        });
}

exports.postUpdateProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;
        return product.save();
    })
    .then(result => {
        console.log("UPDATED PRODUCT");
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.fetchById(prodId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    })
}

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart',{
                path: '/cart',
                pageTitle: 'Your cart',
                products: products
            })
        });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(error => {
            console.log(error);
        })
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(error => {
            console.log(error);
        })
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(error => console.log(error));
}