/**
 * Create maps for navigation
 * @author Fabio Costa
 */
(function () {
    "use strict";

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