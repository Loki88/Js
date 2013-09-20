window.addEvent('domready', function(event){
	var controller = new Controller('control-bar');
	controller.setDisplay('editor');
	var imageTool = new ImageTool('control-img');
});