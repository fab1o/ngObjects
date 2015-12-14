/**
 * Service used to add auto-select, auto-hover and auto-navigation functionality to a remote control handler
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var factoryId = "timerFactory";

    ngObjects.module.factory(factoryId, ["$timeout", "$log", timerFactory]);

    function timerFactory($timeout, $log) {

        var DEFAULT_DELAY = {
            SELECT: .7,
            FOCUS: 1.5
        };

        /**
         * Timer
         * @constructor
         * @param {{
         * selectableObject: SelectableObject,
         * functionName: string,
         * [delay]: number,
         * [name]: string,
         * [isEnabled]: boolean
         * }} [options]
         */
        function Timer(options) {

            options = options || {
                selectableObject: null,
                isEnabled: false,
                name: "",
                delay: null,
                functionName: ""
            };

            this.selectableObject = options.selectableObject || null;

            this.timer = null;
            this.timeoutId = 0;
            this.isEnabled = options.isEnabled || false;

            if (this.selectableObject == null)
                this.isEnabled = false;

            if (typeof options.functionName == "undefined" || options.functionName == null) {

                this.isEnabled = false;
                this.functionName = null;

            } else {
                this.functionName = options.functionName;
            }

            this.name = options.name || "";

            this.delay = options.delay || DEFAULT_DELAY[this.functionName.toUpperCase()] || 1;

            if (this.name && this.isEnabled)
                $log.info(factoryId, this.name + ".autoselect enabled");

        };

        Timer.prototype.fire = function () {

            if (this.selectableObject && this.selectableObject.select) {

                $log.warn(factoryId, this.name + ".fire." + this.timeoutId);

                this.selectableObject[this.functionName]();

                return true;
            }

            return false;
        };

        Timer.prototype.cancelTimer = function (debugInfo) {

            if (this.timer) {

                $timeout.cancel(this.timer);
                this.timer = null;

                if (debugInfo)
                    $log.warn(factoryId, this.name + ".cancelTimer." + debugInfo + "." + this.timeoutId);
                else
                    $log.warn(factoryId, this.name + ".cancelTimer." + this.timeoutId);

                this.timeoutId = 0;

                return true;
            }

            return false;
        };

        Timer.prototype.startTimer = function (debugInfo) {

            if (!this.isEnabled)
                return false;

            var self = this;

            this.timer = $timeout(
                function timedOut() {
                    self.fire();
                    self.timer = null;

                }, this.delay * 500
            );

            this.timeoutId = this.timer.$$timeoutId;

            if (debugInfo)
                $log.info(factoryId, this.name + ".startTimer." + debugInfo + "." + this.timeoutId);
            else
                $log.info(factoryId, this.name + ".startTimer." + this.timeoutId);

            return true;
        };

        return {
            Timer: Timer
        }

    }

})();