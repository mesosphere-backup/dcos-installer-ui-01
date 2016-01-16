var srcFolder = './src';
var distFolderAssets = '../dcos_installer/templates/assets';
var distFolderHTML = '../dcos_installer/templates';

var dirs = {
  src: srcFolder,
  dist: distFolderAssets,
  srcJS: srcFolder + '/js',
  distJS: distFolderAssets,
  srcCSS: srcFolder + '/css',
  distCSS: distFolderAssets,
  srcImg: srcFolder + '/img',
  distImg: distFolderAssets + '/img',
  distHTML: distFolderHTML
};

var files = {
  srcJS: dirs.srcJS + '/index.js',
  distJS: dirs.distJS + '/index.js',
  srcCSS: dirs.srcCSS + '/index.less',
  distCSS: dirs.distCSS + '/index.css',
  srcHTML: dirs.src + '/index.html',
  distHTML: dirs.distHTML + '/index.html'
};

module.exports = {
  dirs: dirs,
  files: files
};
