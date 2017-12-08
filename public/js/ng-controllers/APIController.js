kekkoApp
    .controller('APIController', function ($http, Page) {
        var apiCtrl = this;
        apiCtrl.apiList = [];
        Page.setTitle("API Settings");
        apiCtrl.updateProcess = false;
        apiCtrl.updateApi = function (item) {
            //save api json
            apiCtrl.updateProcess = true;
            $http({
                method: 'POST',
                url: '/api/update',
                data: item
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response);
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", item.name + " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu. " + resp.data.message);
                }
                apiCtrl.updateProcess = false;
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu.");
                console.log(response);
                apiCtrl.updateProcess = false;
            });
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
                //mainCtrl.pairs = [{ symbol: 1, last: 12.1212 }];
            });
        };
        apiCtrl.getAllApis();
    });