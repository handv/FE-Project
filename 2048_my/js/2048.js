const width = 100;
const height = 100;
const margin = 20;

const rowNum = 4;
const colNum = 4;

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
  //删除所有子元素
  $('.table').children().remove();
  let tableWidth = (width + margin) * rowNum + margin;
  let tableHeight = (height + margin) * colNum + margin;
  $('.table').width(tableWidth);
  $('.table').height(tableHeight);
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
      let [fontColor, backgroundColor] = cellNumberColorMap.get(cellVal);
      $(cellId).css('color', fontColor);
      $(cellId).css('background', backgroundColor);
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
  return tempArr;
}
//单步的移动操作
function move(arr) {
  //提取非零元素
  let nonZeroArr = getNonZeroArr(arr);
  //临时数组
  let tempArr = getTempArr(arr);
  /*
    移动策略：
    1、提取非零数组
    2、按行提取；
    3、从后往前，每一行的每一列与前一列比较：
    如果相同，则删除该列，前一列不变，但临时数组的前一列加倍；
  */
  for (let i = 0; i < nonZeroArr.length; i++) {
    for (let j = nonZeroArr[i].length - 1; j > 0; j--) {
      if (nonZeroArr[i][j] == nonZeroArr[i][j - 1]) {
        tempArr[i][j - 1] = 2 * nonZeroArr[i][j];
        nonZeroArr[i].splice(j, 1);
      }
    }
  }
  /*替换原有数组：
    如果非零数组单元不存在,则为0；
    如果临时数组存在，则为临时数组值；
    如果非零数组单元存在，则为临时数组单元
  */
  for (let i = 0; i < rowNum; i++) {
    for (let j = 0; j < colNum; j++) {
      if (typeof nonZeroArr[i][j] == 'undefined') {
        arr[i][j] = 0;
      } else if (typeof tempArr[i][j] != 'undefined' && nonZeroArr[i][j]) {
        arr[i][j] = tempArr[i][j];
      } else {
        arr[i][j] = nonZeroArr[i][j];
      }
    }
  }
  delete nonZeroArr;
  delete tempArr;
  //展示目前得分
  $('.curScore').val(getCurScore())
  return arr;
}
//向左移动操作
function moveLeft() {
  cellArr = move(cellArr);
  showTable();
  setTimeout("randomShow()", 300);
  //console.log(cellArr);
}
//向右移动操作
function moveRight() {
  //按行reverse数组
  let temArr = cellArr;
  temArr = reverseArrByRow(temArr);
  temArr = move(temArr);
  //按行reverse数组
  temArr = reverseArrByRow(temArr);
  cellArr = temArr;
  showTable();
  setTimeout("randomShow()", 300);
  //console.log(cellArr);
}
//向上移动操作
function moveUp() {
  //按行reverse数组
  let temArr = cellArr;
  temArr = reverseArrByCol(temArr);
  temArr = move(temArr);
  //按行reverse数组
  temArr = reverseArrByCol(temArr);
  cellArr = temArr;
  showTable();
  setTimeout("randomShow()", 300);
  //console.log(cellArr);
}
//向右移动操作
function moveDown() {
  //按行reverse数组
  let temArr = cellArr;
  temArr = reverseArrByCol(temArr);
  temArr = reverseArrByRow(temArr);
  temArr = move(temArr);
  //按行reverse数组
  temArr = reverseArrByRow(temArr);
  temArr = reverseArrByCol(temArr);
  cellArr = temArr;
  showTable();
  setTimeout(randomShow, 300);
  //console.log(cellArr);
}
//绑定方向键操作事件
function bindKeyEvent() {
  $(document).keydown(function(event) {
    if (isTableFull() && !moveable()) {
      saveBestScore();
      alert('游戏结束!')
    }
    //判断当event.keyCode 为37时（即左方面键），执行函数to_left();
    //判断当event.keyCode 为39时（即右方面键），执行函数to_right();
    if (event.keyCode == 37) {
      event.preventDefault();
      if (moveable()) {
        moveLeft();
      }
    } else if (event.keyCode == 39) {
      event.preventDefault();
      if (moveable()) {
        moveRight();
      }
    } else if (event.keyCode == 38) {
      event.preventDefault();
      if (moveable()) {
        moveUp();
      }
    } else if (event.keyCode == 40) {
      event.preventDefault();
      if (moveable()) {
        moveDown();
      }
    }
  });
}
//绑定事件
function bindEvents() {
  bindRestart();
  bindKeyEvent();
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
