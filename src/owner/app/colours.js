(function () {
	window.pmColours = makeIt();
	function makeIt() {
		{
			//fix tinycolor so it automatically adds '#' to hex values
			var old_toHex = tinycolor.prototype.toHex;
			tinycolor.prototype.toHex = function () {
				var s = old_toHex.apply(this);
				if (s.charAt(0)!='#') return '#'+s;
				else return s;
			};
			//wrappers for tinycolor
			var mix = function () {
				return tinycolor.mix(arguments[0], arguments[1], arguments[2]).toHex();
			}, darken = function () {
				return tinycolor.darken(arguments[0], arguments[1]).toHex();
			}, lighten = function () {
				return tinycolor.lighten(arguments[0], arguments[1]).toHex();
			}, saturate = function () {
				return tinycolor.saturate(arguments[0], arguments[1]).toHex();
			}, alpha = function () {
				return tinycolor(arguments[0]).setAlpha(arguments[1]).toRgbString();
            };

			var pmc = {
				PrimaryBlue  : "#14cdeb",
				SecondaryBlue: "#1e7dc8",
				Navy         : "#466ea0",
				DarkGrey     : "#6e6e6e",
				LightGrey    : "#d2d2d2",
				Red          : "#f04623",
				Orange       : "#f5871e",
				Yellow       : "#e1e63c",
				Green        : "#a5c832",
				Gold         : "#EBAD10",
				mix			 : mix,
				darken		 :	darken,
				lighten: lighten,
				alpha		 : alpha

			};
			pmc.Danger = pmc.Red;
			pmc.Warning = pmc.Orange;
			pmc.Overdue = pmc.Gold;
			pmc.Info = pmc.SecondaryBlue;
			pmc.Success = pmc.Green;
			//added mixed versions
			pmc.Purple1 = saturate(mix(pmc.SecondaryBlue, pmc.Red, 10), 20);
			pmc.Purple2 = saturate(mix(pmc.SecondaryBlue, pmc.Red, 25), 20);
			pmc.Purple3 = saturate(mix(pmc.SecondaryBlue, pmc.Red, 40), 20);
			pmc.Purple4 = mix(pmc.PrimaryBlue, pmc.Red, 50);
			//add _faded versions
			for (var k in pmc) {
				if (k.indexOf('_faded') >= 0) {
					continue;
				}
				var c = pmc[k];
				pmc[k + "_faded"] = tinycolor.mix(c, 'white', 30).toHex();
			}
			pmc.WarningDanger = [pmc.Warning, pmc.Danger];
			pmc.DangerWarning = [pmc.Danger, pmc.Warning];
			pmc.DangerToGrey_4 = [pmc.Danger, pmc.Warning, pmc.Overdue, pmc.LightGrey];
			pmc.GreyToDanger_4 = pmc.DangerToGrey_4.clone().reverse();
			pmc.DangerToGrey_3 = [pmc.Danger, pmc.Warning, pmc.LightGrey];
			pmc.GreyToDanger_3 = pmc.DangerToGrey_3.clone().reverse();
			pmc.DangerToSuccess_4 = [pmc.Danger, pmc.Warning, pmc.Overdue, pmc.Success];
			pmc.SuccessToDanger_4 = pmc.DangerToSuccess_4.clone().reverse();
			pmc.DangerToSuccess_3 = [pmc.Danger, pmc.Warning, pmc.Success];
			pmc.SuccessToDanger_3 = pmc.DangerToSuccess_3.clone().reverse();
			pmc.BlueToGreen_4 = [pmc.Navy, pmc.SecondaryBlue, pmc.PrimaryBlue, pmc.Green];
			pmc.BlueToGreen_3 = [pmc.SecondaryBlue, pmc.PrimaryBlue, pmc.Green];
			pmc.BlueToGrey_3 = [pmc.PrimaryBlue, pmc.SecondaryBlue, pmc.LightGrey];
			pmc.YellowToGreen_3 = [pmc.Yellow, mix(pmc.Yellow, pmc.Green, 50), pmc.Green];
			pmc.PurpleLightToDark_3 = [pmc.Purple1, pmc.Purple2, pmc.Purple3];
			var nc = pmc.Navy;
			pmc.NavyDarkToLight_3 = [
				mix(nc, 'white', 0), mix(nc, 'white', 50), mix(nc, 'white', 80)
			];
			pmc.NavyDarkToLight_4 = [
				mix(nc, 'white', 0), mix(nc, 'white', 15), mix(nc, 'white', 25), mix(nc, 'white', 45)
			];
			pmc.graduated = {
				blueGreen : function (n) {
					return graduate(pmc.SecondaryBlue, pmc.Green, n);
				},
				secondaryBlue: function(n) {
					return graduate(pmc.SecondaryBlue, pmc.Navy, n);
				}
			};

			pmc.chartColourSet_Expenses = [
				pmc.Red,
				lighten(pmc.Red, 15),
				lighten(pmc.Red, 25),
				pmc.Orange,
				lighten(pmc.Orange, 15),
				lighten(pmc.Orange, 25),
				pmc.Gold,
				lighten(pmc.Gold, 15),
				lighten(pmc.Gold, 25),
				pmc.Yellow,
				lighten(pmc.Yellow, 15),
				lighten(pmc.Yellow, 25)

			];

			pmc.chartColourSet_Income = [
				pmc.Green,
				lighten(pmc.Green, 8),
				lighten(pmc.Green, 16),
				lighten(pmc.Green, 24),
				lighten(pmc.Green, 32),
				lighten(pmc.Green, 40)

			];

			return pmc;
		}

		function graduate(col1, col2,  n) {
			var d = Math.floor(100/n);
			var arr = [];
			for (var i = 0; i < n; i++) {
				arr.push(mix(col1, col2, i*d));
			}
			return arr;
		}
	}
})();
