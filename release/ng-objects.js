"use strict";
// Source: src/module.js
/**
 * Module used for the ngObjects system
 * @author Fabio Costa
 */

var ngObjects = {};

ngObjects.module = (function () {
return angular.module("ngObjects", []);

})();
// Source: src/enum/keyCode.js
/**
 * Keyboard based input related constants
 * @author Fabio Costa
 */
ngObjects.keyCode = (function() {
return {
        LEFT:     37,  // LEFT ARROW
        UP:       38,  // UP ARROW
        RIGHT:    39,  // RIGHT ARROW
        DOWN:     40,  // DOWN ARROW

        ENTER:    13  // ENTER
    };

})();

// Source: src/enum/remoteControl.js
/**
 * Handler events and constants
 * @author Fabio Costa
 */
ngObjects.remoteControl = (function () {
return {
        ON_FOCUS: "onFocus",
        ON_BLUR: "onBlur",

        ON_UP: "onUp",
        ON_DOWN: "onDown",
        ON_RIGHT: "onRight",
        ON_LEFT: "onLeft",

        ON_SELECT: "onSelect"
    };

})();
// Source: src/utility/extend.js
/**
 * Utility library for the ngObjects module
 * @author Fabio Costa
 */
ngObjects.utility = new (function() {
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
// Source: src/utility/ds/dataStructures.js
/**
 * Collection of data structures: maps and nodes
 * @author Fabio Costa
 */
ngObjects.dataStructures = (function () {
var Node = (function () {

        var _id = 0;

        /**
         * Node
         * @param {FocusableObject|SelectableObject} value
         * @param {number} [id]
         * @constructor
         */
        function Node(value, id) {

            ++_id;

            this.id = id || _id;

            this.value = value;

            this.up = null;
            this.down = null;
            this.left = null;
            this.right = null;

            //this.isSearched = false;

            this.column = 0; //indicates what column the node is on a squaredMap
        }

        Node.prototype = {

            focus: function () {

                return this.value.focus();
            },

            blur: function () {

                return this.value.blur();
            },

            select: function () {

                return this.value.select();
            },

            deselect: function () {

                return this.value.deselect();
            }

        };

        return Node;

    })();

    var Map = (function () {

        /**
         * Map
         * @type {Map}
         * @constructor
         */
        function Map() {

            this.length = 0;
            this.current = null;
            this.currentId = 0;
            this._head = null;

            this.nodes = [];
        }

        Map.prototype = {

            get head() {
                return this._head;
            },

            set head(value) {
                this._head = value;
            },

            /**
             * Initializes the map for you pushing down the items
             * @param {Array} array
             */
            initArrayUpDown: function (array) {

                if (array instanceof Array) {
                    if (array) {
                        for (var i = 0; i < array.length; i++) {
                            this.pushDownFromNode(array[i], this.current);
                        }
                    }
                }

            },

            /**
             * Initializes the map for you pushing down the items
             * @param {Array} array
             */
            initArrayLeftRight: function (array) {

                if (array instanceof Array) {
                    if (array) {
                        for (var i = 0; i < array.length; i++) {
                            this.pushRightFromNode(array[i], this.current);
                        }
                    }
                }

            },

            /**
             * Initializes the map with a first node
             * @param {Node} node
             */
            initNode: function (node) {

                this.current = node;

                this.head = this.current;

                this.length++;
                return this.current;
            },

            /**
             * Creates a new Node given a value
             * @param value
             */
            createNode: function (value) {

                this.currentId++;
                var node = new Node(value);
                node.id = this.currentId;
                value.nodeId = node.id;

                this.nodes.push(node);

                return node;
            },

            /**
             * Initializes the map with a first value
             * @param {*} value
             */
            init: function (value) {

                this.current = this.createNode(value);

                this.head = this.current;

                this.length++;
                return this.current;
            },

            /**
             * Creates a node and place it down
             * @param {*} value
             * @returns {Node}
             */
            pushDown: function (value) {

                var newNode = this.createNode(value);

                if (this.length == 0)
                    return this.initNode(newNode);

                this.current.down = newNode;

                this.current = newNode;

                this.length++;

                return this.current;

            },

            /**
             * Creates a node and place it down from the last pushed node
             * @param {*} value
             * @returns {Node}
             */
            pushDownFromCurrent: function (value) {

                var newNode = this.createNode(value);

                if (this.length == 0)
                    return this.initNode(newNode);

                this.current.down = newNode;
                newNode.up = this.current;

                this.current = newNode;

                this.length++;

                return this.current;

            },

            /**
             * Creates a node and place it down from the given node.
             * @param {*} value
             * @param {Node} [node]
             * @returns {Node}
             */
            pushDownFromNode: function (value, node) {

                if (typeof node == 'undefined' || node == null)
                    return this.pushDownFromCurrent(value);

                var newNode = this.createNode(value);

                node.down = newNode;
                newNode.up = node;

                this.current = newNode;

                this.length++;

                return this.current;

            },

            /**
             * Creates a node and place it up
             * @param {*} value
             * @returns {Node}
             */
            pushUp: function (value) {

                var newNode = this.createNode(value);

                if (this.length == 0)
                    return this.initNode(newNode);

                newNode.up = this.current;

                this.current = newNode;

                this.length++;

                return this.current;
            },

            /**
             * Creates a node and place it up from the last pushed node.
             * @param {*} value
             * @returns {Node}
             */
            pushUpFromCurrent: function (value) {

                var newNode = this.createNode(value);

                if (this.length == 0)
                    return this.initNode(newNode);

                newNode.up = this.current;
                this.current.down = newNode;

                this.current = newNode;

                this.length++;

                return this.current;
            },

            /**
             * Creates a node and place it up from the given node.
             * @param {*} value
             * @param {Node} [node]
             * @returns {Node}
             */
            pushUpFromNode: function (value, node) {

                if (typeof node == 'undefined' || node == null)
                    return this.pushUpFromCurrent(value);

                var newNode = this.createNode(value);

                newNode.up = node;
                node.down = newNode;

                this.current = newNode;

                this.length++;

                return this.current;
            },

            /**
             * Creates a node and place it left
             * @param {*} value
             * @returns {Node}
             */
            pushLeft: function (value) {

                var newNode = this.createNode(value);

                if (this.length == 0)
                    return this.initNode(newNode);

                this.current.left = newNode;

                this.current = newNode;

                this.length++;

                return this.current;

            },

            /**
             * Creates a node and place it left from the last pushed node
             * @param {*} value
             * @returns {Node}
             */
            pushLeftFromCurrent: function (value) {

                var newNode = this.createNode(value);

                if (this.length == 0)
                    return this.initNode(newNode);

                this.current.left = newNode;
                newNode.right = this.current;

                this.current = newNode;

                this.length++;

                return this.current;

            },

            /**
             * Creates a node and place it left from the given node.
             * @param {*} value
             * @param {Node} [node]
             * @returns {Node}
             */
            pushLeftFromNode: function (value, node) {

                if (typeof node == 'undefined' || node == null)
                    return this.pushLeftFromCurrent(value);

                var newNode = this.createNode(value);

                node.left = newNode;
                newNode.right = node;

                this.current = newNode;

                this.length++;

                return this.current;

            },

            /**
             * Creates a node and place it right
             * @param {*} value
             * @returns {Node}
             */
            pushRight: function (value) {

                var newNode = this.createNode(value);

                if (this.length == 0)
                    return this.initNode(newNode);

                this.current.right = newNode;

                this.current = newNode;

                this.length++;

                return this.current;

            },

            /**
             * Creates a node and place it right from the last pushed node
             * @param {*} value
             * @returns {Node}
             */
            pushRightFromCurrent: function (value) {

                var newNode = this.createNode(value);

                if (this.length == 0)
                    return this.initNode(newNode);

                this.current.right = newNode;
                newNode.left = this.current;

                this.current = newNode;

                this.length++;

                return this.current;

            },

            /**
             * Creates a node and place it right from the given node.
             * @param {*} value
             * @param {Node} [node]
             * @returns {Node}
             */
            pushRightFromNode: function (value, node) {

                if (typeof node == 'undefined' || node == null)
                    return this.pushRightFromCurrent(value);

                var newNode = this.createNode(value);

                node.right = newNode;
                newNode.left = node;

                this.current = newNode;

                this.length++;

                return this.current;

            },

            /**
             * Gets the size of the list
             * @returns {number}
             */
            size: function () {

                return this.length;

            },

            /**
             * Finds a node given an id
             * @param {number} id
             * @returns {Node|null}
             */
            find: function (id) {

                if (id == null || typeof id == "undefined")
                    return null;

                for (var i = 0; i < this.nodes.length; i++) {
                    if (this.nodes[i].id == id)
                        return this.nodes[i];
                }

                return null;
            },

            /**
             * Finds the first node that has focus
             * @returns {Node|null}
             */
            findFocused: function () {

                for (var i = 0; i < this.nodes.length; i++) {
                    if (this.nodes[i].value.isFocused)
                        return this.nodes[i];
                }

                return null;
            },

            /**
             * Finds the first node that is selected
             * @returns {Node|null}
             */
            findSelected: function () {

                for (var i = 0; i < this.nodes.length; i++) {
                    if (this.nodes[i].value.isSelected)
                        return this.nodes[i];
                }

                return null;
            }

        };

        return Map;

    })();

    var SquaredMap = (function (base) {
        ngObjects.utility.extend(SquaredMap, base);

        /**
         * A prefect squared map is a map that consists on NxN nodes
         * @param {number} column
         * @constructor
         */
        function SquaredMap(column) {

            this.qtyColumns = column || 0;
            this.multipleColumnsChanged = 0;

            base.call(this);

        }

        /**
         * Sets the number of columns
         * @param {number} column
         */
        SquaredMap.prototype.setColumn = function (column) {

            if (this.qtyColumns != column) {

                if (this.qtyColumns != 0) {
                    this.currentId = 0;
                    this.multipleColumnsChanged++;
                }

                this.qtyColumns = column || this.qtyColumns;
            }

        };

        /**
         * Gets the Column number on a prefect squared map (4x4 or 2x2)
         * @param {number} id
         * @param {number} row
         * @returns {number}
         */
        SquaredMap.prototype.getColumn = function (id, row) {

            var column = 0;

            if ((id % this.qtyColumns) + this.qtyColumns == this.qtyColumns) { //experimental (to work with NxN coluns)

                column = this.qtyColumns;

            } else if ((id % 4) + 4 == 4) {

                column = 4;

            } else if ((id % 2) + 2 == 2) {

                column = 2;

            } else if (id - (row * this.qtyColumns) == 3) {

                column = 3;

            } else if (id - (row * this.qtyColumns) == 1) {

                column = 1;

            }

            return column;
        };

        /**
         * Navigates the map going left until the column been reached
         * @param {number} column
         * @returns {Node}
         */
        SquaredMap.prototype.getLeftNodeByColumn = function (column) {

            var current = this.current;

            while (current = current.left) {

                if (current.column == column)
                    return current;

            }

            return null;
        };

        return SquaredMap;

    })(Map);

    var LinkedList = (function () {

        function LinkedList() {
            this.length = 0;
            this.head = null;
            this.tail = null;
        }

        LinkedList.prototype = {
            init: function (array) {
                if (array) {
                    for (var i = 0; i < array.length; i++) {
                        this.add(array[i]);
                    }
                }
            },

            push: function (value) {

                this.add(value);
            },

            add: function (value) {

                var node = {
                    value: value,
                    next: null,
                    previous: null
                };

                if (this.length == 0) {
                    this.head = node;
                    this.tail = node;
                }
                else {
                    this.tail.next = node;
                    node.previous = this.tail;
                    this.tail = node;
                }

                this.length++;
            },

            size: function () {
                return this.length;
            },

            firstNode: function () {
                return this.item(0);
            },

            lastNode: function () {
                return this.item(this.length - 1);
            },

            nodeExists: function (value) {

                var current = this.head;
                var i = 0;

                while (i++ < this.length) {
                    if (current.value === value)
                        return i;

                    current = current.next;
                }

                return -1;
            },

            getNode: function (index) {
                if (index > this.length - 1 || index < 0) {
                    return null;
                }

                var current = this.head;
                var i = 0;

                while (i++ < index) {
                    current = current.next;
                }

                return current;
            },

            removeNode: function (index) {
                if (index > this.length - 1 || index < 0) {
                    return null;
                }

                var current = this.head;
                var i = 0;

                if (index == 0) {
                    this.head = current.next;

                    // check if we removed the only one in the list
                    if (this.head == null) {
                        this.tail = null;
                    }
                    else {
                        this.head.previous = null;
                    }
                }
                else if (index == this.length - 1) {
                    current = this.tail;
                    this.tail = current.previous;
                    this.tail.next = null;
                }
                else {
                    while (i++ < index) {
                        current = current.next;
                    }

                    current.previous.next = current.next;
                    current.next.previous = current.previous;
                }

                this.length--;

                return current.value;

            },

            pop: function () {
                return this.remove(this.length - 1);
            },

            toArray: function () {

                var list = [this.head.value], current = this.head;

                while (current = current.next)
                    list.push(current.value);

                return list;

            }

        };

        return LinkedList;

    })();

    return {
        Map: Map,
        SquaredMap: SquaredMap,
        Node: Node,

        LinkedList: LinkedList
    };


})();
// Source: src/utility/em/eventManager.js
/**
 * Event Manager - used to manage events
 * @author Fabio Costa
 */
ngObjects.eventManager = (function () {
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


// Source: src/model/abstract/focusableObject.js
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
// Source: src/model/abstract/selectableObject.js
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

// Source: src/model/buttonFactory.js
(function (base) {
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

// Source: src/service/direction.js
/**
 * Direction enum
 * @author Fabio Costa
 */
ngObjects.DIRECTION = (function () {

    return {
        RIGHT: "right",
        LEFT: "left",
        DOWN: "down",
        UP: "up"
    };

})();
// Source: src/service/handlerFactory.js
/**
 * Service used for handeling selection and focusing
 * @author Fabio Costa
 */
(function (base) {
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
// Source: src/service/handlerService.js
/**
 * Service used to manager swiching focus between handlers and maintaining current focused handler
 */
(function () {
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
// Source: src/service/inputService.js
/**
 * Service used for managing input (keyboard and Samsung SmartTV remote control)
 * @author Fabio Costa
 */
(function (base) {
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
// Source: src/service/mapFactory.js
/**
 * Create maps for navigation
 * @author Fabio Costa
 */
(function () {
var factoryId = "mapFactory";

    ngObjects.module.factory(factoryId, [mapFactory]);

    function mapFactory() {

        return {
            createGridMap: createGridMap,
            createLinearMap: createLinearMap
        };

        /**
         * Creates a map of objects in linear format
         * @param {{
         * objects: SelectableObject[],
         * [direction]: ngObjects.DIRECTION,
         * [isCircular]: boolean
         * }} [options]
         * @returns {Map}
         */
        function createLinearMap(options) {

            options = options || {};

            var objects = options.objects || [];
            var direction = options.direction || ngObjects.DIRECTION.RIGHT;
            var isCircular = options.isCircular;

            var map = new ngObjects.dataStructures.Map();

            for (var i = 0; i < objects.length; i++) {

                switch (direction){
                    case ngObjects.DIRECTION.RIGHT:
                        map.pushRightFromCurrent(objects[i]);
                        break;
                    case ngObjects.DIRECTION.LEFT:
                        map.pushLeftFromCurrent(objects[i]);
                        break;
                    case ngObjects.DIRECTION.UP:
                        map.pushUpFromCurrent(objects[i]);
                        break;
                    case ngObjects.DIRECTION.DOWN:
                        map.pushDownFromCurrent(objects[i]);
                        break;
                }
            }

            //Making it circular if more than or equals to 2 items
            if (isCircular && objects.length >= 2 && map.current && map.head){

                switch (direction){
                    case ngObjects.DIRECTION.RIGHT:
                        map.current.right = map.head;
                        map.head.left = map.current;
                        break;
                    case ngObjects.DIRECTION.LEFT:
                        map.current.left = map.head;
                        map.head.right = map.current;
                        break;
                    case ngObjects.DIRECTION.UP:
                        map.current.up = map.head;
                        map.head.down = map.current;
                        break;
                    case ngObjects.DIRECTION.DOWN:
                        map.current.down = map.head;
                        map.head.up = map.current;
                        break;
                }
            }

            return map;
        }

        /**
         * Creates a map of objects in grid format
         * @param {{
         * objects: SelectableObject[],
         * [rowsSize]: number
         * }} [options]
         * @returns {Map}
         */
        function createGridMap(options) {

            options = options || {};

            var objects = options.objects || [];
            var rowsSize = options.rowsSize || 4;

            rowsSize = Math.ceil(rowsSize);

            var map = new ngObjects.dataStructures.Map();

            var rows = [];
            var columns = [];

            var max = objects.length;

            for (var i = 1; i <= max; i++) {

                var o = objects[i - 1];
                var node = new ngObjects.dataStructures.Node(o, i);

                map.nodes.push(node);

                var mod = i % rowsSize;

                if (rows.length > 0) {
                    var lastRow = rows[rows.length - 1];

                    var col = (mod || rowsSize) - 1;

                    lastRow[col].down = node;
                    node.up = lastRow[col];

                }

                if (columns.length > 0) {
                    columns[columns.length - 1].right = node;
                    node.left = columns[columns.length - 1];
                }

                columns.push(node);

                if (mod == 0 || mod == max) {
                    rows.push(columns);
                    columns = [];
                }

            }

            if (rows.length > 0 && rows[0].length > 0) {
                map.head = rows[0][0];
            }

            return map;

        }

    }

})();
// Source: src/service/timerFactory.js
/**
 * Service used to add auto-select, auto-hover and auto-navigation functionality to a remote control handler
 * @author Fabio Costa
 */
(function () {
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
// Source: src/directive/ngObjects.js
/**
 * the html A tag responsible for capturing the inputs on ng-keydown
 * @author Fabio Costa
 */
(function () {
ngObjects.module.directive("ngObjects", ["$log", "inputService", function ($log, inputService) {

        inputService.init();

        return {
            template: "<a href='javascript:void(0);' id='ngObjects-key-anchor' ng-keydown='onKeyDown($event)' />",
            restrict: "E",
            replace:  true,
            link: function (scope, elem) {

                scope.onKeyDown = function (event) {

                    inputService.onKeyDown(event);
                };

                elem[0].focus();
            }

        }

    }]);

})();