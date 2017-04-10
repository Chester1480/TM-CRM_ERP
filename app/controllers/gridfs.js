/**
 2014-2016 ToManage

NOTICE OF LICENSE

This source file is subject to the Open Software License (OSL 3.0)
that is bundled with this package in the file LICENSE.txt.
It is also available through the world-wide-web at this URL:
http://opensource.org/licenses/osl-3.0.php
If you did not receive a copy of the license and are unable to
obtain it through the world-wide-web, please send an email
to license@tomanage.fr so we can send you a copy immediately.

DISCLAIMER

Do not edit or add to this file if you wish to upgrade ToManage to newer
versions in the future. If you wish to customize ToManage for your
needs please refer to http://www.tomanage.fr for more information.

@author    ToManage SAS <contact@tomanage.fr>
@copyright 2014-2016 ToManage SAS
@license   http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
International Registered Trademark & Property of ToManage SAS
**/


"use strict";

MetronicApp.controller('FileCtrl', ['$scope', '$rootScope', '$http', 'FileUploader',
    function ($scope, $rootScope, $http, FileUploader) {
        $scope.upload = false;

        $scope.files = [];

        var uploader = $scope.uploader = new FileUploader({autoUpload: true});

        $scope.init = function (model, object) {
            uploader.url = '/erp/api/file/' + model + '/' + object._id;
            $scope.model = model;
            $scope.id = object._id;
            $scope.object = object;
            $scope.find();
        };

        $scope.find = function () {
            this.upload = false;
            //console.log($scope.object.files);

            /*$http({
                method: 'GET',
                url: '/erp/api/file',
                params: {
                    model: $scope.model,
                    id: $scope.id
                }
            }).success(function (data, status) {
                //$scope.files = data;
                console.log(data);
            });*/
        };
        
        $scope.isImg = function(file) {
            if(file.type.search('image') !== null)
                return true;
            
            return false;
        };

        $scope.delete = function (id) {
            $http({
                method: 'DELETE',
                url: '/erp/api/file/' + $scope.model + '/' + $scope.id,
                params: {
                    fileId: id
                }
            }).success(function (data, status) {

                //console.log(data);
                if ($scope.object) {
                    $scope.object.files = data.files;
                    $scope.object.__v = data.__v;
                }

                $scope.find();

            });
        };

        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        $scope.typesConfig = {
            "file": {
                "icon": "fa fa-file-o icon-state-success"
            },
            "image": {
                "icon": "fa fa-file-image-o icon-state-success"
            }
        };

        // CALLBACKS
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
            $scope.find();
        };

        uploader.onCompleteItem = function (item, response, status, headers) {
            //console.log(response);
            if ($scope.object) {
                $scope.object.files = response.files;
                $scope.object.__v = response.__v;
            }
        };

        //console.info('uploader', uploader);

    }]);