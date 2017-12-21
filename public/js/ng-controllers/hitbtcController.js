kekkoApp
    .controller('HitBtcController', function ($location, $http, Page) {
        var hitbtcCtrl = this;
        hitbtcCtrl.updateProcess = false;

        hitbtcCtrl.addChainModel = {};
        hitbtcCtrl.addOrderModel = {};
        hitbtcCtrl.pairs = {};
        hitbtcCtrl.addChain = function () {
            //save api json
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'POST',
                url: '/hitbtc/update',//??
                data: hitbtcCtrl.addChainModel
            }).then(function successCallback(response) {
                console.log(response);
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", item.name + " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu.");
                console.log(response);
                hitbtcCtrl.updateProcess = false;
            });
        };

        hitbtcCtrl.removeChain = function (item) {
            //save api json
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'POST',
                url: '/hitbtc/remove',//??
                data: item
            }).then(function successCallback(response) {
                console.log(response);
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", item.name + " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu.");
                console.log(response);
                hitbtcCtrl.updateProcess = false;
            });
        };
        hitbtcCtrl.getChains = function () {
            //save api json
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'POST',
                url: '/hitbtc/getChains',//??
                data: null
            }).then(function successCallback(response) {
                console.log(response);
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", item.name + " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu.");
                console.log(response);
                hitbtcCtrl.updateProcess = false;
            });
        };

        hitbtcCtrl.getpairs = function () {
            //save api json
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'POST',
                url: '/hitbtc/getPairs',//??
                data: null
            }).then(function successCallback(response) {
                console.log(response);
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    hitbtcCtrl.pairs = resp.data;
                    Page.showMessage("success", "Başarılı", item.name + " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu.");
                console.log(response);
                hitbtcCtrl.updateProcess = false;
            });
        };

        hitbtcCtrl.removeOrder = function () {
            //save api json
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'POST',
                url: '/hitbtc/removeOrder',//??
                data: null
            }).then(function successCallback(response) {
                console.log(response);
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    hitbtcCtrl.pairs = resp.data;
                    Page.showMessage("success", "Başarılı", item.name + " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu.");
                console.log(response);
                hitbtcCtrl.updateProcess = false;
            });
        };

        hitbtcCtrl.getOrders = function () {
            //save api json
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'POST',
                url: '/hitbtc/getOrders',//??
                data: null
            }).then(function successCallback(response) {
                console.log(response);
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    hitbtcCtrl.pairs = resp.data;
                    Page.showMessage("success", "Başarılı", item.name + " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu.");
                console.log(response);
                hitbtcCtrl.updateProcess = false;
            });
        };

        hitbtcCtrl.updateOrder = function () {
            $('#modal-addOrder').modal('toggle');
        };

        hitbtcCtrl.showAddOrderModal = function () {
            hitbtcCtrl.addOrderModel = {};
        };
        hitbtcCtrl.clearChain = function () {
            hitbtcCtrl.addChainModel = {};
        }

    });