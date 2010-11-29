/**
 * Methods plugin for jQuery. A simple plugin for attaching and retrieving
 * custom methods on jQuery objects.
 *
 * @author Ronald Schouten http://cloudsamurai.blogspot.com
 *
 * Copyright Ronald Schouten 2009
 * Licensed under the GPL -  http://www.gnu.org/licenses/gpl.txt
 *
 */

;(function ($) {
    /**
     * Allows methods to be attached to and retrieved from a jQuery object. Methods
     * are added in bulk using an object literal. Methods can be added multiple times
     * but adding a method of the same name will overwrite a previously added method.
     * Call methods without an argument to retrieve a reference to the methods already added.
     * 
     * @param {Object} methodsObj - An object literal containing method names and their methods
     * 
     * E.g.
     *         // Add methods to a jQuery object
     *         $("#foo").methods({
     *             doFoo: function (arg1, arg2) {
     *                 // do some foo
     *             },
     *             undoFoo: function () {
     *                // undo the foo 
     *             }
     *         });
     * 
     *         // Retrieve and call methods on a jQuery object
     *         $("#foo")
     *             .methods()
     *                 .doFoo(1, 2)
     *                 .end() // end does not have to called. Just there for chaining convenience.
     *             .hide();
     * 
     */
     $.fn.methods = function (methodsObj) {

        if (!methodsObj) {
            return this.data ("methods_");
        }

        return this.each (function (i) {
            var el = this, $el = $(el), methods = $(this).data ("methods_");

            // Create the initial methods object and add the built-in end method
            if (!methods) {
                methods = {};
                methods.end = function () {
                    return $el;
                };
                $(this).data ("methods_", methods);
            }
            
            $.each (methodsObj, function (key, val) {
                // No overwriting the built-in end method
                if (key !== "end") {
                    methods[key] = function () {
            
                        var value = val.apply (el, arguments);
                        
                        // test for undefined because func might return false
                        return (value === undefined ? methods : value);
                    };
                }
            });
        });

    };

})(jQuery);

