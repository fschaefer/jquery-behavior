/*
 * jQuery Behavior Plugin: Define rich behaviors that include both event
 * handlers and (un)transformations on DOM elements.
 *
 * Copyright (c) 2011 Florian Schäfer (florian.schaefer@gmail.com)
 * Dual licensed under the MIT (MIT_LICENSE.txt)
 * and GPL Version 2 (GPL_LICENSE.txt) licenses.
 *
 * Version: 1.4.2
 * Requires: jQuery 1.7+ plus modified Live Query 1.2.0
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

    var transform = /\btransform\b/;
    var untransform = /\buntransform\b/;

    $.behavior = function (metabehaviors, context, unbind) {

        // Handle $.behavior(function () {}, [context]).
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
                $.behavior(this);
            });
        }

        // No context provided
        if (typeof context === 'boolean') {
            unbind = context;
            context = document;
        }

        // Promise a context
        var $context = $(context || document);

        // Handle $.behavior({ ... }).
        return $.each(metabehaviors, function (selector, metabehavior) {

            // Cache element.
            var $element = $(selector, $context[0]);

            // Evaluate metabehavior if it's a function.
            if ($.isFunction(metabehavior)) {
                metabehavior = metabehavior.call($element);
            }

            // Bind all events.
            for (var event in metabehavior) {

                if (metabehavior.hasOwnProperty(event)) {

                    $context[unbind ? 'off' : 'on'](event, $element.selector, metabehavior[event])

                    if (transform.test(event) && untransform.test(event)) {
                        $element[unbind ? 'expire' : 'livequery'](null, metabehavior[event], metabehavior[event])
                    } else if (transform.test(event)) {
                        $element[unbind ? 'expire' : 'livequery'](null, metabehavior[event], $.noop)
                    } else if (untransform.test(event)) {
                        $element[unbind ? 'expire' : 'livequery'](null, $.noop, metabehavior[event])
                    }

                }

            }

        });
    };

    $.fn.behavior = function (behaviors, unbind) {
        var metabehavior = {};
        metabehavior[this.selector] = behaviors;
        $.behavior(metabehavior, this.context, unbind);
        return this;
    };

    $(function () {
        if ($.behavior && $.behavior.scriptTag) {
            $('script[type="text/behavior"]').livequery(function () {
                var src = $(this).attr('src'),
                    text = $(this).text();
                $.behavior(eval('({' + (src ? $.ajax({ url: src, async: false }).responseText : text) + '})'));
            });
        }
    });

    $.fn.transform = function (fn, fn2) {
        return $(this).livequery(null, fn, fn2);
    };

    $.fn.untransform = function (fn2) {
        return $(this).livequery(null, null, fn2);
    };

})(jQuery);
