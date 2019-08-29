(function () {
    'use strict';

    angular.module('app').controller('settingsSidebarController', ['$timeout', '$route', 'config', sidebar]);

    function sidebar($timeout, $route, config) {
        var vm = this;

        vm.isCurrent = isCurrent;
		vm.isOpen = isOpen;
        vm.refresh = refresh;

        vm.isDemoActive = config.session.AgentAccess.DatasetType === 'DemoInstance';
        vm.menus = getMainMenus();
        vm.version = config.version;

        vm.minToggle = function () {
            $('body').toggleClass('sidebar-menu-min');
        };

        //////////////////////////

        function isCurrent(menuItem) {

            //check if one this items submenus is the current
            for (var i = 0; i < menuItem.subMenus.length; i++) {
                if (isCurrent(menuItem.subMenus[i])) {
                    return true;
                }
            }

            var params = ['#', $route.current.params.section, $route.current.params.parent, $route.current.params.page ];
            params = params.filter(function (item) {
                return !!item;
            });

            var currentPath = params.join('/');

            return menuItem.link === currentPath;
        }

		function isOpen(menuItem) {
			return menuItem.subMenuOpen;
		}

        function refresh(currentMenuItem) {
            vm.menus.forEach(function(menu) {
                 if (menu !== currentMenuItem && menu.subMenus.length > 0 && menu.subMenuOpen) {
                    $timeout(function() {
                        menu.subMenuOpen = false;
                    });
                }
            });
        }

		function getMainMenus() {
            return [
                create("Portfolio", "", "icon-cog", [
                    create("Company", "#/setting/portfolio/edit"),
                    create("Bank Account", "#/setting/bank-account"),
                    create("Fees", "#/fee/template-list"),
                    create("Labels", "#/setting/label/templates"),
                    create("Chart of Accounts", "#/setting/chartaccount/list")
                ], true),

                create("Brand", "", "icon-edit", [
                    create("Statements", "#/setting/stationery"),
                    create("Email", "#/setting/email-stationery/designer")
                ], true),

                create("Team", "", "icon-group", [
                    create("Members", '#/subscriber/team'),
                    create("Security", '#/setting/security/options'),
                    create("Trusted Devices", '#/setting/security/trusted-devices')
                ], true).hideWhen(vm.isDemoActive),

                create("Messages", "", "icon-pm-paper-plane2", [
                    create("Options", "#/setting/messages/options").hideWhen(vm.isDemoActive),
                    create("Templates", "#/message/schedule/list")
                ], true),

                create("Activity", "", "icon-rss", [
                    create("Log", "#/log/list"),
                    create("Documents", "#/document/list"),
                    create("Owner Portal Access", "#/portal-access/list").hideWhen(vm.isDemoActive)
                ], true),

                create("Integrations", "#/setting/integration", "icon-puzzle-piece"),
                create("Subscription", "#/subscriber/edit", "icon-pm-credit-card2").hideWhen(vm.isDemoActive),
                create("Partners", "#/setting/partner", "icon-pm-group-outline").hideWhen(vm.isDemoActive)
            ];
        }

        function create (title, link, icon, subMenu, subMenuOpenByDefault, isHidden, id) {
            if (!id) {
                id = title;
            }

            return {
                title: title,
                link: link,
                icon: icon || "icon-double-angle-right",
                infoNumber: 0,
                alertNumber: 0,
                subMenus: subMenu || [],
				subMenuOpen: false,
                subMenuOpenByDefault: subMenuOpenByDefault || false,
                isSelected : true,
                childSelected:false,
                isHidden: isHidden || false,
                extraElement:null,
                id: id,

                //////////////////
                betaFeature: function() {
                    this.isBetaFeature = true;
                    return this;
                },
                hideWhen: function(isHidden) {
                    this.isHidden = isHidden;
                    return this;
                }
            };
        }

    }
})();