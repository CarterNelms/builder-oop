$(function() {
  'use strict';
  var intervals = {};
  $('#menu').on('click', '.item[data-name=auto-root] .switch', switchOnOff);
  function switchOnOff() {
    var $thisSwitch = $(this);
    var $item = $thisSwitch.closest('.item');
    $item.toggleClass('on');
    var isOn = $item.hasClass('on');
    var itemId = $item.data('id');
    if (isOn) {
      $traceurRuntime.setProperty(intervals, itemId, setInterval(autoroot, 1000));
    } else {
      clearInterval(intervals[$traceurRuntime.toProperty(itemId)]);
    }
    function autoroot() {
      root();
    }
  }
});

//# sourceMappingURL=autoroot.map
