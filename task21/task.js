/*Tag插入操作*/
function insertTag(value,target) {
	return function() {
		var formatStr = value.trim().replace(/&/gi,"&amp;").replace(/ /gi,"&nbsp;").replace(/</gi,"&lt;").replace(/>/gi,"&gt;");
		if (formatStr === "") return;
		for (var i = 0; i < current_queue.length; i++) {
			if (formatStr === current_queue[i].innerHTML) {
				alert("\"" + value.trim() + "\"已存在，请勿重复添加！");
				return;
			}
		}
		var new_p = document.createElement("p");
		new_p.innerHTML = formatStr;
		new_p.onclick = clickP(target);
		new_p.onmouseover = mouseOverP;
		new_p.onmouseout = mouseOutP;
		if (current_queue.length === 10) {
			current_queue.shift();
		}
		current_queue.push(new_p);
		renderQueue(target);
	};
}
/*内容为用户输入的兴趣爱好的p标签的插入操作*/
function insertHobby() {
	var hobbys = hobbyInput.value.trim().replace(/,/gi," ")
										.replace(/、/gi," ")
										.replace(/，/gi," ")
										.replace(/　/gi," ")
										.replace(/ +/gi," ")
										.split(" ");
	for (var i = 0; i < hobbys.length; i++) {
		insertTag(hobbys[i],hobbyDiv)();
	}
}

/*定义鼠标移入每个p标签时触发的事件处理函数*/
function mouseOverP() {
	this.innerHTML = "删除<br>" + this.innerHTML + "<br>?";
}

/*定义鼠标从每个p标签移出时触发的事件处理函数*/
function mouseOutP() {
	this.innerHTML = this.innerHTML.replace(/删除<br>/gi,"")
								   .replace(/<br>\?/gi,"");
}

/*定义每个容器中p标签被点击时触发的事件处理函数*/
function clickP(target){
	return function() {
		for (var i = 0; i < current_queue.length; i++) {
			if(current_queue[i] === this){
				current_queue.splice(i,1);
				break;
			}
		}
		renderQueue(target);
	};
}

/*定义输入Tag时相应按键按下时触发的事件处理函数*/
function handleKeyDownInTagInput(event) {
	switch(event.keyCode) {
		case 13:
		case 32:
		case 188:
			insertTag(tagInput.value,tagDiv)();
			break;
	}
}
var current_queue = [],
	tagDiv = document.getElementById("tagQueue"),
	hobbyDiv = document.getElementById("hobbyQueue"),
	tagInput = document.getElementById("tagInput"),
	hobbyInput = document.getElementById("hobbyInput");

/*根据指定参数将全局数组中的p标签渲染到目标容器target中*/
function renderQueue(target) {
	target.innerHTML = "";
	for (var i = 0; i < current_queue.length; i++) {
		target.appendChild(current_queue[i]);
	}
}
/*初始化用户界面*/
function initialUI(){
	document.getElementById("insertTag").onclick = insertTag(tagInput.value,tagDiv);
	tagInput.onkeydown = handleKeyDownInTagInput;
	document.getElementById("insertHobby").onclick = insertHobby;
}

window.onload = function(){
	initialUI();
};