duokandou
=========
多看爬书脚本。

好早以前多看三天全场免费写的，没想到这么久了竟然还能用。不过当时不需要写登录的代码，所以目前只能爬爬免费的书。 (2015-11-30)


使用方法:

For Mac:

curl https://raw.githubusercontent.com/didikeke/duokandou/master/book.js > book.js

brew update && brew install phantomjs

phantomjs book.js e9f14f9849fb4972a2287451d1aad98b 极简欧洲史 2


稍等片刻就开始下载了

说明：
第一个参数： 图书的id在url中，譬如：
http://www.duokan.com/reader/www/app.html?id=e9f14f9849fb4972a2287451d1aad98b
第二个参数是要保存目录的名字
第三个有2个值，1 或者 2，就是按1页排版还是按2页排版


（其他系统请自行到 http://phantomjs.org/ 下载 phantomjs）

