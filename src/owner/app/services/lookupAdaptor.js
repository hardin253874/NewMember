(function () {
    'use strict';

    angular.module('app').factory('lookupAdaptor', [factory]);

    function factory() {
        function _factory(list, mapFn) {
            var self = this;

            self.lookup = [];
            self.source = list;

            self.getById = getById;
            self.getByProp = getByProp;

            //init
            if (list && list.length > 0 && mapFn && typeof(mapFn) == 'function') {
                self.lookup = list.map(mapFn);
            }

            function getById(id) {
                var found = {};
                if (self.source && self.source.length > 0) {
                    self.source.some(function (item) {
                        if (item.Id == id) {
                            found = item;
                            return true;
                        }
                    }
                    );
                }
                return found;
            }

            function getByProp(prop, key) {
                var found = {};
                if (self.source && self.source.length > 0) {
                    self.source.some(function (item) {
                            if (item[prop] == key) {
                                found = item;
                                return true;
                            }
                        }
                    );
                }
                return found;
            }
        }

        _factory.useLabel = useLabel;
        _factory.useReference = useReference;
        _factory.useName = useName;
        _factory.fromArray = fromArray;

        function useLabel(item) {
            return {
                id: item.Id,
                label: item.Label,
                template: item.Label,
                filter: item.Label
            };
        }

        function useReference(item) {
            return {
                id: item.Id,
                label: item.Reference,
                template: item.Reference,
                filter: item.Reference
            };
        }

        function useName(item) {
            return {
                id: item.Id,
                label: item.Name,
                template: item.Name,
                filter: item.Name
            };
        }

        function fromArray(item) {
            return {
                id: item,
                label: item,
                template: item,
                filter: item
            };
        }

        return _factory;
    }
})();