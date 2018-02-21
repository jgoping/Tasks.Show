/*
Huge thanks towards Traversy Media as the basis for this code is
inspired by a tutorial on their channel, the link is below:
https://www.youtube.com/watch?v=gnsO8-xJ8rs&t=3068s.
*/

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('taskapp', ['tasks']);
var ObjectId = mongojs.ObjectId;

var app = express();

// View Enginer
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// Global Vars
app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});
var sortBy = 'default';
var direction = 1;

// Express Validator Middleware
app.use(expressValidator());

app.get('/', function(req, res) {
  if (sortBy == 'default') {
    db.tasks.find(function(err, docs) {
      res.render('index', {
        title: 'Tasks',
        tasks: docs
      });
    })
  } else if (sortBy == 'task') {
    db.tasks.find().sort({'task':direction}, function(err, docs) {
      res.render('index', {
        title: 'Tasks',
        tasks: docs,
      })
    });
  } else if (sortBy == 'due_date') {
    db.tasks.find().sort({'due_date':direction}, function(err, docs) {
      res.render('index', {
        title: 'Tasks',
        tasks: docs,
      })
    });
  } else {
    db.tasks.find().sort({'priority':direction}, function(err, docs) {
      res.render('index', {
        title: 'Tasks',
        tasks: docs,
      })
    });
  }
});

function inDatabase(task, newTask) {
  return ((task.task == newTask.task) &&
    (task.due_date != newTask.due_date ||
      task.priority != newTask.due_date ||
      task.status != newTask.status));
}

app.post('/tasks/add', function(req, res) {
  req.checkBody('task', 'The task is Required').notEmpty();
  req.checkBody('due_date', 'The due date is Required').notEmpty();
  req.checkBody('priority', 'Priority level is Required').notEmpty();
  req.checkBody('status', 'Status is Required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    db.tasks.find(function(err, docs) {
      res.render('index', {
        title: 'Tasks',
        tasks: docs,
        errors: errors
      })
    });
  } else {
    var newTask = {
      task: req.body.task,
      due_date: req.body.due_date,
      priority: req.body.priority,
      status: req.body.status
    }

    db.tasks.insert(newTask, function(err, result) {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
  }
});


app.delete('/tasks/delete/:id', function(req, res) {
  db.tasks.remove({
    _id: ObjectId(req.params.id)
  }, function(err, result) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  })
});

app.post('/tasks/changeStatus/:id', function(req, res) {
  db.tasks.update({
    _id: ObjectId(req.params.id)
  }, {
    $set: {
      status: req.body.str
    }
  }, function(err, result) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  })
});

app.get('/tasks/sortTasks', function(req, res) {
  if (sortBy == 'task') {
    direction = -direction;
  } else {
    sortBy = 'task';
    direction = 1;
  }

  res.redirect('/');
});

app.get('/tasks/sortDates', function(req, res) {
  if (sortBy == 'due_date') {
    direction = -direction;
  } else {
    sortBy = 'due_date';
    direction = 1;
  }

  res.redirect('/');
});

app.get('/tasks/sortPriorities', function(req, res) {
  if (sortBy == 'priority') {
    direction = -direction;
  } else {
    sortBy = 'priority';
    direction = 1;
  }

  res.redirect('/');
});


app.listen(3000, function() {
  console.log('Server started on Port 3000...');
});
