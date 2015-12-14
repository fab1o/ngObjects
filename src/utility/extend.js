/**
 * Utility library for the ngObjects module
 * @author Fabio Costa
 */
ngObjects.utility = new (function() {
    "use strict";

    /**
     * Extends two classes
     * @param {*} subclass
     * @param {*} superclass
     */
    function extend(subclass, superclass) {

        for (var propertyName in superclass) {
            if (superclass.hasOwnProperty(propertyName)) {
                subclass[propertyName] = superclass[propertyName];
            }
        }

        function subclassPrototype() {
            this.constructor = subclass;
        }

        subclassPrototype.prototype = superclass.prototype;
        //subclass.prototype = new subclassPrototype();
        subclass.prototype = superclass === null ? Object.create(superclass) : (subclassPrototype.prototype = superclass.prototype, new subclassPrototype());

        subclass._super = superclass.prototype;

        return subclass;
    }

    //public methods
    return {
        extend: extend
    }


})();