/**
 * Service used for handeling selection and focusing
 * @author Fabio Costa
 */
(function (base) {
    "use strict";

    var serviceId = "handlerFactory";

    ngObjects.module.factory(serviceId, ["$log", "inputService", "timerFactory", handlerFactory]);

    /**
     * @typedef {handlerFactory}
     */
    function handlerFactory($log, inputService, timerFactory) {

        /**
         * @constructor
         * @param {{
         * name: string,
         * isFocused: boolean}|{name: string,
         * [id]: number,
         * [isFocused]: boolean,
         * [debug]: boolean,
         * [autoSelect]: boolean,
         * [autoFocus]: boolean,
         * [autoSelectDelay]: number,
         * [autoFocusDelay]: number
         * }} [options]
         */
        function Handler(options) {
            base.call(this);

            options = options || {
                isFocused: false,
                name: "", id: 0,
                isDebug: true,
                autoSelect: false,
                autoFocus: false,
                autoSelectDelay: null,
                autoFocusDelay: null
            };

            this.isFocused = false;

            this.name = options.name || "Handler";

            this.id = options.id || 0;

            this.isDebug = typeof options.isDebug == "undefined" || options.isDebug;

            options.autoSelect = options.autoSelect || false;
            options.autoFocus = options.autoFocus || false;

            this.autoSelect = new timerFactory.Timer({
                selectableObject: this,
                name: this.name,
                isEnabled: options.autoSelect,
                functionName: "select",
                delay: options.autoSelectDelay
            });

            this.autoFocus = new timerFactory.Timer({
                selectableObject: this,
                name: this.name,
                isEnabled: options.autoFocus,
                functionName: "focus",
                delay: options.autoFocusDelay
            });

            if (this.isDebug)
                $log.warn(serviceId, this.name + ".new", options);

            this.map = null;

            this.currentSelected = null;
            this.currentFocused = null;

            var self = this;
            this.listener = function remoteControlListener(e) {

                var keyCode = e.args.keyCode;

                if (keyCode == ngObjects.keyCode.UP) {

                    self.up();

                } else if (keyCode == ngObjects.keyCode.DOWN) {

                    self.down();

                } else if (keyCode == ngObjects.keyCode.RIGHT) {

                    self.right();

                } else if (keyCode == ngObjects.keyCode.LEFT) {

                    self.left();

                } else if (keyCode == ngObjects.keyCode.ENTER) {

                    self.select();

                }

            };

            if (options.isFocused)
                self.focus();
        }

        Handler.prototype = new base();
        Handler.prototype.constructor = Handler;

        /**
         * Sets the map
         * @param {Map} map
         * @param {{focusOnNode: Node, [reset]: boolean}} [options]
         */
        Handler.prototype.setMap = function (map, options) {

            //check if map is real
            if (map != null && !(map instanceof ngObjects.dataStructures.Map)) {

                if (this.isDebug)
                    $log.error(serviceId, this.name + ".setMap", "argument 'map' is not a Map");

                return false;
            }

            options = options || {
                reset: map == null,
                focusOnNode: null
            };

            options.focusOnNode = options.focusOnNode || null;

            if (typeof options.reset == "undefined" || options.reset == null)
                options.reset = map == null || map.head == null;

            if (options.reset) {

                if (this.currentFocused)
                    this.currentFocused.blur();

                if (this.currentSelected)
                    this.currentSelected.deselect();

                this.currentSelected = null;
                this.currentFocused = null;
            }

            if (map && map.head) {

                if (options.focusOnNode) {
                    this.currentFocused = options.focusOnNode;
                } else {
                    this.currentFocused = map.findFocused();
                    //map.clearSearch();
                    this.currentSelected = map.findSelected();
                    //map.clearSearch();
                }

                if (this.currentFocused)
                    this.focus();
            }

            this.map = map;
        };

        /**
         * Returns true if this handler has a valid map
         * @returns {boolean}
         */
        Handler.prototype.hasMap = function () {

            if (this.map == null || !(this.map instanceof ngObjects.dataStructures.Map))
                return false;

            return this.map.head != null;
        };

        Handler.prototype.up = function () {

            if (this.isDebug)
                $log.info(serviceId, this.name + ".up");

            this.fire(ngObjects.remoteControl.ON_UP, {
                currentFocused: this.currentFocused,
                currentSelected: this.currentSelected
            });

            if (this.currentFocused == null) {
                if (this.isDebug)
                    $log.info(serviceId, this.name + ".currentFocused is null");
                return false;
            }

            if (this.currentFocused.up == null) {
                if (this.isDebug)
                    $log.info(serviceId, this.name + ".currentFocused.up is null");
                return false;
            }

            this.autoSelect.cancelTimer(ngObjects.remoteControl.ON_UP);
            this.autoFocus.cancelTimer(ngObjects.remoteControl.ON_UP);

            this.currentFocused.blur();

            this.currentFocused = this.currentFocused.up;

            this.currentFocused.focus();

            this.autoFocus.startTimer(ngObjects.remoteControl.ON_UP);
            this.autoSelect.startTimer(ngObjects.remoteControl.ON_UP);

            return true;
        };

        Handler.prototype.down = function () {

            if (this.isDebug)
                $log.info(serviceId, this.name + ".down");

            this.fire(ngObjects.remoteControl.ON_DOWN, {
                currentFocused: this.currentFocused,
                currentSelected: this.currentSelected
            });

            if (this.currentFocused == null) {
                if (this.isDebug)
                    $log.info(serviceId, this.name + ".currentFocused is null");
                return false;
            }

            if (this.currentFocused.down == null) {
                if (this.isDebug)
                    $log.info(serviceId, this.name + ".currentFocused.down is null");
                return false;
            }

            this.autoSelect.cancelTimer(ngObjects.remoteControl.ON_DOWN);
            this.autoFocus.cancelTimer(ngObjects.remoteControl.ON_DOWN);

            this.currentFocused.blur();

            this.currentFocused = this.currentFocused.down;

            this.currentFocused.focus();

            this.autoFocus.startTimer(ngObjects.remoteControl.ON_DOWN);
            this.autoSelect.startTimer(ngObjects.remoteControl.ON_DOWN);

            return true;
        };

        Handler.prototype.left = function () {

            if (this.isDebug)
                $log.info(serviceId, this.name + ".left");

            this.fire(ngObjects.remoteControl.ON_LEFT, {
                currentFocused: this.currentFocused,
                currentSelected: this.currentSelected
            });

            if (this.currentFocused == null) {
                if (this.isDebug)
                    $log.info(serviceId, this.name + ".currentFocused is null");
                return false;
            }

            if (this.currentFocused.left == null) {
                if (this.isDebug)
                    $log.info(serviceId, this.name + ".currentFocused.left is null");
                return false;
            }

            this.autoSelect.cancelTimer(ngObjects.remoteControl.ON_LEFT);
            this.autoFocus.cancelTimer(ngObjects.remoteControl.ON_LEFT);

            this.currentFocused.blur();

            this.currentFocused = this.currentFocused.left;

            this.currentFocused.focus();

            this.autoFocus.startTimer(ngObjects.remoteControl.ON_LEFT);
            this.autoSelect.startTimer(ngObjects.remoteControl.ON_LEFT);

            return true;
        };

        Handler.prototype.right = function () {

            if (this.isDebug)
                $log.info(serviceId, this.name + ".right");

            this.fire(ngObjects.remoteControl.ON_RIGHT, {
                currentFocused: this.currentFocused,
                currentSelected: this.currentSelected
            });

            if (this.currentFocused == null) {
                if (this.isDebug)
                    $log.info(serviceId, this.name + ".currentFocused is null");
                return false;
            }

            if (this.currentFocused.right == null) {
                if (this.isDebug)
                    $log.info(serviceId, this.name + ".currentFocused.right is null");
                return false;
            }

            this.autoSelect.cancelTimer(ngObjects.remoteControl.ON_RIGHT);
            this.autoFocus.cancelTimer(ngObjects.remoteControl.ON_RIGHT);

            this.currentFocused.blur();

            if (this.currentFocused.right instanceof ngObjects.dataStructures.Node) {

                this.currentFocused = this.currentFocused.right;

                this.currentFocused.focus();

                this.autoFocus.startTimer(ngObjects.remoteControl.ON_RIGHT);
                this.autoSelect.startTimer(ngObjects.remoteControl.ON_RIGHT);

            }

            return true;

        };

        /**
         * Selects the currentFocused node
         * @param {{selectOnNode: Node}} [options]
         * @returns {boolean}
         */
        Handler.prototype.select = function (options) {

            options = options || {
                selectOnNode: null
            };

            options.selectOnNode = options.selectOnNode || null;

            this.autoSelect.cancelTimer(ngObjects.remoteControl.ON_SELECT);
            this.autoFocus.cancelTimer(ngObjects.remoteControl.ON_SELECT);

            if (this.isDebug)
                $log.warn(serviceId, this.name + ".select");

            if (this.currentFocused == null && options.selectOnNode == null)
                return false;

            if (this.currentSelected)
                this.currentSelected.deselect();

            if (options.selectOnNode) {
                options.selectOnNode.select();
                this.currentSelected = options.selectOnNode;
            } else {
                this.currentFocused.select();
                this.currentSelected = this.currentFocused;
            }

            this.fire(ngObjects.remoteControl.ON_SELECT, {
                currentFocused: this.currentFocused,
                currentSelected: this.currentSelected
            });

            return true;
        };

        /**
         * Removes focus on this handler and optionally on the current focused item
         * @param {{[blurCurrentFocused]: boolean, [cancelTimer]: boolean}} [options]
         * @returns {boolean}
         */
        Handler.prototype.blur = function (options) {

            this.autoFocus.cancelTimer(ngObjects.remoteControl.ON_BLUR);

            options = options || {
                blurCurrentFocused: false,
                cancelTimer: true
            };

            options.blurCurrentFocused = options.blurCurrentFocused || false;

            if (typeof options.cancelTimer == "undefined" || options.cancelTimer == null)
                options.cancelTimer = true;

            if (options.cancelTimer) {
                this.autoSelect.cancelTimer(ngObjects.remoteControl.ON_BLUR);
            }

            if (!this.isFocused)
                return true;

            if (this.isDebug)
                $log.info(serviceId, this.name + ".blur.NOT.listening");

            this.isFocused = false;

            inputService.removeListener(inputService.ON_KEY_DOWN, this.listener);

            if (options.blurCurrentFocused) {

                if (this.currentFocused)
                    this.currentFocused.blur();
            }

            this.fire(ngObjects.remoteControl.ON_BLUR, {
                currentFocused: this.currentFocused,
                currentSelected: this.currentSelected
            });

        };

        /**
         * Receive focus
         * @param {{
         * [forced]: boolean,
         * [firstNode]: boolean,
         * [focusCurrentSelected]: boolean,
         * [refocus]: boolean
         * }} [options]
         * @returns {boolean}
         */
        Handler.prototype.focus = function (options) {

            options = options || {
                forced: false, //focus at all costs
                firstNode: false, //focus on the first node of the map
                focusCurrentSelected: false, //focus on the current selected (default behavior)
                refocus: false //re-focus means to focus again but only if this handler has focus
            };

            options.refocus = options.refocus || false;
            options.forced = options.forced || false;
            options.firstNode = options.firstNode || false;
            options.focusCurrentSelected = options.focusCurrentSelected || false;

            //if focused but not forced, then return
            if (this.isFocused && options.forced == false && options.refocus == false)
                return false;

            if (options.refocus && !this.isFocused) //if refocusing, make sure this handler has focus
                return false;

            if (this.isDebug)
                $log.info(serviceId, this.name + ".focus.YES.listening");

            this.isFocused = true;

            if (options.focusCurrentSelected && this.currentSelected) {

                if (this.currentFocused)
                    this.currentFocused.blur();

                this.currentFocused = this.currentSelected;
                this.currentFocused.focus();

            } else if (this.currentFocused) {

                this.currentFocused.focus();

            } else {

                this.setFocusToFirstNode();
            }


            if (this.currentFocused && this.currentFocused.isFocused) {
                this.autoFocus.startTimer(ngObjects.remoteControl.ON_FOCUS);
            }

            inputService.addListener(inputService.ON_KEY_DOWN, this.listener, false);

            this.fire(ngObjects.remoteControl.ON_FOCUS);

            return true;
        };

        Handler.prototype.fixfocus = function () {

            $log.info(serviceId, this.name + ".fixfocus");

            if (!this.isFocused)
                return false;

            this.focus();

            return true;
        };

        Handler.prototype.refocus = function () {

            $log.info(serviceId, this.name + ".refocus");

            this.focus({
                refocus: true
            });

        };

        /**
         * Sets focus to a node. Only execute this once at the custom initialization
         * @param {Node} node
         * @param {{
         * [forced]: boolean,
         * [firstNode]: boolean,
         * [focusCurrentSelected]: boolean,
         * [refocus]: boolean
         * }} [options]
         * @returns {boolean}
         */
        Handler.prototype.setFocusToNode = function (node, options) {

            if (node == null)
                return false;

            //check if it's a real node
            if (!(node instanceof ngObjects.dataStructures.Node)) {
                if (this.isDebug)
                    $log.error(serviceId, this.name + ".setFocusToNode", "argument 'node' is not a Node");
                return false;
            }

            if (!this.exists(node))
                return false;

            $log.info(serviceId, this.name + ".setFocusToNode");

            if (this.currentFocused)
                this.currentFocused.blur();

            this.currentFocused = node;

            return this.focus(options);
        };

        /**
         * Sets focus to a node. Only execute this once at the custom initialization
         * @param {Node} node
         */
        Handler.prototype.setSelectedToNode = function (node) {

            if (node == null)
                return false;

            //check if it's a real node
            if (!(node instanceof ngObjects.dataStructures.Node)) {
                if (this.isDebug)
                    $log.error(serviceId, this.name + ".setSelectedToNode", "argument 'node' is not a Node");
                return false;
            }

            if (!this.exists(node))
                return false;

            if (this.isDebug)
                $log.info(serviceId, this.name + ".setSelectedToNode");

            if (this.currentSelected)
                this.currentSelected.deselect();

            this.currentSelected = node;
            this.currentSelected.select();

            return true;
        };

        /**
         * Check if given node exists in this handler's map
         * @param node
         * @returns {boolean}
         */
        Handler.prototype.exists = function (node) {

            var found = false;

            //check if node is in the map
            if (this.hasMap() && this.map.nodes) {

                for (var n in this.map.nodes) {

                    if (this.map.nodes[n] === node) {
                        found = true;
                        break;
                    }
                }

            }

            if (!found) {
                if (this.isDebug)
                    $log.error(serviceId, this.name + ".exists", "argument 'node' is not in this map");
            }

            return found;
        };

        /**
         * Deselects current selected
         */
        Handler.prototype.deselect = function () {

            if (this.currentSelected)
                this.currentSelected.deselect();

            return true;
        };

        /**
         * Sets focus to the first node of the map
         */
        Handler.prototype.setFocusToFirstNode = function () {

            if (this.isDebug)
                $log.info(serviceId, this.name + ".setFocusToFirstNode");

            if (!this.hasMap())
                return false;

            if (this.currentFocused)
                this.currentFocused.blur();

            this.currentFocused = this.map.head;
            this.currentFocused.focus();
            this.autoFocus.startTimer(ngObjects.remoteControl.ON_FOCUS);

            return true;
        };

        /**
         * Selects the first node of the map
         */
        Handler.prototype.setSelectedToFirstNode = function () {

            if (this.map == null || this.map.head == null)
                return false;

            if (this.isDebug)
                $log.info(serviceId, this.name + ".setSelectedToFirstNode");

            if (this.currentSelected)
                this.currentSelected.deselect();

            this.currentSelected = this.map.head;
            this.currentSelected.select();

            return true;

        };

        /**
         * * Returns true or false if the name of this handler is the same as given
         * @param {string} handlerName
         * @returns {*}
         */
        Handler.prototype.is = function (handlerName) {
            return this.name == handlerName;
        };

        /**
         * Returns the name of this handler
         * @returns {string}
         */
        Handler.prototype.toString = function () {
            return this.name;
        };

        return {
            Handler: Handler
        };

    }

})(ngObjects.eventManager.EventTarget);