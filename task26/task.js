function spaceship(id) {
	this.energy = 100;
	this.speed = 50;
	this.id = id;
	this.rotateAngle = 0;
	this.status = "created";
}

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

spaceship.prototype.createController = function() {
	var newState = document.createElement("p"),
		startButton = document.createElement("button"),
		stopButton = document.createElement("button"),
		destroyButton = document.createElement("button"),
		supplyButton = document.createElement("button"),
		that = this;

	startButton.innerHTML = "开始飞行";
	startButton.onclick = function () {
		var success = parseInt(Math.random() * 100) + 1,
			target = document.getElementById("ship" + that.id),
			targetInfo = target.getElementsByTagName("p")[0],
			timeCounter = 0,
			logP = document.createElement("p");

		if(success > 30) {
			if (that.energy > 0) {
				clearTimeout(that.startTimer);
				logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“开始飞行”指令发送成功！";
				that.status = "running";
				that.startTimer = setTimeout(function () {
					that.runningTimer = setInterval(function () {
						if (timeCounter++ === 10) {
							targetInfo.innerHTML = that.id + "号<br>" + that.energy + "%";
							timeCounter = 0;
						}
						if (that.energy === 0) {
							clearTimeout(that.runningTimer);
							that.status = "stopped";
							targetInfo.innerHTML = that.id + "号<br>" + that.energy + "%";
						} else {
							that.rotateAngle += that.speed * 0.1;
							target.style.transform = "rotate(" + that.rotateAngle + "deg)";
							target.style.webkitTransform = "rotate(" + that.rotateAngle + "deg)";
							target.style.mozTransform = "rotate(" + that.rotateAngle + "deg)";

							that.energy -= 0.5;
							that.speed = 0.3 * that.energy;
						}
					},100);
				},1000);
			} else {
				logP.innerHTML = new Date() + " : " + that.id + "号飞船能源不足，请补充能源！";
			}
		} else {
			logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“开始飞行”指令发送失败！";
		}
		consolelog.appendChild(logP);
	};

	stopButton.innerHTML = "停止飞行";
	stopButton.onclick = function() {
		
		var success = parseInt(Math.random() * 100) + 1,
			logP = document.createElement("p");
		if (success > 30) {
			if (that.status === "running") {
				clearTimeout(that.runningTimer);
				that.status = "stopped";
				logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“停止飞行”指令成功！";
			} else {
				logP.innerHTML = new Date() + " : " + that.id + "号飞船并不在运行当中！";
			}
		} else {
			logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“停止飞行”指令失败！";
		}
		consolelog.appendChild(logP);
	};

	destroyButton.innerHTML = "自我销毁";
	destroyButton.onclick = function() {
		var success = parseInt(Math.random() * 100) + 1,
			logP = document.createElement("p");
		if (success > 30) {
			clearTimeout(that.destroyTimer);
			that.destroyTimer = setTimeout(function () {
				space.removeChild(document.getElementById("ship" + that.id));
				state.removeChild(document.getElementById("ship" + that.id + "State"));
				shipArr[that.id] = undefined;

				var successDestroy = document.createElement("p");
				successDestroy.innerHTML = new Date() + " : "+ that.id +"号飞船销毁成功！";
				consolelog.appendChild(successDestroy);
			},2000);
			logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“自我销毁”指令成功！2秒钟后自动销毁...";
		} else {
			logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“自我销毁”指令失败！";
		}
		consolelog.appendChild(logP);
	};

	supplyButton.innerHTML = "补充能源";
	supplyButton.onclick = function() {
		var success = parseInt(Math.random() * 100) + 1,
			updateEnergy = document.getElementById("ship" + that.id).getElementsByTagName("p")[0],
			logP = document.createElement("p");

		if (success > 30) {
			clearTimeout(that.supplyTimer);
			switch(that.status) {
				case "created":
					alert(that.id + "号飞船能源充足，不需要补充能源！");
					return;
				case "running":
					alert(that.id + "号飞船正在运行当中，请先停止飞船运行再补充能源！");
					return;
			}
			that.supplyTimer = setInterval(function () {
				if (that.energy >= 95) {
					clearTimeout(that.supplyTimer);
					that.energy = 100;
					updateEnergy.innerHTML = that.id + "号<br>" + that.energy + "%";

					logP.innerHTML = new Date() + " : "+ that.id +"号飞船能源补充完成！";
				} else {
					that.energy += 5;
					updateEnergy.innerHTML = that.id + "号<br>" + that.energy + "%";
				}
			},1000);
		} else {
			logP.innerHTML = new Date() + " : 对" + that.id + "号飞船发送“补充能源”指令失败！";
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
	state = document.getElementById("state"),
	consolelog = document.getElementById("console");

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

function initial() {
	document.getElementById("launch").onclick = launchAShip;
}

initial();