/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {
	"北京": 90,
	"上海": 40,
	"广州": 20
};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var cityName = document.getElementById('aqi-city-input').value.trim();
	var aqiValue = document.getElementById('aqi-value-input').value.trim();
  if (cityName === '') {
    alert('请输入城市');
  } else if (!/^[A-Za-z\u4e00-\u9fa5]+$/g.test(cityName)) {
    alert('城市名必须为中英文字符');
  } else if (aqiValue === '') {
    alert('请输入' + cityName + '的空气质量指数');
  } else if (!/^\d+$/g.test(aqiValue)) {
    alert('空气质量指数必须为整数');
  } else {
    aqiData[cityName] = aqiValue;
    renderAqiList();
  }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var aqiTable = document.getElementById('aqi-table');
  aqiTable.innerHTML = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
  for (var cityName in aqiData) {
    aqiTable.innerHTML += '<tr><td>' + 
                          cityName + '</td><td>' + 
                          aqiData[cityName] + '</td><td><button>删除</button></td></tr>';
  }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(event) {
  var target = event.target;
  var cityName = target.parentNode.parentNode.firstElementChild.textContent;
  delete aqiData[cityName];
  renderAqiList();
}

/**
 * 事件代理函数               
 */
function delegateEvent(delegateElement, targetTag, eventName, handler) {
	delegateElement.addEventListener(eventName, function (event) {
		if (event.target.nodeName.toLowerCase() === targetTag.toLowerCase()) {
			return handler(event);
		}
	}, false);
}

function init() {
   	var addBtn = document.getElementById('add-btn');
   	var aqiTable = document.getElementById('aqi-table');
  	// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  	addBtn.addEventListener('click', addBtnHandle, false);
  	// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  	delegateEvent(aqiTable, 'button', 'click', delBtnHandle);
    renderAqiList();
}

init();
