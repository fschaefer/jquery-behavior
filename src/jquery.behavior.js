/*
 * jQuery Behavior Plugin: Define rich behaviors that include both event
 * handlers and (un)transformations on DOM elements.
 *
 * Copyright (c) 2011 Florian Schäfer (florian.schaefer@gmail.com)
 * Dual licensed under the MIT (MIT_LICENSE.txt)
 * and GPL Version 2 (GPL_LICENSE.txt) licenses.
 *
 * Version: 1.4
 * Requires: jQuery 1.7+ plus modified Live Query 1.1.1
 *
 */
(function ($, attr) {

    // jQuery supports getData, setData and changeData,
    // support getAttr, setAttr, changeAttr too.
    $.attr = function (elem, name, value) {
        var current = attr(elem, name),
            // read current value.
            retval = current;

        if (!value) {
            // we are getting a value.
            $.event.trigger('getAttr', {
                attribute: name,
                from: current,
                to: value
            }, elem);
        } else { // writing
            // we are setting a value.
            $.event.trigger('setAttr', {
                attribute: name,
                from: current,
                to: value
            }, elem);

            retval = attr.apply(this, arguments); // call original.
            // value or type changed.
            if (current !== value) {
                $.event.trigger('changeAttr', {
                    attribute: name,
                    from: current,
                    to: value
                }, elem);
            }
        }
        return retval; // return original
    };

})(jQuery, jQuery.attr);

(function ($, undefined) {

    if (!$.livequery) {
        throw "jquery.behavior.js: jQuery Plugin: Live Query not loaded.";
    }

    $.behavior = function (metabehaviors, context) {

        context = context || window.document;

        // Handle $.behavior(function () {}).
        if ($.isFunction(metabehaviors)) {
            metabehaviors = metabehaviors();
        }

        // Handle $.behavior(""), $.behavior(null), or $.behavior(undefined).
        if (!metabehaviors) {
            return this;
        }

        // Handle $.behavior([{ ... }, { ... }, ... ], [context]).
        if ($.isArray(metabehaviors)) {
            return $.each(metabehaviors, function () {
                $.behavior(this, context);
            });
        }

        // Handle $.behavior({ ... }, [context]).
        return $.each(metabehaviors, function (selector, metabehavior) {

            // Cache element.
            var $elementInContext = $(selector, context);

            // Evaluate metabehavior if it's a function.
            if ($.isFunction(metabehavior)) {
                metabehavior = metabehavior.call($elementInContext);
            }

            // Provide at least noop functions for transform and untransform.
            metabehavior = $.extend({
                transform: $.noop,
                untransform: $.noop
            }, metabehavior);

            // Bind all events.
            for (var event in metabehavior) {

                if (metabehavior.hasOwnProperty(event)) {

                    if (event !== 'transform' && event !== 'untransform') {
                        $elementInContext.livequery(event, metabehavior[event]);
                    }

                }

            }

            // Transform DOM element.
            $elementInContext.livequery(metabehavior.transform, metabehavior.untransform);

        });
    };

    $.fn.behavior = function (metabehaviors) {
        return this.each(function () {
            $.behavior(metabehaviors, this);
        });
    };

    $(function () {
        $('script[type="text/behavior"]').livequery(function () {
            $.behavior(eval('({' + $(this).text() + '})'));
        });
    });

})(jQuery);
