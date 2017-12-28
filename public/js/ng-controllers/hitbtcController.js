kekkoApp
    .controller('HitBtcController', function ($location, $http, Page, $scope) {
        var hitbtcCtrl = this;
        hitbtcCtrl.updateProcess = false;
        hitbtcCtrl.viewOrder = false;
        hitbtcCtrl.chainsStart = 0;
        hitbtcCtrl.chainsTake = 100;
        hitbtcCtrl.currentChain = {};

        hitbtcCtrl.addChainModel = {};
        hitbtcCtrl.addOrderModel = {};
        hitbtcCtrl.addOrderModel.pair = null;
        hitbtcCtrl.pairs = [];
        hitbtcCtrl.chains = [];
        hitbtcCtrl.orders = [];

        $scope.$watch('hitbtcCtrl.addOrderModel.pairModel', function (newValue, oldValue) {
            if (hitbtcCtrl.addOrderModel.pairModel != null) {
                hitbtcCtrl.addOrderModel.price = hitbtcCtrl.addOrderModel.pairModel.last;
            }
        });

        hitbtcCtrl.addChain = function () {
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'POST',
                url: '/hitbtc/chains/add',
                data: hitbtcCtrl.addChainModel
            }).then(function successCallback(response) {
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", "Başarıyla kaydedildi.");
                    hitbtcCtrl.addChainModel.id = resp.data;
                    hitbtcCtrl.chains.push(hitbtcCtrl.addChainModel);
                    hitbtcCtrl.addChainModel = {};
                } else {
                    Page.showMessage("error", "Başarısız", "Kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", "Kaydedilirken hata oluştu.");
                hitbtcCtrl.updateProcess = false;
            });
        };

        hitbtcCtrl.removeChain = function (item) {
            hitbtcCtrl.updateProcess = true;
            //for removing active must be 0
            item.active = 0;
            $http({
                method: 'POST',
                url: '/hitbtc/chains/update',//??
                data: item
            }).then(function successCallback(response) {
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", item.name + " başarıyla kaydedildi.");
                    hitbtcCtrl.updateProcess = true;
                    var index = hitbtcCtrl.chains.indexOf(item);
                    hitbtcCtrl.chains.splice(index, 1);
                } else {
                    Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu. " + resp.data.message);
                    hitbtcCtrl.updateProcess = false;
                }
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", item.name + " kaydedilirken hata oluştu.");
                hitbtcCtrl.updateProcess = false;
            });
        };
        hitbtcCtrl.getChains = function () {
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'GET',
                url: '/hitbtc/chains?start=' + hitbtcCtrl.chainsStart + '&take=' + hitbtcCtrl.chainsTake
            }).then(function successCallback(response) {
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", "");
                    hitbtcCtrl.chains = resp.data;
                } else {
                    Page.showMessage("error", "Başarısız", "" + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", "Hata oluştu.");
                hitbtcCtrl.updateProcess = false;
            });
        };

        hitbtcCtrl.getChainOrders = function (chain) {
            if (chain != null) {
                hitbtcCtrl.currentChain = chain;
            }
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'GET',
                url: '/hitbtc/chains/' + hitbtcCtrl.currentChain.id
            }).then(function successCallback(response) {
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", "");
                    hitbtcCtrl.orders = resp.data;
                } else {
                    Page.showMessage("error", "Başarısız", "" + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
                hitbtcCtrl.viewOrder = true;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", "Hata oluştu.");
                hitbtcCtrl.updateProcess = false;
            });
        };
        hitbtcCtrl.getpairs = function () {
            hitbtcCtrl.updateProcess = true;
            $http({
                method: 'GET',
                url: '/hitbtc/tickers'
            }).then(function successCallback(response) {
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    hitbtcCtrl.pairs = resp.data;
                    //Page.showMessage("success", "Başarılı", item.name + " başarıyla kaydedildi.");
                } else {
                    Page.showMessage("error", "Fail", "An error occured while getting pairs from hitbtc" + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Fail", "Connection erro");
                hitbtcCtrl.updateProcess = false;
            });
        };
        hitbtcCtrl.getpairs();
        hitbtcCtrl.removeOrder = function (item) {
            hitbtcCtrl.updateProcess = true;
            item.active=0;
            $http({
                method: 'POST',
                url: '/hitbtc/chains/' + hitbtcCtrl.currentChain.id + '/updateOrder',
                data: item
            }).then(function successCallback(response) {
                var resp = response.data.respObj;
                if (resp.result == 1) {                    
                    Page.showMessage("success", "Başarılı", " başarıyla kaydedildi.");
                    var index = hitbtcCtrl.orders.indexOf(item);
                    hitbtcCtrl.orders.splice(index, 1);
                } else {
                    Page.showMessage("error", "Başarısız", " kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", " kaydedilirken hata oluştu.");
                hitbtcCtrl.updateProcess = false;
            });
        };

        hitbtcCtrl.addOrder = function () {
            hitbtcCtrl.updateProcess = true;
            hitbtcCtrl.addOrderModel.pair = hitbtcCtrl.addOrderModel.pairModel.symbol;
            hitbtcCtrl.addOrderModel.order_ = hitbtcCtrl.orders.length + 1;
            $http({
                method: 'POST',
                url: '/hitbtc/chains/' + hitbtcCtrl.currentChain.id + '/addOrder',
                data: hitbtcCtrl.addOrderModel
            }).then(function successCallback(response) {
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Başarılı", " başarıyla kaydedildi.");
                    hitbtcCtrl.addOrderModel.id = resp.data;//newly added order's id
                    hitbtcCtrl.addOrderModel.success = 0;// new order has not accomplished yet.
                    hitbtcCtrl.orders.push(hitbtcCtrl.addOrderModel);
                    hitbtcCtrl.addOrderModel = {};
                } else {
                    Page.showMessage("error", "Başarısız", " kaydedilirken hata oluştu. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Başarısız", " kaydedilirken hata oluştu.");
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
        hitbtcCtrl.showAddChainModal = function () {
            hitbtcCtrl.addChainModel = {};
            $('#modal-addChain').modal('toggle');
        };
        hitbtcCtrl.clearChain = function () {
            hitbtcCtrl.addChainModel = {};
        };

        hitbtcCtrl.startStopChain = function (item,status) {

            $http({
                method: 'POST',
                url: '/hitbtc/chains/' + hitbtcCtrl.currentChain.id + '/start',
                data: hitbtcCtrl.addOrderModel
            }).then(function successCallback(response) {
                var resp = response.data.respObj;
                if (resp.result == 1) {
                    Page.showMessage("success", "Success", "Chain is started successfully");
                } else {
                    Page.showMessage("error", "Error", "An error has occured. " + resp.data.message);
                }
                hitbtcCtrl.updateProcess = false;
            }, function errorCallback(response) {
                Page.showMessage("error", "Failed", "");
                hitbtcCtrl.updateProcess = false;
            });
        };

    });