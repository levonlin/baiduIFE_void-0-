function leftIn() {
	var parseUserInput = parseFloat(userInput.value);
	if ((!parseUserInput)&&(parseUserInput !== 0)) {
		alert("输入的内容必须是数值，请重新输入！");
		return;
	}
	var new_p = document.createElement("p");
	new_p.innerHTML = parseUserInput;
	new_p.onclick = clickP;
	current_queue.unshift(new_p);
	renderQueue();
}
function leftOut() {
	alert(current_queue[0].innerHTML);
	current_queue.shift();
	renderQueue();
}
function rightIn() {
	var parseUserInput = parseFloat(userInput.value);
	if ((!parseUserInput)&&(parseUserInput !== 0)) {
		alert("输入的内容必须是数值，请重新输入！");
		return;
	}
	var new_p = document.createElement("p");
	new_p.innerHTML = parseUserInput;
	new_p.onclick = clickP;
	current_queue.push(new_p);
	renderQueue();
}
function rightOut() {
	alert(current_queue[current_queue.length - 1].innerHTML);
	current_queue.pop();
	renderQueue();
}
function clickP(){
	for (var i = 0; i < current_queue.length; i++) {
		if(current_queue[i] === this){
			current_queue.splice(i,1);
			break;
		}
	}
	renderQueue();
}
var current_queue = [],
	target_div = document.getElementById("queue"),
	userInput = document.getElementsByTagName("input")[0];
function renderQueue() {
	target_div.innerHTML = "";
	for (var i = 0; i < current_queue.length; i++) {
		target_div.appendChild(current_queue[i]);
	}
}
function initialUI(){
	document.getElementById("leftIn").onclick = leftIn;
	document.getElementById("leftOut").onclick = leftOut;
	document.getElementById("rightIn").onclick = rightIn;
	document.getElementById("rightOut").onclick = rightOut;
}

window.onload = function(){
	initialUI();
};