function spaceship(id) {
	this.energy = 100;
	this.speed = valueObj.speed;
	this.consume = valueObj.consume;
	this.supply = valueObj.supply;
	this.speedType = valueObj.speedType;
	this.supplyType = valueObj.supplyType;
	this.id = id;
	this.rotateAngle = 0;
	this.status = "created";
}
/*在“太空”中创建出“飞船”实体*/
spaceship.prototype.createAShip = function() {
	var newshipDomNode = document.createElement("div"),
		newPtag = document.createElement("p");

	newPtag.innerHTML = this.id + "号<br>" + this.energy + "%";
	newshipDomNode.appendChild(newPtag);

	newshipDomNode.className = "spaceship";
	newshipDomNode.id = "ship" + this.id;
	space.appendChild(newshipDomNode);
	shipArr[this.id] = this;
};
/*初始化与刚创建的飞船相关的控制按钮*/
spaceship.prototype.createController = function() {
	var newState = document.createElement("p"),
		startButton = document.createElement("button"),
		stopButton = document.createElement("button"),
		destroyButton = document.createElement("button"),
		supplyButton = document.createElement("button"),
		currentLine = document.getElementById("ship" + this.id + "Line"),
		currentLineTd = currentLine.getElementsByTagName("td"),
		that = this;

	currentLine.getElementsByTagName("td")[0].innerHTML = that.id + "号";
	currentLine.getElementsByTagName("td")[1].innerHTML = that.speedType;
	currentLine.getElementsByTagName("td")[2].innerHTML = that.supplyType;
	currentLine.getElementsByTagName("td")[3].innerHTML = "准备起飞";
	currentLine.getElementsByTagName("td")[4].innerHTML = parseInt(that.energy) + "%";

	/*初始化创建的飞船的“开始飞行”按钮*/
	startButton.innerHTML = "开始飞行";
	startButton.onclick = function () {
		var success = parseInt(Math.random() * 100) + 1,
			target = document.getElementById("ship" + that.id),
			targetInfo = target.getElementsByTagName("p")[0],
			timeCounter = 0,
			logP = document.createElement("p");
		/*模拟10%的丢包率*/
		if(success > 10) {
			if (that.energy > 0) {
				clearTimeout(that.startTimer);
				clearTimeout(that.runningTimer);
				logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“开始飞行”指令发送成功！";
				if (that.status === "supplying") {
					alert(that.id + "号飞船正在补充能源中，请稍后再启动！");
					return;
				} else {
					/*设置飞船的运行状态*/
					that.status = "running";
					/*更新监视图中飞船的运行状态*/
					currentLine.getElementsByTagName("td")[3].innerHTML = "正在运行中";
					that.startTimer = setTimeout(function () {
						that.runningTimer = setInterval(function () {
							if (timeCounter++ === 10) {
								targetInfo.innerHTML = that.id + "号<br>" + parseInt(that.energy) + "%";
								currentLine.getElementsByTagName("td")[4].innerHTML = parseInt(that.energy) + "%";
								timeCounter = 0;
							}
							if (that.energy <= 0) {
								clearTimeout(that.runningTimer);
								/*实时更新飞船的当前状态*/
								that.status = "stopped";
								currentLine.getElementsByTagName("td")[3].innerHTML = "停止运行";
								that.energy = 0;
								targetInfo.innerHTML = that.id + "号<br>0%";
								currentLine.getElementsByTagName("td")[4].innerHTML = that.energy + "%";
							} else {
								that.rotateAngle += that.speed * 0.1;
								target.style.transform = "rotate(" + that.rotateAngle + "deg)";
								target.style.webkitTransform = "rotate(" + that.rotateAngle + "deg)";
								target.style.mozTransform = "rotate(" + that.rotateAngle + "deg)";

								that.energy -= that.consume;
								that.speed = 0.3 * that.energy;
							}
						},100);
					},1000);
				}
			} else {
				logP.innerHTML = new Date() + " : " + that.id + "号飞船能源不足，请补充能源！";
			}
		} else {
			logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“开始飞行”指令发送失败，请重新尝试！";
		}
		consolelog.appendChild(logP);
	};

	/*初始化创建的飞船的“停止飞行”按钮*/
	stopButton.innerHTML = "停止飞行";
	stopButton.onclick = function() {
		var success = parseInt(Math.random() * 100) + 1,
			logP = document.createElement("p");
		if (success > 10) {
			if (that.status === "running") {
				clearTimeout(that.startTimer);
				clearTimeout(that.runningTimer);
				that.status = "stopped";
				currentLine.getElementsByTagName("td")[3].innerHTML = "停止运行";
				logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“停止飞行”指令成功！";
			} else {
				logP.innerHTML = new Date() + " : " + that.id + "号飞船并不在运行当中！";
			}
		} else {
			logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“停止飞行”指令失败，请重新尝试！";
		}
		consolelog.appendChild(logP);
	};

	/*初始化创建的飞船的“自我销毁”按钮*/
	destroyButton.innerHTML = "自我销毁";
	destroyButton.onclick = function() {
		var success = parseInt(Math.random() * 100) + 1,
			logP = document.createElement("p");
		if (success > 10) {
			clearTimeout(that.runningTimer);
			clearTimeout(that.supplyTimer);
			clearTimeout(that.destroyTimer);
			that.destroyTimer = setTimeout(function () {
				space.removeChild(document.getElementById("ship" + that.id));
				state.removeChild(document.getElementById("ship" + that.id + "State"));
				shipArr[that.id] = undefined;

				var successDestroy = document.createElement("p");
				successDestroy.innerHTML = new Date() + " : "+ that.id +"号飞船销毁成功！";
				consolelog.appendChild(successDestroy);
				for (var i = 0; i < currentLineTd.length; i++) {
					currentLineTd[i].innerHTML = "";
				}
			},2000);
			logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“自我销毁”指令成功！2秒钟后自动销毁...";
		} else {
			logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“自我销毁”指令失败，请重新尝试！";
		}
		consolelog.appendChild(logP);
	};
	/*初始化创建的飞船的“补充能源”按钮*/
	supplyButton.innerHTML = "补充能源";
	supplyButton.onclick = function() {
		var success = parseInt(Math.random() * 100) + 1,
			updateEnergy = document.getElementById("ship" + that.id).getElementsByTagName("p")[0],
			logP = document.createElement("p");

		if (success > 10) {
			clearTimeout(that.supplyTimer);
			switch(that.status) {
				case "created":
					alert(that.id + "号飞船能源充足，不需要补充能源！");
					return;
				case "running":
					alert(that.id + "号飞船正在运行当中，请先停止飞船运行再补充能源！");
					return;
			}
			var reportSupplyState = document.createElement("p");
			reportSupplyState.innerHTML = new Date() + " : "+ "正在为" + that.id + "号飞船补充能源，请稍等...";
			consolelog.appendChild(reportSupplyState);
			that.status = "supplying";
			currentLine.getElementsByTagName("td")[3].innerHTML = "补充能源中";
			that.supplyTimer = setInterval(function () {
				if (that.energy >= 97) {
					clearTimeout(that.supplyTimer);
					that.energy = 100;
					that.status = "stopped";
					updateEnergy.innerHTML = that.id + "号<br>" + that.energy + "%";
					currentLine.getElementsByTagName("td")[3].innerHTML = "停止运行";
					currentLine.getElementsByTagName("td")[4].innerHTML = that.energy + "%";
					logP.innerHTML = new Date() + " : "+ that.id +"号飞船能源补充完成！";
				} else {
					that.energy += that.supply;
					updateEnergy.innerHTML = that.id + "号<br>" + that.energy + "%";
					currentLine.getElementsByTagName("td")[4].innerHTML = that.energy + "%";
				}
			},1000);
		} else {
			logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“补充能源”指令失败，请重新尝试！";
		}
		consolelog.appendChild(logP);
	};

	newState.innerHTML = "对" + this.id + "号飞船下达指令：";
	newState.appendChild(startButton);
	newState.appendChild(stopButton);
	newState.appendChild(destroyButton);
	newState.appendChild(supplyButton);
	newState.id = "ship" + this.id + "State";
	state.appendChild(newState);
};


var count = 0,
	shipArr = [],
	space = document.getElementById("space"),
	power = document.getElementById("power"),
	energy = document.getElementById("energy"),
	state = document.getElementById("state"),
	consolelog = document.getElementById("console"),
	valueObj = {speed:30,consume:0.5,supply:2,speedType:"前进号",supplyType:"劲量型"};
/*处理用户输入，根据用户的不同选择做不同的初始化*/
function handleUserInput() {
	
	var powerInputs = power.getElementsByTagName("input"),
		energyInputs = energy.getElementsByTagName("input"),
		createSuccess = document.createElement("p");

	for (var i = 0; i < powerInputs.length; i++) {
		if(powerInputs[i].checked) {
			switch(powerInputs[i].value) {
				case "lowSpeed":
					valueObj.speedType = "前进号";
					valueObj.speed = 30;
					valueObj.consume = 0.5;
					break;

				case "middleSpeed":
					valueObj.speedType = "奔腾号";
					valueObj.speed = 50;
					valueObj.consume = 0.7;
					break;

				case "highSpeed":
					valueObj.speedType = "超越号";
					valueObj.speed = 80;
					valueObj.consume = 0.9;
					break;
			}
			break;
		}
	}

	for (var j = 0; j < energyInputs.length; j++) {
		if(energyInputs[j].checked) {
			switch(energyInputs[j].value) {
				case "slowSupply":
					valueObj.supplyType = "劲量型";
					valueObj.supply = 2;
					break;

				case "middleSupply":
					valueObj.supplyType = "光能型";
					valueObj.supply = 3;
					break;

				case "fastSupply":
					valueObj.supplyType = "永久型";
					valueObj.supply = 4;
					break;
			}
			break;
		}
	}
	createSuccess.innerHTML = new Date() + " : 新的飞船创建成功！正在等待起飞...";
	consolelog.appendChild(createSuccess);
}
/*定义用户点击“新的飞船起飞”按钮触发的事件处理程序*/
function launchAShip() {
	if (shipArr.length === 4) {
		var flag = false;
		for (var i = 0; i < shipArr.length; i++) {
			if(shipArr[i] === undefined) {
				flag = true;
				break;
			}
		}
		if (flag) {
			count = i;
		} else {
			alert("当前创建的飞船数目已达上限！");
			return;
		}
	}
	
	var newship = new spaceship(count++);
	newship.createAShip();
	newship.createController();
}
/*初始化可拖曳的监视图面板*/
function initialTablePanel() {
	var isDown = false,
		originX,originY,
		panel = document.getElementById("movablePanel"),
		pageWidth = document.body.clientWidth,
		pageHeight = document.body.clientHeight;

	document.getElementById("title").onmousedown = function(event){
		/*console.log(event.pageX);*/
		isDown = true;
		
		originX = event.pageX - panel.offsetLeft;
		originY = event.pageY - panel.offsetTop;
	};

	document.onmousemove = function(event) {
		if (isDown) {
			
			panel.style.left = event.pageX - originX + "px";
			panel.style.top = event.pageY - originY + "px";

			if (panel.offsetLeft + panel.offsetWidth >= pageWidth) {
				panel.style.left = pageWidth - panel.offsetWidth + "px";
			} else if(panel.offsetLeft <= 0) {
				panel.style.left = 0;
			}

			if (panel.offsetTop + panel.offsetHeight >= pageHeight) {
				panel.style.top = pageHeight - panel.offsetHeight + "px";
			} else if(panel.offsetTop <= 0) {
				panel.style.top = 0;
			}
		}
	};

	document.onmouseup = function(){
		isDown = false;
	};
}
/*页面初始化*/
function initial() {
	
	document.getElementById("launch").onclick = launchAShip;
	document.getElementById("create").onclick = handleUserInput;

	initialTablePanel();
}

initial();