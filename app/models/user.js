'use strict';

var traceur = require('traceur');
var Item = traceur.require(__dirname + '/../models/item.js');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class User
{
  constructor(username)
  {
    this.username = username;
    this.wood = 0;
    this.cash = 0;
    this.items = [];
  }

  sellWood(amount)
  {
    if(amount <= this.wood)
    {
      this.cash += amount/5;
      this.wood -= amount;
    }
  }

  save(fn)
  {
    users.save(this, ()=>fn());
  }

  purchase(item)
  {
    if(item.cost <= this.cash)
    {
      this.cash -= item.cost;
      this.items.push(item._id);
    }
  }

  getItems(fn)
  {
    var itemsNotYetFound = this.items.length;
    if(itemsNotYetFound)
    {
      var items = [];
      this.items.forEach(itemId=>
      {
        Item.findByItemId(itemId, item=>
        {
          items.push(item);
          if(!(--itemsNotYetFound))
          {
            fn(items);
          }
        });   
      });
    }
    else
    {
      fn([]);
    }
  }

  static login(username, fn)
  {
    username = username.trim().toLowerCase();
    users.findOne({username: username}, (e, user)=>
    {
      if(user)
      {
        fn(_.create(User.prototype, user));
      }
      else
      {
        user = new User(username);
        users.save(user, ()=>fn(user));
      }
    });
  }

  static findByUserId(userId, fn)
  {
    userId = Mongo.ObjectID(userId);
    users.findOne({_id: userId}, (e, user)=>
    {
      fn(_.create(User.prototype, user));
    });    
  }
}

module.exports = User;