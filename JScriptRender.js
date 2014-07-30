/*
 * JScript Render - Javascript renderization tools
 * http://www.pleets.org
 * Copyright 2014, Pleets Apps
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: 2014-07-30
 */

/* JScriptRender alias */
if (!window.hasOwnProperty('JScriptRender'))
    JScriptRender = {};

/* Standard class */
JScriptRender.StdClass = 
{
    include: function(url, ajax, callback) 
    {
        callback = callback || new Function();

        if (typeof ajax == "undefined" || ajax == false)
        {
            var script = document.createElement("script");
            script.src = url;
            script.type = 'text/javascript';

            script.id = 'JScriptRender-module';

            /* IE */
            if (script.readyState)
            {
                script.onreadystatechange = function() 
                {
                    if (this.readyState == 'complete') {
                        var scriptTag = document.querySelector('#' + script.id);
                        scriptTag.parentNode.removeChild(scriptTag);
                        callback();
                    }
                }                
            }
            /* Others */
            else {
                script.onload = function() {
                    var scriptTag = document.querySelector('#' + script.id);
                    scriptTag.parentNode.removeChild(scriptTag);
                    callback();
                }
            }

            var head = document.querySelector('head');
            head.appendChild(script);
        }
        else {
            var xhr = new XMLHttpRequest();
            // To prevent 412 (Precondition Failed) use GET method instead of POST
            // Set async to false to can use xhr.status after xhr.send()
            xhr.open("GET", url, false);

            xhr.onreadystatechange = function()
            {
                if (xhr.readyState == 4 && xhr.status == 200)
                    eval(xhr.responseText);
                if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 404)) {
                    callback();   
                }
            }

            xhr.send();

            if (xhr.status == 404)
                return false;
        }
        return true;
    },
    require: function(url, callback)
    {
        if (!this.include(url, true, callback))
            alert('The resource ' + url + ' probably does not exists');
    },
    array_include: function(urlArray, callback)
    {
        var that = this;
        var resource = urlArray[0];

        callback = callback || new Function();

        if (urlArray.length > 0)
            this.include(resource, false, function(){
                urlArray = urlArray.splice(1, urlArray.length);
                that.array_include(urlArray, callback);
            });
        else
            callback();
    }
}

/* Short alias */
var $j = JScriptRender;
for (var f in $j.StdClass) {
    $j[f] = $j.StdClass[f];
};

/* Load classes */

$j.array_include([

    // Validators
    'validator/MathExpression.js',
    'validator/StringLength.js',
    'validator/Digits.js',
    'validator/Alnum.js',
    'validator/Date.js',
    'validator/FileFormat.js',

    // Filters
    'filter/InputFilter.js',

    // Html
    'html/Html.js',
    'html/Overlay.js',
    'html/Loader.js',
    'html/Dialog.js',
    'html/Form.js',

    // Exceptions
    'exception/Exception.js',
    
    // Readers
    'readers/File.js',

], function(){
    $j.include('demo.js');
});
