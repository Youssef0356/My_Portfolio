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
  const sliderm = new Sliderm('#exampe-slider', {
    arrow: true,
    pagination: true,
    grouping: false,
    loop: true,
    preview: false,
    columns: 4,
    duration: 1000,
    spacing: 10,
    align: 'center',
  });
  sliderm.on('slide.start', () => {
    console.log('Just starting to slide!');
  });
  
  sliderm.on('slide.end', () => {
    console.log('The slider is stopped.');
  });