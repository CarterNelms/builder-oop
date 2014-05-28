'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Tree = traceur.require(__dirname + '/../models/tree.js');

exports.plant = (req, res)=>
{
  Tree.plant(req.body.userId, tree=>
  {
    res.render('trees/tree', {tree: tree});
  });
};

exports.getForest = (req, res)=>
{
  Tree.findAllByUserId(req.query.userId, trees=>
  {
    res.render('trees/forest', {trees: trees});
  });
};

exports.grow = (req, res)=>
{
  Tree.findByTreeId(req.params.treeId, tree=>
  {
    tree.grow();
    tree.save(()=>
    {
      res.render('trees/tree', {tree: tree});
    });
  });
};

exports.chop = (req, res)=>
{
  Tree.findByTreeId(req.params.treeId, tree=>
  {
    User.findByUserId(req.params.userId, user=>
    {
      tree.chop(user);
      tree.save(()=>
      {
        user.save(()=>
        {
          res.render('trees/tree', {tree: tree}, (e, treeHtml)=>
          {
            res.render('users/dashboard', {user: user}, (e, dashboard)=>
            {
              res.send({tree: treeHtml, dashboard: dashboard});
            });
          });
        });
      });
    });
  });
};

exports.destroy = (req, res)=>
{
  Tree.root(req.body.userId, ()=>
  {
    res.send();
  });
};