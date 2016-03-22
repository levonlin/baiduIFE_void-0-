/**
 * Created by youzipi on 2016/3/22.
 */

var f = function () {
  var a = {};
  a.isOk = 1;
  a.update = function (status) {
    this.isOk = status;
  };


  changeStatus(a);
  console.log(a.isOk);

};

var changeStatus = function (a) {
  a.update(2);
};

f();

a = 1;
a = (a<<1);
console.log(a);
a = (a<<1);
console.log(a);
a = (a<<1);
console.log(a);
a = (a<<1)+1;
console.log(a);
a = (a<<1);
console.log(a);
//console.log(1<<50);
