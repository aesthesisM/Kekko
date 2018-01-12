var kekkoApp = angular.module('kekkoApp', ['ngSanitize', 'ngRoute', 'ui.select']);
kekkoApp.factory('Page', function () {
    var title = 'Dashboard';
    return {
        title: function () { return title; },
        setTitle: function (newTitle) { title = newTitle; },
        showMessage: function (type, title, message) {
            console.log(type, title, message);
            swal({
                type: type,
                title: title,
                html: $('<div>')
                    .text(message),
                //animation: false,
                //customClass: 'animated tada',
                allowOutsideClick: false
            });
        }
    };
});
kekkoApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'APIController as apiCtrl',
            templateUrl: 'home/dashboard.html'
            //resolve: function () { return []; }
        })
        .when('/signals', {
            templateUrl: 'signals.html'
            //resolve: function () { return null; }
        })
        .when('/dashboard/api', {
            controller: 'APIController as apiCtrl',
            templateUrl: 'api/settings.html'
            //resolve: function () { return []; }
        })
        .when('/order/bittrex', {
            controller: 'BittrexController as bittrexCtrl',
            templateUrl: 'order/bittrex.html'
            //resolve: function () { return null; }
        })
        .when('/order/hitbtc', {
            controller: 'HitBtcController as hitbtcCtrl',
            templateUrl: 'order/hitbtc.html'
            //resolve: function () { return null; }
        })
        .when('/order/poloniex', {
            controller: 'PoloniexController as poloniexCtrl',
            templateUrl: 'order/poloniex.html'
            //resolve: function () { return null; }
        })
        .otherwise({
            redirectTo: '/'
        });
});
kekkoApp.controller('MainController', function ($scope, $http, Page, $sce, $q) {
    var mainCtrl = this;
    Page.setTitle("Dashboard");
    mainCtrl.Page = Page;
    mainCtrl.pairs = [];
    mainCtrl.signalArray = [];
    mainCtrl.getPairs = function () {
        $http({
            method: 'GET',
            url: '/home'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            mainCtrl.pairs = response.data.slice(0, 20);
            console.log(response);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            mainCtrl.pairs = [{ symbol: 1, last: 12.1212 }];
        });
    };
    //mainCtrl.getPairs();

    mainCtrl.saveApi = function () {
        //save api json
    };
    mainCtrl.getAllApis = function () {

    };
    mainCtrl.showList = function () {
        console.log(mainCtrl.signalArray);
    }

    mainCtrl.showSignalChart = function (data) {
        mainCtrl.signalChart = data;
        var pp = data.pair.split("-")[1] + data.pair.split("-")[0];
        mainCtrl.signalChart.url = $sce.trustAsResourceUrl("/views/tradingView.html?site=BITTREX&value=" + pp);
        $('#modal-signalChart').modal('toggle');
    };
    mainCtrl.getLatestTickBittrex = function (pair) {
        var proxy = 'https://cors-anywhere.herokuapp.com/';
        var url = $sce.trustAsResourceUrl("https://bittrex.com/api/v1.1/public/getmarketsummary?market=" + pair.pair);

        return $http({
            method: "GET",
            url: proxy + url
        });
    };
    mainCtrl.openSignals = function () {
        toastr.options = {
            closeButton: true,
            debug: false,
            newestOnTop: true,
            progressBar: true,
            positionClass: "toast-top-right",
            preventDuplicates: false,
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: "120000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        };
        var socket = io.connect("http://localhost:50000");

        var hitbtcCallback;
        var bittrexCallback;
        var poloniexCallback;

        socket.on("callback", function (data) {
            if (data != null && data != undefined) {
                var error = null;
                if (_has(data, "error")) {
                    error = data.error;
                }
                switch (data.api) {
                    case 1: hitbtcCallback(data, error);
                        break;
                    case 2: bittrexCallback(data, error);
                        break;
                    case 3: poloniexCallback(data, error);
                        break;

                }
            }
        });
        socket.on("connection", function (data) {
            //mainCtrl.signalArray = data;
            for (i = 0; i < data.result[0].length; i++) {
                mainCtrl.signalArray.push((data.result[0])[i])
            }
            for (i = 0; i < data.result[1].length; i++) {
                mainCtrl.signalArray.push((data.result[1])[i])
            }
            mainCtrl.updatePercentages().then(function (data) {
                $scope.$apply();
            });;
            console.log(data);
        });
        socket.on('message', function (data) {
            socket.emit('message', { message: 'bambam message emit from client ;)' });
        });
        socket.on('signal', function (data) {
            toastr["info"](data.type + " / " + data.lastClosePrice + " / " + data.interval, "<a href='#!/signals' style='color:#ffffff;text-decoration:underline;'>" + data.pair + "</a>");
            console.log(data);
            mainCtrl.signalArray.push(data);
            mainCtrl.getLatestTickBittrex(data)
                .then(function successCallback(response) {
                    // pair.last = response.result[0].Last;
                    data.value = response.data.result[0].Last;
                    mainCtrl.calcPercentage(data);
                    $scope.$apply();
                }, function errorCallback(response) {
                    console.log("Err", response);
                    $scope.$apply();
                });
            document.getElementById('signalSound').play();
        });
    };
    mainCtrl.openSignals();
    mainCtrl.calcPercentage = function (item) {
        var diff = 0;
        if (item.value > item.lastClosePrice) {
            diff = item.value - item.lastClosePrice;
            item.change = "+";
        } else {
            diff = item.lastClosePrice - item.value;
            item.change = "-";
        }
        item.percentage = diff / item.lastClosePrice * 100;
    };
    mainCtrl.updatePercentages = function () {
        var deferred = $q.defer();
        angular.forEach(mainCtrl.signalArray, function (item, i) {
            // item.value = undefined;
            mainCtrl.getLatestTickBittrex(item)
                .then(function successCallback(response) {
                    // pair.last = response.result[0].Last;
                    item.value = response.data.result[0].Last;
                    mainCtrl.calcPercentage(item);
                    if (i == mainCtrl.signalArray.length - 1) {
                        console.log("Last item in list", item.pair);
                        deferred.resolve("ok");
                    }
                }, function errorCallback(response) {
                    item.value = "Err";
                });
        });
        return deferred.promise;
    };
    setInterval(function () {
        mainCtrl.updatePercentages().then(function (data) {
            $scope.$apply();
        });
    }, 30 * 6000);
});

