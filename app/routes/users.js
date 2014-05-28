'use strict';

//var _ = require('lodash');
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Item = traceur.require(__dirname + '/../models/item.js');

exports.login = (req, res)=>
{
  User.login(req.body.username, user=>
  {
    renderMenu(user, res);
  });
};

exports.sellWood = (req, res)=>
{
  User.findByUserId(req.query.userId, user=>
  {
    user.sellWood(req.query.woodcount);
    user.save(()=>
    {
      renderMenu(user, res);
    });
  });
};

exports.purchase = (req, res)=>
{
  console.log('purchase...');
  var itemName = req.params.itemName;
  console.log('item: '+itemName);
  User.findByUserId(req.params.userId, user=>
  {
    console.log('user: '+user);
    var item = new Item(itemName);
    item.save(()=>
    {
      user.purchase(item);
      user.save(()=>
      {
        renderMenu(user, res);
      });
    });
  });
};

function renderMenu(user, res)
{
  user.getItems(items=>
  {
    res.render('users/menu', {user: user, items: items, Item: Item});
  });  
}