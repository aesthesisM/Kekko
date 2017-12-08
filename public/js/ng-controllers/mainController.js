﻿var kekkoApp = angular.module('kekkoApp', ['ngRoute']);
kekkoApp.factory('Page', function () {
    var title = 'Dashboard';
    return {
        title: function () { return title; },
        setTitle: function (newTitle) { title = newTitle; }
    };
});
kekkoApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'APIController as apiCtrl',
            templateUrl: 'home/dashboard.html'
            //resolve: function () { return []; }
        })
        .when('/dashboard/api', {
            controller: 'APIController as apiCtrl',
            templateUrl: 'api/index.html'
            //resolve: function () { return []; }
        })
        .when('/order/bittrex', {
            controller: 'BittrexController as bittrexCtrl',
            templateUrl: 'order/bittrex.html'
            //resolve: function () { return null; }
        })
        .when('/order/hitbtc', {
            controller: 'HitBtcController as hitbtcCtrl',
            templateUrl: 'order/HitBtc.html'
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
kekkoApp.controller('MainController', function ($http, Page) {
    var mainCtrl = this;
    mainCtrl.Page = Page;
    mainCtrl.pairs = [];
    Page.setTitle("Dashboard");
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
});

