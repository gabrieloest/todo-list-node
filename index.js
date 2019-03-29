var express = require('express');
var session = require('cookie-session'); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var uuid = require('uuid');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let todos = {
    1: {
      id: '1',
      todo: 'Add CSS',
    },
    2: {
      id: '2',
      todo: 'Add MongoDB',
    },
};

/* Using sessions */
app.use(session({secret: 'todotopsecret'}))


/* If there is no to do list in the session, 
we create an empty one in the form of an array before continuing */
.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }

    if (typeof(req.session.todos) == 'undefined') {
        req.session.todos = {};
    }
    next();
})

/* The to do list and the form are displayed */
.get('/todo', function(req, res) { 
    res.render('todo.ejs', {todolist: req.session.todolist});
})

/* Adding an item to the to do list */
.post('/todo/add/', urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        req.session.todolist.push(req.body.newtodo);
    }
    res.redirect('/todo');
})

/* Deletes an item from the to do list */
.get('/todo/delete/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})


/* Route management below */
.get('/api/todos', (req, res) => {
    return res.send(Object.values(req.session.todos));
})

.get('/api/todos/:id', (req, res) => {
    return res.send(req.session.todos[req.params.id]);
})

.post('/api/todos', (req, res) => {
    const id = uuid.v4();
    const item = {
      id,
      todo: req.body.todo,
    };
  
    req.session.todos[id] = item;
  
    return res.send(req.session.todos);
})

.put('/api/todos/:id', (req, res) => {

})

.delete('/api/todos/:id', (req, res) => {
    const {
        [req.params.id]: todo,
        ...otherTodos
    } = req.session.todos;
    req.session.todos = otherTodos;
    
    return res.send(todo);
})

.use(function(req, res, next){
    res.redirect('/todo');
})

.listen(8080);