"use strict";
(function ($) {
    $(document).ready(function () {
        var _twoFactorSecret = null;
        var _isProcessing = false;
        var _timeCorrection = 0;

        $.extend({
            show_box: show_box,
            nextTfaSetupPanel: nextTfaSetupPanel
        }); // Expose show_box, nextTfaSetupPanel to other JS code in jQuery

        addBehaviours();
        init();
        //checkBrowser();
        //denyOldBrowser();
        function addBehaviours() {
            $("form#signInForm").submit(function (e) {
                e.preventDefault();
                var urlVars = getUrlVars();
                if (urlVars.setupTfa) {
                    nextTfaSetupPanel('info-panel');
                    show_box('tfa-setup-box');
                    return false;
                }
                if ($("#RememberEmail:checked").length > 0) {
                    amplify.store("signInEmail", $("#UserName").val());
                } else {
                    amplify.store("signInEmail", null);
                }

                $("input#RememberMe").attr("checked", false);

                // $("form#signInForm").submit();
                submit($('#UserName').val(), $('#Password').val(), $('#Continue').val(), $('#State').val());
                return false;
            });
            $("#showForgot,.forgot-link").click(function (e) {e.preventDefault(); show_box('forgot-box'); });
            $(".showLogin").click(function (e) {e.preventDefault(); show_box('login-box'); });
            $('form#verifyTotpForm').submit(function (e) {
                e.preventDefault();
                submit($('#UserName').val(), $('#Password').val(), $('#Continue').val(), $('#State').val(), $('#OneTimePinCode').val());
                return false;
            });
            $('#nextButton').click(function(e) {
                e.preventDefault();
                nextTfaSetupPanel();
            });
            $('form#confirmTotpForm').submit(function(e) {
                e.preventDefault();
                nextTfaSetupPanel();
                return false;
            });
            $('#cantScanButton').click(function(e) {
                e.preventDefault();
                nextTfaSetupPanel('manual-panel');
            });
        }

        function init() {
            var urlVars = getUrlVars();
            var err = urlVars.error || urlVars.f;
            if (err) {
                $("#signinError").show();
                $("#bigForgotAlert").show();
                $("#errorMessage").text(unescape(err).replace(/\+/g, ' '));
            }

            if(urlVars.Continue){
                $("#Continue").attr("value", decodeURIComponent(urlVars.Continue));
            }

            var email = amplify.store("signInEmail");
            if (email) {
                $("#UserName").val(email);
                $("input#RememberEmail").attr("checked", true);
                $("#Password").focus();
            }

            $.ajax({
                url: PM_SERVERROOT + '/api/settings/current-time',
                dataType: 'json',
                contentType: "application/json",
                method: 'POST'
            }).done(function(systemTime) {
                _timeCorrection = systemTime - (new Date().getTime());
            });
          
        }
        function  getUrlVars () {
            var vars = [], hash, slicePoint;
            slicePoint= window.location.href.indexOf('?');
            if (slicePoint <= 0) {
                slicePoint = window.location.href.indexOf('#');
            }
            var hashes = window.location.href.slice(slicePoint + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }

        function show_box(id) {
            $('.toggle-able').hide();
            $("#signinError").hide();
            $("#bigForgotAlert").hide();
            $('#' + id).show();
            return false;
        }

        function submit(userName, password, _continue, state, totpCode, tfaSecret) {
            if (_isProcessing) {
                return;
            }

            $("#signinError").hide();
            $("#bigForgotAlert").hide();

            var data = {
                UserName: userName,
                Password: password,
                Continue: _continue,
                State: state,
                Meta: {}
            };

            if (totpCode) {
                data.Meta.OneTimePinCode = totpCode;
            }

            if (tfaSecret) {
                data.Meta.TwoFactorSecret = tfaSecret;
            }

            _isProcessing = true;
            $('#loading-bar-spinner').show();
            $.ajax({
                url: $("form#signInForm").attr('action'),
                dataType: 'json',
                contentType: "application/json",
                method: 'POST',
                data: JSON.stringify(data)
            }).done(function(result) {
                window.location = result.ReferrerUrl;
            }).fail(function(jqXHR, textStatus, errorThrown) {
                switch (errorThrown) {
                    case 'RequireTwoFactorSecret':
                        _isProcessing = false;
                        $('#loading-bar-spinner').hide();
                        nextTfaSetupPanel('info-panel');
                        show_box('tfa-setup-box');
                        break;

                    case 'RequireOneTimePinCode':
                        _isProcessing = false;
                        $('#loading-bar-spinner').hide();
                        show_box('totp-box');
                        $('#OneTimePinCode').focus();
                        break;

                    case 'RequireResetPassword':
                        $('#EmailToReset').val(userName);
                        $('form#resetPasswordForm').submit();
                        break;

                    default:
                        if (jqXHR.responseJSON && jqXHR.responseJSON.ResponseStatus && jqXHR.responseJSON.ResponseStatus.Message) {
                            _isProcessing = false;
                            $('#loading-bar-spinner').hide();
                            $("#errorMessage").text(jqXHR.responseJSON.ResponseStatus.Message);
                            $("#signinError").show();
                            $("#bigForgotAlert").show();

                        } else {
                            $("#errorMessage").text("Connection error. Please check your internet connection.");
                            $("#signinError").show();
                        }
                }
            });
        }

        function checkBrowser(bForceFail) {
            if (!(bowser.chrome || bowser.safari || bowser.ipad ) && !bForceFail) {
                showFailMessage();
            }
            function showFailMessage() {
                var name_ver = bowser.name + " " + bowser.version;
                var msg = "<strong><i class='icon-warning-sign warning'></i> You are using an unsupported browser </strong>" + (name_ver.length > 1 ? " (" + name_ver + ")" : "") + "";
                $("#BrowserRecommendationMessage").show().find(".msg").html(msg);
            }
        }
        function denyOldBrowser(bForceFail) {
            if (!bowser.a || bForceFail) {
                //bowser.a means containgin the top level features
                $('#login-box-inner').hide();
                $('#SignInDeniedForOldBrowsersMsg').show();
            }

        }

        function nextTfaSetupPanel(panel) {
            if (typeof panel === 'undefined' || panel === null) {
                if ($('.info-panel').is(':visible')) {
                    nextTfaSetupPanel('qr-panel');
                } else if ($('.qr-panel').is(':visible')) {
                    nextTfaSetupPanel('verification-panel');
                } else if ($('.manual-panel').is(':visible')) {
                    nextTfaSetupPanel('verification-panel');
                } else if ($('.verification-panel').is(':visible')) {
                    verifyTwoFactorSecret();
                }
            } else {
                $('.tfa-setup-box .tfa-panel').hide()
                switch (panel) {
                    case 'info-panel':
                        _twoFactorSecret = TfaUtil.generateBase32Secret(10);
                        var provider = window.location.hostname !== 'app.propertyme.com' ? window.location.hostname + ':'  : '';
                        var otpPath = 'otpauth://totp/' + provider + $('#UserName').val() + '?secret=' + _twoFactorSecret + '&issuer=PropertyMe';

                        var qr = new QRious({
                            element: document.getElementById('qr'),
                            size: 150,
                            value: otpPath
                        });

                        $('.info-panel').show();
                        break;

                    case 'qr-panel':
                        $('.qr-panel').show();
                        break;

                    case 'manual-panel':
                        var tfaSecretToDisplay = '';
                        for (var i = 0; i < _twoFactorSecret.length; i = i + 4) {
                            tfaSecretToDisplay += _twoFactorSecret.substring(i, i + 4) + ' ';
                        }
                        $('#TfaSecretDisplay').text(tfaSecretToDisplay.toLowerCase().trim());
                        $('.manual-panel').show();
                        break;

                    case 'verification-panel':
                        $('#ConfirmOneTimePinCode').val('');
                        $('.verification-panel').show();
                        $('#ConfirmOneTimePinCode').focus();
                        break;
                }
            }
        }

        function verifyTwoFactorSecret() {
            if (!TfaUtil.verifyPinAgainstSecret(_twoFactorSecret, $('#ConfirmOneTimePinCode').val(), _timeCorrection, { previousStep: 2, futureStep: 2 })) {
                $("#errorMessage").text('Invalid code. Please check if the time on your phone is ' + new Date(new Date().getTime() + _timeCorrection) + '.');
                $("#signinError").show();
            } else {
                $("#signinError").hide();
                submit($('#UserName').val(), $('#Password').val(), $('#Continue').val(), $('#State').val(), null, _twoFactorSecret);
            }
        }
    });
})(jQuery);

