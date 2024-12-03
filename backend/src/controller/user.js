import {User} from '../data/entity/User.js';
import {AppDataSource} from '../data/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {CustomError} from "../middleware/CustomError.js";

const saltRounds = 10;
const SECRET = '1234';
const userRepository = AppDataSource.getRepository("User");

function asyncCompare(passedPasswd, userPasswd){
    return new Promise((resolve, reject) => {
       bcrypt.compare(passedPasswd, userPasswd, (err, data) => {
           if (err){
             reject(err);
           }else if(data){
               resolve(true);
           }else{
               reject(new CustomError(403, '>>> ERROR : User - Incorrect User or Password.'));
           }
       });
    });
}

function asyncCrypt(passedPasswd) {
    return new Promise((resolve, reject) => {
       bcrypt.hash(passedPasswd, saltRounds, (err, data) => {
           if(err){
               reject(err);
           }else{
               resolve(data);
           }
       });
    });
}

export async function connectUser(userEmail, passedPasswd){
    try{
        let user = await userRepository.find({
            where: {email: userEmail},
        })
        const data = await asyncCompare(passedPasswd, user ? user[0]?.password ?? "" : "");
        return jwt.sign({...user}, SECRET);
    }catch (e) {
        throw new CustomError(500, 'controller/user.js - connectUser - ' + e.message);
    }
}

export async function createUser(userEmail, firstName, lastName, userPasswd) {
    try{

        let existingUser = await userRepository.findOne({
            where: {email: userEmail}
        });

        console.log(">>> USER CONTENT START");
        console.log(existingUser);
        console.log(">>> USER CONTENT END");

        if(! existingUser){
            let user = {
                email: userEmail,
                firstName: firstName,
                lastName: lastName,
                password: await asyncCrypt(userPasswd),
            };

        console.log(user);
        userRepository
            .save(user)
            .then(function(){
                console.log('>>> INFO : User successfully created.');
            });
        }else{
            throw new CustomError(400, 'controller/user.js - createUser - An account with this user already exists.');
        }

    }catch (e) {
        console.error('>>> ERROR : Error while creating the user.');
        throw new CustomError(400, 'controller/user.js - createUser - ' + e.message);
    }
}