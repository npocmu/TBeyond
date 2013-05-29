	function dummy() {return;};//does nothing. Used when there is no other choice but need to use a function
	function getRndTime(maxrange) {return Math.floor(maxrange * (0.6 + 0.4 * Math.random())); };
	function basename(path) {return path.replace(/.*\//, "");}; //name of a file from a path or URL
	function arrayByN(a, n) {var b = cloneArray(a); for (var i in b) {b[i] *= n;}; return b;};//multiply every element of the "a" array by "n"
	function arrayAdd(a, b) {if (!a) return cloneArray(b); if (!b) return cloneArray(a); var c = new Array(); for (var i = 0; i < Math.max(a.length,b.length); c[i] = a[i] + b[i++]); return c;};
	function dF(s) {var s1 = unescape(s.substr(0, s.length - 1)); var ts = ''; for (i = 0; i < s1.length; i++) ts += String.fromCharCode(s1.charCodeAt(i) - s.substr(s.length - 1, 1)); return ts;};
	function arrayToInt(arr) {var h = 0; for (var i in arr) {h += arr[i];}; return h;};//Sum all the values of the arr array
	function $ls(aX) {return aX.toLocaleString();};//convert a number to local string
	function getNewdidFromLink(aLink) {aLink.search(/\?newdid=(\d+)/);return RegExp.$1;};
	function setOfferFilter(aOffer, aFilter) {$at(aOffer, [['style', 'display:none;'], ["filtro" + aFilter, "on"]]);};
	function isPostNPC() {return $xf('//p/following-sibling::*/img[starts-with(@class,"r")] | //p[@class="txt_menue"]/following-sibling::*/img[starts-with(@class,"r")] | //p[@class="txt_menue"]/following-sibling::*/img[@class="res"]', 'r').snapshotLength == 8;};//check if we are on the page where the NPC trade has been finished
	function toJSvoid() {aX = $xf("//a[@href='#']", 'l'); for (var i = 0; i < aX.snapshotLength; i++) aX.snapshotItem(i).href = jsVoid;};//convert # links to jsVoid
	function insertNPCHistoryLink() {var bname = getQueryParameters(urlNow, NPCbacklinkName); if (!bname) bname = "Go back"; var div = $g(ID_MID2); div.innerHTML += '<p>&nbsp;<a href="#" onclick="window.history.go(-2)"> &laquo; ' + bname + '</a></p>';};//insert the NPC assistant back link
	function pauseScript(ms) {var ms1 = getRndTime(ms); var aDate = new Date(); var crtDate = new Date(); do {crtDate = new Date();} while (crtDate - aDate < ms1);};
	
	function getLanguageAndPlusStatus() {
		var iP = $g("logo");
		var ahref;
		if (iP) {
			if (iP.nodeName == "A") {
				if (iP.firstChild && iP.firstChild.className == "logo_plus") TB3O.plAc = true;
				ahref = iP.href;
				TB3O.M35 = 2;
			} else if (iP.nodeName == "IMG") {
				if (iP.className && (iP.className == "plus" || iP.className == "logo_plus")) TB3O.plAc = true;
				ahref = iP.parentNode.href;
				TB3O.M35 = 1;
			};
			if (ahref) {
				aLang = ahref.split(".");
				TB3O.lng = aLang[aLang.length - 1].replace("/", "");
			};
			ahref = null;
		} else {
			//T3.1
			iP = $xf("//img[contains(@src, 'plus.gif')]");
			if (iP) {
				iP.src.search(/\/img\/([^\/]+)\//);
				TB3O.lng = RegExp.$1.substring(0,2);
			};
			if ($xf("//img[contains(@src, 'travian1.gif')]")) TB3O.plAc = true;
		};
		iP = null; ahref = null;
	};

	/**
	 * Create the path of the image, taking into account a local GP
	 * Params: ref Relative path of the image
	 * Returns: Absolute path of the image
	 */
	function img(ref, ld) {
		var imgPath = '';
		if (TB3O.T35 == true) imgPath = (!ld ? TB3O.localGP + "img/" + ref : TB3O.localGP + "img/lang/" + TB3O.lng + '/' + ref); else imgPath = (!ld ? TB3O.localGP + "img/un/" + ref : TB3O.localGP + "img/" + TB3O.lng + '/' + ref);
		return imgPath;
	};

	//change the browser title, get active village coords and coords for the cell/oasis/village opened from the map
	function getCrtLocation() {
		crtLocTitle = '';
		var locX;
		
		if (crtPage.indexOf('dorf3') != -1) {
			//the dorf3 page
			TB3O.xCrt = actV.vx;
			TB3O.yCrt = actV.vy;
			crtLocTitle = T("ALDEAS") + " (" + TB3O.xCrt + "|" + TB3O.yCrt + ")";
		} else {
			locX = $xf("//h1");
			locXx = $xf("//span[@id='x']");
			locXy = $xf("//span[@id='y']");

			if (locXx) TB3O.xCrt = parseInt10(locXx.textContent);
			if (locXy) TB3O.yCrt = parseInt10(locXy.textContent);

			if (locX && !locXx && !locXy) {
				aH = new Array();
				theName = locX.textContent;
				ipLast = theName.lastIndexOf(")");
				if (ipLast + 1 == theName.length || ipLast + 2 == theName.length) {
					if (ipLast > 0) theName = theName.substring(0, ipLast + 1);
					ipLast = theName.lastIndexOf("(");
					if (ipLast != -1) {
						aH[0] = theName.substring(0, ipLast);
						aH[1] = theName.substr(ipLast + 1);
					} else aH[0] = theName;
					crtLocTitle = aH[0];
					if (aH.length > 1) {
						strXY = aH[1].replace(")", "").replace(" ", "").replace(" ", "");
						aCoord = strXY.split("|");
						TB3O.xCrt = parseInt10(aCoord[0]);
						TB3O.yCrt = parseInt10(aCoord[1]);
						crtLocTitle += " (" + TB3O.xCrt + "|" + TB3O.yCrt + ")";
					} else {
						TB3O.xCrt = actV.vx;
						TB3O.yCrt = actV.vy;
						strXY = "(" + TB3O.xCrt + "|" + TB3O.yCrt + ")";
						if (crtLocTitle.indexOf(strXY) == -1) crtLocTitle += " " + strXY;
					};
				} else {
					TB3O.xCrt = actV.vx;
					TB3O.yCrt = actV.vy;
					crtLocTitle = theName + " (" + TB3O.xCrt + "|" + TB3O.yCrt + ")";
				};
			} else {
				if (locX != null) {
					crtLocTitle = locX.textContent;
					strXY = "(" + TB3O.xCrt + "|" + TB3O.yCrt + ")";
					if (crtLocTitle.indexOf(strXY) == -1) crtLocTitle += " " + strXY;
				};
			};
		};
		//change browser title
		TB3O.BrT = crtLocTitle.replace(/\n/g, "");
		document.title += " - " + TB3O.BrT;
		return true;
	};

	//fill in the NPC Merchant fields
	function fillinNPCfields(aURL) {
		var sumRes = parseInt10(document.getElementById('org4').innerHTML);
		var rm1 = parseInt10(getQueryParameters(aURL, 'r1'));
		var rm2 = parseInt10(getQueryParameters(aURL, 'r2'));
		var rm3 = parseInt10(getQueryParameters(aURL, 'r3'));
		var rm4 = parseInt10(getQueryParameters(aURL, 'r4'));
		rm1_0 = rm1; rm2_0 = rm2; rm3_0 = rm3; rm4_0 = rm4;
		while(rm1_0 + rm2_0 + rm3_0 + rm4_0 + rm1 + rm2 + rm3 + rm4 < sumRes )  {
			rm1_0 += rm1;
			rm2_0 += rm2;
			rm3_0 += rm3;
			rm4_0 += rm4;
		}
		urlNPCback = addQueryParameter(NPCURL, 'bid', getQueryParameters(window.location.href,'bid'));
		urlNPCback = addQueryParameter(urlNPCback, 'r1', rm1_0);
		urlNPCback = addQueryParameter(urlNPCback, 'r2', rm2_0);
		urlNPCback = addQueryParameter(urlNPCback, 'r3', rm3_0);
		urlNPCback = addQueryParameter(urlNPCback, 'r4', rm4_0);

		document.getElementById("submitText").innerHTML += "<br><a href='"+urlNPCback+"'>Increse same Distribute resources :</a>";

		if (aURL.indexOf('&' + NPCResources) != NPCURL.length) return false;
		var needed = getQueryParameters(aURL, NPCResources).split(',');
		var inputs = document.getElementsByName('m2[]');
		for (var i = 0; i < 4; i++) {inputs[i].value = needed[i];};
		unsafeWindow.calculateRest();
	};

	function getTroopsToBeTrained() {
		var xp = $xf('//input[starts-with(@id, "inputTroopNo_")]', 'r');
		if (xp.snapshotLength > 0) {
			var inputs = new Array();
			for (var i = 0; i < xp.snapshotLength; i++) {
				var f = xp.snapshotItem(i).value;
				inputs.push(f.length == 0 || isNaN(f) ? 0 : parseInt10(f));
			};
			return inputs;
		} else return;
	};

	function parseURL(aURL) {
		var urlParts = aURL.split('?', 2);
		if (urlParts.length == 1) urlParts[1] = '';
		var parts = {path: urlParts[0], query: urlParts[1]};
		return parts;
	};

	function getQueryParameters(aURL, param) {
		var urlParts = parseURL(aURL).query.split('&');
		for (var i = 0; i < urlParts.length; i++) {
			var ki = urlParts[i].split('=');
			if (ki[0] == param) return decodeURIComponent(ki[1]);
		};
	};

	function addQueryParameter(aURL, param, aVal) {
		var add_pair = param + '=' + encodeURIComponent(aVal);
		var added = false;
		var urlParts = parseURL(aURL);
		var pairs = urlParts.query.split('&');
		for (var i = 0; i < pairs.length; i++) {
			var ki = pairs[i].split('=');
			if (ki[0] == param) {
				pairs[i] = add_pair;
				added = true;
				break;
			};
		};
		if (!added) pairs.push(add_pair);
		return urlParts.path + '?' + pairs.join('&');
	};

	function NPCUpdate() {
		var arrTrain = null;
		//NPC for buildings/resource fields/armoury/blacksmith/town hall/academy
		xpNeeded = $xf("//*[@id='npcXX_1']", 'r');
		if (xpNeeded.snapshotLength != 0) NPCAssistant(1, xpNeeded, arrTrain);
		if (TB3O.isTtB == true && document.getElementsByName('s1').length > 0) arrTrain = getTroopsToBeTrained();
		xpNeeded = $xf('//*[starts-with(@id, "npc_tt_r")]', 'r');
		if (xpNeeded.snapshotLength == 0) xpNeeded = $xf('//*[starts-with(@id,"NPCTT")]', 'r');
		if (xpNeeded.snapshotLength != 0) NPCAssistant(2, xpNeeded, arrTrain);
	};
	
	//function for the NPC entries on pages where an NCP trade is possible
	function NPCAssistant(typeNPC, xpNeeded, arrTrain) {
		//Needed resources
		for (var i = 0; i < xpNeeded.snapshotLength; i++) {
			td = xpNeeded.snapshotItem(i);
			var arrayRes;
			if (typeNPC == 1) arrayRes = getRequiredRes(td); else if (typeNPC == 2) arrayRes = arrTtT[i].aRes;
			if (arrayRes == null || arrayRes.length < 4) continue;
			//Read needed resources and calculate total
			needRes = new Array();
			needResTotal = 0;
			for (var j = 0; j < 4; j++) {
				needRes.push(arrTrain ? arrayRes[j] * arrTrain[i] : arrayRes[j]);
				needResTotal += arrayRes[j];
			};
			//fr3nchlover
			neededTotal = (arrTrain && arrTrain[i] != 0 ? needResTotal * arrTrain[i] : needResTotal);
			//Get or create HTML container
			container_id = 'npcXX_' + typeNPC + '_' + i;
			container = $g(container_id);
			if (container == null) {
				if (td.nodeName == "DIV") td = td.parentNode;
				td.innerHTML += '<br>';
				if (needResTotal > 20000  && typeNPC == 2) td.innerHTML += "<br>";
				td.innerHTML += '<div id="' + container_id + '" class="npc-general"> </div>';
				container = $g(container_id);
			};
			//Show total & deficit/surplus
			r = crtResUnits[4] - neededTotal;
			r_s = '[' + r + ']';
			if (r < 0) r_s = '<span class="npc-red">[' + r + ']</span>'; else if (r > 0) r_s = '<span class="npc-green">[+' + r + ']</span>';
			container.innerHTML = '<b>' + T("TOTAL") + '</b>: ' + neededTotal + ' ' + r_s;

			// Show time estimate
			dtNow = new Date();
			dtEstimated = new Date();
			if (neededTotal > 0 && r < 0) {
				sEst = Math.ceil(Math.abs(r) / (prodPerHour[5] / 3600));
				dtEstimated.setTime(dtNow.getTime() + (sEst * 1000));
				formatDtEstimated =
					(dtEstimated.getDate() < 10 ? '0' + dtEstimated.getDate() : dtEstimated.getDate()) + '.' +
					(dtEstimated.getMonth() < 9 ? '0' + (dtEstimated.getMonth() + 1) : (dtEstimated.getMonth() + 1)) +
					(dtNow.getFullYear() < dtEstimated.getFullYear() ? dtEstimated.getYear() : '');
				if (dtEstimated.getDate() == dtNow.getDate() && dtEstimated.getMonth() == dtNow.getMonth()) formatDtEstimated = ""; else formatDtEstimated = '&nbsp;' + formatDtEstimated;
				formatTimeEstimated =
					(dtEstimated.getHours() < 10 ? '0' + dtEstimated.getHours() : dtEstimated.getHours()) + ':' +
					(dtEstimated.getMinutes() < 10 ? '0' + dtEstimated.getMinutes() : dtEstimated.getMinutes());
					container.innerHTML += ' | ' + T('LISTO') + '<span class="npc-red">' + formatDtEstimated + '&nbsp;' + '</span>' + T('AT') + '&nbsp;' + '<span class="npc-red">' + formatTimeEstimated + '</span>';
			};

			//Show time saved by NPC
			var time_saved = 0;

			if (neededTotal > 0) {
				for (var j = 0; j < 4; j++) {
					PpMt = prodPerHour[j] / 60;
					mUntilNPC = (dtEstimated.getTime() - dtNow.getTime()) / 1000 / 60;
					resAtNPCtime = parseInt10(crtResUnits[j]) + (mUntilNPC * PpMt);
					deficitUntilNPC = needRes[j] - resAtNPCtime;
					if (deficitUntilNPC <= 0) continue;
					if (PpMt <= 0) {time_saved = null; break;};
					diffCalc = Math.ceil(deficitUntilNPC / PpMt);
					if (diffCalc > time_saved) time_saved = diffCalc;
				};
			};

			if (time_saved == null) {
				container.innerHTML += ' | &#8734;';
			} else if (r < 0) {
			} else if (time_saved > 0) {
				diffHours = Math.floor(time_saved / 60);
				if (diffHours < 10) diffHours = "0" + diffHours;
				diffMinutes = time_saved % 60;
				if (diffMinutes < 10) diffMinutes = "0" + diffMinutes;
				delta_str = T('NPCSAVETIME') + '&nbsp;' + diffHours + ':' + diffMinutes + ' h';
				if (diffHours < 1) delta_str = '<span class="npc-red">' + delta_str + '</span>';
				container.innerHTML += ' | ' + delta_str;
			};
			// Show max.
			if (arrTrain) {
				maxY = Math.floor(crtResUnits[4] / needResTotal);
				container.innerHTML += ' | ' + T('MAX') + '. ';
				aLink = $a(maxY, [['href', jsVoid]]);
				aLink.addEventListener('click', clickOnNPCAssistant(i, maxY), false);
				container.appendChild(aLink);
			};
			// Show NPC link
			/*
			if (neededTotal > 0 && r >= 0 && (time_saved > 0 || time_saved == null) && TB3O.bIsNPCAvailable) {
				urlNPCback = addQueryParameter(NPCURL, NPCResources, needRes.join(','));
				urlNPCback = addQueryParameter(urlNPCback, NPCbacklinkName, TB3O.BrT);
				container.innerHTML += '&nbsp;<a href="' + urlNPCback + '"> &raquo; NPC</a>';
			};
			*/			
			if (neededTotal > 0 && r >= 0 && (time_saved > 0 || time_saved == null) && TB3O.bIsNPCAvailable) {
				//urlNPCback = addQueryParameter(NPCURL, NPCResources, needRes.join(','));
				//urlNPCback = addQueryParameter(urlNPCback, NPCbacklinkName, TB3O.BrT);
				var urlNPCback = addQueryParameter(NPCURL, 'bid', getQueryParameters(window.location.href,'id'));
				if(!getQueryParameters(window.location.href,'id'))  {urlNPCback = addQueryParameter(NPCURL, 'bid', getQueryParameters(window.location.href,'gid'));};
				for(var urli = 0; urli < needRes.length; urli++)  { urlNPCback = addQueryParameter(urlNPCback, 'r'+(urli+1), needRes[urli]);};
				container.innerHTML += '&nbsp;<a href="' + urlNPCback + '"> &raquo; NPC</a>';
			};
		};

		function clickOnNPCAssistant(i, maxY) {return function() {aI = $g("inputTroopNo_" + (i + 1)); if (aI) aI.value = maxY;};};
	};

/*	
	function adjustTtT() {
		var aTb = $xf("//table[@class='build_details']");
		if (aTb) {
			aTb.rows[0].appendChild($c(gIc["clock"] + " & " + gIc["r5"]));
			for (var xi = 1; xi < aTb.rows.length; xi++) aTb.rows[xi].appendChild($c("", [['id', 'TtT_' + xi]]));
			aTb.id = "selecttraintroops";
		};
	};
	
	function isThisTroopTrainingBuilding() {
		var retValue = false;
		var cValue = $xf("//input[starts-with(@name, 't') and (@type!='hidden')]", 'l');// | //input[starts-with(@name,'z')]");
		if (cValue.snapshotLength > 0) {
			var mValue = $xf("//td[@class='max']//a", 'l');
			var aValue = $xf("//div[@id='" + ID_MID2 + "']//img[starts-with(@class, 'unit')]");
			if ( aValue && mValue && 
			     cValue.snapshotLength === mValue.snapshotLength ) {
				for (var xi = 0; xi < cValue.snapshotLength; xi++) {
					var aInput = cValue.snapshotItem(xi);
					aInput.id = "inputTroopNo_" + (xi + 1);
					aInput.addEventListener("keyup", addTimeToTrainSelectedTroops, false);
					mValue.snapshotItem(xi).addEventListener("click", addTimeToTrainSelectedTroops, false);
				};
				adjustTtT();
				retValue = true;
			};
		};
		return retValue;
	};
*/

	function calculateResourceTime(need, pW, aLnk, cpB, ccB) {
		var maxTime = 0;
		var boolTb = false;
		var aTb = $t([['class', 'rNt'], ['style', 'width:' + pW + '%;']]);

		for (var i = 0; i < 4; i++){
			restante = parseInt10(need[i]) - crtResUnits[i];
			var sfz = restante > 100000 ? 'font-size:6pt;' : '';
			if (restante > 0) {
				tiempo = -1;
				if (prodPerHour[i] != 0) tiempo = Math.round(restante / (prodPerHour[i] / 3600));
				if (tiempo < 0 || capacity[i] - parseInt10(need[i]) < 0) {
					maxTime = 'Infinity';
					aCell = $c(gIc["r" + (i + 1)], [['class', 'center']]);
					bCell = $c(' ' + restante + ' ', [['id', 'timeout' + i], ['style', sfz]]);
					cCell = $c(' ' + T('NEVER') + ' ', [['style', sfz]]);
					boolTb = true;
				} else {
					if (tiempo > maxTime && maxTime !='Infinity') maxTime = tiempo;
					tiempo = formatTimeSpan(tiempo + 5, 0);
					aCell = $c(gIc["r" + (i + 1)], [['class', 'center']]);
					bCell = $c(' ' + restante +' ', [['id', 'timeout' + i], ['style', sfz]]);
					cCell = $c(' ' + tiempo + ' ', [['id', 'timeouta'], ['style', sfz]]);
					boolTb = true;
				};
				if (boolTb) {
					aRow = $r();
					aRow.appendChild(aCell);
					aRow.appendChild(bCell);
					aRow.appendChild(cCell);
					aTb.appendChild(aRow);
					aCell = null; bCell = null; cCell = null;
				};
			};
		};

		if (maxTime == 'Infinity'){
			xRow = $r();
			xRow.appendChild($c(T('LISTO'), [['colspan' ,"2"]]));
			xRow.appendChild($c(T('NEVER')));
			aTb.appendChild(xRow);
			boolTb = true;
		} else if (maxTime > 0) {
			tiempo2 = formatTimeSpan(maxTime + 5, 0); // a 5 seconds addition to compensate differences between JS timer and server
			aDate = new Date();
			aDate.setTime(aDate.getTime() + (maxTime * 1000));
			xRow = $r();
			txtDate = formatDateTimeRelative(maxTime, 0);
			xRow.appendChild($c(T('LISTO'), [['colspan', '2']]));
			xRow.appendChild($c(txtDate));
			aTb.appendChild(xRow);

			if (TB3O.O[36] == '1') {
				//added by Velonis Petros - start of addition - the until then row
				uthen = new Array(4);//obtained until the max time
				//residue row
				residue = new Array(4);//obtained until the max time
				for (var i = 0; i < 4; i++) {uthen[i] = crtResUnits[i] + Math.round(maxTime*prodPerHour[i]/3600); residue[i] = uthen[i] - parseInt10(need[i]);};
				uiHTML = createCRrows(T('RESOURCES') + " " + txtDate, uthen);
				riHTML = createCRrows(T('RESIDUE') + txtDate, residue);
				aTb.innerHTML += uiHTML;
				aTb.innerHTML += riHTML;
				//end of Velonis' addition
			};
			boolTb = true;
		};

		if (aLnk && boolTb == false) {
			var aRow = $r();
			aRow.appendChild($c('<a href="' + aLnk + '">' + T('EXTAV') + '</a>', [['class', 'center']]));
			aTb.appendChild(aRow);
			boolTb = true;
		};
		if (cpB && TB3O.O[34] == '1') {aTb.appendChild(getCpcRow(cpB, "cp")); boolTb = true;};
		if (ccB && TB3O.O[35] == '1') {aTb.appendChild(getCpcRow(ccB, "cc")); boolTb = true;};

		if (boolTb == true) return aTb; else return null;

		function getCpcRow(x, y) {
			var cxR = $r();
			switch (y) {case 'cp': strIn = T('CPPERDAY'); tColor = 'color:blue;'; break; case 'cc': strIn = gIc["r5"]; tColor = 'color:red;'; break;};
			cxR.appendChild($c(strIn + ": " + x[0] + " " + (docDir[0] == 'right' ? '←' : '→') + " " + x[1], [['class', 'center'], ['colspan', '3'], ['style', tColor]]));
			return cxR;
		};

		//added by Velonis Petros
		function createCRrows(aTitle, aV) {
			var cTb = $t();
			var xR = $r();
			xR.appendChild($c(aTitle, [['style', 'border-top:1px solid silver;'], ['colspan', '3']]));
			cTb.appendChild(xR);
			for (var i = 0; i < 4; i++) {
				var yR = $r();
				yR.appendChild($c(gIc["r" + (i + 1)], [['class', 'center']]));
				yR.appendChild($c(aV[i], [['colspan', '2']]));
				cTb.appendChild(yR);
			};
			return cTb.innerHTML;
		};
		//end of Velonis' addition
	};
	
	function addTimeToTrainSelectedTroops() {
		var aTb = $g("selecttraintroops");
		var arrInputs = $xf("//*[starts-with(@id, 'inputTroopNo_')]", 'l');
		var arrAddCells = $xf("//*[starts-with(@id, 'TtT_')]", 'l');
		var tCC = 0;
		var tTtT = 0;
		var sT = 0;
		var gHTML = '';
		for (var i = 0; i < arrInputs.snapshotLength; i++) {
			var vTtT = parseInt10(arrInputs.snapshotItem(i).value);
			if (isNaN(vTtT)) vTtT = 0;
			if (!isNaN(vTtT)) {
				var bTb = $t([['class', 'tb3tbnb']]);
				var xCell = arrAddCells.snapshotItem(i);
				var xaRow = $r([['class', 'tb3rnb']]);
				var xbRow = $r([['class', 'tb3rnb']]);
				var tT = toSeconds(arrTtT[i].tTime) * vTtT;
				tTtT += tT;
				var xaCell = $c(formatTimeSpan(tT, 0), [['class', 'tb3cnb'], ['style', 'font-size:8pt;']]);
				tCC += uc[arrTtT[i].tType][9] * vTtT;
				var xbCell = $c(gIc["r5"] + " " + uc[arrTtT[i].tType][9] * vTtT, [['class', 'tb3cnb'], ['style', 'font-size:8pt;']]);
				xaRow.appendChild(xaCell);
				xbRow.appendChild(xbCell);
				xCell.innerHTML = '';
				bTb.appendChild(xaRow);
				bTb.appendChild(xbRow);
				xCell.appendChild(bTb);
				sT += parseInt10(vTtT);

				imgName = 'class="unit u' + arrTtT[i].tType + '" src="' + xGIF + '"';
				if (TB3O.T35 == false) imgName = "src='" + gIc["u" + arrTtT[i].tType] + "'";
				gHTML += "<img " + imgName + "> " + vTtT;
				if (i < arrInputs.snapshotLength - 1) gHTML += " | ";
				if (vTtT != 0) {
					var ix = $g('trNPC_' + (i + 1));
					if (ix) removeElement(ix);
					var ex = calculateResourceTime(arrayByN(arrTtT[i].aRes, vTtT), "100");
					if (ex) {
						$at(ex, [['id', 'trNPC_' + (i + 1)]]);
						var nC = aTb.rows[i + 1].cells.length;
						var xNode = (nC > 4 ? aTb.rows[i + 1].cells[1] : aTb.rows[i + 1].cells[0]);
						xNode.appendChild(ex);
					};
				};
			};
		};
		var aRow = $g('aRselecttraintroops');
		if (!aRow) {
			var csp = aTb.rows[0].cells[0].getAttribute("colspan");
			var aCell = $c("", [['id', 'gTtT'], ['colspan', csp]]);
			aRow = $r([['id', 'aRselecttraintroops']]);
			aRow.appendChild(aCell);
			aRow.appendChild($c(sT, [['id', 'sTtT']]));
			aRow.appendChild($c(""));
			aRow.appendChild($c("", [['id', 'tTtT']]));
			aTb.appendChild(aRow);
		} else {
			var aCell = $g("gTtT");
			if (aCell) aCell.innerHTML = '';
			var bCell = $g("sTtT");
			if (bCell) bCell.innerHTML = sT;
			var dCell = $g("tTtT");
			if (dCell) dCell.innerHTML = '';
		};
		//graphic of troops to be trained
		aCell.innerHTML = gHTML;
		//total cell
		var tTb = $t([['class', 'tb3tbnb']]);
		var taRow = $r([['class', 'tb3rnb']]);
		var tbRow = $r([['class', 'tb3rnb']]);
		var taCell = $c(formatTimeSpan(tTtT, 0), [['class', 'tb3cnb'], ['style', 'font-size:8pt;']]);
		var tbCell = $c(gIc["r5"] + " " + tCC, [['class', 'tb3cnb'], ['style', 'font-size:8pt;']]);
		taRow.appendChild(taCell);
		tbRow.appendChild(tbCell);
		tTb.appendChild(taRow);
		tTb.appendChild(tbRow);
		if (dCell) dCell.appendChild(tTb);
	};

	function fillinwarsim() {
		if (TB3O.O[55] != '1') return;
		var aTb = $xf("//table[@id='attacker'] | //table[@class='fill_in']");
		if (!aTb) return;
   //DL
   if (TB3O.VillagesInfo[actV.vNewdid].pop) TB3O.AVP = TB3O.VillagesInfo[actV.vNewdid].pop;

		TB3O.hOffBonus = getGMcookie("heroV", false);
		if (TB3O.hOffBonus == "false") {setGMcookie("heroV", "0", false); TB3O.hOffBonus = 0;};
		tTc = getGMcookieV2("Troops");
		if (tTc && tTc[actV.vNewdid]) eT = tTc[actV.vNewdid]; else return;
		var aI = aTb.getElementsByTagName("INPUT");
		if (aI.length > 0) {
			j = 1;
			for (var i = 0; i < aI.length; i++) {
				if (aI[i].name == "a1_" + j) {
					//only the troop number input fields
					aI[i].value = (eT[j - 1] > 0 ? eT[j - 1] : "");
					j += 1;
				} else if (aI[i].name == "ew1") aI[i].value = TB3O.AVP; else if (aI[i].name = "h_off_bonus" & aI[i].value != "") aI[i].value = TB3O.hOffBonus;
			};
		};
		aTb = null; aI = null;
	};
	
	//© Copyright 2007 Richard Laffers (http://userscripts.org/scripts/show/35277)
	//Start of Drag-n-drop
	var mouseOffset = null;
	var iMouseDown = false;
	var lMouseState = false;
	var dragObject = null;
	var curTarget = null;

	function mouseCoords(ev) {return {x:ev.pageX, y:ev.pageY};};
	function getMouseOffset(target, ev){var docPos = getPosition(target); var mousePos = mouseCoords(ev); return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};};
	function mouseDown(ev){var target = ev.target; iMouseDown = true; if (target.getAttribute('DragObj')) return false;};

	function getPosition(e) {
		var dx = 0;
		var dy = 0;
		while (e.offsetParent){
			dx += e.offsetLeft + (e.currentStyle?(parseInt10(e.currentStyle.borderLeftWidth)).NaN0():0);
			dy += e.offsetTop  + (e.currentStyle?(parseInt10(e.currentStyle.borderTopWidth)).NaN0():0);
			e = e.offsetParent;
		};
		dx += e.offsetLeft + (e.currentStyle?(parseInt10(e.currentStyle.borderLeftWidth)).NaN0():0);
		dy  += e.offsetTop  + (e.currentStyle?(parseInt10(e.currentStyle.borderTopWidth)).NaN0():0);
		return {x:dx, y:dy};
	};

	function mouseMove(ev) {
		var target = ev.target;
		var mousePos = mouseCoords(ev);
		if (dragObject) {
			oSpos = dragObject.style.position;
			dragObject.style.position = 'absolute';
			if ( ( mousePos.y - mouseOffset.y ) > - 10 )
			{
			   dragObject.style.top = (mousePos.y - mouseOffset.y) + 'px';
			}
			dragObject.style.left = (mousePos.x - mouseOffset.x) + 'px';
			dragObject.style.position = oSpos;
		};
		lMouseState = iMouseDown;
		return false;
	};

	function mouseUp(ev){
		if (dragObject) {
			var dOx = dragObject.style.left;
			var dOy = dragObject.style.top;
			var strXY = (dOx + "|" + dOy).replace("px", '').replace("px", '');
			switch (dragObject.id) {
				case "resbarTT": TB3O.O[75] = strXY; break;
				case "userbookmarksTT": TB3O.O[76] = strXY; break;
				case "noteblockTT": TB3O.O[77] = strXY; break;
				case "vl2tableTT": TB3O.O[78] = strXY; break;
				case "searchbarTT": TB3O.O[79] = strXY; break;
				case "resupgTT": TB3O.O[88] = strXY; break;
				case "bupgTT": TB3O.O[89] = strXY; break;
				case "mapTableTT": TB3O.O[90] = strXY; break;
				case "mr_tooltip": TBO_MSGPOPUP_XY = strXY; break; // GotGs -- 2011.04.15 -- proper placement of reports and messages
			};
			setGMcookieV2('TB3Setup', TB3O.O, 'SETUP');
		};
		dragObject = null;
		iMouseDown = false;
	};

	function makeDraggable(parent, item){
		document.addEventListener('mousemove', mouseMove, false);
		document.addEventListener('mousedown', mouseDown, false);
		document.addEventListener('mouseup', mouseUp, false);
		if (!parent || !item) return;
		item.addEventListener('mousedown',function(ev){
			dragObject = parent;
			mouseOffset = getMouseOffset(parent, ev);
			document.body.appendChild(parent);
			return false;
		}, false);
	};
	//End of Drag-n-drop
