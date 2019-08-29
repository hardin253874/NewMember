(function () {
    "use strict";

    //use "iconMapper.icon.job" etc if you have the exact key: "job"
    //otherwise use iconMapper.map("jobs"), or iconMapper.map("transactions");
    angular.module('app').service("iconMapper", iconMapper);

	//use inside html like <i class="{{vm.Value || toIcon}}"></i>
    angular.module('app').filter('toIcon', toIconFilter);

    var list = {
        job: 'icon-wrench',
        transaction: 'icon-pm-banknote-dark',
        receipt : 'icon-file',
        email:   'icon-pm-mail2',
        conversation: 'icon-inbox',
        message: 'icon-pm-paper-plane2',
        messagethread: 'icon-pm-mail2',
        comment: 'icon-comment-alt',
        membercomment: 'icon-comment-alt',
        letter: 'icon-print',
        print: 'icon-print',
        document: 'icon-print',
        statement: 'icon-file',
        sms: 'icon-pm-phone',
        text: 'icon-pm-phone',
        tenant: 'icon-contact-tenant',
        tenancy: 'icon-contact-tenant',
        owner: 'icon-contact-owner',
        ownership: 'icon-contact-owner',
        supplier: 'icon-contact-supplier',
        agent: 'icon-user',
        property: 'icon-home',
        lot: 'icon-home',
        sale: 'icon-pm-sign-house',
        seller: 'icon-pm-sign-house',
        buyer: 'icon-pm-sign-house',
        inspection: 'icon-pm-signup',
        contact: 'icon-user',
		task: 'icon-pm-clipboard',
        login: 'icon-pm-login'
	};

	var png = {
		mapMarker: {
			selected: 'app/content/images/maps/mapmarker-blue.png',
			unselected: 'app/content/images/maps/mapmarker-grey.png',
			userLocation: 'app/content/images/mapmarker-green.png',
			error: 'app/content/images/mapmarker-red.png'
		},
		blank: 'app/content/images/blankdot.png'
	};

    function iconMapper(){

        function map (str) {
            if (!str) return undefined;
            str = str.toLowerCase();
            var str_no_s = str;
            if (str.endsWith('s')) {
                str_no_s = str.slice(0,str.length-1);
            }
            return list[str] ||  list[str_no_s] ;
        }

        return {
            icon: list,
            map: map,
			png: png
        };
    }

    function toIconFilter() {
        return function(input) {
            return iconMapper().map(input);
        };
    }


})();