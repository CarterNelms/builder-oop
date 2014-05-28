'use strict';
var audioChop,
    audioBeanStalk;
$(function() {
  $('#login').click(login);
  $('#menu').on('click', '#plant', plant);
  $('#menu').on('click', '#getForest', getForest);
  $('#menu').on('click', '#sellWood', sellWood);
  $('#menu').on('click', '.purchase', purchase);
  $('#menu').on('input', '.item input[type=range]', updateSliderVal);
  $('#forest').on('click', '.grow', grow);
  $('#forest').on('click', '.chop', chop);
  preloadAssets();
  function updateSliderVal() {
    var $slider = $(this);
    var $chopHeightDisplay = $slider.closest('.item').find('.autochop-height');
    $chopHeightDisplay.text($slider.val());
  }
  function purchase() {
    var userId = $('#user').attr('data-id');
    var itemName = $(this).data('name');
    ajax(("/users/" + userId + "/purchase/" + itemName), 'PUT', {}, (function(html) {
      replaceContent($('#menu'), html);
    }));
  }
  function preloadAssets() {
    audioChop = $('<audio>')[0];
    audioChop.src = '/audios/chop.wav';
    audioBeanStalk = $('<audio>')[0];
    audioBeanStalk.src = '/audios/grow.wav';
  }
  function sellWood(e) {
    var data = $(this).closest('form').serialize();
    var userId = $('#user').attr('data-id');
    data += ("&userId=" + userId);
    ajax(("/sell?" + data), 'PUT', null, (function(menu) {
      $('#menu').empty().append(menu);
      $('#woodcount').val('');
    }));
    e.preventDefault();
  }
  function chop() {
    var $treeWrap = $(this).closest('.treeWrap');
    chopTree($treeWrap);
  }
  function grow() {
    var $treeWrap = $(this).closest('.treeWrap');
    growTree($treeWrap);
  }
  function getForest() {
    var userId = $('#user').attr('data-id');
    ajax(("/trees?userId=" + userId), 'GET', null, (function(html) {
      var $forest = $('#forest');
      $forest.empty();
      $forest.append(html);
    }));
  }
  function login() {
    var username = $('#username').val();
    ajax('/login', 'POST', {username: username}, (function(html) {
      $('#menu').empty().append(html).css('visibility', 'visible');
    }));
  }
  function replaceContent($element, html) {
    $element.empty().append(html);
  }
});
function growTree($treeWrap) {
  var $tree = $treeWrap.children('.tree');
  var treeId = $tree.attr('data-id');
  ajax(("trees/" + treeId + "/grow"), 'PUT', null, (function(html) {
    $treeWrap.replaceWith(html);
    if ($(html).children('.tree').hasClass('beanstalk')) {
      audioBeanStalk.play();
    }
  }));
}
function chopTree($treeWrap) {
  var $tree = $treeWrap.children('.tree');
  var treeId = $tree.attr('data-id');
  var userId = $('#user').attr('data-id');
  ajax(("trees/" + treeId + "/chop/" + userId), 'PUT', null, (function(response) {
    $('#dashboard').empty().append(response.dashboard);
    $treeWrap.replaceWith(response.tree);
    audioChop.play();
  }), 'json');
}
function plant() {
  var userId = $('#user').attr('data-id');
  ajax('/trees/plant', 'POST', {userId: userId}, (function(html) {
    $('#forest').append(html);
  }));
}
function root() {
  var userId = $('#user').attr('data-id');
  ajax("/trees/root", 'DELETE', {userId: userId}, (function() {
    $('.tree.dead').closest('.treeWrap').remove();
  }));
}
function ajax(url, type) {
  var data = arguments[2] !== (void 0) ? arguments[2] : {};
  var success = arguments[3] !== (void 0) ? arguments[3] : (function(r) {
    return console.log(r);
  });
  var dataType = arguments[4] !== (void 0) ? arguments[4] : 'html';
  $.ajax({
    url: url,
    type: type,
    dataType: dataType,
    data: data,
    success: success
  });
}

//# sourceMappingURL=game.map
