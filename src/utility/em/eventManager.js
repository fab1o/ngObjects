/**
 * Event Manager - used to manage events
 * @author Fabio Costa
 */
ngObjects.eventManager = (function () {
    "use strict";

    /**
     * Event Target
     * @constructor
     */
    function EventTarget() {
        this.listeners = {};
    }

    EventTarget.prototype = {

        constructor: EventTarget,

        /**
         * Adds a listener function
         * @param {string} type - name of the event
         * @param {function} listener - function that will be called when this event fires
         * @param {boolean} [exclusive] - set this to true when you want only this event to be fired and not multiple
         * @returns {boolean}
         */
        addListener: function (type, listener, exclusive) {

            if (typeof listener == "undefined" || listener == null)
                return false;

            if (typeof type != "string")
                return false;

            if (typeof this.listeners[type] == "undefined") {
                this.listeners[type] = [];
            }

            if (exclusive)
                this.removeListener(type);

            this.listeners[type].push(listener);

            return true;
        },

        /**
         * Fires an event
         * @param {string} type - name of the event
         * @param {*} args - arguments for the event handler
         * @param {function} [callback] - function to be called when event handler is done
         * @returns {{type: string, args: *, callback: function, cancel: boolean}}
         */
        fire: function (type, args, callback) {

            if (typeof type != "string")
                return null;

            var event = {
                type: type,
                args: args,
                callback: callback,
                cancel: false
            };

            if (!event.target) {
                event.target = this;
            }

            if (this.listeners[event.type] instanceof Array) {

                //respect the order of events you add to the manager
                var listeners = this.listeners[event.type];
                for (var i = 0, len = listeners.length; i < len && i < listeners.length; i++) {
                    listeners[i].call(this, event);
                }

            }

            return event;
        },

        /**
         * Removes a listener function
         * @param {string} type - name of the event
         * @param {function} [listener] - function must match when listener was added
         * @returns {boolean}
         */
        removeListener: function (type, listener) {

            var found = false;

            if (typeof type != "string")
                return false;

            if (this.listeners[type] instanceof Array) {

                if (typeof listener == "undefined" || listener == null) {

                    found = this.listeners[type].length > 0;
                    this.listeners[type] = [];

                } else {

                    var listeners = this.listeners[type];

                    for (var i = 0, len = listeners.length; i < len && i < listeners.length; i++) {
                        if (listeners[i] === listener) {
                            listeners.splice(i, 1);
                            found = true;
                            break;
                        }
                    }

                }

            }

            return found;
        },

        /**
         * Removes a listener function
         * @param {string} type - name of the event
         * @returns {boolean}
         */
        removeListeners: function (type) {

            return this.removeListener(type);
        },

        /**
         * Quantity of listeners
         * @param {string} type - name of the event
         * @returns {number}
         */
        size: function (type) {

            return this.listeners[type].length;
        }

    };


    return { //Namespacing
        EventTarget: EventTarget
    };

})();

