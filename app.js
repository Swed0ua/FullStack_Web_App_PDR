require('dotenv').config();
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const path = require('path');

const bodyParser = require('body-parser');
const Database = require('./modules/BD/index');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = "crypto.randomBytes(32).toString('hex')";
process.env.JWT_SECRET = JWT_SECRET

// Підключення до бази даних
const db = new Database(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD);
db.init();

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'views')));


app.use(cors());
app.use('/', routes(db));


// Front-end req
app.get('/', (req, res)=>{
    res.render('index')
})
app.get('/coursesList', (req, res)=>{
    res.render('coursesList')
})

app.get('/testsList', (req, res)=>{
    res.render('testList')
})

app.get('/cabinet', (req, res)=>{
    res.render('cabinet')
})

app.get('/coursesPreview/:name', async (req, res)=>{
    try{
        const coursePath = req.params.name;
        const course = await db.Curses.findOne({ where: { path: coursePath } });
        
        if (!course) {
            res.sendStatus(404);
            return;
        }
        
        res.render('coursePreview', {course})
    } catch(err) {
        res.sendStatus(404).send(err);
    }
    
})

app.get('/test/:name', async (req, res)=>{
    try{
        const coursePath = req.params.name;
        const test = await db.Tests.findOne({ where: { link: coursePath } });
        if (!test) {
            res.sendStatus(404);
            return;
        }
        
        res.render('testPreview', {test: {id: test.id, title: test.title, desc: test.description}})
    } catch(err) {
        res.sendStatus(404).send(err);
    }
    
})

// app.get('/ts', async (req, res)=>{
//     try{
        
//         res.render('testPreview', {course: "asdsa"})
//     } catch(err) {
//         res.sendStatus(404).send(err);
//     }
    
// })

app.get('/course/:name/:subname', async (req, res)=>{
    try{
        const courseTitle = req.params.name;
        const courseSubtitle = req.params.subname;
        

        const filePath = path.join(__dirname, `views/courses/${courseTitle}/${courseSubtitle}.ejs`);

        if (fs.existsSync(filePath)) {
            res.render(filePath);
        } else {
            res.status(404).send('Шлях не знайдено');
        }
    } catch(err) {
        console.log(err)
        res.sendStatus(404).send(err);
    }
    
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// db.createTests({
//     title: "Загальне оцінювання",
//     description: 'Тест на знання правил правильного руху автомобіля та зупинки в різних ситуаціях на дорозі.',
//     questions: [
//         {
//             title: 'Чи дозволено Вам (не водію маршрутного ТЗ) зупинитися в цьому місці для посадки або висадки пасажирів?',
//             img: "./../../imgs/public/old037002img_037_00002.jpg",
//             options: [
//                 {title:'Так'},
//                 {title:'Ні'}
//             ],
//             right: 1
//         },
//         {
//             title: 'Чи дозволено зупинитися в цьому місці для посадки пасажирів?',
//             img: "./../../imgs/public/old018042img_018_00042.jpg",
//             options: [
//                 {title:'Дозволено'},
//                 {title:'Заборонено'},
//                 {title: 'Дозволено тільки в світлий час доби'}
//             ],
//             right: 1
//         },
//         {
//             title: 'По якій дорозі Вам дозволено рух?',
//             img: "./../../imgs/public/old036211img_036_00211.jpg",
//             options: [
//                 {title:'По дорозі А.'},
//                 {title:'По дорозі Б.'},
//                 {title: 'По будь-якій дорозі'}
//             ],
//             right: 2
//         },
//         {
//             title: 'Чи дозволено автомобілю виконати виїзд на трамвайну колію попутного напрямку?',
//             img: "./../../imgs/public/old014020img_014_00020.jpg",
//             options: [
//                 {title:'Дозволено'},
//                 {title:'Заборонено'}
//             ],
//             right: 0
//         },{
//             title: 'Чи дозволяється самовільно відкривати шлагбаум на залізничному переїзді?',
//             img: "./../../imgs/public/old023021img_023_00021.jpg",
//             options: [
//                 {title:'Дозволено, якщо вимкнена звукова і світлова сигналізація.'},
//                 {title:'Заборонено.'}
//             ],
//             right: 1
//         },{
//             title: 'Як Ви повинні проїхати дане перехрестя?',
//             img: "./../../imgs/public/old019014img_019_00014.jpg",
//             options: [
//                 {title:'Дати дорогу фіолетовому автомобілю.'},
//                 {title:'Проїхати першим, не даючи дорогу фіолетовому автомобілю'}
//             ],
//             right: 0
//         }
//     ],
//     duration: 0,
//     instructions: '',
//     passPercentage: 5
// });