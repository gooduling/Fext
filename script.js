var width = 210;
var count = 3; 
var ul = document.getElementById('suggestions');
var item = ul.getElementsByTagName('li');
var position = 0; 
var timer;
var duration=2000;

function prev() {
	if (position >= 0) position=-width*(item.length-count+1);
	position = position + width;
	ul.style.marginLeft = position + 'px';
	return false
}
function next() {
	if (position <= -width*(item.length-count)) position=width; 
	position = position-width;
	ul.style.marginLeft = position + 'px';
	return false
}
function run() {
	var left = 0; 
	timer = setInterval(next, duration);
	if (position > 9000) clearInterval(timer) 
}

document.body.onload = run
document.getElementById('prev').onclick = prev;
document.getElementById('next').onclick = next;
document.getElementById('whatson').onmouseover = function(){clearInterval(timer)};
document.getElementById('whatson').onmouseout = function(){clearInterval(timer); run()}; // clearInterval дублируется для исключения возможности дублирования запуска run()
