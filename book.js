var system = require('system');
var page = require('webpage').create();

if (system.args.length < 3) {
    console.log('Usage:');
    console.log('phantomjs book.js BOOKID FOLDER FORMAT')
    console.log('BOOKID: id from url; FOLDER: where to save files;');
    console.log('FORMAT: Optional, input value 1 or 2, default is 2');

    phantom.exit()

}

var BOOK_URL = 'http://www.duokan.com/reader/www/app.html?id=' + system.args[1];



var FOLDER = system.args[2];

//set view port size
if (1 == system.args[3]) {

    page.viewportSize = {
        width: 800,
        height: 1600
    };

} else if (3 == system.args[3]) {
    page.viewportSize = {
        width: 800,
        height: 1000
    };
} else {
    page.viewportSize = {
        width: 2560,
        height: 1600
    };
}



var _padding = function(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
};

var _pageNum = 1;
var _getPageNum = function() {
    return _padding(_pageNum++, 4);
};

var _isTextLoaded = function() {
    return page.evaluate(function() {
        return window['jQuery'] ? 0 == jQuery('.loading').length : false;
    });
};

var _pics = {};
var _isPicLoaded = function(callback) {
    if (0 == _objectSize(_pics)) {
        return true;
    } else {
        return false;
    }
};

var _closeAd = function() {
    page.evaluate(function() {
        if (0 != jQuery('.u-btn.j-close')) {
            jQuery('.u-btn.j-close').click();
            console.log('closed AD');
        }
    });
};

var _closeHelper = function() {
    page.evaluate(function() {
        jQuery('.j-md-help').hide();

    });
};

var _isEnd = function() {
    return page.evaluate(function() {
        var footers = jQuery('.j-md-footer div');
        if (footers.length > 0) {
            var last = footers[footers.length - 1];
            var texts = $(last).text().split('/');
            if (2 == texts.length) {
                return texts[0] == texts[1];
            }
        }

        return false;
    });
};

var _nextPage = function() {
    page.evaluate(function() {
        jQuery('.j-pagedown').click();
    });
};

var _setClipRect = function(page) {
    var rect = page.evaluate(function() {
        return $('.j-md-book')[0].getBoundingClientRect();
    });

    page.clipRect = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
    };

};

var _renderBook = function() {
    var timeout = 0;
    var interval = 200;
    var timer = setInterval(function() {
        if (_isTextLoaded() && _isPicLoaded()) {
            _closeAd();
            _closeHelper();
            var fileName = FOLDER + '/' + _getPageNum() + '.png';
            _setClipRect(page);
            page.render(fileName);
            console.log(fileName);

            if (_isEnd()) {
                clearInterval(timer);
                phantom.exit()
            } else {
                _nextPage();
            }

            timeout = 0;
        } else if(timeout > 40 * 1000){
            console.log("refresh page, because of timeout")
            _refreshPage();
            timeout = 0;
        } else {
            timeout += interval;
        }
    }, interval);
};


var _isMatchedUrl = function(url) {
    
    if (/duokan\.com/.test(url)) {
        return true;
    } else {
        return false;
    }
};

var _objectSize = function(obj) {
    var size = 0;
    var key;
    for(key in obj){
        if(obj.hasOwnProperty(key)){
            size++;
        }
    }
    return size;
};

var _refreshPage = function() {
    page.open(BOOK_URL, function(){
        _pics = {};
    });
};

page.onResourceRequested = function(request) {
    if (_isMatchedUrl(request.url)) {
        //console.log("requested: " + request.url);
        _pics[request.url] = true;
    }
};
page.onResourceReceived = function(response) {
    if (_isMatchedUrl(response.url) && 'end' == response.stage) {
        //console.log("received: " + response.url);
        if(_pics[response.url]){
            delete _pics[response.url];
        }
    }
};

page.open(BOOK_URL, function() {
    console.log('starting...');
    page.clearCookies();
    page.evaluate(function() {
        localStorage.clear();
    });
    _renderBook();

});