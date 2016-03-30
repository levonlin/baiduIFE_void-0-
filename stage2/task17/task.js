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

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "-1",
  nowGraTime: "day"
};


function renderADiv(target,data,width) {
  var newDiv = document.createElement("div");
  var degree = data.degree;
  newDiv.style.height = degree + "px";
  newDiv.style.width = width + "px";
  if (data.date) {
    newDiv.title = data.date + " " + "空气质量指数：" + degree;
  }else{
    newDiv.title = "空气质量指数：" + degree;
    newDiv.style.marginRight = "5px";
  }
  newDiv.style.backgroundColor = data.color;
  target.appendChild(newDiv);
}
/**
 * 渲染图表
 */
function renderChart() {
  var nowSelectCity = chartData[pageState.nowSelectCity],
      targetDiv = document.getElementById("aqi-chart-wrap");
  targetDiv.innerHTML = "";
  var placeholder = document.createElement("div");
  placeholder.className = "placeholder";
  targetDiv.appendChild(placeholder);
  if (pageState.nowSelectCity === "-1") return;
  switch(pageState.nowGraTime){
    case "day":
      var dayData = nowSelectCity.dayData;
      for (var i = 0; i < nowSelectCity.dayData.length; i++) {
        renderADiv(targetDiv,dayData[i],5);
      }
      break;

    case "week":
      var weekData = nowSelectCity.weekData;
      for (var j = 0; j < weekData.length; j++) {
        renderADiv(targetDiv,weekData[j],30);
      }
      break;

    case "month":
      var monthData = nowSelectCity.monthData;
      for (var k = 0; k < monthData.length; k++) {
        renderADiv(targetDiv,monthData[k],145);
      }
      break;
  }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {

  if (pageState.nowGraTime !== this.value) {
    pageState.nowGraTime = this.value;

    renderChart();
  }

}
/**
 * select发生变化时的处理函数
 */
function citySelectChange() {

  if (pageState.nowSelectCity !== this.value) {
    pageState.nowSelectCity = this.value;

    renderChart();
  }

}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var labels = document.getElementsByTagName("label");
  for (var i = 0; i < labels.length; i++) {
    labels[i].onclick = graTimeChange.bind(labels[i].getElementsByTagName("input")[0]);
  }
  labels[0].getElementsByTagName("input")[0].checked = "checked";
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var selectList = document.getElementById("city-select");
  var newOption;
  for(var attr in aqiSourceData){
    newOption = document.createElement("option");
    newOption.value = attr;
    newOption.innerHTML = attr;
    selectList.appendChild(newOption);
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  selectList.onchange = citySelectChange;
}
function fillColor(degree){
  if ((degree >= 0)&&(degree < 100)) {
    return "#43B29F";
  }else if ((degree >= 100)&&(degree < 200)) {
    return "#3888C0";
  }else if ((degree >= 200)&&(degree < 300)) {
    return "#E1CD46";
  }else if ((degree >= 300)&&(degree < 400)) {
    return "#CE4A35";
  }else{
    return "red";
  }
}
/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var dayDegree,weekDegree,monthDegree,
      weekCount = 1,monthCount = 1,i = 0,
      weekSum = 0,monthSum = 0,
      monthDays = [31,29,31];
  for(var city in aqiSourceData){
    i = 0;
    chartData[city] = {
      dayData:[],
      weekData:[],
      monthData:[]
    };
    for(var date in aqiSourceData[city]){
      dayDegree = aqiSourceData[city][date];
      chartData[city].dayData.push({
        degree:dayDegree,
        color:fillColor(dayDegree),
        date:date
      });

      weekSum += dayDegree;
      if ((weekCount === 7)||(date === "2016-03-31")) {
        weekDegree = parseInt(weekSum/weekCount);
        chartData[city].weekData.push({
          degree:weekDegree,
          color:fillColor(weekDegree)
        });
        weekCount = 0;
        weekSum = 0;
      }
      weekCount++;

      monthSum += dayDegree;
      if (monthCount === monthDays[i]) {
        monthDegree = parseInt(monthSum/monthDays[i]);
        chartData[city].monthData.push({
          degree:monthDegree,
          color:fillColor(monthDegree)
        });
        if (i < 2) i++;
        monthCount = 0;
        monthSum = 0;
      }
      monthCount++;
    }
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
window.onload=function () {
  init();
};
