angular.module('kekko', ['ngRoute'])
    .controller('APIController', function (Page) {
        var apiCtrl = this;
        apiCtrl.apiList = apis;
        Page.setTtitle("APİ")
        var saveApi = function () {
            //save api json
        };
        var getAllApis = function () {

        };
    });