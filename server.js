// This example uses array as data sourse
// This example includes files: 
// server.js, index.ejs, style.css, swagger2.json
//

// swagger-ui-express
const swaggerUi = require('swagger-ui-express');

// Swagger Documentation using json
const swaggerDocument = require('./swagger.json');

// Joi and express
const Joi = require('joi');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Use swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// use json
app.use(express.json());
// For website. The folder for css file
app.use(express.static('public'));

// Support parsing of application/json type post data
app.use(bodyParser.json());
// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true}));
// Set up the template engine
app.set('view engine', 'ejs');

// The array used to store courses data
const courses = [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'},
    {id:4, name: 'course4'},
];

// Website
app.get('/', (req,res)=>{
    res.render('index', {weather: null, error: null}); //  ?
});

// Get all courses
app.get('/api/courses',(req,res) =>{
    res.send(courses);
});

// Get a couses by id
app.get('/api/courses/:id',(req, res)=> {
    // check whether the course with the given ID exist 
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.${req.params.id}')
    res.send(course);
});

// Add a new course
app.post('/api/courses',(req,res) => {
    // course name validation
    const {error} = validateCourse(req.body);
    if(error) return res.status(400).send(result.error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

// Update a course by id
app.put('/api/courses/:id', (req, res) => {
    // check whether the course with the given ID exist 
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.')

    // courses name validation
    const {error} = validateCourse(req.body); // getting result.error
    if(error) return res.status(400).send(result.error.details[0].message);
      
    //Update course
    course.name = req.body.name;

    //Return the updated course to client
    res.send(course);
});

// Delete all courses
app.delete('/api/courses', (req, res) => {
    // remove all courses
    const n = courses.length;
    courses.splice(0, n);

        res.status(200).send('success.');    // Return the deleted course
});

// Delete a course by id
app.delete('/api/courses/:id', (req, res) => {
     // look up the course. Not existing, return 404
    const course = courses.find(c=>c.id===parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');
    
    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
        res.send(course);    // Return the deleted course
});

// function for validateCourse name
function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

const port = process.env.PORT || 60000;
app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}...`));