/**
 * 读取文件头，判断文件类型
 */
var FS = require( 'fs' );
// 默认读取的文件头byte长度

var HeaderLength = 10;

// 文件类型和对应的文件头前几位的hax编码表
var TypeHash = {
    jpeg: 'ffd8',                               // 2bytes
    png: '89504E470D0A1A0A',                    // 8bytes
    gif: [ '474946383961', '474946383761' ],    // 6bytes utf8->GIF89(7)a
    bmp: '424D'                                 // 2bytes utf8->BM
};

module.exports = {

    /**
     * 获取文件头部分长度，作为buffer返回
     * @param path  需要获取的我呢见路径
     * @param cb    回调函数
     *      err, buffer, bytesRead
     * @param headerLength  需要读取的文件头长度 默认为10
     */
    getHeader: function( path, cb, headerLength ){

        headerLength = headerLength || HeaderLength;

        FS.open( path, 'r', function( err, fd ){

            if( err ){

                cb( err );
            }
            else {

                var buffer = new Buffer( headerLength );
                FS.read( fd, buffer, 0, headerLength, null, function( err, bytesRead, buffer ){

                    if( err ){

                        cb( err );
                    }
                    else {

                        cb( undefined, buffer, bytesRead );
                    }
                });
            }
        });
    },

    /**
     * 根据给定的文件头buffer的八进制表示字符串来进行判断图片类型
     * @param bufferHexString
     * @return {String|Undefined}   jpeg|png|gif|bmp|undefined
     */
    testHeader: function( bufferHexString ){

        var typeName;
        var typeTag;
        var typeTagArr;
        var typeTagEx;
        var ifFound = false;
        var resultTag;
        var i;

        for( typeName in TypeHash ){

            typeTag = TypeHash[ typeName ];

            if( typeof typeTag === 'string' ){
                typeTagArr = [ typeTag ];
            }
            else {
                typeTagArr = typeTag;
            }

            for( i = 0; typeTag = typeTagArr[ i ]; i++ ){

                typeTagEx = new RegExp( '^' + typeTag.toLowerCase() );

                if( typeTagEx.test( bufferHexString ) ){

                    ifFound = true;
                    resultTag = typeName;
                    break;
                }
            }
            
            if( ifFound ){

                break;
            }
        }

        return resultTag;
    },

    /**
     * 根据给定的文件路径，解析该图片的图片类型
     * @param path
     * @param cb( err, type )
     */
    parse: function( path, cb ){

        var that = this;

        this.getHeader( path, function( err, buffer, byteRead ){

            if( err ){

                cb( err );
            }
            else {

                cb( undefined, that.testHeader( buffer.toString( 'hex' ) ) );
            }
        });
    }
};
