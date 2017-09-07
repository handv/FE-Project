//在老师写的动态规划算法求最大公共子字符串
let res = '';
//获取编辑距离
function compareSequence(source, target) {
  let matrix = [];
  let n = source.length;
  let m = target.length;
  //初始化第一列
  for (let i = 0; i < n + 1; i++) {
    matrix[i] = new Array(m + 1);
    matrix[i][0] = 0;
  }
  //初始化第一行
  for (let j = 0; j < m + 1; j++) {
    matrix[0][j] = 0;
  }
  //遍历source
  for (let i = 1; i <= n; i++) {
    let ch1 = source.charAt(i - 1);
    //匹配target
    for (let j = 1; j <= m; j++) {
      let ch2 = target.charAt(j - 1);
      if (ch1 == ch2) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = (matrix[i - 1][j] >= matrix[i][j - 1] ? matrix[i - 1][j] : matrix[i][j - 1]);
      }
    }
  }
  return matrix;
}
//获取最大子字符串
function getMaxSubstring(arr, source, target, i, j) {
  if (i == 0 || j == 0) {
    return;
  }
  if(source.charAt(i-1) == target.charAt(j-1)) {
    getMaxSubstring(arr,source,target,i-1,j-1);
    res += source.charAt(i-1);
  } else if (arr[i-1][j] >= arr[i][j]) {
    getMaxSubstring(arr,source,target,i-1,j);
  } else {
    getMaxSubstring(arr,source,target,i,j-1);
  }
}
//更改相同元素的颜色
function changeDiff(str,substr) {
  let string = str;
  let sub = substr;
  let strarr = str.split('');
  let fromindex = 0;
  for (let i=0; i< sub.length; i++) {
    let index = string.indexOf(sub.charAt(i),fromindex);
    strarr[index] = '<span style="color:black">'+sub.charAt(i)+'</span>';
    fromindex = index;
  }
  return strarr.join('');
}
//对比两个字符串主函数
function compare(source,target) {
  res = '';
  let changeStr = [];
  let arr = compareSequence(source, target);
  getMaxSubstring(arr,source, target,source.length,target.length);
  changeStr[0] = changeDiff(source,res);
  changeStr[1] = changeDiff(target,res);
  return changeStr;
}
function com(){
  var source = document.getElementById('source').value;
  var target = document.getElementById('target').value;
  let changeStr = compare(source,target);
  document.getElementById('so').innerHTML = changeStr[0];
  document.getElementById('ta').innerHTML = changeStr[1];
}
