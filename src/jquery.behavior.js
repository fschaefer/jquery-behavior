/*
 * jQuery Behavior Plugin: Define rich behaviors that include both event 
 * handlers and (un)transformations on DOM elements.
 * 
 * Copyright (c) 2010-2011 Florian Schäfer (florian.schaefer@gmail.com)
 * Dual licensed under the MIT (MIT_LICENSE.txt)
 * and GPL Version 2 (GPL_LICENSE.txt) licenses.
 *
 * Version: 1.0
 * Requires: jQuery 1.4.2+ and Live Query 1.1+.
 * 
 */

;(function($, attr) {
    
    // jQuery supports getData, setData and changeData,
    // support getAttr, setAttr, changeAttr too.
    $.attr = function (elem, name, value) { 
        var current = attr (elem, name), // read current value.
        retval = current;
        
        if (!value) {
            // we are getting a value.
            $.event.trigger ('getAttr', {
                attribute: name,
                from: current,
                to: value
            }, elem);
        } else { // writing
            // we are setting a value.
            $.event.trigger ('setAttr', {
                attribute: name,
                from: current,
                to: value
            }, elem);
                    
            retval = attr.apply (this, arguments); // call original.
            
            // value or type changed.
            if (current !== value) {
                $.event.trigger ('changeAttr', {
                    attribute: name,
                    from: current,
                    to: value
                }, elem);
            }
        }
        return retval; // return original 
    }
    
})(jQuery, jQuery.attr);

;(function($, undefined) {
    
    if (!$.fn.livequery) throw "jquery.behavior.js: jQuery Plugin: Live Query not loaded.";
    
    $.behavior = function (metabehaviors, context) {
        
        context = context || window.document;
        
        // Handle $.behavior (""), $.behavior (null), or $.behavior (undefined).
        if (!metabehaviors) {
            return this;
        }
        
        // Handle $.behavior ([{ ... }, { ... }, ... ], [context]).
        if ($.isArray (metabehaviors)) {
            return $.each (metabehaviors, function () {
                $.behavior (this, context);
            });
        }
        
        // Handle $.behavior ({ ... }, [context]).
        return $.each (metabehaviors, function (selector, metabehavior) {
            
            metabehavior = $.extend (true, {
                options: {
                    expire: false
                },
                transform: undefined,
                untransform: undefined
            }, metabehavior);
            
            // Cache element.
            var $element = $(selector, context);
            
            if (metabehavior.options.expire) {
                $element.expire ();
            }
            
            // Transform DOM element.
            if ($.isFunction (metabehavior.transform)) {
                $element.livequery (function () {
                    metabehavior.transform.apply (this, arguments);
                }, metabehavior.untransform);
            }
            
            // Bind all events.
            for (var event in metabehavior) {
                switch (event) {
                    case 'transform':
                    case 'untransform':
                    case 'options':
                        // Don't handle these here.
                        continue;
                    
                    default:
                        if ($.isFunction (metabehavior[event])) {
                            $element.livequery (event, metabehavior[event]);
                        }
                        break;
                }
            }
            
            delete metabehavior;
            
        });
    };
    
})(jQuery);
