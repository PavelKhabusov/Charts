let canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		wrap = document.querySelector('.wrap'),
		DATA,
		wLeveler = 8640000,
		hLeveler = 100,
		btn = document.getElementById('next'),
		k = 0;
function getFile (fileName) {
	var request = new XMLHttpRequest();
	request.open('GET', fileName);
	request.onloadend = function() {
			parse(request.responseText);
	}
	request.send();
}
getFile('js/chart_data.json'); //путь к файлу
btn.addEventListener('click', function(){
	if(k<4){
		k++;
	} else {
		k = 0;
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#222";
	ctx.fillRect(0, 0, 99512, 100000);
	getFile('js/chart_data.json');
});
function parse(obj) {	
	DATA = JSON.parse(obj);
	let min = 30000, 
			max = 0,
			yQuantity = DATA[k].columns.length-1,
			maxmin = min, 
			maxmax = max;
	function minMax(yg) {
		for(let m = 0; m < DATA[k].columns[`${yg}`].length; m++) {
			if(DATA[k].columns[`${yg}`][m]*hLeveler < min) {
				min = DATA[k].columns[`${yg}`][m]*hLeveler;
			}
			if(DATA[k].columns[`${yg}`][m]*hLeveler > max) {
				max = DATA[k].columns[`${yg}`][m]*hLeveler;
			}
		}
		min-=1000;
		max+=1000;
	}
	for(let yQu = 1; yQu <= yQuantity; yQu++) {
		minMax(yQu);
		if(maxmax < max) {
			maxmax = max;
		} 
		if(maxmin > min) {
			maxmin = min;
		}
	}
	console.log(maxmin);
	console.log(maxmax);
	let coeff = maxmax/30000;
	console.log(coeff);
	hLeveler /= coeff;
	console.log(hLeveler);

	function drawTheLine(p) {
		let yp = 'y' + (p-1);
		ctx.lineWidth = '1';
		ctx.strokeStyle = DATA[k].colors[`${yp}`];
		ctx.beginPath();
		ctx.moveTo(0, DATA[k].columns[p][1]*hLeveler);
		for(let j = 1; j < DATA[k].columns[0].length; j++) {
			ctx.lineTo((DATA[k].columns[0][j]-DATA[k].columns[0][1])/wLeveler, DATA[k].columns[p][j]*hLeveler);
		}
		ctx.stroke();
	}
	for(let yQu = 1; yQu <= yQuantity; yQu++) {
		drawTheLine(yQu);
	}
}
ctx.fillStyle = "#222";
ctx.fillRect(0, 0, 99512, 100000);