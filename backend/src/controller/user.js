const User = require('../data/entity/User');
const AppDataSource = require('../data/connection.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {CustomError} = require("../middleware/CustomError");

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
        let user = userRepository.find({
            where: {email: userEmail},
        })

        const data = await asyncCompare(passedPasswd, user?.password ?? "");
        return jwt.sign({...user}, SECRET);
    }catch (e) {
        throw new CustomError(500, 'controller/user.js - connectUser - ' + e.message);
    }
}

export async function createUser(userEmail, firstName, lastName, userPasswd) {
    try{
        let user = {
            email: userEmail,
            firstName: firstName,
            lastName: lastName,
            password: await asyncCrypt(userPasswd),
        };

        userRepository
            .save(user)
            .then(function(){
                console.log('>>> INFO : User successfully created.');
            });
    }catch (e) {
        console.error('>>> ERROR : Error while creating the user.');
        throw new CustomError(500, 'controller/user.js - createUser - ' + e.message);
    }
}

