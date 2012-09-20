# jQuery Behavior Plugin:
Define rich behaviors that include both event handlers and (un)transformations on DOM elements.

## Why Behaviors:
While CSS stylesheets let us apply styles to our HTML pages without worrying about DOM load, traversal or changes over the lifetime of a page, we have to define the behaviors of the elements in a totally different way:

        /* the style sheet */
        div.menu { display: block; }
        div.menu li > a { color: blue; }

        /* the behavior */
        $('div.menu').do().something().with().element();
        $('div.menu li > a').click(function (e) { ... });


The jQuery Behavior Plugin introduces a convention to define `` metabehaviors `` that mimic the unobtrusive way of CSS stylesheets.

        /* the style sheet */
        div.menu { display: block; }
        div.menu li > a { color: blue; }

        /* the behavior */
        $.behavior({
            'div.menu li': {
                'transform': function (e) { ... }
            },
            'div.menu li > a': {
                'click': function (e) { ... }
            }
        });


In additon to the friendly syntax, the jQuery Behavior Plugin let us group and structure the actions into metabehaviors, it monitors DOM changes so that all behaviors are applied to future elements, and we can even definde behaviors for disappearing elements.


## Anatomy of Metabehaviors:
A metabehavior is the object describing the elements behaviors (before it is applied via the $.behavior function):

        var metabehavior = {
            'div.menu li': {
                'transform': function (e) { ... }
            },
            'div.menu li > a': {
                'click': function (e) { ... }
            }
        };

        $.behavior(metabehavior);

The metabehavior object properties consists of jQuery CSS selectors and carry an object with jQuery events names and attached actions. All jQuery events are supported, even 'ajaxStart' and such. In addition to the jQuery events, two special events are defined: `` 'transform' `` (a action that is applied if an element appears in DOM) and `` 'untransform' `` (a action that is triggered when an element is removed from DOM).

## Requirements:
jQuery 1.4.2+  
Live Query 1.1+

## Examples:
Example #1: http://jsfiddle.net/apy83/56/
