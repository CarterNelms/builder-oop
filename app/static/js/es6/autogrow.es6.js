/* global growTree, chopTree */

$(function()
{
  'use strict';

  var intervals = {};

  $('#menu').on('click', '.item[data-name=auto-grow] .switch', switchOnOff);

  function switchOnOff()
  {
    var $thisSwitch = $(this);

    var $item = $thisSwitch.closest('.item');
    $item.toggleClass('on');

    var isOn = $item.hasClass('on');
    var itemId = $item.data('id');
    if(isOn)
    {
      intervals[itemId] = setInterval(autogrow, 1000);
    }
    else
    {
      clearInterval(intervals[itemId]);
    }

    function autogrow()
    {
      var $growButtons = $('button.grow');
      var chopHeight = $thisSwitch.closest('.item').find('.autochop-height').text() * 12;
      $growButtons.each((i, button)=>
      {
        var $treeWrap = $(button).closest('.treeWrap');
        var height = $treeWrap.find('.height').attr('data-height');

        if(height < chopHeight)
        {
          growTree($treeWrap);
        }
        else
        {
          chopTree($treeWrap);
        }
      });
    }
  }
});