var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;   

var router = express.Router();

var users = [{id: 1, username: "cvarela", password: "cgvm123"}];
var roles = [{id:1, description: "admin"}, {id: 2, description: "normal"}];
var userRoles = [{userId: 1, roleId:2}, {userId: 1, roleId:1}];

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

function getRolesByUser(userId){
    let result = [];
    for (let i = 0; i < userRoles.length; i++) {
        if (userRoles[i].userId === userId) {
            result.push(getRoleById(userRoles[i].roleId));
        }
    }
    return result;
}

function getRoleById(id){
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].id === id) {
            return roles[i];
        }
    }
    return null;
}

function getUserById(id){
    for (let i = 0; i < users.length; i++) {
        if(users[i].id === id){
           return users[i];
        }
    }
    return null;
}

router.route('/users')
    .get(function(req, res){
        let data = [];
        for (let i = 0; i < users.length; i++) {
            let userModel = {id: users[i].id, username: users[i].username, password: users[i].password, roles: getRolesByUser(users[i].id)};
            data.push(userModel);
        }
        res.json(data)
    });


router.route('/users/:id')
    .get(function(req, res){
        let id = Number(req.params.id);
        let user = getUserById(id);
        if(user == null){
            res.json({error: "User Not Found"});
        }
        return res.json(user);
    });

    router.route('/users/:id')
    .put(function(req, res){
        let id = Number(req.params.id);
        let user = req.body;
        let existingUser = getUserById(id);
        if(existingUser == null){
            res.json({error: "User Not Found"});
        }
        existingUser.username = user.username;
        existingUser.password = user.password; 
        res.json(user);
    });
    
    
router.route('/roles')
    .get(function(req, res){
        res.json(roles);
    });

router.route("/roles")
    .post(function(req, res){
        let role = req.body;
        roles.push(role);
        res.json(role);
    });

router.route("/roles/:id")
    .put(function(req, res){
        let role = req.body;
        let id = Number(req.params.id);
        let existingRole = getRoleById(id);
        if(existingRole == null){
            res.json({error: "No se encontro el rol"});
        }
        existingRole.description = role.description;
        res.json(role);
    });

router.route("/roles/:id")
    .get(function(req,res){
        let id = Number(req.params.id);
        let existingRole = getRoleById(id);
        if(existingRole == null){
            res.json({error: "No se encontro el rol"});
        }
        res.json(existingRole);
    });

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);