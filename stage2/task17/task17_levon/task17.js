/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

// 生成的测试数据
var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项，在未触发事件时也能以此来获取数据
var pageState = {
  nowSelectCity: "",
  nowGraTime: ""
};

/**
 * 事件代理函数
 */
function delegateEvent(delegateElement, targetTag, eventName, handler) {
  delegateElement.addEventListener(eventName, function (event) {
    var target = event.target;
    if (targetTag.toLowerCase() === target.nodeName.toLowerCase()) {
      return handler(event);
    }
  }, false);
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var target = event.target;
  // 设置对应数据
  pageState.nowGraTime = event.target.value;
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(event) {
  // 确定是否选项发生了变化 
  var target = event.target;
  // 设置对应数据
  pageState.nowSelectCity = event.target.value;
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var form = document.getElementById('form-gra-time');
  delegateEvent(form, 'input', 'change', graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var select = document.getElementById('city-select');
  select.innerHTML += '<option></option>';
  for(var cityName in aqiSourceData) {
    select.innerHTML += '<option>' + cityName + '</option>';
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  select.addEventListener('change', citySelectChange, false);
}

/**
 * 求数组中元素的平均值
 */
function arrayAverage(arr) {
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
}

/**
 * 生成以天为单位的数据
 */
function getDaysData() {
  return aqiSourceData[pageState.nowSelectCity];
}

/**
 * 判断某个日期属于一年中的第几周
 */
function getWeekNum(date) {
	// 获取指定日期和该年元旦的时间戳之差，算出间隔的周数
  var thisYear = date.getFullYear();
	var thisDate = date.getTime();
	var firstDate = new Date(thisYear + '').getTime();
	var weekNum = Math.ceil((thisDate - firstDate) / (1000 * 3600 * 24 * 7));
	// 修正首周和尾周加起来不超过七天的情况，此时周数要加一
	var thisDay = date.getDay();
	var firstDay = new Date(thisYear + '').getDay();
	if (thisDay <= firstDay) {
		weekNum += 1;
	}
	return thisYear + '-' + '第' + weekNum + '周';
}

/**
 * 生成以周为单位的数据
 */
function getWeeksData() {
  var nowSelectCityData = aqiSourceData[pageState.nowSelectCity];
  var weeksData = {};
  var weeksAverageData = {};
  for (var date in nowSelectCityData) {
  	var week = getWeekNum(new Date(date));
  	if (weeksData[week]) {
  	  weeksData[week].push(nowSelectCityData[date]);
  	} else {
  	  weeksData[week] = [nowSelectCityData[date]];
  	}
  }
  // 将周数相同数据求平均
  for (var w in weeksData) {
    weeksAverageData[w] = Math.ceil(arrayAverage(weeksData[w]));
  }
  return weeksAverageData;
}

/**
 * 生成以月为单位的数据
 */
function getMonthsData() {
  var nowSelectCityData = aqiSourceData[pageState.nowSelectCity];
  var monthsData = {};
  var monthsAverageData = {};
  // 将月份相同的数据放在同一数组
  for (var date in nowSelectCityData) {
    var month = date.match(/^(\d+\-\d+)-(\d+)$/)[1];
    if (monthsData[month]) {
      monthsData[month].push(nowSelectCityData[date]);
    } else {
      monthsData[month] = [nowSelectCityData[date]];
    }
  }
  // 将月份相同数据求平均
  for (var m in monthsData) {
    monthsAverageData[m] = Math.ceil(arrayAverage(monthsData[m]));
  }
  return monthsAverageData;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  switch (pageState.nowGraTime) {
    case 'day': 
      chartData = getDaysData();
      break;
    case 'week':
      chartData = getWeeksData();
      break;
    case 'month': 
      chartData = getMonthsData();
      break;
  }
}

/**
 * 获取aqi对应的空气质量水平
 */
function getAqiLevel(aqi) {
	if (aqi >= 0 && aqi <= 50) {
		return 'superior';
	} else if (aqi >= 51 && aqi <= 100) {
		return 'good';
	} else if (aqi >= 101 && aqi <= 150) {
		return 'light';
	} else if (aqi >= 151 && aqi <= 200) {
		return 'mid';
	} else if (aqi >= 201) {
		return 'heavy';
	}
}

/**
 * 空气质量水平转为中文
 */
function toChineseLevel(level) {
  switch (level) {
    case 'aqi-superior': return '优';
    case 'aqi-good': return '良';
    case 'aqi-light': return '轻度污染';
    case 'aqi-mid': return '中度污染';
    case 'aqi-heavy': return '重度污染';
  }
}

/**
 * 渲染图表
 */
function renderChart() {
  var chart  = document.getElementsByClassName('aqi-chart-wrap')[0];
  chart.innerHTML = '';
  var columnType = 'column-' + pageState.nowGraTime;
  for (var date in chartData) {
  	var aqi = chartData[date];
  	var aqiLevel = 'aqi-' + getAqiLevel(aqi); 
    var column = document.createElement('div');
    column.className = 'column ' + columnType + ' ' + aqiLevel;
    column.style.height = aqi + 'px';
    column.style.top = (510 - aqi) + 'px';
    column.title = date + '\n' + aqi + '\n' + toChineseLevel(aqiLevel);
    chart.appendChild(column); 
  }
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
}

init();
