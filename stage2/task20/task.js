function validateInput() {
	if (userInput.value === "") return false;
	return true;
}

function leftIn() {
	if (!validateInput()) return;
	var new_p = document.createElement("p");
	
	/*将用户要插入的内容进行实体转换*/
	new_p.innerHTML = userInput.value.trim()
							   .replace(/&/gi,"&amp;")
							   .replace(/ /gi,"&nbsp;")
							   .replace(/>/gi,"&gt;")
							   .replace(/</gi,"&lt;");
	new_p.onclick = clickP;
	current_queue.unshift(new_p);
	renderQueue();
}
function leftOut() {
	unHighlight();

	/*将从p标签中读出来的内容中包含的实体进行转换*/
	alert("\""+ current_queue[0].innerHTML.replace(/&amp;/gi,"&")
										  .replace(/&lt;/gi,"<")
										  .replace(/&gt;/gi,">")
										  .replace(/&nbsp;/gi," ")  + "\"");
	current_queue.shift();
	renderQueue();
}
function rightIn() {
	if (!validateInput()) return;
	var new_p = document.createElement("p");

	/*将用户要插入的内容进行实体转换*/
	new_p.innerHTML = userInput.value.trim()
							   .replace(/&/gi,"&amp;")
							   .replace(/ /gi,"&nbsp;")
							   .replace(/>/gi,"&gt;")
							   .replace(/</gi,"&lt;");
	new_p.onclick = clickP;
	current_queue.push(new_p);
	renderQueue();
}

function rightOut() {
	unHighlight();

	/*将从p标签中读出来的内容中包含的实体进行转换*/
	alert("\""+ current_queue[current_queue.length - 1].innerHTML.replace(/&amp;/gi,"&")
																 .replace(/&lt;/gi,"<")
																 .replace(/&gt;/gi,">")
																 .replace(/&nbsp;/gi," ") + "\"");
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

/*根据用户输入高亮显示p标签中的匹配内容*/
function matchInput() {
	/*将p标签中的内容还原回来，防止每次查询时出现span标签嵌套*/
	unHighlight();

	/*获取用户使用各种分隔符分隔的多个查询内容*/
	var formatArr = userInput.value.replace(/,/gi," ")
								   .replace(/;/gi," ")
								   .replace(/、/gi," ")
								   .replace(/	/gi," ")
								   .replace(/　/gi," ")
								   .replace(/ +/gi," ")
								   .trim()
								   .split(" ");

	for (var m = 0; m < current_queue.length; m++) {
		for (var n = 0; n < formatArr.length; n++) {

			/*将用户输入的每个内容进行实体的转换*/
			formatStr = formatArr[n].replace(/&/gi,"&amp;")
								   	.replace(/>/gi,"&gt;")
								   	.replace(/</gi,"&lt;");

			current_queue[m].innerHTML = current_queue[m].innerHTML.replace( new RegExp(formatStr,"gi"),
							"<span class="+ color[ n % 5 ] +">" + formatStr + "</span>");
		}
	}
	renderQueue();
}

/*取消文字高亮，清除p标签中包含的所有的span标签*/
function unHighlight() {
	for (var i = 0; i < current_queue.length; i++) {
		current_queue[i].innerHTML = current_queue[i].innerHTML.replace(/<span class=\"blue\">/gi,"")
															   .replace(/<span class=\"black\">/gi,"")
															   .replace(/<span class=\"green\">/gi,"")
															   .replace(/<span class=\"yellow\">/gi,"")
															   .replace(/<span class=\"purple\">/gi,"")
															   .replace(/<\/span>/gi,"");
	}
	renderQueue();
}
var current_queue = [],
	color = ["blue","green","yellow","black","purple"],
	target_div = document.getElementById("queue"),
	userInput = document.getElementsByTagName("textarea")[0];

/*渲染全局数组中所有的p标签*/
function renderQueue() {
	target_div.innerHTML = "";
	for (var i = 0; i < current_queue.length; i++) {
		target_div.appendChild(current_queue[i]);
	}
}

/*初始化用户界面*/
function initialUI(){
	document.getElementById("leftIn").onclick = leftIn;
	document.getElementById("leftOut").onclick = leftOut;
	document.getElementById("rightIn").onclick = rightIn;
	document.getElementById("rightOut").onclick = rightOut;
	document.getElementById("search").onclick = matchInput;
	document.getElementById("unhighlight").onclick = unHighlight;
}

window.onload = function(){
	initialUI();
};