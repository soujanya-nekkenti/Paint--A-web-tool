$(document).ready(start);
var draw;
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var radius = 10;
var minRadius = 2;
var maxRadius = 30;

save();



function penSize(){
	$('#btnIncrease').click(function(){
		radius = radius + 2;
		if (radius >= maxRadius) {
			radius = maxRadius;
		}
		$('#penVal').text(radius);

	});

	$('#btnDecrease').click(function(){
		radius = radius - 2;
		if (radius <= minRadius) {
			radius = minRadius;
		}
		$('#penVal').text(radius);

	});
}
var canvasState = (function() {
	var index = 0;
	var stack = [];
	var size = 10;

	var module = {};
	module.save = function() {
		console.log('hi iam save');
		var data = context.getImageData(0, 0, canvas.width, canvas.height);
		stack[++index] = data;
		if (stack.length > size) {
			stack.shift();
			index--;
		}
		console.log("in save"+stack.length);
	}

	module.undo = function() {
		console.log('hi iam undo');
		if (index > 1) {
			var data = stack[--index];
			context.putImageData(data, 0, 0);
		}
		console.log("in undo"+stack.length);
	}

	module.redo = function() {
		console.log('hi iam redo');
		if (index < stack.length - 1) {
			var data = stack[++index];
			context.putImageData(data, 0, 0);
		}
		console.log("in redo"+stack.length);
	}

	return module;
})();

function setupCanvasState() {
	console.log('canvasSetup');
	var undoButton = document.querySelector("button.undo");
	var redoButton = document.querySelector("button.redo");


	undoButton.onclick = canvasState.undo;
	redoButton.onclick = canvasState.redo;

}

setupCanvasState();

function start(){
	penSize();
	canvas.width = window.innerWidth - 15;
	canvas.height = window.innerHeight;

	$('#canvas').mousedown(press);
	$('#canvas').mousemove(paint);
	$('#canvas').mouseup(stop);
	canvasState.save();
	function press(){

		draw = true;
		context.moveTo(event.pageX, event.pageY);
	}

	function paint(){
		if(draw){
			context.lineWidth = radius * 2;
			context.lineTo(event.pageX, event.pageY)
			context.stroke();

			context.beginPath();
			context.arc(event.pageX, event.pageY, radius, 0, 2*Math.PI);
			context.fill();

			context.beginPath();
			context.moveTo(event.pageX, event.pageY);
		}
		//canvasState.save();
	}

	function stop(){

		draw = false;
		canvasState.save();
	}
}


function save(){
	$('#btnSave').click(function(){
		var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		window.location.href = image;
	});
}



function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
           var img = new Image();
           img.onload = function() {
             context.drawImage(img, 0, 0);
           };
           img.src = e.target.result;
        };       
        FR.readAsDataURL( this.files[0] );
		canvasState.save();

	}

}
document.getElementById("fileUpload").addEventListener("change", readImage, false);
