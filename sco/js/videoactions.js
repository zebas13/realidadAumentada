AFRAME.registerComponent('vidhandler', {
  init: function () {
    this.toggle = false;
    this.vid = document.querySelector("#vid")
    this.vid.pause();
  },
  tick:function(){
if(this.el.object3D.visible == true){
  if(!this.toggle){
     this.toggle = true;
     this.vid.play();
    }
  }else{
  this.toggle = false;
    this.vid.pause();
    }
  }      
    
});

window.addEventListener("touchstart",function(){
  			document.querySelector("#vid").play();
  		},false)      
  
      