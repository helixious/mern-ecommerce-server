import Express from "express";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

import User from "../model/User";
import Product from "../model/Product";
import { SECRET } from "../../config";
import { DBConnector } from "../config/db.config";
const { oneOf, check, validationResult, checkSchema, param} = require("express-validator");
const bcrypt = require("bcryptjs");
const router = Express.Router();

let queryLimit = 5;
let userQueryLimit = 5;

function onlyValidUniqueIds(value, index, self) {
    return self.indexOf(value) === index && ObjectId.isValid(value);
}

const adminCheck = async(userId) => {
    let users = await User.find({
        '_id': userId,
        'role': 'admin'
    });
    return users.length > 0;
}

function noNull(value, index, self) {
    return value !== null;
}
//create, update, delete

const authorizedOnly = (req, res, next) => {
    const protectedPaths = [
        "/create",
        "/update",
        "/delete"
    ];

    let isProtected = protectedPaths.indexOf(req.path) != -1;
    if(!isProtected || (req.session && req.session.userId)) return next();

    res.status(403).send();
};

router.use(authorizedOnly);

router.get('/:productIds', [
    param('productIds').default(null).customSanitizer( value => {
        return value.split(/ ,|, |,/g)
            .filter(onlyValidUniqueIds)
            .map(id => ObjectId(id));
    }),
    param('productIds', "invalid / missing productIds").notEmpty(),
    param('productIds', `exceeds limit of ${queryLimit}`).isArray({max:queryLimit})
], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    let userId = req.session.userId && ObjectId.isValid(req.session.userId) ? ObjectId(req.session.userId) : false;
    let isAdmin = await adminCheck(userId);

    if(isAdmin) {
        let products = await Product.find( {
            '_id': {
                $in: req.params.productIds
            }
        });
        res.json(products);
    } else {
        let products = await Product.find( {
            '_id': {
                $in: req.params.productIds
            },
            'visible': true 
        });
        res.json(products);
    }
});

router.get('/active', async(req, res) => {
    return res.status(200).json({active:1});
});

router.get('/profile', async(req, res) => {
    const { userId } = req.session;
    let user = await User.findById(userId);
    if(!user) return res.status(400).send();

    let {id=_id, username, email, createdAt} = user;
    return res.status(200).json({id, createdAt, username, email});
    
});

router.get('/posts', async(req, res) => {

})

router.post('/signout', async(req, res) => {
    console.log('signing out');
    req.session.destroy((err) => {
        console.log(err);
    })
    res.send('OK');
})

router.post(
    "/edit/:productId",
    [
        param('user', "no ownership change allowed").isEmpty(),
        param('productId').default(null).customSanitizer( value => {
            return value.split(/ ,|, |,/g)
                .filter(onlyValidUniqueIds)
                .map(id => ObjectId(id));
        }),
        param('productId', "invalid / missing productId").notEmpty(),
        param('productId', `must have 1 productId `).isArray({min:1, max:1})
    ],
    async(req, res) => {

        let sessionUserId = req.session.userId && ObjectId.isValid(req.session.userId) ? ObjectId(req.session.userId) : false;
        let productId = req.params.productId[0];
        let isAdmin = await adminCheck(sessionUserId);

        if(isAdmin) {
            let product = await Product.updateOne(
                {_id: productId},
                req.body
            );
            res.json(product);
        } else {
            let product = await Product.updateOne(
                {_id: productId, user: sessionUserId},
                req.body
            );
            res.json(product);
        }
    }
)

router.post(
    "/create",
    [
        check("price", "price").exists(),
        check("productId", "productId").not().exists(),
        check("title", "title").exists().isLength( { min:3 }),
        check("description", "description").exists().isLength( {min:20}),
        check("type", "type").exists(),
        check("location", "location").exists(),
        check("ingredients", "ingredients").exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        try {
            console.log('adding new product');
            let {title, description, type, price, location, ingredients} = req.body;
            let user = req.session.userId;
            let product = new Product({ user, title, description, type, price, location, ingredients});
            await product.save();
            res.status(200).json(product);
        } catch(e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            })
        }
    }
);

router.get("/all", async (req, res) => {
    let userId = req.session.userId && ObjectId.isValid(req.session.userId) ? ObjectId(req.session.userId) : false;
    let isAdmin = await adminCheck(userId);

    const products = isAdmin ? await Product.find() : await Product.find({visible:true});
    res.json(products);
});

router.get("/", async (req, res) => {
    let userId = req.session.userId && ObjectId.isValid(req.session.userId) ? ObjectId(req.session.userId) : false;
    let isAdmin = await adminCheck(userId);

    const products = isAdmin ? await Product.find() : await Product.find({visible:true});
    res.json(products);
});

router.get(
    "/user/:userIds",
    [
        param('userIds').default(null).customSanitizer( value => {
            return value.split(/ ,|, |,/g)
                .filter(onlyValidUniqueIds)
                .map(id => ObjectId(id));
        }),
        param('userIds', "invalid / missing userIds").notEmpty(),
        param('userIds', `exceeds limit of ${userQueryLimit}`).isArray({max:userQueryLimit})
    ],
    async (req, res) => {
        let products = [];
        let sessionUserId = req.session.userId && ObjectId.isValid(req.session.userId) ? ObjectId(req.session.userId) : false;
        let isAdmin = await adminCheck(sessionUserId);

        if (isAdmin) {
            products = await Product.find({
                'user': {
                    $in: req.params.userIds
                }
            });
            res.json(products);
        } else {
            products = await Product.find({
                'user': {
                    $in: req.params.userIds
                },
                'visible': true
            });
            res.json(products);
        }
    }
)

export default router;