var app = angular.module('scriptRunner', []);

clean = function (scope) {
    scope.execCode = '';
    scope.phyScripts = [];
    scope.getStatus = '';
    scope.uploadStatus = '';
    scope.scriptName = '';
    scope.script = '';
    scope.deleteStatus = '';
    scope.execStatus = '';
    scope.execErrOut = '';
    scope.execStdOut = '';
    scope.execCode = '';
    scope.scriptToExecute = '';
    scope.scriptToDelete = '';
},

    app.controller('scriptCtrl', function ($scope, $http) {

        $scope.upload = function () {
            var req = {
                method: 'POST',
                url: 'http://localhost:3000/register',
                data: {scriptName: $scope.scriptName, script: $scope.script}
            };
            clean($scope);
            $http(req).success(function (data, status, headers, config) {
                $scope.uploadStatus = status;
                $scope.scriptName = '';
                $scope.script = '';
            }).error(function (data, status) {
                $scope.uploadStatus = status;
                $scope.scriptName = '';
                $scope.script = '';
            });
        },

            $scope.listScripts = function () {
                var req = {
                    method: 'GET',
                    url: 'http://localhost:3000/scripts '
                };
                clean($scope);
                $http(req).success(function (data, status, headers, config) {
                    $scope.phyScripts = data;
                    $scope.getStatus = status;
                }).error(function (data, status) {
                    $scope.phyScripts = [];
                    $scope.getStatus = status;
                });
            },

            $scope.deleteScript = function () {
                var scriptName = $scope.scriptToDelete;
                var req = {
                    method: 'DELETE',
                    url: 'http://localhost:3000/' + scriptName
                };
                clean($scope);
                $http(req).success(function (data, status, headers, config) {
                    $scope.deleteStatus = status;
                    $scope.scriptToDelete = scriptName;
                }).error(function (data, status) {
                    $scope.deleteStatus = status;
                    $scope.scriptToDelete = scriptName;
                });
            },

            $scope.executeScript = function () {
                var scriptToExec = $scope.scriptToExecute;
                var req = {
                    method: 'PUT',
                    url: 'http://localhost:3000/execute/' + scriptToExec
                };
                clean($scope);
                $http(req).success(function (data, status, headers, config) {
                    if (data.code !== null && data.code !== undefined) {
                        $scope.execCode = data.code;
                    }
                    if (data.stdErr) {
                        $scope.execErrOut = data.stdErr;
                    }
                    if (data.stdOut) {
                        $scope.execStdOut = data.stdOut;
                    }
                    $scope.execStatus = status;
                    $scope.scriptToExecute = scriptToExec;
                }).error(function (data, status) {
                    $scope.execStatus = status;
                    $scope.scriptToExecute = scriptToExec;
                });;
            }
    });
