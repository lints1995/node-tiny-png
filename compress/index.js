/**
 * author: lints
 * date: 2018-07-09
 * description: 基于tinyPng压缩的图片工具
 * tinypng website: https://tinypng.com/
 * tinypng免费版一个月只支持500张
 * 说明:图片压缩完成输出到outputImg文件夹存在延迟
 */

const fs = require("fs"); //引用文件系统模块
const image = require("imageinfo"); //引用imageinfo模块
const tinify = require("tinify"); //tinyPng包
tinify.key = "IKLKsBWuO1D9YPYmGe11JGklb9BWK78Q"; //tinyPng提供的key
const inputImgUrl = "./images/"; //图片源文件路径
let outputImgPath = "./outputImgs/"; //压缩后图片存放路径
let images = []; //存放图片源文件路径下图片数组

function readFileList(path, filesList) {
  let files = fs.readdirSync(path);
  files.forEach(function (itm, index) {
    let stat = fs.statSync(path + itm);
    if (stat.isDirectory()) {
      //递归读取文件
      readFileList(path + itm + "/", filesList);
    } else {
      let obj = {}; //定义一个对象存放文件的路径和名字
      obj.path = path; //路径
      obj.filename = itm; //名字
      filesList.push(obj);
    }
  });
}
let getFiles = {
  //获取文件夹下的所有文件
  getFileList: function (path) {
    let filesList = [];
    readFileList(path, filesList);
    return filesList;
  },
  //获取文件夹下的所有图片
  getImageFiles: function (path) {
    let imageList = [];
    this.getFileList(path).forEach((item) => {
      let ms = image(fs.readFileSync(item.path + item.filename));
      ms.mimeType && imageList.push(item.filename);
    });
    return imageList;
  },
};

images = getFiles.getImageFiles(inputImgUrl); // 获取文件夹下的所有图片
images.map((el, index) => {
  console.log(
    `${"\033[37m"} 图片压缩已压缩 ${"\033[31m"}${index + 1}${"\033[32m"}/${
      images.length
    }`
  );
  tinify.fromFile(`${inputImgUrl}${el}`).toFile(`${outputImgPath}${el}`);
  if (index >= images.length - 1) {
    return console.log(
      `${"\033[32m"} 图片已压缩完成，压缩图片在${"\033[31m"}/compress/outputImg${"\033[32m"}文件中...`,
      "\n",
      "图片过大会存在延迟输出的情况"
    );
  }
});
