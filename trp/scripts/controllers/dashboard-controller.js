app.controller('DashboardController', ['$scope', '$localStorage', '$interval', 'AssetFactory', function ($scope, $localStorage, $interval, AssetFactory) {

    $scope.VehicleCounterList = [];
    $scope.vehdistanceactive = "week";
    $scope.username = $localStorage.username;


    //dashboard vehicle counter    
    $scope.getDashboardVehicleCounter = function () {
        AssetFactory.getDashboardVehicleCounter(function (data) {
            $scope.VehicleCounterList = data;
        }, function (error) {
            console.log(error);
        });

    }


    //chart options
    $scope.colors = [{
        backgroundColor: '#6bc59d',
        pointBackgroundColor: 'rgb(34, 181, 115)',
        pointHoverBackgroundColor: 'rgb(34, 181, 115)',
        borderColor: 'rgb(34, 181, 115)',
        pointBorderColor: '#fff',
        pointHoverBorderColor: '#fff'
    }, ];


    $scope.options = {
        responsive: true,
        spanGaps: true,
        maintainAspectRatio: true,
        title: {
            display: false,
            text: 'Top Vehicles by Distance Driven',
            fontSize: 24,
            padding: 22,
            fontColor: '#333'
        },
        tooltips: {
            displayColors: false,
            callbacks: {
                label: function (tooltipItem, data) {
                    return tooltipItem.xLabel + " km";
                }
            },
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Distance Driven (km)'
                },
                ticks: {
                    padding: 20
                }
            }],
            yAxes: [{
                gridLines: {
                    display: true,
                    lineWidth: 1,
                    zeroLineWidth: 1,
                    zeroLineColor: '#666666',
                    drawTicks: false
                },
                ticks: {
                    display: true,
                    stepSize: 0,
                    min: 0,
                    autoSkip: false,
                    fontSize: 11,
                    padding: 12
                }
            }]
        }
    };

    $scope.line_options = {
        responsive: true,
        title: {
            display: false,
            text: 'Fleet Utilization',
            fontSize: 24,
            fontColor: '#333',
            padding: 22,
        },
        tooltips: {
            displayColors: false,
            callbacks: {
                label: function (tooltipItem, data) {
                    return tooltipItem.yLabel + "%";
                }
            },
        },
        scales: {
            xAxes: [{

                scaleLabel: {
                    display: true,
                    labelString: 'Last 30 days'
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 15,
                    maxRotation: 0,
                    minRotation: 0
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Utilization (%)',
                },
                gridLines: {
                    tickMarkLength: 20
                }
            }]
        }
    };


    //dashboard top 10 vehicle distance yesterday
    $scope.getDashboardVehicleDistanceYesterday = function () {
      
        var endDate = getYesterDay(1).datenotime + ' 23:59:59';
        
        var startDate = getYesterDay(1).datenotime + ' 00:00:00';

        var json = {
            StartDate: startDate,
            EndDate: endDate
        };
        console.log(json);

        AssetFactory.getDashboardVehicleDistance(json, function (data) {

            var assets = [];
            var distance = [];
            data.forEach(function (d) {
                assets.push(d.AssetID);
                distance.push(d.Distance);
            });

            $scope.labels = assets;
            $scope.series = ['Series A'];

            $scope.data = [
              distance
            ];


        }, function (error) {
            console.log(error);
        });

    }

    //dashboard top 10 vehicle distance last seven days
    $scope.getDashboardVehicleDistanceLastSevendays = function () {
        var endDate = getYesterDay(1).datenotime + ' 23:59:59';

        var startDate = getYesterDay(7).datenotime + ' 00:00:00';

        var json = {
            StartDate: startDate,
            EndDate: endDate
        };

        AssetFactory.getDashboardVehicleDistance(json, function (data) {

            var assets = [];
            var distance = [];
            data.forEach(function (d) {
                assets.push(d.AssetID);
                distance.push(d.Distance);
            });

            $scope.labels = assets;
            $scope.series = ['Series A'];

            $scope.data = [
              distance
            ];

        }, function (error) {
            console.log(error);
        });

    }

    //dashboard top 10 vehicle distance last thirty days
    $scope.getDashboardVehicleDistanceLastThirtydays = function () {

        var endDate = getYesterDay(1).datenotime + ' 23:59:59';

        var startDate = getYesterDay(30).datenotime + ' 00:00:00';

        var json = {
            StartDate: startDate,
            EndDate: endDate
        };

        console.log(json);

        AssetFactory.getDashboardVehicleDistance(json, function (data) {

            var assets = [];
            var distance = [];
            data.forEach(function (d) {
                assets.push(d.AssetID);
                distance.push(d.Distance);
            });

            $scope.labels = assets;
            $scope.series = ['Series A'];

            $scope.data = [
              distance
            ];


        }, function (error) {
            console.log(error);
        });

    }



    //dashboard vehicle utilization
    $scope.getDashbhoadVehicleUtilize = function () {

        var date = new Date();
        var endDate = date.toISOString().replace('Z', '').replace('T', ' ');

        date.setDate(date.getDate() - 30);
        var startDate = date.toISOString().replace('Z', '').replace('T', ' ');

        var json = {
            StartDate: startDate,
            EndDate: endDate
        };

        AssetFactory.getDashboardVehicleUtilize(json, function (data) {

            var days = [];
            var utils = [];
            data.forEach(function (d) {
                d.day = moment(d.day).format('MMM D');
                days.push(d.day);
                utils.push(d.utilisation.toFixed(2));
            });

            $scope.line_labels = days;
            $scope.line_data = [utils];

        }, function (error) {
            console.log(error);
        });
    }

    $scope.getDashboardVehicleCounter();
    $scope.getDashboardVehicleDistanceLastSevendays();
    $scope.getDashbhoadVehicleUtilize();


    $scope.setVehicleDistance = function (_type) {
        if (_type == "yesterday") {
            $scope.vehdistanceactive = _type;
            $scope.getDashboardVehicleDistanceYesterday();
        } else if (_type == "week") {
            $scope.vehdistanceactive = _type;
            $scope.getDashboardVehicleDistanceLastSevendays();
        } else if (_type == "month") {
            $scope.vehdistanceactive = _type;
            $scope.getDashboardVehicleDistanceLastThirtydays();
        }
    }

    
    $scope.dashboardInterval = function () {
        $scope.getDashboardVehicleCounter();
        $scope.getDashbhoadVehicleUtilize();
        $scope.setVehicleDistance($scope.vehdistanceactive);
    }

    $interval($scope.dashboardInterval, 3600000);
    //$interval($scope.dashboardInterval, 10000);

    function startTimer(duration, display) {
        var timer = duration, minutes, seconds;
        setInterval(function () {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                timer = duration;
            }
        }, 1000);
    }

    window.onload = function () {
        var time = 60 * 60,
            display = document.querySelector('#time');
        startTimer(time, display);
    };



}]);