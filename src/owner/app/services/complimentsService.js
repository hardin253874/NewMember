(function () {
    'use strict';
    angular.module('app').service('compliments', [complimentsService]);
    function complimentsService () {
        var list  = [
            "Well done, you have my vote for property manager of the year!",
            "Nice work. Grab a coffee - you deserve it!",
            "This is all up to date, high five me!",
            "Fantastic, this stuff is easy!",
            "Nothing to see here, all up to date.",
            "It's going to be a great day today, now this is sorted."
        ];


        return {
            randomCompliment: function() {return list.randomElement();}
        };


    }
}());