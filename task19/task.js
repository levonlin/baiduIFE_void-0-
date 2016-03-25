function insert() {
	var temp,
		parseUserInput = parseFloat(userInput.value);

	/*判断用户输入是否合法*/
	if (!parseUserInput) {
		if (parseUserInput === 0) {
			alert("输入的数值必须在10-100之间，请重新输入！");
		}else{
			alert("输入的内容必须是数值，请重新输入！");
		}
		return;
	}
	if ((parseUserInput<10)||(parseUserInput>100)) {
		alert("输入的数值必须在10-100之间，请重新输入！");
		return;
	}
	/*判断方块数目是否已达上限*/
	if (current_queue >= 60) {
		alert("添加条目个数已达上限！");
		return;
	}
	/*创建新的p标签并设置相应属性*/
	var new_p = document.createElement("p");
	new_p.style.height = parseUserInput + "px";
	new_p.title = parseUserInput;
	new_p.onclick = clickP;

	/*添加新的p标签到全局数组中，并按高度进行排序*/
	current_queue.unshift(new_p);
	for (var i = 0; i < current_queue.length; i++) {
		if(current_queue[i+1]) {
			if(current_queue[i].title>current_queue[i+1].title) {
				temp = current_queue[i];
				current_queue[i] = current_queue[i+1];
				current_queue[i+1] = temp;
			}else{
				break;
			}
		}
	}
	renderQueue();
}
/*定义左侧出触发时的处理函数，并刷新*/
function leftOut() {
	if(current_queue.length!==0){
		current_queue.shift();
		renderQueue();
	}
}
/*定义右侧出触发时的处理函数，并刷新*/
function rightOut() {
	if(current_queue.length!==0){
		current_queue.pop();
		renderQueue();
	}
}
/*定义方块被点击时的处理函数，并刷新*/
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
/*根据全局数组中的内容渲染出数组中所有的p标签*/
function renderQueue() {
	target_div.innerHTML = "";
	var placeholder = document.createElement("p");
	placeholder.className = "placeholder";
	target_div.appendChild(placeholder);
	for (var i = 0; i < current_queue.length; i++) {
		target_div.appendChild(current_queue[i]);
	}
}
/*初始化用户界面，为相应控件绑定事件处理函数*/
function initialUI(){
	document.getElementById("insert").onclick = insert;
	document.getElementById("leftOut").onclick = leftOut;
	document.getElementById("rightOut").onclick = rightOut;
}

window.onload = function(){
	initialUI();
};