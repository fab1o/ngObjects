/**
 * Service used to manager swiching focus between handlers and maintaining current focused handler
 */
(function () {
    "use strict";

    var serviceId = "handlerService";

    ngObjects.module.service(serviceId, ["$log", "handlerFactory", handlerService]);

    /**
     * @typedef {handlerService}
     */
    function handlerService($log, handlerFactory) {

        /**
         * Holds current focused handler
         * @type {null}
         */
        this.current = null;

        /**
         * Holds all handlers
          * @type {Array}
         */
        this.handlers = [];

        /**
         * Holds handlers' state information
         * @type {Array}
         */
        this.states = [];

        /**
         * Creates a new handler and ads to the list
         * @param {{name: string, isFocused: boolean}|{name: string, [isFocused]: boolean, [debug]: boolean, [autoSelect]: boolean }} [options]
         */
        this.createNewHandler = function (options) {

            var handler = new handlerFactory.Handler(options);

            this.handlers.push(handler);

            return handler;
        };

        /**
         * Switches focus from currentFocused handler to new handler and maintain it as currentFocused
         * @param {*|handlerFactory.Handler|Handler} handler
         * @param {{
         * [select]: boolean
         * [skipBlurCurrent]: boolean
         * }} [options]
         * @returns {boolean}
         */
        this.focus = function (handler, options) {

            if (handler == null) {
                $log.error(serviceId, "argument 'handler' cannot be null");
                return false;
            }

            options = options || {
                select: false,
                skipBlurCurrent: false
            };

            options.select = options.select || false;
            options.skipBlurCurrent = options.skipBlurCurrent || false;

            if (this.currentFocused) {

                this.currentFocused.blur({
                    blurCurrentFocused: this.currentFocused.name != handler.name
                });

                $log.warn(serviceId, "transitioning from " + this.currentFocused.name + " to " + handler.name);
            }

            this.currentFocused = handler;
            this.currentFocused.focus(options);

            if (options.select)
                this.currentFocused.select();

            return true;
        };

        this.getHandlerStates = function() {

            this.states = [];

            for (var i = 0; i < this.handlers; i++)
            {
                var handler = this.handlers[i];

                if (handler) {
                    this.states.push({
                        name: handler.name,
                        isFocused: handler.isFocused
                    });
                }

            }

            return this.states;
        };

        /**
         * Blur all handlers
         * @param {boolean} skipAppHandler
         * @returns {boolean}
         */
        this.blurAll = function (skipAppHandler) {

            $log.info(serviceId, "blurAll");

            this.getHandlerStates();

            for (var i = 0; i < this.handlers; i++)
            {
                var handler = this.handlers[i];

                if (handler) {
                    handler.blur();
                }

            }

            return true;
        };

        /**
         * Undo blur on all handlers
         * @returns {boolean}
         */
        this.undoBlur = function () {

            $log.info(serviceId, "undoBlur");

            for (var i = 0; i < this.handlers; i++)
            {
                var handler = this.handlers[i];

                if (handler) {

                    for (var j = 0; j < this.states; j++)
                    {
                        if (this.states[j].name == handler.name) {

                            if (this.states[j].isFocused) {
                                handler.focus();
                            }

                        }

                    }

                }

            }

            return true;
        };

        return this;
    }

})();