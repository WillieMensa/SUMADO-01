/* check each prefixed name of a function on an object
   call the one that exists on this object and skip the
   remaining names by making the iterator return false */
var call = function(object, fnNames) {
  Array.prototype.forEach.call(fnNames, function(fn) {
    if (fn in object) {
      object[fn]();
      return false;
    }
  });
}


document.getElementById('lock').onclick = function (e) {
    call(document.documentElement, [
        'requestFullscreen',
        'mozRequestFullScreen',
        'webkitRequestFullscreen',
        'msRequestFullscreen'
    ]);
    screen.orientation.lock(screen.orientation.type);
    document.getElementById('state').innerHTML = 'locked';
    document.getElementById('lock').disabled = 1;
    document.getElementById('unlock').disabled = 0;
};
document.getElementById('unlock').onclick = function (e) {
    call(document, [
        'exitFullscreen',
        'mozCancelFullScreen',
        'webkitExitFullscreen',
        'msExitFullscreen'
    ]);
    screen.orientation.unlock();
    document.getElementById('state').innerHTML = 'unlocked';
    document.getElementById('lock').disabled = 0;
    document.getElementById('unlock').disabled = 1;
};

var updateOrientation = function () {
    document.getElementById('type').innerHTML = screen.orientation.type;
};

screen.orientation.addEventListener('change', updateOrientation);

updateOrientation();