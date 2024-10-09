import express from "express";
import bcryt from 'bcrypt'
const router = express.Router();
import {User} from '../models/User.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'



const EMAIL = process.env.EMAIL
const EMAILPASSWORD = process.env.EMAILPASSWORD


router.post('/signup', async (req, res) => {
    const {username, email, password} = req.body;
    const user = await User.findOne(({email}))
    if(user){
        return res.json({message: "user already existed"})
    }

    const hashpassword = await bcryt.hash(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashpassword,
    })
    await newUser.save()
    return res.json({status: true, message: "record registed"})
})


router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.json({message: "user is not registered"})
    }

    const validPassword = await bcryt.compare(password, user.password)
    if(!validPassword){
        return res.json({message: "password is incorrect"})
    }

    const token = jwt.sign({username: user.username}, process.env.KEY, {expireIn: '1h'})
    res.cookie('token', token, {httpOnly: true, maxAge: 360000})
return res.json({status: true, message: "login successfully"})
})


router.post('/forgot-password', async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.json({message: "user not registered"})
        }

        const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: '1h' });
        var transporter = nodemailer.createTransport({
            service: '{EMAIL}',
            auth: {
                user: '{EMAIL}',
                pass: '{EMAILPASSWORD}'
            }
        });

        var mailOptions = {
            from: '',
            to: email,
            subject: 'Reset Pasword',
            text: `http://localhost:5173/resetPassword/${token}`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return res.json({message: "error sending email sent"})
            }else{
                return res.json({status: true, message: "email sent"})
            }
        })


    } catch (err) {
        console.log(err)
    }
})



router.post('/reset-password/:token', async (req, res) => {
    const {token} = req.params;
    const {passsword} = req.body
    try {
        const decoded = await jwt.verify(token, process.env.KEY);
        const id = decoded.id;
        const hashPassword = await ({_id: id}, {passsword: hashPassword})
        return res.json({status: true, message: "updated password"})
    } catch (error) {
        return res.json("invalid password")
    } 
})


const verifyUser = async (req, res, next) =>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.json({status: false, message: "no token"})
        }
        const decoded = await jwt.verify(token, process.env.KEY);
        next()
    } catch (error) {
        return res.json(error)
    }
}



router.get('/verify', (req, res) =>{
    return res.json({status: true, message: "authorized"})
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({status: true })
})


export {router as UserRouter}