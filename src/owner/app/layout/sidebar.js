(function () {
    'use strict';

    angular.module("app").controller('sidebarController', ['$scope', '$timeout', '$route', 'server', 'config', 'setupProgressService', 'partnerService', sidebar]);

    function sidebar($scope, $timeout, $route, server, config, setupProgressService, partnerService) {
        var vm = this;

        vm.isCurrent = isCurrent;
		vm.isOpen = isOpen;
        vm.refresh = refresh;

        vm.menus = getMainMenus();
        vm.version = config.version;

        vm.unreadReadCount = 0;

        vm.partnerInfo = partnerService.currentPartner;

        vm.minToggle = function () {
            $('body').toggleClass('sidebar-menu-min');
        };

        if (setupProgressService.isInitialised) {
            toggleSetupLink();
        }

        $scope.$on('affected:messagethread', function (e, event) {
            updateUnread();
        });

        updateUnread();

        setupProgressService.afterInit.push(toggleSetupLink);

        //////////////////////////

        function convertLinkToParams(link){
            var parts = link.split('/');
            if (parts.length === 3) {
                return {
                    section: parts[1],
                    page   : parts[2]
                };
            }
            if (parts.length === 2) {
                return {
                    section: parts[1]
                };
            }
            return {};
        }

        function isCurrent(menuItem) {
            var params = convertLinkToParams(menuItem.link);

            if ($route.current.loadedTemplateUrl === 'app/defaultRedirect.html' &&
                config.session &&
                config.session.AgentAccess) {
                if (params.section === 'dashboard' && !setupProgressService.isShowing) {
                    return true;
                }
                if (params.section === 'setup' && setupProgressService.isShowing) {
                    return true;
                }
            }

            //check if one this items submenus is the current
            for (var i = 0; i < menuItem.subMenus.length; i++) {
                if (isCurrent(menuItem.subMenus[i])) {
                    return true;
                }
            }

            if (!params.page) {
                return false;
            }

            return $route.current.params.page ===  params.page &&
                $route.current.params.section === params.section;
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

		function getMainMenus(){
            var mainMenus = [
                create("Setup", "#/setup/shell", "icon-rocket", undefined, undefined, true),
                create("Dashboard", "#/dashboard/now", "icon-dashboard"),
                create("Inbox","#/message/inbox", 'icon-inbox'),
                create("Properties", "#/property/list", "icon-home"),
                create("Contacts", "#/contact/list", "icon-user"),
                create("Jobs","#/jobtask/list","icon-wrench"),
                create("Inspections","#/inspection/list","icon-pm-signup"),
                create("Tasks","#/task/list","icon-list"),
               //create("Messages","#/message/list","icon-pm-paper-plane2"),
                create("Messages","","icon-pm-paper-plane2", [
                    create("Outbox","#/message/list"),
                    create("Undelivered","#/message/undelivered"),
                    create("Sent","#/message/sent"),
                ], true),
               // create("Tasks","#/task/list","icon-list"),
                create("Reports", "#/report/list","icon-file-text-alt"),
                create("Accounts", "", "icon-book", [
                    create("Transactions", "#/transaction/list"),
                    create("Bills", "#/bill/list"),
                    create("Invoices", "#/invoice/list"),
                    create("Banking", "#/banking/list"),
                    create("Reconciliations", "#/reconciliation/list"),
                    create("Disbursements", "#/disbursement/list")
                ], true)
            ];

            if (isLocal()) {
                mainMenus.push(create("Tests", "#/test", "icon-beaker"));
            }
            return mainMenus;
        }

        function create (title, link, icon, subMenu, subMenuOpenByDefault, isHidden, id) {
            if (!id) {
                id = title;
            }

            var item = {
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
                }
            };

            return item;
        }

        function isLocal() {
            return window.location && window.location.protocol === 'http:';
        }

        function toggleSetupLink() {
            vm.menus.getBy('title','Setup').isHidden = !setupProgressService.isShowing;
            if(setupProgressService.pages.length > 0){
                vm.menus.getBy('title','Setup').extraElement = (setupProgressService.MaxCompletedStep + 1) + '/' +  setupProgressService.pages.length;
            }
        }

        function updateUnread() {
            server.getQuietly('/api/comms/threads/unread')
                .success(function (dto) {
                    // This menu system should be redone to explicitly be badge numbers, and automatically total subMenus
                    vm.unreadReadCount = dto.Unread;
                    var unread = vm.unreadReadCount === 0 ? null : vm.unreadReadCount;

                    var msgMenu = vm.menus.getBy('id','Inbox');
                    if (msgMenu) {
                        msgMenu.extraElement = unread;
                    }
                });
        }

        /*
        function updateFromSettings()  {
            server.get('/api/comms/settings')
                .success(function (response) {
                    var msgMenu = vm.menus.getBy('id','Messages');

                    var inboxMenu = msgMenu.subMenus.getBy('title','Inbox');
                    if (inboxMenu){
                        inboxMenu.isHidden = !response.IsInboundEmailEnabled;
                    }


                    if (response.IsInboundEmailEnabled) {
                        updateUnread();
                    }
                });
        }
        */
    }
})();