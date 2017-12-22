kekkoApp
    .controller('HitBtcController', function ($location, $http, Page) {
        var hitbtcCtrl = this;
        hitbtcCtrl.updateProcess = false;
        hitbtcCtrl.chainsStart = 0;
        hitbtcCtrl.chainsTake = 100;

        hitbtcCtrl.addChainModel = {};
        hitbtcCtrl.addOrderModel = {};
        hitbtcCtrl.pairs = [];
        hitbtcCtrl.chains = [];
        hitbtcCtrl.addChain = function () {
            //save api json
            console.log(hitbtcCtrl.addChainModel);
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'POST',
                url: '/hitbtc/chains/add',
                data: hitbtcCtrl.addChainModel
            }).then(function successCallback(response) {
                console.log(response);
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", "Başarıyla kaydedildi.");
                    hitbtcCtrl.chains.push(hitbtcCtrl.addChainModel);
                    hitbtcCtrl.addChainModel = {};
                } else {
                    Page.showMessage("error", "Başarısız", "Kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", "Kaydedilirken hata oluştu.");
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
                method: 'GET',
                url: '/hitbtc/chains?start=' + hitbtcCtrl.chainsStart + '&take=' + hitbtcCtrl.chainsTake
            }).then(function successCallback(response) {
                console.log(response);
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", "");
                    hitbtcCtrl.chains = resp.data;
                } else {
                    Page.showMessage("error", "Başarısız", "" +  resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", "Hata oluştu.");
                console.log(response);
                hitbtcCtrl.updateProcess = false;
            });
        };
        hitbtcCtrl.getChains();
        hitbtcCtrl.getpairs = function () {
            //save api json
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'GET',
                url: '/hitbtc/tickers'
            }).then(function successCallback(response) {
                console.log(response);
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    hitbtcCtrl.pairs = resp.data;
                    //Page.showMessage("success", "Başarılı", item.name + " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Başarısız", "Kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", "Kaydedilirken hata oluştu.");
                console.log(response);
                hitbtcCtrl.updateProcess = false;
            });
        };
        hitbtcCtrl.getpairs();
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
                    Page.showMessage("success", "Başarılı", " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Başarısız", " kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", " kaydedilirken hata oluştu.");
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
                    Page.showMessage("success", "Başarılı", " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Başarısız", " kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", " kaydedilirken hata oluştu.");
                console.log(response);
                hitbtcCtrl.updateProcess = false;
            });
        };

        hitbtcCtrl.addOrder = function () {
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'POST',
                url: '/hitbtc/addOrder',
                data: hitbtcCtrl.addOrderModel
            }).then(function successCallback(response) {
                console.log(response);
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Başarısız", " kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", " kaydedilirken hata oluştu.");
                console.log(response);
                hitbtcCtrl.updateProcess = false;
            });
        };

        hitbtcCtrl.updateOrder = function () {
            $('#modal-addOrder').modal('toggle');
        };

        hitbtcCtrl.showAddOrderModal = function () {
            hitbtcCtrl.addOrderModel = {};
            $('#modal-addOrder').modal('toggle');
        };
        hitbtcCtrl.clearChain = function () {
            hitbtcCtrl.addChainModel = {};
        }

    });