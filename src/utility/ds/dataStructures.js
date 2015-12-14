/**
 * Collection of data structures: maps and nodes
 * @author Fabio Costa
 */
ngObjects.dataStructures = (function () {
    "use strict";

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