kekkoApp
    .controller('APIController', function ($http, Page) {
        var apiCtrl = this;
        apiCtrl.apiList = [];
        Page.setTitle("API Settings");

        apiCtrl.saveApi = function () {
            //save api json
        };
        apiCtrl.getAllApis = function () {
            $http({
                method: 'GET',
                url: '/api'
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                apiCtrl.apiList = response.data.respObj.data;
                console.log(response);
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                mainCtrl.pairs = [{ symbol: 1, last: 12.1212 }];
            });
        };        
    });