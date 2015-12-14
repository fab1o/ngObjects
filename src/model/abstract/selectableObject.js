/**
 * Selectable Object definition
 * @author Fabio Costa
 */
ngObjects.abstract.SelectableObject = (function (base) {

    ngObjects.utility.extend(SelectableObject, base);

    /**
     * @typedef {SelectableObject}
     * @constructor
     */
    function SelectableObject() {
        base.call(this);

        this.isSelected = false;
        this.isDisabled = false;
    }

    SelectableObject.prototype.onDeselected = function () {};

    SelectableObject.prototype.deselect = function () {

        this.isSelected = false;

        if (this.onDeselected)
            this.onDeselected();

        return true;
    };

    SelectableObject.prototype.onSelected = function () {};

    SelectableObject.prototype.select = function () {

        if (this.isDisabled)
            return;

        this.isSelected = true;

        if (this.onSelected)
            this.onSelected();

        return true;
    };

    SelectableObject.prototype.disable = function () {

        this.isDisabled = true;

        return true;
    };

    SelectableObject.prototype.enable = function () {

        this.isDisabled = false;

        return true;
    };


    return SelectableObject;

})(ngObjects.abstract.FocusableObject);