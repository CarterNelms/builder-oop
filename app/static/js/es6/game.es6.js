/* jshint unused: false */

'use strict';

var audioChop, audioBeanStalk;

$(function()
{
  $('#login').click(login);
  $('#menu').on('click', '#plant', plant);
  $('#menu').on('click', '#getForest', getForest);
  $('#menu').on('click', '#sellWood', sellWood);
  $('#menu').on('click', '.purchase', purchase);
  $('#menu').on('input', '.item input[type=range]', updateSliderVal);
  $('#forest').on('click', '.grow', grow);
  $('#forest').on('click', '.chop', chop);
  preloadAssets();

  function updateSliderVal()
  {
    var $slider = $(this);
    var $chopHeightDisplay = $slider.closest('.item').find('.autochop-height');
    $chopHeightDisplay.text($slider.val());
  }

  function purchase()
  {
    var userId = $('#user').attr('data-id');
    var itemName = $(this).data('name');
    ajax(`/users/${userId}/purchase/${itemName}`, 'PUT', {}, html=>
    {
      replaceContent($('#menu'), html);
    });
  }

  function preloadAssets()
  {
    audioChop = $('<audio>')[0];
    audioChop.src = '/audios/chop.wav';
    audioBeanStalk = $('<audio>')[0];
    audioBeanStalk.src = '/audios/grow.wav';
  }

  function sellWood(e)
  {
    var data = $(this).closest('form').serialize();
    var userId = $('#user').attr('data-id');
    data += `&userId=${userId}`;
    ajax(`/sell?${data}`, 'PUT', null, menu=>
    {
      // $('#wood').text(response.wood.toFixed(2).toString());
      // $('#cash').text(response.cash.toFixed(2).toString());      
      $('#menu').empty().append(menu);
      $('#woodcount').val('');
    });

    e.preventDefault();
  }

  function chop()
  {
    var $treeWrap = $(this).closest('.treeWrap');
    chopTree($treeWrap);
  }

  function grow()
  {
    var $treeWrap = $(this).closest('.treeWrap');
    growTree($treeWrap);
  }

  function getForest()
  {
    var userId = $('#user').attr('data-id');
    ajax(`/trees?userId=${userId}`, 'GET', null, html=>
    {
      var $forest = $('#forest');
      $forest.empty();
      $forest.append(html);
    });
  }

  function login()
  {
    var username = $('#username').val();
    ajax('/login', 'POST', {username: username}, html=>
    {
      $('#menu').empty().append(html).css('visibility', 'visible');
    });
  }

  function replaceContent($element, html)
  {
    $element.empty().append(html);
  }
});

function growTree($treeWrap)
{
  var $tree = $treeWrap.children('.tree');
  var treeId = $tree.attr('data-id');
  ajax(`trees/${treeId}/grow`, 'PUT', null, (html)=>
  {
    $treeWrap.replaceWith(html);
    if($(html).children('.tree').hasClass('beanstalk'))
    {
      audioBeanStalk.play();
    }
  });  
}

function chopTree($treeWrap)
{
  var $tree = $treeWrap.children('.tree');
  var treeId = $tree.attr('data-id');
  var userId = $('#user').attr('data-id');
  ajax(`trees/${treeId}/chop/${userId}`, 'PUT', null, (response)=>
  {
    // $('#wood').text(response.wood.toFixed(2).toString());
    $('#dashboard').empty().append(response.dashboard);
    $treeWrap.replaceWith(response.tree);
    audioChop.play();
  }, 'json');
}

function plant()
{
  var userId = $('#user').attr('data-id');
  ajax('/trees/plant', 'POST', {userId: userId}, html=>
  {
    $('#forest').append(html);
  });
}

function root()
{
  var userId = $('#user').attr('data-id');
  ajax(`/trees/root`, 'DELETE', {userId: userId}, ()=>
  {
    $('.tree.dead').closest('.treeWrap').remove();
  });
}

function ajax(url, type, data={}, success=r=>console.log(r), dataType='html')
{
  $.ajax(
  {
    url: url,
    type: type,
    dataType: dataType,
    data: data,
    success: success
  });
}