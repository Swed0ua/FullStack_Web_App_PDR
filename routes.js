const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const db = require('./modules/BD/index');
const {isValidEmail, isValidPassword} = require('./modules/Validation/valid');
const { where } = require('sequelize');


module.exports = (db) => {
    function verifyToken(req, res, next) {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Авторизація не пройшла.' });
        }
    
        jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Помилка перевірки.' });
            }
            req.user = decoded;
            next();
        });
    }

    router.get('/user', verifyToken, async (req, res) => {
        const username = req.user.username;
        const user = await db.findUserByUsername(username);

        res.status(200).json({ user:{
            firstName:user.firstName,
            lastName:user.lastName,
            username:user.username,
            history:user.history,
        } });
    });

    // auth
    router.post('/register', async (req, res) => {
        try {
            const { username, password, firstName, lastName, re_password=null } = req.body;
            const user = await db.findUserByUsername(username);
            
            if (user) {
                return res.status(400).json({ message: 'Користувач вже існує' });
            }
            
            if (!isValidEmail(username)) {
                return res.status(422).json({ message: 'Неправильний формат емейлу' });
            }
            if (!isValidPassword(password)) {
                return res.status(422).json({ message: 'Невірна кількість символів в поролі' });
            }
            await db.createUser(username, password, firstName, lastName);

            res.status(201).json({ message: 'Користувач зареєстрований успішно' });
        } catch (error) {
            console.error('Помилка реєстрації користувача:', error);
            res.status(500).json({ message: 'Помилка реєстрації користувача' });
        }
    });

    router.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await db.findUserByUsername(username);
            if (!user) {
                return res.status(400).json({ message: 'Невірне ім\'я користувача або пароль -2' });
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'Невірне ім\'я користувача або пароль' });
            }
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '2d' });
            res.json({ token });
        } catch (error) {
            console.error('Помилка входу користувача:', error);
            res.status(500).json({ message: 'Помилка входу користувача' });
        }
    });

    // curses
    router.get('/curses', async (req, res) => {
        try {
            const products = await db.Curses.findAll();
            if (!products) {
                return res.status(404).json({ message: 'Не вдалий запит'});
            }
            res.json(products);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    router.get('/tests', async (req, res) => {
        try {
            const products = await db.Tests.findAll();
            if (!products) {
                return res.status(404).json({ message: 'Не вдалий запит'});
            }
            res.json(products);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    router.post('/get_score', async (req, res) => {
        try {
            res.status(201).json({re:req.params})
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    router.get('/getQuestions/:id', async (req, res) => {
        try {
            const p_id = req.params.id;
            const products = await db.Tests.findOne({ where: { id:p_id } })
            if (!products) {
                return res.status(404).json({ message: 'Не вдалий запит'});
            }
            
            let results = JSON.parse(products.questions).map(e=>{
                delete e.right
                return e
            })
            console.log(results)

            res.json(results);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    async function checkRess(ress, id){
        const test = await db.Tests.findOne({ where: { id:id } })
        let score = 0 
        let passPercentage = 0
        if (test) {
            let ind = 0
            JSON.parse(test.questions).forEach(question => {
                if  (ress[ind]==question.right) {
                    score++
                }
                ind++
            });   


            passPercentage = test.passPercentage
        }
        return [score, passPercentage]
    }


    router.post('/compareAnswers', verifyToken, async (req, res) => {
        try {
            let [score, pass] = await checkRess(req.body.results, req.body.id)
            let isGood = score >= pass

            const username = req.user.username;
            const user = await db.findUserByUsername(username);
            let userHistory = JSON.parse(user.history)
            userHistory.push({
                duration : req.body.seconds,
                test_id : req.body.id,
                isGood,
                score,
                passing: pass
            })

            await db.User.update(
                { history: userHistory },
                { where: { username: username } }
            );

            res.json({
                isGood:isGood,
                score:score,
                passing:pass
            })

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    router.post('/compareAnswersGuest', async (req, res) => {
        try {
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
    

    return router
}

