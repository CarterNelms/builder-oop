'use strict';

var trees = global.nss.db.collection('trees');
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class Tree
{
  constructor(userId)
  {
    this.userId = userId;
    this.height = 0;
    this.isHealthy = true;
    this.isChopped = false;
  }

  getClasses()
  {
    var classes = [];
    if(this.height <= 0)
    {
      classes.push('seed');
    }
    else if(this.height < 24)
    {
      classes.push('sapling');
    }
    else if(!this.isAdult)
    {
      classes.push('treenager');
    }
    else
    {
      classes.push('adult');
    }

    if(!this.isHealthy)
    {
      classes.push('dead');
    }

    if(this.isChopped)
    {
      classes.push('stump');
    }

    if(this.isBeanStalk)
    {
      classes.push('beanstalk');
    }

    return classes.join(' ');
  }

  get isAdult()
  {
    return this.height >= 48;
  }

  get isGrowable()
  {
    return this.isHealthy && !this.isBeanStalk;
  }

  get isChoppable()
  {
    return this.isAdult && this.isHealthy && !this.isBeanStalk;
  }

  get isBeanStalk()
  {
    return this.height/12 > 10000;
  }

  save(fn)
  {
    trees.save(this, ()=>fn());
  }

  grow()
  {
    if(this.isHealthy)
    {
      var maxGrowth = (this.isAdult) ? this.height/10 : 2;
      this.height += _.random(0, maxGrowth);
  
      var maxDeathChance = 200;
      var deathChance = this.isAdult ? maxDeathChance - this.height/120 : maxDeathChance;
      deathChance = deathChance < 10 ? 10 : deathChance;
      this.isHealthy = _.random(0, deathChance, false) !== 0;
    }
  }

  chop(user)
  {
    if(this.height)
    {
      user.wood += this.height/2;
      this.height = 0;
      this.isHealthy = false;
      this.isChopped = true;
    }
  }

  static plant(userId, fn)
  {
    userId = Mongo.ObjectID(userId);
    users.findOne({_id: userId}, (e, user)=>
    {
      if(user)
      {
        // trees.count({userId: user._id}, (e, count)=>
        // {         
        //   if(count < 50)
        //   {
        var tree = new Tree(userId);
        trees.save(tree, ()=>fn(tree));
        //   }
        // });
      }
    });
  }

  static findAllByUserId(userId, fn)
  {
    userId = Mongo.ObjectID(userId);
    trees.find({userId: userId}, (e, usersTrees)=>usersTrees.toArray((e, aTrees)=>
    {
      var forest = aTrees.map(tree=>_.create(Tree.prototype, tree));
      fn(forest);
    }));
  }

  static findByTreeId(treeId, fn)
  {
    treeId = Mongo.ObjectID(treeId);
    trees.findOne({_id: treeId}, (e, tree)=>
    {
      fn(_.create(Tree.prototype, tree));
    });
  }

  static root(userId, fn)
  {
    userId = Mongo.ObjectID(userId);
    trees.remove({userId: userId, isHealthy: false}, (e, count)=>
    {
      fn();
    });
  }
}

module.exports = Tree;