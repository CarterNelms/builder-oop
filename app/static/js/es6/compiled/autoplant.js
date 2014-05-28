$(function() {
  'use strict';
  var intervals = {};
  $('#menu').on('click', '.item[data-name=auto-plant] .switch', switchOnOff);
  function switchOnOff() {
    var $thisSwitch = $(this);
    var $item = $thisSwitch.closest('.item');
    $item.toggleClass('on');
    var isOn = $item.hasClass('on');
    var itemId = $item.data('id');
    if (isOn) {
      $traceurRuntime.setProperty(intervals, itemId, setInterval(autoplant, 1000));
    } else {
      clearInterval(intervals[$traceurRuntime.toProperty(itemId)]);
    }
    function autoplant() {
      if ($('button.grow').length < 50) {
        plant();
      }
    }
  }
});

//# sourceMappingURL=autoplant.map
