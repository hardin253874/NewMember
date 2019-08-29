(function () {
	'use strict';

	var MAX_FILE_SIZE = 10 * 1000 * 1000; //10 mb
	var MAX_AGENCY_PHOTO_FILE_SIZE = 200 * 1024; //200 kb
	var ALLOWED_FILE_TYPES = ['OFX','BMP','CSV','DOC','DOCX','DOT','EML','FRM','GIF','JPEG','JPG','KEYNOTE','MSG','NUMBERS','ODF','ODS','ODT','PAGES','PDF','PNG','PPT','PPTX','RAR','RTF','TEXT','TIF','TIFF','TXT','XLS','XLSX','ZIP'];
	var ALLOWED_PHOTO_TYPES = ['BMP','GIF','JPEG','JPG','PNG','TIF','TIFF'];

	angular.module('app').controller('toastFileUploadController', ['$timeout', '$rootScope', 'server',  'ux', 'config', 'permissionService', controller]);

	function controller($timeout, $rootScope, server,  ux, config, permissionService) {
		var vm = this;

		vm.uploader = server.uploader;
		vm.showToast = false;
		vm.isSuccess = false;
		vm.stopUpload = stopUpload;
		vm.currentFileItem = null;
		vm.lastFileName = null;
		vm.isSavingOnS3 = false;

		// FUNCTIONS //
		function finishAndClose() {
			vm.uploader.clearQueue();
			unlockWindow();
			$timeout(function() {
				vm.showToast = false;

			},2000);
		}

		function stopUpload(){
			vm.uploader.cancelAll();
			finishAndClose();
		}

		function isValid(fileItem) {

			if (!fileItem.formData) {
				return false;
			}

			//the bundled "filters" feature in angular-file-upload is not well constructed
			// (hard to turn filters on and off - ALL filters run by default)
			// the default filters are (make sure it is not a folder) and (check the queue limit) which we can both leave running
			//but adding filters for, say, image types, is better handled inside this isValid function.

			//Check size
			if (fileItem.file.size >= MAX_FILE_SIZE) {
				ux.alert.error(fileItem.file.name + ' is too big to upload. The maximum size allowed is 10Mb.');
				return false;
			}
			if (fileItem.file.size === 0 ) {
				ux.alert.error(fileItem.file.name + ' is empty. Empty files cannot be uploaded.');
				return false;
			}

			//check file extension
			var chunks = fileItem.file.name.split('.');
			if (chunks.length < 2) {
				ux.alert.error(fileItem.file.name + ' is not a valid file type. It has no file extension like ' + ALLOWED_FILE_TYPES.join(', ') + '.');
				return false;
			} else {
				var ext = chunks[chunks.length-1].toUpperCase();
				if (!ALLOWED_FILE_TYPES.contains(ext)) {
					ux.alert.error(fileItem.file.name + ' is not a valid file type. The following types are allowed: ' + ALLOWED_FILE_TYPES.join(', ') + '.');
					return false;
				}

				if (isPhoto(fileItem) && !ALLOWED_PHOTO_TYPES.contains(ext)) {
					ux.alert.error(fileItem.file.name + ' is not a valid file type for a photo. The following types are allowed: ' + ALLOWED_PHOTO_TYPES.join(', ') + '.');
					return false;
				}
			}

			//Check file size for agency public photos: for stationery setting
			var formObject = {};
			for(var i = 0; i < fileItem.formData.length; i++){
				angular.extend(formObject,  fileItem.formData[i]);
			}

			if ((fileItem.file.size >= MAX_AGENCY_PHOTO_FILE_SIZE) && (formObject.DocumentType === 'Photo' ) && (formObject.DocumentArea === 'Agency')) {
				ux.alert.error('"' + fileItem.file.name + '" image file is greater than the maximum 200KB allowed for stationary. Choose a smaller image.');
				return false;
			}

			return true;
		}

		function isPhoto(fileItem) {
			return fileItem.formData.some(function(item) {
				return (angular.isDefined(item.DocumentType) && item.DocumentType === 'Photo');
			});
		}

		function lockWindow() {
			window.onbeforeunload = function(e) {
				// if pending uploads - display notice to cancel uploads first
				return 'A file upload is in progress. If you close this page or reload it, ' +
					'the upload will stop and you will need to upload any unfinished files again.';
			};
		}
		function unlockWindow(){
			window.onbeforeunload = null;
		}

		//API for uploader https://github.com/nervgh/angular-file-upload/wiki/Module-API
		vm.uploader.onAfterAddingFile = function(fileItem) {
			if (permissionService.isEditAllowed && isValid(fileItem)) {
				lockWindow();
				vm.showToast = true;
				vm.isSuccess = false;
				vm.isSavingOnS3 = false;
				fileItem.upload();

				$rootScope.$broadcast(config.events.uploadNewFile, getEventData(fileItem));
			} else {
				fileItem.remove();
				fileItem.cancel();
			}
		};
		vm.uploader.onBeforeUploadItem = function (fileItem) {
			vm.currentFileItem = fileItem;
		};
		vm.uploader.onCompleteItem = function(fileItem) {
			$rootScope.$broadcast(config.events.uploadFinishedItem, getEventData(fileItem));
		};
		vm.uploader.onCompleteAll = function() {
			//this will trigger when the queue is finished - even if it finished because files were cancelled
			vm.isSuccess = vm.uploader.queue.every(function(f) {return f.isSuccess;});
			ux.refreshData();
			$rootScope.$broadcast(config.events.uploadFinishedAll);
			finishAndClose();
		};

		vm.uploader.onProgressAll = function (val) {
			//console.log('progress is', val);
			if (val == 100) {
				vm.isSavingOnS3 = true;
			}
		};

		//vm.uploader.onSuccessItem = function(item) {
		//	$rootScope.$emit(config.events.uploadFinishedItem,item);
		//};

		/*
		vm.uploader.onProgressItem = function (item, val) {
			//console.log('progress for',item,  val);
		};
		*/

		function getEventData(fileItem) {
			return  {
				FileName: fileItem.file.name,
				formData: getFormData()
			};
			function getFormData() {
                var data = {};
                fileItem.formData.forEach(function(obj){
                    for (var attrname in obj) { data[attrname] = obj[attrname]; }
                });
				return data;
			}
		}
	}
})();
