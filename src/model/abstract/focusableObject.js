ngObjects.abstract = {};

/**
 * Focusable Object definition (No selection properties)
 * @author Fabio Costa
 */
ngObjects.abstract.FocusableObject = (function () {
    /**
     * @typedef {FocusableObject}
     * @constructor
     */
    function FocusableObject() {
        this.isFocused = false;
    }

    FocusableObject.prototype.onFocused = function () {};

    FocusableObject.prototype.focus = function () {

        this.isFocused = true;

        if (this.onFocused)
            this.onFocused();

        return true;
    };

    FocusableObject.prototype.onBlured = function () {};

    FocusableObject.prototype.blur = function () {

        this.isFocused = false;

        if (this.onBlured)
            this.onBlured();

        return true;
    };

    return FocusableObject;

})();