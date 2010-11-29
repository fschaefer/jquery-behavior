/*
 * jQuery Behavior Plugin: Define rich behaviors that include both event 
 * handlers, helpers and (un)transformations on DOM elements.
 * 
 * Copyright (c) 2010 Florian Schäfer (florian.schaefer@gmail.com)
 * Dual licensed under the MIT (MIT_LICENSE.txt)
 * and GPL Version 2 (GPL_LICENSE.txt) licenses.
 *
 * Version: 0.8
 * Requires: jQuery 1.4.2+ and Live Query 1.1+ & Methods Plugin.
 * 
 */

(function($, attr) {
    
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

(function($) {

    if (!$.fn.livequery) throw "jquery.behavior.js: jQuery Plugin: Live Query not loaded.";
    if (!($.fn.helpers = $.fn.methods)) throw "jquery.behavior.js: jQuery Plugin: Methods not loaded.";

    $.behavior = function (metabehaviors, context) {
        
        context = context || document;
        
        var $context = $(context);
        
        // Handle $.behavior (""), $.behavior (null), or $.behavior (undefined).
        if (!metabehaviors) {
            return this;
        }
        
        // Handle $.behavior (metabehaviors, [context]).        
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
                    $context.undelegate (selector, event);
                }
                
                if ($.isFunction (callback)) {
                    $context.delegate (selector, event, callback);
                }
            });
            
            delete metabehavior;
            
        });
    };
    
})(jQuery);

/*

$.behavior ({
    'button': {
        events: { 
            click: function () {
                alert ('clicked');
            }
        },
        transform: function () {
            $(this).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        }
    }
});

*/

/* Zippy widget

css:
    .zippy-header {
        cursor: pointer;
        line-height: 13px;
    }

    .zippy-icon {
        float: left;
    }

    zippy
    zippy-header
    zippy-content
    zippy-icon

html:
    <div class="zippy">
        <p class="zippy-header"><span class="ui-icon ui-icon-circlesmall-plus zippy-icon"></span>Zippy 3</p>
        <p class="zippy-content">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas commodo
            convallis nisi. Cras rhoncus elit non dolor. Vivamus gravida ultricies arcu.
            Praesent ipsum erat, vehicula et, ultrices at, dignissim at, ipsum. Aenean
            venenatis. Fusce blandit laoreet urna. Aliquam et pede condimentum lorem
            posuere molestie. Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas. Fusce euismod, justo in feugiat feugiat,
            urna metus sagittis felis, in varius neque mauris vitae dui. Nunc vel sapien
            in diam laoreet euismod. Mauris quis felis ut ipsum auctor feugiat. Nulla
            facilisi. Proin vitae urna. Quisque dignissim commodo nisl. Curabitur
            bibendum.
        </p>
    </div>
    
javascript:

$.behavior ({
    '.zippy-header': {
        transform: function () {
            var $zippy = $(this).parent ('.zippy');
            var $zippy_content = $zippy.children ('.zippy-content:first');
            var $zippy_icon = $zippy.find ('span.zippy-icon:first');
            if ($zippy_content.is (':hidden')) {
                $zippy_icon
                .removeClass ('ui-icon-circlesmall-minus')
                .addClass ('ui-icon-circlesmall-plus');
            } else {
                $zippy_icon
                .removeClass ('ui-icon-circlesmall-plus')
                .addClass ('ui-icon-circlesmall-minus');
            }
        },
        events: { 
            click: function () {
                var $zippy = $(this).parent ('.zippy');
                var $zippy_content = $zippy.children ('.zippy-content:first');
                var $zippy_icon = $zippy.find ('span.zippy-icon:first');

                if ($zippy_content.is (':hidden')) {
                    $zippy_content.slideDown (function () {
                        $zippy_icon
                        .removeClass ('ui-icon-circlesmall-plus')
                        .addClass ('ui-icon-circlesmall-minus');
                    });
                } else {
                    $zippy_content.slideUp (function () {
                        $zippy_icon
                        .removeClass ('ui-icon-circlesmall-minus')
                        .addClass ('ui-icon-circlesmall-plus');
                    });
                }
            }
        }
    }
});

*/

/*

buttonset:

$.behavior ({
    '#radio': {
        transform: function () {
            $(this).buttonset ();
        }
    },
    '#radio input': {
        events: {
            click: function () {
                console.log (this.id);
            }
        }
    }
});

*/
