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
