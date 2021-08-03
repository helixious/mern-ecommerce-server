import Express from "express";
import jwt from "jsonwebtoken";

import User from "../model/User";
import { SECRET } from "../../config";
const { oneOf, check, validationResult, checkSchema} = require("express-validator");
const bcrypt = require("bcryptjs");
const router = Express.Router();


// const checker = {
//     signup: {
        
//     }
// }

const authorizedOnly = (req, res, next) => {
    const protectedPaths = [
        "/active",
        "/profile",
        "/edit"
    ];

    let isProtected = protectedPaths.indexOf(req.path) != -1;
    if(!isProtected || (req.session && req.session.userId)) return next();

    res.status(403).send();
}

router.use(authorizedOnly);

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

router.post('/signout', async(req, res) => {
    console.log('signing out');
    req.session.destroy((err) => {
        console.log(err);
    })
    res.send('OK');
})

router.post(
    "/edit", 
    [
        oneOf([
            check("password", "Enter Password with 6 characters or more").exists().isLength({ min:6 }),
            check("password").not().exists()
        ]),
        // check('email', 'email change not allowed').not().exists()
    ]
    ,
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        try {
            let { username, password } = req.body;
            const { userId } = req.session;

            let salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            let user = await User.findOneAndUpdate( { _id : userId }, { username, password },{
                new: false,
                upsert: false
            });

            let success = res.value instanceof User === false
            res.status(200).json({success});
        } catch(e) {
            console.log(e)
            res.status(500).json({
                message: "Server Error"
            });
        }
        
        
    }

)

router.post(
    "/signup",
    [
        check("username", "username").not().isEmpty(),
        check("email", "email").isEmail(),
        check("password", "password").isLength({ min:6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        
        try {
            let {firstName, lastName, username, email, password} = req.body;
            let user = await User.findOne({
                email
            });

            let emailVerified = false;

            if(user) {
                return res.status(400).json({
                    message: "User already exists"
                })
            }

            let salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            user = new User({firstName, lastName, username, email, password, emailVerified});
            await user.save();

            req.session.userId = user.id;

            let payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }

            // user = {id, username, email} = user;

            jwt.sign(
                payload,
                SECRET,
                {expiresIn: 36e5},
                (err, token) => {
                    if(err) throw err;
                    res.status(200).json({
                        token,
                        user
                    });
                }
            );
        } catch(e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            })
        }
    }
)

router.post(
    "/signin",
    [
        check("email", "email").isEmail(),
        check("password", "Enter Password with 6 characters or more").isLength({ min:6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        try {
            let {email, password} = req.body;
            let user = await User.findOne({email});
            if(!user) return res.status(401).json({message: "User does not exist"});

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(401).json({message: "Incorrect password"});
            req.session.userId = user.id;
            user = {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }

            jwt.sign(
                user,
                SECRET,
                {expiresIn: 36e5},
                (err, token) => {
                    if(err) throw err;
                    res.status(200).json({
                        token,
                        user
                    });
                }
            );

        } catch(e) {
            console.error(e);
            res.status(500).json({
                message: "Server Error"
            })
        }
    }
)

export default router;