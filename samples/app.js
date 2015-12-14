(function() {

    angular.module("app", ["ngObjects"])

    .controller("appController", ["$scope", "handlerFactory", "mapFactory", "buttonFactory", appController]);

    function appController($scope, handlerFactory, mapFactory, buttonFactory) {

        //create a handler
        var myHandler = new handlerFactory.Handler({
            name: "myHandler"
        });

        function init() {

            //create some sample buttons
            var buttons = [];

            for (var i = 0; i < 16; i++) {
                var btn = new buttonFactory.Button;
                btn.name = "button_" + i.toString();
                buttons.push(btn);
            }

            //create the map
            var map = mapFactory.createGridMap({
                objects: buttons,
                rowsSize: 4
            });

            $scope.vm = {
                buttons: buttons
            };

            //set map to handler
            myHandler.setMap(map);

            //focus the handler
            myHandler.focus();
        }

        //destroy view model and handler
        $scope.$on("$destroy", function () {

            myHandler.blur();
            $scope.vm = null;
        });

        init();
    }

})();
