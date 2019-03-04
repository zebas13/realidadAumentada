
function CreateSpriteSheets(textureObject,animations, frameWidth, frameHeigth, textureWidth, textureHeigth){
	textureObject.wrapS = textureObject.wrapT = THREE.RepeatWrapping;
	
	textureObject.animations = [];
	for(var i = 0; i < animations.length; i++){
		textureObject.animations[animations[i].anim]={'frames':animations[i].frames,'speed':animations[i].speed,'onComplete':animations[i].onComplete};
	}
	textureObject.framesWidth = frameWidth;
	textureObject.framesHeight = frameHeigth;
	textureObject.Width = textureWidth;
	textureObject.Height = textureHeigth;
	textureObject.currentTime = 0;
	textureObject.currentAnim = 'loop';
	textureObject.idAnim = 0;
	textureObject.repeat.set(1/(textureObject.Width/textureObject.framesWidth),1/(textureObject.Height/textureObject.framesHeight));
	textureObject.needsUpdate = true;
	//rayTexture.offset.set(0,0.8);
	textureObject.update = updateAnims;
	textureObject.anisotropy = 0;
	textureObject.magFilter = THREE.NearestFilter;
	textureObject.minFilter = THREE.NearestFilter;
	
	
	
}

function updateAnims(delta){
	
	this.currentTime+=delta;
	//console.log("Update textures "+rayTexture.currentTime+"  "+rayTexture.animations[rayTexture.currentAnim].speed);
	//console.log(rayTexture.currentAnim);
	
	
	if(this.animations[this.currentAnim].speed<=this.currentTime){
		//nextFrame
		this.currentTime-=this.animations[this.currentAnim].speed;
		this.idAnim ++;
		if(this.idAnim>=this.animations[this.currentAnim].frames.length){
			//EndofAnimation
			if(this.animations[this.currentAnim].onComplete==null){
				//loop
				this.idAnim = 0;
			}
			else{
				this.animations[this.currentAnim].onComplete(this);
				this.idAnim = 0;
				
			}
		}
		
		setOffset(this);
		
	}

}



function setAnim(texture,anim){
	texture.currentAnim = anim;
	rayTexture.idAnim = 0;
	setOffset(texture);
	
}

function setOffset(texture){

	var offset = texture.animations[texture.currentAnim].frames[texture.idAnim] * texture.framesWidth;
	//console.log(offset);
	var offsetY = Math.floor(offset/texture.Width);
	var offsetX = offset - (offsetY*texture.Width);
	
	offsetY = (offsetY*texture.framesHeight)/texture.Height;
	offsetX = offsetX / texture.Width;
	
	texture.offset.set(offsetX, offsetY);

	
}