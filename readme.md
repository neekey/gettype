[![build status](https://secure.travis-ci.org/neekey/gettype.png)](http://travis-ci.org/neekey/gettype)
##GetType

A simple tool to get the real format of a binary file(Currently only `png|jpeg|gif|bmp`)

监测二进制文件的真实文件格式（目前只有常见的图片格式:`png|jpeg|gif|bmp`）

###Install 安装

`npm install gettype`

###Usage 使用

	var GetType = require( 'getType' );
	var pathToParse = 'images/jpeg.jpg';

	GetType.parse( pathToParse, function( err, type ){
	
		if( err ){
			console.log( 'file format parse error!' );
		}
		else {
			console.log( 'file format is : ' + type );
		}
	});