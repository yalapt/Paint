/*---- style ----*/

function setButtonSelection(element)
{
	document.getElementById('list-item-'+element).style.backgroundColor = '#3276b1';
	document.getElementById(element).style.display = 'block';
}

function resetButtonSelection()
{
	document.getElementById('list-item-crayon').style.backgroundColor = '#428bca';
	document.getElementById('crayon').style.display = 'none';
	document.getElementById('list-item-ligne').style.backgroundColor = '#428bca';
	document.getElementById('ligne').style.display = 'none';
	document.getElementById('list-item-rectangle').style.backgroundColor = '#428bca';
	document.getElementById('rectangle').style.display = 'none';
	document.getElementById('list-item-cercle').style.backgroundColor = '#428bca';
	document.getElementById('cercle').style.display = 'none';
	document.getElementById('list-item-text').style.backgroundColor = '#428bca';
	document.getElementById('text').style.display = 'none';
	document.getElementById('list-item-gomme').style.backgroundColor = '#428bca';
	document.getElementById('gomme').style.display = 'none';
}

/*---- convertisseur ----*/

function hexToR(color)
{
	return parseInt((cutHex(color)).substring(0,2),16);
}

function hexToG(color)
{
	return parseInt((cutHex(color)).substring(2,4),16);
}

function hexToB(color)
{
	return parseInt((cutHex(color)).substring(4,6),16);
}

function cutHex(color)
{
	if(color.charAt(0) == "#")
	{
		return color.substring(1,7);
	}
	else
	{
		return color;
	}
}

function negativeToPositive(nb)
{
	var value = String(nb);
	var newValue = value.split("-");
	if(newValue[1])
	{
		return newValue[1];
	}
	else
	{
		return newValue[0];
	}
}

/*---- canvas ----*/

var isDown = false;
var isMove = false;
var isUp = false;
var paintZone = document.getElementById('paint-canvas');
var calqueZone = document.getElementById('calque-canvas');
var paint = paintZone.getContext("2d");
var calque = calqueZone.getContext("2d");
var paintData = paintZone.toDataURL();
var calqueData = calqueZone.toDataURL();
var saveAutoData = [paintData];
var zttx = document.getElementById('zttx').value;
var ztty = document.getElementById('ztty').value;
var zttxSave = zttx;
var zttySave = ztty;
paint.fillStyle = "#000";
calque.fillStyle = "#000";

function canvasSize() 
{
	zttx = document.getElementById('zttx').value;
	ztty = document.getElementById('ztty').value;
	resetCanvasSize();
}

function resetCanvasSize()
{
	document.getElementById('paint-canvas').width = zttx;
	document.getElementById('paint-canvas').height = ztty;
	document.getElementById('calque-canvas').width = zttx;
	document.getElementById('calque-canvas').height = ztty;
	setColor('input');
	restoreAuto();
}

function setColor(color)
{
	if(color == "input")
	{
		color = document.getElementById('paint-couleur').value;
		r = hexToR(color);
		g = hexToG(color);
		b = hexToB(color);
		opacity = document.getElementById('paint-opacity').value;
		opacity = opacity / 100;
		var rgba = "rgba("+r+","+g+","+b+","+opacity+")";
		paint.fillStyle = rgba;
		calque.fillStyle = rgba;
		paint.strokeStyle = rgba;
		calque.strokeStyle = rgba;
		paint.globalCompositeOperation = 'source-over';
		document.getElementById('paint-couleur').value = color;
		document.getElementById('paint-couleur').style.backgroundColor = color;
		paint.globalCompositeOperation = 'source-over';
	}
	else
	{
		r = hexToR(color);
		g = hexToG(color);
		b = hexToB(color);
		opacity = document.getElementById('paint-opacity').value;
		opacity = opacity / 100;
		var rgba = "rgba("+r+","+g+","+b+","+opacity+")";
		paint.fillStyle = rgba;
		calque.fillStyle = rgba;
		paint.strokeStyle = rgba;
		calque.strokeStyle = rgba;
		paint.globalCompositeOperation = 'source-over';
		document.getElementById('paint-couleur').value = color;
		document.getElementById('paint-couleur').style.backgroundColor = color;
	}
}

function setImage(event)
{
	var img = event.target.files[0], type = /image.*/;
    if(!img.type.match(type))
    {
        return false;
    }

    var reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = loadFile;

    function loadFile(event) 
	{
		var image = new Image();
		image.src = event.target.result;
		image.onload = function() {
			paint.drawImage(image, 0, 0);
			saveAuto();
		};
	}
}

function getPosition(event)
{
	var x = Math.round(event.x);
	var y = Math.round(event.y);
	if(navigator.appName == 'Netscape')
	{
		x = Math.round(event.clientX);
		y = Math.round(event.clientY);
		if(navigator.vendor == 'Google Inc.')
		{
			x -= left.offsetLeft+25;
			y -= left.offsetTop+288;
			document.getElementById('positionX').value = x+canvas.scrollLeft+document.body.scrollLeft;
			document.getElementById('positionY').value = y+canvas.scrollTop+document.body.scrollTop;
		}
		else
		{
			x -= left.offsetLeft+25;
			y -= left.offsetTop+289;
			document.getElementById('positionX').value = x+canvas.scrollLeft+document.documentElement.scrollLeft;
			document.getElementById('positionY').value = y+canvas.scrollTop+document.documentElement.scrollTop;
		}
	}
	if(navigator.appName == 'Microsoft Internet Explorer')
	{
		document.getElementById('positionX').value = x+document.body.scrollLeft;
		document.getElementById('positionY').value = y+document.body.scrollTop;
	}
}

function position(event)
{
	var x = Math.round(event.x);
	var y = Math.round(event.y);
	if(navigator.appName == 'Netscape')
	{
		x = Math.round(event.clientX);
		y = Math.round(event.clientY);
		if(navigator.vendor == 'Google Inc.')
		{
			x -= left.offsetLeft+25-canvas.scrollLeft-document.body.scrollLeft;
			y -= left.offsetTop+288-canvas.scrollTop-document.body.scrollTop;
		}
		else
		{
			x -= left.offsetLeft+25-canvas.scrollLeft-document.documentElement.scrollLeft;
			y -= left.offsetTop+289-canvas.scrollTop-document.documentElement.scrollTop;
		}
	}
	if(navigator.appName == 'Microsoft Internet Explorer')
	{
		x -= document.body.scrollLeft;;
		y -= document.body.scrollTop;
	}
	return [x, y];
}

function distance(x1, y1, x2, y2)
{
	var x = (x2) - (x1);
	var y = (y2) - (y1);
	x = Math.pow(x,2);
	y = Math.pow(y,2);
	var value = (x) + (y); 
	return Math.sqrt(value);
}

/*---- keycode ----*/

function keyCode(event) 
{
	if(event)
	{
		var keycode = event.keyCode;
	}

	if(keycode == 67 && event.altKey)
	{
		setCrayon();
	}

	if(keycode == 86 && event.altKey)
	{
		setLigne();
	}

	if(keycode == 66 && event.altKey)
	{
		setRectangle();
	}

	if(keycode == 78 && event.altKey)
	{
		setCercle();
	}

	if(keycode == 90 && event.altKey)
	{
		restoreSaveAuto();
	}

	if(keycode == 83 && event.altKey)
	{
		save();
	}

	if(keycode == 82 && event.altKey)
	{
		restore();
	}

	if(keycode == 88 && event.altKey)
	{
		reset();
	}

	if(keycode == 65 && event.altKey)
	{
		show();
	}

	if(event.ctrlKey && event.altKey)
	{
		var crayonForme = document.getElementById('crayon-forme').value;
		var ligneForme = document.getElementById('ligne-forme').value;
		var rectangleRemplissage = document.getElementById('rectangle-remplissage').value;
		var cercleRemplissage = document.getElementById('cercle-remplissage').value;
		var textRemplissage = document.getElementById('text-remplissage').value;
		var gommeForme = document.getElementById('crayon-forme').value;
		if(crayonForme == "rond" || ligneForme == "rond" || rectangleRemplissage == "avec" || cercleRemplissage == "avec" || textRemplissage == "avec" || gommeForme == "rond")
		{
			document.getElementById('crayon-forme').value = "carre";
			document.getElementById('ligne-forme').value = "carre";
			document.getElementById('rectangle-remplissage').value = "sans";
			document.getElementById('cercle-remplissage').value = "sans";
			document.getElementById('text-remplissage').value = "sans";
			document.getElementById('gomme-forme').value = "carre";
		}
		else
		{
			document.getElementById('crayon-forme').value = "rond";
			document.getElementById('ligne-forme').value = "rond";
			document.getElementById('rectangle-remplissage').value = "avec";
			document.getElementById('cercle-remplissage').value = "avec";
			document.getElementById('text-remplissage').value = "avec";
			document.getElementById('gomme-forme').value = "rond";
		}
	}

	if(event.shiftKey && event.altKey)
	{
		var cercleMode = document.getElementById('cercle-mode').value;
		if(cercleMode == "normal")
		{
			document.getElementById('cercle-mode').value = "rayon";
		}
		else
		{
			document.getElementById('cercle-mode').value = "normal";
		}
	}
}

document.onkeydown = keyCode;

/*---- start action ----*/

var action = "crayon";

function setCrayon()
{
	resetButtonSelection();
	setButtonSelection('crayon');
	action = "crayon";
}

function setLigne()
{
	resetButtonSelection();
	setButtonSelection('ligne');
	action = "ligne";
}

function setRectangle()
{
	resetButtonSelection();
	setButtonSelection('rectangle');
	action = "rectangle";
}

function setCercle()
{
	resetButtonSelection();
	setButtonSelection('cercle');
	action = "cercle";
}

function setText()
{
	resetButtonSelection();
	setButtonSelection('text');
	action = "text";
}

function setGomme()
{
	resetButtonSelection();
	setButtonSelection('gomme');
	action = "gomme";
}

function setAction(event)
{
	if(action == "crayon")
	{
		crayon(event);
	}
	if(action == "ligne")
	{
		ligne(event);
	}
	if(action == "rectangle")
	{
		rectangle(event);
	}
	if(action == "cercle")
	{
		cercle(event);
	}
	if(action == "text")
	{
		text(event);
	}
	if(action == "gomme")
	{
		gomme(event);
	}
}

/*---- action ----*/

var painting = false;
var start = true;
var finish = true;
var startPosX = null;
var startPosY = null;

function mouse()
{
	$('#calque-canvas').mousemove(function(){
	    isMove = true;
	    isUp = false;
	});

	$("#calque-canvas").mousedown(function(){
	    isDown = true;
	    isMove = false;
	    isUp = false;
	    painting = true;
	});

	$('#calque-canvas').mouseup(function(){
		isDown = false;
		isMove = false;
		isUp = true;
	});
}

function mouseOut()
{
	document.getElementById('positionX').value = null;
	document.getElementById('positionY').value = null;
	if(action == "gomme")
	{
		clearCalque();
	}
	if(action == "crayon")
	{
		clearCalque();
		start = true;
		finish = true;
		saveAuto();
	}
}

function crayon(event)
{
	clearCalque();
	mouse();
	var pos = position(event);
	var taille = document.getElementById('crayon-taille').value;
	var forme = document.getElementById('crayon-forme').value;
	pos0 = parseInt(pos[0]) - (parseInt(taille) / 2);
	pos1 = parseInt(pos[1]) - (parseInt(taille) / 2);
	paint.lineWidth = taille;
	calque.lineWidth = "1";
	calque.strokeStyle = "rgba(150, 150, 150, 1)";

	if(forme == "rond")
	{
		paint.lineCap = "round";
		taille = parseInt(taille) / 2;
		calque.beginPath();
		calque.arc(pos[0], pos[1], taille, 0, 2 * Math.PI, true);
		calque.stroke();
	}
	else
	{
		paint.lineCap = "square";
		calque.beginPath();
		calque.rect(pos0, pos1, taille, taille);
		calque.stroke();
	}

	setColor("input");
	if(painting)
	{
		if(isDown)
		{
			if(start == true)
			{
				paint.beginPath();
			    paint.moveTo(pos[0], pos[1]);
			    paint.lineTo(pos[0], pos[1]);
			    paint.stroke();
			    startPosX = pos[0];
				startPosY = pos[1];
			    start = false;
			}
			else
			{
				paint.beginPath();
				paint.moveTo(startPosX, startPosY);
			    paint.lineTo(pos[0], pos[1]);
			    paint.stroke();
			    startPosX = pos[0];
				startPosY = pos[1];
				finish = false;
			}
		}

		if(isUp)
		{
			if(finish == true)
			{
				startPosX = pos[0];
				startPosY = pos[1];

				if(forme == "rond")
				{
					paint.beginPath();
					paint.arc(startPosX, startPosY, taille, 0, 2 * Math.PI, true);
					paint.fill();
				}

				if(forme == "carre")
				{
					pos0 = parseInt(startPosX) - (parseInt(taille) / 2);
					pos1 = parseInt(startPosY) - (parseInt(taille) / 2);
					paint.fillRect(pos0, pos1, taille, taille);
				}
			}
			else
			{
				paint.beginPath();
				paint.moveTo(startPosX, startPosY);
			    paint.lineTo(pos[0], pos[1]);
			    paint.stroke();
			}

			start = true;
			finish = true;
			painting = false;
			saveAuto();
		}
	}
}

function ligne(event)
{
    clearCalque()
    mouse();
	var pos = position(event);
	var taille = document.getElementById('ligne-taille').value;
	var forme = document.getElementById('ligne-forme').value;
	calque.lineWidth = taille;
	paint.lineWidth = taille;

	if(forme == "rond")
	{
		paint.lineCap = "round";
		calque.lineCap = "round";
	}
	else
	{
		paint.lineCap = "square";
		calque.lineCap = "square";
	}

	if(painting)
	{
		if(isDown)
		{
			if(start == true)
			{
				calque.beginPath();
			    calque.moveTo(pos[0], pos[1]);
			    calque.lineTo(pos[0], pos[1]);
			    calque.stroke();
			    startPosX = pos[0];
				startPosY = pos[1];
			    start = false;
			}
			else
			{
				calque.beginPath();
				calque.moveTo(startPosX, startPosY);
			    calque.lineTo(pos[0], pos[1]);
			    calque.stroke();
			    finish = false;
			}
		}

		if(isUp)
		{
			if(finish == true)
			{
				startPosX = pos[0];
				startPosY = pos[1];
			}
			
			paint.beginPath();
			paint.moveTo(startPosX, startPosY);
		    paint.lineTo(pos[0], pos[1]);
		    paint.stroke();
		    startPosX = pos[0];
			startPosY = pos[1];
		    start = true;
		    finish = true;
		    painting = false;
		    saveAuto();
		}
	}
}

function rectangle(event)
{
    clearCalque()
    mouse();
	var pos = position(event);
	var taille = document.getElementById('rectangle-taille').value;
	var remplissage = document.getElementById('rectangle-remplissage').value;
	calque.lineWidth = taille;
	paint.lineWidth = taille;

	if(painting)
	{
		if(isDown)
		{
			if(start == true)
			{
				calque.beginPath();
			    calque.rect(pos[0], pos[1], 0, 0);
			    if(remplissage == "avec")
			    {
			    	calque.fill();
			    }
			    else
			    {
			    	calque.stroke();
			    }
			    startPosX = pos[0];
				startPosY = pos[1];
			    start = false;
			}
			else
			{
				var rectangleWidth = pos[0] - startPosX;
				var rectangleHeight = pos[1] - startPosY;
				calque.beginPath();
			    calque.rect(startPosX, startPosY, rectangleWidth, rectangleHeight);
			    if(remplissage == "avec")
			    {
			    	calque.fill();
			    }
			    else
			    {
			    	calque.stroke();
			    }
			    finish = false;
			}
		}

		if(isUp)
		{
			if(finish == true)
			{
				startPosX = pos[0];
				startPosY = pos[1];
			}
			
			var rectangleWidth = pos[0] - startPosX;
			var rectangleHeight = pos[1] - startPosY;
			paint.beginPath();
		    paint.rect(startPosX, startPosY, rectangleWidth, rectangleHeight);
		    if(remplissage == "avec")
		    {
		    	paint.fill();
		    }
		    else
		    {
		    	paint.stroke();
		    }
		    startPosX = pos[0];
			startPosY = pos[1];
		    start = true;
		    finish = true;
		    painting = false;
		    saveAuto();
		}
	}
}

function cercle(event)
{
    clearCalque()
    mouse();
	var pos = position(event);
	var taille = document.getElementById('cercle-taille').value;
	var remplissage = document.getElementById('cercle-remplissage').value;
	var mode = document.getElementById('cercle-mode').value;
	calque.lineWidth = taille;
	paint.lineWidth = taille;

	if(painting)
	{
		if(mode == "rayon")
		{
			if(isDown)
			{
				if(start == true)
				{
					calque.beginPath();
				    calque.arc(pos[0], pos[1], 0, 0, 2 * Math.PI, false);
				    if(remplissage == "avec")
				    {
				    	calque.fill();
				    }
				    else
				    {
				    	calque.stroke();
				    }
				    startPosX = pos[0];
					startPosY = pos[1];
				    start = false;
				}
				else
				{
					var radius = distance(startPosX, startPosY, pos[0], pos[1]);
					calque.beginPath();
					calque.arc(startPosX, startPosY, radius, 0, 2 * Math.PI, false);
				    if(remplissage == "avec")
				    {
				    	calque.fill();
				    }
				    else
				    {
				    	calque.stroke();
				    }
				    finish = false;
				}
			}

			if(isUp)
			{
				if(finish == true)
				{
					startPosX = pos[0];
					startPosY = pos[1];
				}
				
				var radius = distance(startPosX, startPosY, pos[0], pos[1]);
				paint.beginPath();
				paint.arc(startPosX, startPosY, radius, 0, 2 * Math.PI, false);
			    if(remplissage == "avec")
			    {
			    	paint.fill();
			    }
			    else
			    {
			    	paint.stroke();
			    }
			    startPosX = pos[0];
				startPosY = pos[1];
			    start = true;
			    finish = true;
			    painting = false;
			    saveAuto();
			}
		}
		else
		{
			if(isDown)
			{
				if(start == true)
				{
					calque.beginPath();
				    calque.arc(pos[0], pos[1], 0, 0, 2 * Math.PI, false);
				    if(remplissage == "avec")
				    {
				    	calque.fill();
				    }
				    else
				    {
				    	calque.stroke();
				    }
				    startPosX = pos[0];
					startPosY = pos[1];
				    start = false;
				}
				else
				{
					var cercleWidth = pos[0] - startPosX;
					var cercleHeight = pos[1] - startPosY;
					var posX = startPosX + (cercleWidth / 2);
					var posY = startPosY + (cercleHeight / 2);
					var height = negativeToPositive(cercleHeight);
					var width = negativeToPositive(cercleWidth);
					var radiusWidth = width / 2;
					var radiusHeight = height / 2;
					
					if(radiusHeight < radiusWidth)
					{
						var radius = radiusHeight;
					}
					else
					{
						var radius = radiusWidth;
					}
					calque.beginPath();
					calque.lineWidth = "1";
					calque.strokeStyle = "rgba(150, 150, 150, 1)";
					calque.rect(startPosX, startPosY, cercleWidth, cercleHeight);
					calque.stroke();
					setColor("input");
					calque.lineWidth = taille;
					calque.beginPath();
				    calque.arc(posX, posY, radius, 0, 2 * Math.PI, false);
				    if(remplissage == "avec")
				    {
				    	calque.fill();
				    }
				    else
				    {
				    	calque.stroke();
				    }
				    finish = false;
				}
			}

			if(isUp)
			{
				if(finish == true)
				{
					startPosX = pos[0];
					startPosY = pos[1];
				}
				
				var cercleWidth = pos[0] - startPosX;
				var cercleHeight = pos[1] - startPosY;
				var posX = startPosX + (cercleWidth / 2);
				var posY = startPosY + (cercleHeight / 2);
				var height = negativeToPositive(cercleHeight);
				var width = negativeToPositive(cercleWidth);
				var radiusWidth = width / 2;
				var radiusHeight = height / 2;
				
				if(radiusHeight < radiusWidth)
				{
					var radius = radiusHeight;
				}
				else
				{
					var radius = radiusWidth;
				}
				paint.beginPath();
			    paint.arc(posX, posY, radius, 0, 2 * Math.PI, false);
			    if(remplissage == "avec")
			    {
			    	paint.fill();
			    }
			    else
			    {
			    	paint.stroke();
			    }
			    startPosX = pos[0];
				startPosY = pos[1];
			    start = true;
			    finish = true;
			    painting = false;
			    saveAuto();
			}
		}
	}
}

function text(event)
{
	clearCalque()
	mouse();
	var pos = position(event);
	var text = document.getElementById('text-text').value;
	var taille = document.getElementById('text-taille').value;
	var remplissage = document.getElementById('text-remplissage').value;
	var police = document.getElementById('text-police').value;
	var style = document.getElementById('text-style').value;

	if(painting)
	{
		if(isDown)
		{
			calque.font = style+" "+taille+"pt "+police;
			calque.textAlign = "center";
			calque.textBaseline = "middle";
			if(remplissage == "avec")
		    {
		    	calque.fillText(text, pos[0], pos[1]);
		    }
		    else
		    {
		    	calque.strokeText(text, pos[0], pos[1]);
		    }
		}

		if(isUp)
		{
			paint.font = style+" "+taille+"pt "+police;
			paint.textAlign = "center";
			paint.textBaseline = "middle";
			if(remplissage == "avec")
		    {
		    	paint.fillText(text, pos[0], pos[1]);
		    }
		    else
		    {
		    	paint.strokeText(text, pos[0], pos[1]);
		    }

		    painting = false;
		    saveAuto();
		}
	}
}

function gomme(event)
{
	clearCalque();
	mouse();
	var pos = position(event);
	var taille = document.getElementById('gomme-taille').value;
	var forme = document.getElementById('gomme-forme').value;
	pos0 = parseInt(pos[0]) - (parseInt(taille) / 2);
	pos1 = parseInt(pos[1]) - (parseInt(taille) / 2);
	paint.lineWidth = taille;
	calque.lineWidth = "1";
	calque.strokeStyle = "rgba(150, 150, 150, 1)";

	if(forme == "rond")
	{
		paint.lineCap = "round";
		taille = parseInt(taille) / 2;
		calque.beginPath();
		calque.arc(pos[0], pos[1], taille, 0, 2 * Math.PI, true);
		calque.stroke();
	}
	else
	{
		paint.lineCap = "square";
		calque.beginPath();
		calque.rect(pos0, pos1, taille, taille);
		calque.stroke();
	}

	setColor("input");
	if(painting)
	{
		if(isDown)
		{
			if(start == true)
			{
				paint.beginPath();
				paint.globalCompositeOperation = 'destination-out';
			    paint.moveTo(pos[0], pos[1]);
			    paint.lineTo(pos[0], pos[1]);
			    paint.stroke();
			    startPosX = pos[0];
				startPosY = pos[1];
			    start = false;
			}
			else
			{
				paint.beginPath();
				paint.globalCompositeOperation = 'destination-out';
				paint.moveTo(startPosX, startPosY);
			    paint.lineTo(pos[0], pos[1]);
			    paint.stroke();
			    startPosX = pos[0];
				startPosY = pos[1];
				finish = false;
			}
		}

		if(isUp)
		{
			if(finish == true)
			{
				startPosX = pos[0];
				startPosY = pos[1];

				if(forme == "rond")
				{
					paint.beginPath();
					paint.globalCompositeOperation = 'destination-out';
					paint.arc(startPosX, startPosY, taille, 0, 2 * Math.PI, true);
					paint.fill();
				}

				if(forme == "carre")
				{
					pos0 = parseInt(startPosX) - (parseInt(taille) / 2);
					pos1 = parseInt(startPosY) - (parseInt(taille) / 2);
					paint.globalCompositeOperation = 'destination-out';
					paint.fillRect(pos0, pos1, taille, taille);
				}
			}
			else
			{
				paint.beginPath();
				paint.moveTo(startPosX, startPosY);
			    paint.lineTo(pos[0], pos[1]);
			    paint.stroke();
			}

			start = true;
			finish = true;
			painting = false;
			paint.globalCompositeOperation = 'source-over';
			saveAuto();
		}
	}
}

/*---- reset save restore ----*/

function saveAuto()
{
	saveAutoData.push(paintZone.toDataURL());
}

function restoreSaveAuto()
{
	reset();
	var lastSaveAutoData = saveAutoData.length-2;
	var image = new Image();
	image.src = saveAutoData[lastSaveAutoData];
	image.onload = function() {
		paint.drawImage(image, 0, 0);
	};
	saveAutoData.pop();
}

function restoreAuto()
{
	reset();
	var lastSaveAutoData = saveAutoData.length-1;
	var image = new Image();
	image.src = saveAutoData[lastSaveAutoData];
	image.onload = function() {
		paint.drawImage(image, 0, 0);
	};
}

function reset()
{
	startPosX = null;
	startPosY = null;
	paint.clearRect(0, 0, paintZone.width, paintZone.height);
}

function clearCalque()
{
	calque.clearRect(0, 0, calqueZone.width, calqueZone.height);
}

function save()
{
	paintData = paintZone.toDataURL();
	zttxSave = zttx;
	zttySave = ztty;
}

function restore()
{
	zttx = zttxSave;
	ztty = zttySave;
	document.getElementById('zttx').value = zttx;
	document.getElementById('ztty').value = ztty;
	document.getElementById('paint-canvas').width = zttx;
	document.getElementById('paint-canvas').height = ztty;
	document.getElementById('calque-canvas').width = zttx;
	document.getElementById('calque-canvas').height = ztty;
	setColor('input');
	reset();
	var image = new Image();
	image.src = paintData;
	image.onload = function() {
		paint.drawImage(image, 0, 0);
		saveAuto();
	};
}

function show()
{
	var showData = paintZone.toDataURL();
	window.open(showData);
}