/*
 * jQuery Behavior Plugin: Define rich behaviors that include both event 
 * handlers, helpers and (un)transformations on DOM elements.
 * 
 * Copyright (c) 2010 Florian Schäfer (florian.schaefer@gmail.com)
 * Dual licensed under the MIT (MIT_LICENSE.txt)
 * and GPL Version 2 (GPL_LICENSE.txt) licenses.
 *
 * Version: 0.9
 * Requires: jQuery 1.4.2+ and Live Query 1.1+ & Methods Plugin.
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
                    
            retval = attr (elem, name, value); // call original.
            
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

;(function($) {

    if (!$.fn.livequery) throw "jquery.behavior.js: jQuery Plugin: Live Query not loaded.";
    if (!($.fn.helpers = $.fn.methods)) throw "jquery.behavior.js: jQuery Plugin: Methods not loaded.";

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
                    expire: true
                },
                helpers: null,
                events: {},
                transform: null,
                untransform: undefined
            }, metabehavior);
            
            var $element = $(selector, context);
            
            // Transform DOM element.
            if (metabehavior.transform || metabehavior.untransform || metabehavior.helpers) {
            
                if (metabehavior.options.expire) {
                    $element.expire (metabehavior.transform, metabehavior.untransform);
                }
                
                $element.livequery (function () {
                    
                    if ($.isPlainObject (metabehavior.methods)) {
                        $element.helpers (metabehavior.methods);
                    }
                    
                    if ($.isPlainObject (metabehavior.helpers)) {
                        $element.helpers (metabehavior.helpers);
                    }
                    
                    if ($.isFunction (metabehavior.transform)) {
                        metabehavior.transform.apply (this, arguments);
                    }
                    
                }, metabehavior.untransform);
            
            }
            
            // Bind all events.
            $.each (metabehavior.events, function (event, callback) {
                
                if (metabehavior.options.expire) {
                    $element.expire (event);
                }
                
                if ($.isFunction (callback)) {
                    $element.livequery (event, callback);
                }
            });
            
            delete metabehavior;
            
        });
    };
    
})(jQuery);
