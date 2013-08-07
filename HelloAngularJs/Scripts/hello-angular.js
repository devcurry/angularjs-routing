/// <reference path="jquery-2.0.3.js" />
/// <reference path="hello-angular.js" />
/// <reference path="angular.js" />

// Create ngTwitter Module (roughly Module = namespace in C#)

var ngTwitter = angular.module("ngTwitter", ['ngResource']);

ngTwitter.config(function ($routeProvider)
{
    $routeProvider.when(
        "/", {
            templateUrl: "timeline",
            controller: "TimelineController"
        }).when(
        "/status/:id", {
            templateUrl: "status",
            controller: "TimelineController"
        })
});

// Declaring a Service
ngTwitter.factory("TwitterService", function ($resource, $http, $routeParams)
{
    return {
        timeline: $resource("/Home/Tweet"),
        status: function (id)
        {
            return $http.get("/Home/Status/" + id);
        }
    }
});

ngTwitter.directive("retweetButton", function ()
{
    return {
        restrict: "E",
        replace: true,
        scope: {
            text: "@",
            clickevent: "&"
        },
        template: "<button class='btn btn-mini' ng-click='clickevent()'><i class='icon-retweet'></i> {{text}}</button>"
    };
});

//ngTwitter.controller("StatusController", function ($scope, $http, TwitterService)
//{
//    $http.get("/Home/Status/" + $routeParams.id)
//    statusPromise.success(function (data)
//    {   
//        $scope.status = data;
//    });
//});

ngTwitter.controller("TimelineController", function ($scope, $http, $routeParams, TwitterService)
{
    if ($routeParams.id)
    {
        var statusPromise = TwitterService.status($routeParams.id);
        statusPromise.success(function (data)
        {
            $scope.status = data;
        });
    }
    else
    {
        $scope.tweets = TwitterService.timeline.query({});
    }
    $scope.newTweets = {
        0: "No new Tweets",
        other: "{} new Tweets"
    };

    $scope.sendStatus = function ()
    {
        var tweetText = $scope.statusText;
        var newTimeLine = new TwitterService.timeline(
            {
                Tweet: tweetText
            });
        newTimeLine.$save(function (data, headers)
        {
            if (data.success && data.success == true)
            {
                alert("Tweet Sent Successfully!");
                $scope.statusText = "";
            }
            else
            {
                alert("ERROR: " + data.errorMessage);
            }
        });
    };

    $scope.retweet = function (item)
    {
        var resultPromise = $http.post("/Home/Retweet/", item);
        resultPromise.success(function (data)
        {
            if (data.success)
            {
                alert("Retweeted successfully");
            }
            else
            {
                alert("ERROR: Retweeted failed! " + data.errorMessage);
            }
        });
    };
});
