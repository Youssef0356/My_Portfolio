function load(url) {
  // display loading image here...
  document.getElementById('animation').visible = true;
  // request your data...
  var req = new XMLHttpRequest();
  req.open("POST", url, true);

  req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
          // content is loaded...hide the gif and display the content...
          if (req.responseText) {
              document.getElementById('header').innerHTML = req.responseText;
              document.getElementById('loadingImg').visible = false;
          }
      }
  };
  request.send(vars);
}


function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
  function toggleMute() {

    var video=document.getElementById("myvideo");
  
    if(video.muted){
      video.muted = false;
    } else {
      debugger;
      video.muted = true;
      video.play()
    }
  
  }
  
  $(document).ready(function(){
    setTimeout(toggleMute,3000);
  })