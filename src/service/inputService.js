/**
 * Service used for managing input (keyboard and Samsung SmartTV remote control)
 * @author Fabio Costa
 */
(function (base) {
    "use strict";

    var serviceId = "inputService";

    ngObjects.module.service(serviceId, ["$log", inputService]);

    /**
     * Initializes inputService
     * @returns {inputService}
     */
    function inputService($log) {

        base.call(this);

        this.ON_KEY_DOWN = "onKeyDown";

        /**
         * Called from startupService to initialize remote control input
         */
        this.init = function () {

            $log.info(serviceId, "init");

            initWeb();

            return true;
        };

        /**
         * Triggered key from inputKey directive
         * @param {*} event
         */
        this.onKeyDown = function (event) {

            var keyCode = event.keyCode;

            // Convert the keyCode into a (readable) character - used primarily for logging
            var keyChar = null;

            switch (keyCode) {

                case ngObjects.keyCode.LEFT:
                    keyChar = "KEY.LEFT";
                    break;

                case ngObjects.keyCode.RIGHT:
                    keyChar = "KEY.RIGHT";
                    break;

                case ngObjects.keyCode.UP:
                    keyChar = "KEY.UP";
                    break;

                case ngObjects.keyCode.DOWN:
                    keyChar = "KEY.DOWN";
                    break;

                case ngObjects.keyCode.ENTER:
                    keyChar = "KEY.ENTER";
                    break;

                default:
                    keyChar = "NOT.DEFINED";
                    break;
            }

            if (keyChar)
                $log.info(serviceId, "onKeyDown(keyCode: " + keyCode + ", keyChar: " + keyChar + ")");

            this.fire(this.ON_KEY_DOWN, { keyCode: keyCode });

            return true;
        };

        /**
         * Initializes keyboard input from web browser
         */
        function initWeb() {

            $log.info(serviceId, "initWeb");

            // Listen for mouse movement on document to return focus back to input anchor
            document.onmousemove = function() {
                var inputKeyAnchor = document.getElementById("ngObjects-key-anchor");
                if (inputKeyAnchor)
                    inputKeyAnchor.focus();
            };

            return true;
        }

        return this;

    }

    inputService.prototype = new base();
    inputService.prototype.constructor = inputService;


})(ngObjects.eventManager.EventTarget);