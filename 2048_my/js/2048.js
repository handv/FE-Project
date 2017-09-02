let width = 0;
let height = 0;
let margin = 0;
//width和margin的比例
const scale = 5;
//单元格行数，列数
const rowNum = 4;
const colNum = 4;
//触碰点坐标
let startX = 0;
let startY = 0;

let cellArr = [];
const cellNumberColorMap = new Map();
//数字与字体和背景颜色映射表
var initColorMap = function() {
  //(key, value) = (number,   [css.color, css.background-color])
  cellNumberColorMap.set(0, ['#776E65', 'rgba(238, 228, 218, 0.35)']);
  cellNumberColorMap.set(2, ['#776E65', '#EEE4DA']);
  cellNumberColorMap.set(4, ['#776E65', '#EDE0C8']);
  cellNumberColorMap.set(8, ['#F9F6F2', '#F2B179']);
  cellNumberColorMap.set(16, ['#F9F6F2', '#F59563']);
  cellNumberColorMap.set(32, ['#F9F6F2', '#F67C5F']);
  cellNumberColorMap.set(64, ['#F9F6F2', '#F65E3B']);
  cellNumberColorMap.set(128, ['#F9F6F2', '#EDCF72']);
  cellNumberColorMap.set(256, ['#F9F6F2', '#FFD00A']);
  cellNumberColorMap.set(512, ['#F9F6F2', '#9c0']);
  cellNumberColorMap.set(1024, ['#F9F6F2', '#33b5e5']);
  cellNumberColorMap.set(2048, ['#F9F6F2', '#09c']);
  cellNumberColorMap.set(4096, ['#F9F6F2', '#a6c']);
  cellNumberColorMap.set(8192, ['#F9F6F2', '#93c']);
}
//获取单元格margin值
function getCellMargin() {
  //获取屏幕大小
  let screenWidth = window.screen.availWidth;
  if (screenWidth > 1000) {
    margin = 20;
  } else {
    margin = screenWidth * 0.9 / (scale + 1) / rowNum;
  }
  return margin;
}
//设置屏幕的单元格宽度,margin值
function initTableCss() {
  margin = getCellMargin();
  width = margin * scale;
  height = width;
}
//棋盘上是否已满
function isTableFull() {
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < colNum; j++) {
      if (cellArr[i][j] == 0) {
        return false;
      }
    }
  }
  return true;
}
//是否存在相同元素
function isNeighborSame() {
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < colNum - 1; j++) {
      if (cellArr[i][j] == cellArr[i][j + 1]) {
        return true;
      }
    }
  }
  for (let i = 0; i < rowNum - 1; i++) {
    for (let j = 0; j < colNum; j++) {
      if (cellArr[i][j] == cellArr[i + 1][j]) {
        return true;
      }
    }
  }
  return false;
}
//是否可以移动
function moveable() {
  if (!isTableFull() || isNeighborSame()) {
    return true;
  }
  return false;
}
// 格子的位置偏移量，使用绝对坐标
function numberCellPadding(x) {
  return (width + margin) * x + margin;
}
// 格子棋盘初始化
function initTable() {
  initTableCss();
  //删除所有子元素
  $('.table').children().remove();
  let tableWidth = (width + margin) * rowNum + margin;
  let tableHeight = (height + margin) * colNum + margin;
  $('.table').width(tableWidth);
  $('.table').height(tableHeight);
  $('header').width(tableWidth);
}
//载入最佳成绩，使用localStorage本地缓存
function loadBestScore() {
  if (localStorage.bestScoreOf2048Game == undefined) {
    localStorage.bestScoreOf2048Game = 0;
  }
  return localStorage.bestScoreOf2048Game;
}
// 棋盘内容初始化
function init() {
  initTable();
  initColorMap();
  //成绩初始化为0
  $('.curScore').val(0);
  $('.bestScore').val(loadBestScore());
  for (let i = 0; i < rowNum; i++) {
    cellArr[i] = [];
    for (let j = 0; j < colNum; j++) {
      let cellId = 'cell-' + i + '-' + j;
      let cell = '<div class="cell" id=' + cellId + '></div>';
      $('.table').append($(cell));
      $('.cell').css('width', width);
      $('.cell').css('height', height);
      $('.cell').css('background-color', 'rgba(238, 228, 218, 0.35)');
      $('.cell').css('line-height', width + 'px');
      $('.cell').css('font-size', width * 0.6);
      $('#' + cellId).css('top', numberCellPadding(i));
      $('#' + cellId).css('left', numberCellPadding(j));
      cellArr[i][j] = 0;
    }
  }
}
//随机生成一个2
function randomShow() {
  if (!isTableFull()) {
    let xPos = Math.floor(Math.random() * rowNum);
    let yPos = Math.floor(Math.random() * colNum);
    let cellId = '#cell-' + xPos + '-' + yPos;
    if (cellArr[xPos][yPos] == 0) {
      cellArr[xPos][yPos] = 2;
      $(cellId).html(cellArr[xPos][yPos]);
      let [fontColor, backgroundColor] = cellNumberColorMap.get(2);
      $(cellId).css('color', fontColor);
      $(cellId).css('background', backgroundColor);
    } else {
      randomShow();
    }
  }
}
//获取成绩
function getCurScore() {
  let ta = cellArr.join(",").split(","); //转化为一维数组
  let maxScore = Math.max.apply(null, ta); //最大值
  return maxScore;
}
//保存最好成绩
function saveBestScore() {
  let curScore = parseInt($('.curScore').val());
  let bestScore = parseInt(localStorage.bestScoreOf2048Game);
  if (curScore > bestScore) {
    $('.bestScore').val(curScore);
    localStorage.bestScoreOf2048Game = curScore;
  }
}
//重新开始游戏
function bindRestart() {
  $('#restartBtn').click(function() {
    event.preventDefault();
    saveBestScore();
    init();
    randomShow();
    randomShow();
  });
}
//网页重载时保存成绩
//unload方法在浏览器刷新或关闭时调用
function bindUnload() {
  window.addEventListener('unload', function(event) {
    saveBestScore();
  })
}
//重新展示table
function showTable() {
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < colNum; j++) {
      let cellId = '#cell-' + i + '-' + j;
      let cellVal = parseInt(cellArr[i][j]);
      let cellVal1 = cellVal;
      if (cellVal > 8192) {
        cellVal1 = 8192;
      }
      let [fontColor, backgroundColor] = cellNumberColorMap.get(cellVal1);
      $(cellId).css('color', fontColor);
      $(cellId).css('background', backgroundColor);
      //设置字体大小，以免数字太大的时候超出格子范围
      if (cellVal > 1000) {
        $(cellId).css('font-size', width * 0.55);
      } else if (cellVal > 100) {
        $(cellId).css('font-size', width * 0.5);
      }
      $(cellId).html(cellVal != 0 ? cellArr[i][j] : '');
    }
  }
}
//提取非零元素数组
function getNonZeroArr(arr) {
  let nonZero = [];
  for (let i = 0; i < arr.length; i++) {
    nonZero[i] = [];
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j] != 0) {
        nonZero[i].push(arr[i][j]);
      }
    }
  }
  return nonZero;
}
//获取临时数组
function getTempArr(arr) {
  let temp = [];
  for (let i = 0; i < arr.length; i++) {
    temp[i] = [];
  }
  return temp;
}
//按行反转数组
function reverseArrByRow(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].reverse();
  }
  return arr;
}
//列变行
function reverseArrByCol(arr) {
  let tempArr = getTempArr(arr);
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      tempArr[i][j] = arr[j][i];
    }
  }
  tempArr.lastDir = arr.lastDir;
  return tempArr;
}
//单步的移动操作
function move(arr, direction) {
  /*
    添加一个参数change，代表移动后是否再增加一个随机数.
    满足如下条件则不增加：
    1、如果上一步操作和本次操作的移动方向相同
    2、本次操作没有合并新数值
  */
  arr.change = true;
  //提取非零元素
  let nonZeroArr = getNonZeroArr(arr);
  let nonZeroArrCp = getNonZeroArr(arr);
  /*
    移动策略：
    1、提取非零数组
    2、按行提取；
    3、从头往后，每一行的每一列与前一列比较：
    如果相同，则删除该列，前一列不变，但临时数组的前一列加倍；
  */
  for (let i = 0; i < nonZeroArr.length; i++) {
    for (let j = 1; j < nonZeroArr[i].length; j++) {
      if (nonZeroArr[i][j] == nonZeroArr[i][j - 1]) {
        nonZeroArr[i][j - 1] = 2 * nonZeroArr[i][j];
        //nonZeroArr[i][j - 1] = 0;
        nonZeroArr[i].splice(j, 1);
      }
    }
  }
  if (arr.lastDir && arr.lastDir == direction && nonZeroArrCp.toString() == nonZeroArr.toString()) {
    arr.change = false;
  }
  /*替换原有数组：
    如果非零数组单元不存在,则为0；
    如果非零数组单元存在，则为非零数组单元
  */
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < colNum; j++) {
      if (typeof nonZeroArr[i][j] == 'undefined') {
        arr[i][j] = 0;
      } else {
        arr[i][j] = nonZeroArr[i][j];
      }
    }
  }
  delete nonZeroArr;
  //展示目前得分
  $('.curScore').val(getCurScore())
  arr.lastDir = direction;
  return arr;
}
//向左移动操作
function moveLeft() {
  cellArr = move(cellArr, 'left');
  showTable();
  if (cellArr.change) {
    setTimeout(randomShow, 300);
  }
}
//向右移动操作
function moveRight() {
  //按行reverse数组
  let temArr = cellArr;
  temArr = reverseArrByRow(temArr);
  temArr = move(temArr, 'right');
  let change = temArr.change;
  //按行reverse数组
  temArr = reverseArrByRow(temArr);
  cellArr = temArr;
  showTable();
  if (change) {
    setTimeout(randomShow, 300);
  }
}
//向上移动操作
function moveUp() {
  //按行reverse数组
  let temArr = cellArr;
  temArr = reverseArrByCol(temArr);
  temArr = move(temArr, 'up');
  let change = temArr.change;
  //按行reverse数组
  temArr = reverseArrByCol(temArr);
  cellArr = temArr;
  showTable();
  if (change) {
    setTimeout(randomShow, 300);
  }
}
//向右移动操作
function moveDown() {
  //按行reverse数组
  let temArr = cellArr;
  temArr = reverseArrByCol(temArr);
  temArr = reverseArrByRow(temArr);
  temArr = move(temArr, 'down');
  let change = temArr.change;
  //按行reverse数组
  temArr = reverseArrByRow(temArr);
  temArr = reverseArrByCol(temArr);
  cellArr = temArr;
  showTable();
  if (change) {
    setTimeout(randomShow, 300);
  }
}
//移动操作
function moveDirection(event, moveFunc) {
  event.preventDefault();
  gameOver();
  if (moveable()) {
    moveFunc();
  }
}
//判断游戏是否结束
function gameOver() {
  if (isTableFull() && !moveable()) {
    saveBestScore();
    alert('游戏结束!')
    return;
  }
}

//绑定方向键操作事件
function bindKeyEvent() {
  $(document).keydown(function(event) {
    //判断当event.keyCode 为37时（即左方面键），执行函数to_left();
    //判断当event.keyCode 为39时（即右方面键），执行函数to_right();
    if (event.keyCode == 37) {
      moveDirection(event, moveLeft);
    } else if (event.keyCode == 39) {
      moveDirection(event, moveRight);
    } else if (event.keyCode == 38) {
      moveDirection(event, moveUp);
    } else if (event.keyCode == 40) {
      moveDirection(event, moveDown);
    }
  });
}
//设置滑动距离标值：如果滑动小于该值，则表示非滑动，只是触碰屏幕
function getSlideLength() {
  //获取屏幕大小
  return window.screen.availWidth * 0.05;
}
//touchstart事件
function touchSatrtFunc(evt) {
  try {
    evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
    let touch = evt.touches[0]; //获取第一个触点
    let x = Number(touch.pageX); //页面触点X坐标
    let y = Number(touch.pageY); //页面触点Y坐标
    //记录触点初始位置
    startX = x;
    startY = y;
  } catch (e) {
    //alert('touchSatrtFunc：' + e.message);
  }
}

//touchmove事件，这个事件无法获取坐标
function touchMoveFunc(evt) {
  try {
    evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
  } catch (e) {
    //alert('touchEndFunc：' + e.message);
  }
}
//touchend事件
function touchEndFunc(evt) {
  try {
    evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
    let slideLength = getSlideLength();
    /*
      注意与touchSatrtFunc的区别：
      touchSatrtFunc使用的是evt.touches[0]
      touchEndFunc使用的是evt.changedTouches[0]
    */
    let touch = evt.changedTouches[0]; //获取第一个触点
    let endX = Number(touch.pageX); //页面触点X坐标
    let endY = Number(touch.pageY); //页面触点Y坐标
    //判断滑动方向
    let deltaX = endX - startX;
    let deltaY = endY - startY;
    if (Math.abs(deltaX) >= Math.abs(deltaY) && Math.abs(deltaX) > slideLength) {
      if (deltaX > 0) {
        moveDirection(evt, moveRight);
      } else {
        moveDirection(evt, moveLeft);
      }
    } else if (Math.abs(deltaX) < Math.abs(deltaY) && Math.abs(deltaY) > slideLength) {
      if (deltaY > 0) {
        moveDirection(evt, moveDown);
      } else {
        moveDirection(evt, moveUp);
      }
    }
  } catch (e) {
    //alert('touchMoveFunc：' + e.message);
  }
}

//绑定移动端滑动操作
function bindTouchMove() {
  document.addEventListener('touchstart', touchSatrtFunc, false);
  document.addEventListener('touchmove', touchMoveFunc, false);
  document.addEventListener('touchend', touchEndFunc, false);
}
//绑定事件
function bindEvents() {
  bindRestart();
  bindKeyEvent();
  bindTouchMove();
  bindUnload();
}
//主函数
function __main() {
  init();
  randomShow();
  randomShow();
  bindEvents();
}

$(function() {
  __main();
});
