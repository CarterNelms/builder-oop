'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var game = traceur.require(__dirname + '/../routes/game.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var trees = traceur.require(__dirname + '/../routes/trees.js');

  app.get('/', dbg, home.index);
  app.get('/help', dbg, home.help);

  app.get('/game', dbg, game.index);
  app.post('/login', dbg, users.login);
  app.post('/trees/plant', dbg, trees.plant);
  app.get('/trees', dbg, trees.getForest);
  app.put('/trees/:treeId/grow', dbg, trees.grow);
  app.put('/trees/:treeId/chop/:userId', dbg, trees.chop);
  app.delete('/trees/root', dbg, trees.destroy);
  app.put('/sell', dbg, users.sellWood);
  app.put('/users/:userId/purchase/:itemName', dbg, users.purchase);

  console.log('Routes Loaded');
  fn();
}
