app.controller('UserSettingsModalController', function ($scope, $uibModalInstance, data, $localStorage, CommonFactory, ControllerType, UserSettingsFactory) {
    $scope.ControllerType = ControllerType;

    if ($scope.ControllerType == 'Asset Assignment') {

        $scope.assignmentList = data;
        $scope.accountID = data[0].AccountID;
        $scope.isLoading = true;
        UserSettingsFactory.getAssignmentAssetList($scope.accountID, function (asset) {
            $scope.isLoading = false;
            UserSettingsFactory.setAssignmentCustomerList(asset);


        }, function (error) {

        });

        $scope.getAssetList = function (id) {

            $scope.isLoading = true;
            $scope.accountID = id;

            UserSettingsFactory.getAssignmentAssetList(id, function (asset) {

                $scope.isLoading = false;
                UserSettingsFactory.setAssignmentCustomerList(asset);

            }, function (error) {

            });
        };

        $scope.UpdateAssignmentAssetList = function (_customerList) {

            var updateAsset = [];
            _customerList.forEach(function (customer) {
                customer.AccountUserChildAssetList.forEach(function (asset) {
                    updateAsset.push(asset);
                })
            });
            UserSettingsFactory.updateAssignmentAssetList($scope.accountID, updateAsset, function (success) {

                CommonFactory.createAlert("Success", "Asset Assignment Updated");

            }, function (error) {
            });

        }

        $scope.$watch(function () {
            return UserSettingsFactory.getAssignmentCustomerList();
        }, function (data) {

            data.forEach(function (d) {
                var countAssetAssigned = $.grep(d.AccountUserChildAssetList, function (e) {
                    return e.IsAssigned == true;
                });

                if (d.AccountUserChildAssetList.length === countAssetAssigned.length) {
                    d.isCustomerCheckAll = true;
                }
                else {
                    d.isCustomerCheckAll = false;
                }

            });

            $scope.AssignmentCustomerList = data;
        }, true);

    }
    else {

        $scope.selectedFrequency = null;
        $scope.frequencyList = [
            {
                id: 1,
                name: "Daily",
                isCheck: false
            },
            {
                id: 2,
                name: "Weekly",
                isCheck: false
            },
            {
                id: 3,
                name: "Monthly",
                isCheck: false
            }
        ];


        $scope.customerList = data;


        //get report type list
        UserSettingsFactory.getReportTypeList(function (reportList) {
            $scope.reportTypeList = reportList;

            //get user email reports
            UserSettingsFactory.getUserAssignEmailReports(function (success) {
                if (success != null) {
                    $scope.reportTypeList.forEach(function (e) {
                        success.forEach(function (suc) {
                            if (e.ReportTypeID === suc.ReportType) {
                                e.isAssigned = true;
                            }
                        });
                    });

                    $scope.selectedFrequency = success[0].Frequency;

                    $scope.frequencyList.forEach(function (e) {
                        if (e.id === success[0].Frequency) {
                            e.isCheck = true;
                        }
                    });

                    if (success[0].Email != null) {
                        $scope.MultipleEmail = [];
                        var checker;

                        checker = success[0].Email.replace(/[&\/\\#,+()$~%':*?;<>{}]/g, ';');
                        if (checker.indexOf(';') != -1) {
                            var x = success[0].Email.split(/[&\/\\#,+()$~%':*?;<>{}]/g);
                            x.forEach(function (y) {
                                $scope.MultipleEmail.push({
                                    InputEmail: y
                                });
                            });

                        } else {
                            $scope.MultipleEmail.push({
                                InputEmail: success[0].Email
                            });
                        }

                    } else {
                        $scope.MultipleEmail.push({
                            InputEmail: null
                        });
                    }

                }
                else {
                    $scope.MultipleEmail = [];
                    $scope.MultipleEmail.push({
                        InputEmail: null
                    });
                }

                $scope.addInput = function () {
                    if ($scope.MultipleEmail.length > 5)
                    {
                        CommonFactory.createAlert("Error", "User may input up to 5 emails only.");
                    }
                    else
                    {
                        $scope.MultipleEmail.push({ InputEmail: null, });
                    }
                }

                $scope.removeInput = function (index) {
                    $scope.MultipleEmail.splice(index, 1);
                }

            }, function (error) {

            });

        }, function (error) {

        });

        
       


        $scope.frequencyChange = function (id) {
            $scope.selectedFrequency = id;
        }

      
        //update user email reports
        $scope.updateUserEmailList = function () {

            $("#error-container").text("");
            $("#emailnotif").parsley().validate();

            if ($("#emailnotif").parsley().isValid()) {

                var _confirm = confirm("Are you sure you want to update?");

                if (_confirm) {
                    
                    var em = $scope.MultipleEmail.filter(x=> x.InputEmail != "").map(function (elem) {
                        return elem.InputEmail;
                    }).join(";");


                    var reportTypeList = [];


                    var filterReportTypeList = $scope.reportTypeList.filter(function(e){
                        return e.isAssigned == true;
                    });

                    if(filterReportTypeList.length > 0)
                    {
                        filterReportTypeList.forEach(function(e){
                            reportTypeList.push({ ReportTypeID: e.ReportTypeID, ReportType: e.Name });
                        });
                    }

                    var params = {
                        Frequency: $scope.selectedFrequency,  
                        ReportTypeList: reportTypeList,
                        Email: em
                    };
                    
                    UserSettingsFactory.userAssignEmailReports(params, function (success) {
                        CommonFactory.createAlert('Success', 'Updated successfully.');
                    }, function (error) {
                        CommonFactory.createAlert('Error', 'Updated failed.');
                    });

                }

            }
        }


    }


    $scope.getSelectedAssetList = function (data, selectAll) {

        if (selectAll) {
            selectAll = false;
        } else {
            selectAll = true;
        }

        data.forEach(function (v) {
            v.IsAssigned = selectAll;
        });
    }


    $scope.toggleSelectAllAssetList = function (IsAssigned, cus) {

        if (!IsAssigned) {
            cus.isCustomerCheckAll = false;
        }
    }


    $scope.getSelectedEmail = function (data, selectAllEmail) {

        data.forEach(function (v) {
            v.SendEmail = selectAllEmail;
        });
    };


    $scope.toggleSelectAllEmail = function (SendEmail) {

        if (!SendEmail) {
            $scope.allSelected.Email = false;
        }
    }


    $scope.getSelectedReports = function (data, selectAllReports) {

        data.forEach(function (v) {
            v.isAssigned = selectAllReports;
        });

    };


    $scope.toggleSelectAllReports = function (Reports) {

        if (!Reports) {
            $scope.allSelected.Reports = false;
        }
    };


    $scope.viewAsset = function (id) {

        if ($("#user-font-icon-" + id).hasClass('active')) {

            $("#user-font-icon-" + id).removeClass('active');
            $("#user-font-icon-" + id).removeClass('fa-plus-circle');
            $("#user-font-icon-" + id).addClass('fa-minus-circle');
            $('#user-' + id).slideToggle({ direction: "up" }, 300);

        }
        else {

            $("#user-font-icon").removeClass('active');
            $("#user-font-icon-" + id).removeClass('fa-minus-circle');
            $("#user-font-icon-" + id).addClass('fa-plus-circle');
            $("#user-font-icon-" + id).addClass('active');
            $('#user-' + id).slideToggle({ direction: "down" }, 300);

        }
    }


    $scope.ok = function () {
        $uibModalInstance.close();
    };


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});