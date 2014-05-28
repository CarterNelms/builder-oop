'use strict';

var items = global.nss.db.collection('items');
var Mongo = require('mongodb');
var _ = require('lodash');

class Item
{
  constructor(name)
  {
    var itemType = getItemTypeByName(name);

    this.name = itemType.name;
    this.cost = itemType.cost;
    this.image = itemType.image;
  }

  save(fn)
  {
    items.save(this, ()=>fn());
  }

  // static cost(type)
  // {
  //   switch(type)
  //   {
  //     case 'autogrow':
  //       return 50;
  //     default:
  //       return 0;
  //   }
  // }

  // static image(type)
  // {
  //   switch(type)
  //   {
  //     case 'autogrow':
  //       return '/img/autogrow.png';
  //     default:
  //       return '';
  //   }
  // }

  static getAllItemTypes()
  {
    return [
    {
      name: 'auto-grow',
      cost: 50000,
      image: '/img/autogrow.png'
    },
    {
      name: 'auto-plant',
      cost: 75000,
      image: '/img/autoplant.png'
    },
    {
      name: 'auto-root',
      cost: 85000,
      image: '/img/autoroot.png'
    }];
  }

  static findByItemId(itemId, fn)
  {
    itemId = Mongo.ObjectID(itemId);
    items.findOne({_id: itemId}, (e, item)=>
    {
      fn(_.create(Item.prototype, item));
    });
  }
}

function getItemTypeByName(name)
{
  var itemTypes = Item.getAllItemTypes();
  return _.find(itemTypes, itemType=>itemType.name === name);
}

module.exports = Item;