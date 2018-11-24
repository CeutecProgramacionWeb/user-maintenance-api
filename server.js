var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');

var cors = require('cors')
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;   

var router = express.Router();

var rolesId = 2;
var usersId = 1;
var users = [{id: 1, username: "cvarela", password: "test", roleId : 1}];
var roles = [{id:1, description: "admin"}, {id: 2, description: "normal"}];

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

function getRoleDescription(id){
    for(let i = 0; i< roles.length; i++){
        if(roles[i].id === id){
            return roles[i].description;
        }
    }
    return null;
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
            let userModel = {id: users[i].id, username: users[i].username, password: users[i].password, roleDescription: getRoleDescription(users[i].roleId), roleId: users[i].roleId };
            data.push(userModel);
        }
        res.json(data)
    });

router.route('/users')
    .post(function(req, res){
        let username = req.body.username;
        let password = req.body.password;
        let roleId = req.body.roleId;
        let newUser = {id : ++usersId, username: username, password: password, roleId: roleId};
        users.push(newUser);
        let result = {id : usersId, username: username, password: password, roleId: roleId, roleDescription: getRoleDescription(roleId) };
        res.json(result);
    });

router.route('/users/:id')
    .get(function(req, res){
        let id = Number(req.params.id);
        let user = getUserById(id);
        if(user == null){
            res.json({error: "User Not Found"});
        }
        let userModel = {id: user.id, username: user.username, password: user.password, roleDescription: getRoleDescription(user.roleId), roleId: user.roleId };
        return res.json(userModel);
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
        existingUser.roleId = user.roleId;
        res.json(user);
    });
    
    
router.route('/roles')
    .get(function(req, res){
        res.json(roles);
    });

router.route("/roles")
    .post(function(req, res){
        let roleDescription = req.body.description;
        let role = {id: ++rolesId, description: roleDescription};
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