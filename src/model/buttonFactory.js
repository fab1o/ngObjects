(function (base) {
    "use strict";

    var factoryId = "buttonFactory";

    ngObjects.module.factory(factoryId, buttonFactory);

    /**
     * @typedef {buttonFactory} buttonFactory
     */
    function buttonFactory() {

        ngObjects.utility.extend(Button, base);

        function Button() {
            base.call(this);

            this.name = "";
        }

        return {
            Button: Button
        };

    }

})(ngObjects.abstract.SelectableObject);
