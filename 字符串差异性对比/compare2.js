//在compare.js基础上修改，以单词、数字、汉字为单位进行对比，而不是以字符为单位
let res = [];
function compare(source,target) {
  res = [];
  let changeStr = [];
  let sourceArr = str2Arr(source);
  let targetArr = str2Arr(target);
  let arr = compareSequence(sourceArr, targetArr);
  getMaxSubstring(arr,sourceArr, targetArr,sourceArr.length,targetArr.length);
  changeStr[0] = changeDiff(source,sourceArr,res);
  changeStr[1] = changeDiff(target,targetArr,res);
  return changeStr;
}
function changeDiff(str,arr,substr) {
  let strarr = arr;
  let sub = substr;
  let fromindex = 0;
  for (let i=0; i< sub.length; i++) {
    let index = strarr.indexOf(sub[i],fromindex);
    strarr[index] = '<span style="color:black">'+sub[i]+'</span>';
    fromindex = index;
    str = str.replace(sub[i],strarr[index]);
  }
  return str;
}
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
    let ch1 = source[i - 1];
    //匹配target
    for (let j = 1; j <= m; j++) {
      let ch2 = target[j - 1];
      if (ch1 == ch2) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = (matrix[i - 1][j] >= matrix[i][j - 1] ? matrix[i - 1][j] : matrix[i][j - 1]);
      }
    }
  }
  return matrix;
}

function getMaxSubstring(arr, source, target, i, j) {
  if (i == 0 || j == 0) {
    return;
  }
  if(source[i-1] == target[j-1]) {
    getMaxSubstring(arr,source,target,i-1,j-1);
    res.push(source[i-1]);
  } else if (arr[i-1][j] >= arr[i][j]) {
    getMaxSubstring(arr,source,target,i-1,j);
  } else {
    getMaxSubstring(arr,source,target,i,j-1);
  }
}
function str2Arr(str) {
  let arr = str.split(/{|}|,|:|\[|\]/g);
  let resultArr = [];
  for (let i=0; i< arr.length; i++) {
    if (arr[i] != '') {
      resultArr.push(arr[i]);
    }
  }
  return resultArr;
}
function com(){
  var source = document.getElementById('source').value;
  var target = document.getElementById('target').value;
  let changeStr = compare(source,target);
  document.getElementById('so').innerHTML = changeStr[0];
  document.getElementById('ta').innerHTML = changeStr[1];
}
