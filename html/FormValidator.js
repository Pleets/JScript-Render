/*
 * JScript Render - FormValidator Class
 * http://www.pleets.org
 *
 * Copyright 2014, Pleets Apps
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/* JScriptRender alias */
if (!window.hasOwnProperty('JScriptRender'))
   JScriptRender = {};

/* Namespace */
if (!JScriptRender.hasOwnProperty('html'))
   JScriptRender.html = new Object();

/* FormValidator class */
JScriptRender.html.FormValidator = new Function();

JScriptRender.html.FormValidator.prototype = 
{
    render: function(formElementToProcess, settings)
    {
        var HTML = JScriptRender.html;

        var set = settings || {};

        // Highlight classes on error or success
        set.highlight = (set.highlight instanceof Object) ? set.highlight: {};
        set.highlight.onValid = set.highlight.onValid || "";
        set.highlight.onInvalid = set.highlight.onInvalid || "";

        set.id = set.id || "dialog-ui";

        // Callbacks
        set.onInvalid = set.onInvalid || new Function();
        set.onValid = set.onValid || new Function();

        document.querySelector(formElementToProcess).addEventListener("submit", function(event)
        {
            event.preventDefault();

            var that = this;

            var form_id = formElementToProcess.replace("#",'');

            var url = this.getAttribute("action");
            var _url = (url == null || url.trim() == "") ? document.URL : url;
            

            _validators = (set.validators !== "undefined" && set.validators) ? set.validators : false;

            if (_validators)
            {
                var InputFilter = new JScriptRender.filter.InputFilter(formElementToProcess);
                for (var input in set.validators)
                {
                    InputFilter.add({ name: input, validators: set.validators[input]});
                }


                // [BUG] - Bad return value for InputFilter.getValidInput()

                var validInputs = InputFilter.getInputs();
                var invalidInputs = InputFilter.getInvalidInput();             

                // Refresh
                for (var i = validInputs.length - 1; i >= 0; i--) 
                {
                    var classes = validInputs[i].className.split(" ");
                    var classString = "";
                    for (var j = classes.length - 1; j >= 0; j--) {
                        if (classes[j] != set.highlight.onInvalid)
                            classString += " " +classes[j];
                    };
                    validInputs[i].className = classString;
                };

                // [BUG] - Missing support for onValid class

                if (invalidInputs.length)
                {
                    for (var i = invalidInputs.length - 1; i >= 0; i--) 
                    {
                        invalidInputs[i].className = invalidInputs[i].className + " " + set.highlight.onInvalid;
                        if (i == 0)
                            invalidInputs[i].focus();
                    };
                    return set.onInvalid(invalidInputs);
                }
                else
                    set.onValid(InputFilter.getInputs());
            }

            return false;

        });
    },
}
