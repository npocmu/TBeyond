//////////////////////////////////////////////////////////////////////
function composeGMcookieName(aName, addNewDid) 
{
   nC = (addNewDid && addNewDid == true ? TB3O.gServer + '_' + TB3O.UserID + '_' + actV.vNewdid + '_' + aName : TB3O.gServer + '_' + TB3O.UserID + '_' + aName); return nC;
};

function getGMcookie(aName, addNewDid) {return decodeURIComponent(GM_getValue(composeGMcookieName(aName, addNewDid), false));};
function deleteGMcookie(aName, addNewDid) {nc = composeGMcookieName(aName, addNewDid); GM_deleteValue(nc);};
function setGMcookie(aName, aValue, addNewDid) {if (TB3O.UserID != '0' && TB3O.UserID != 0) {var nc = composeGMcookieName(aName, addNewDid); if (aValue) GM_setValue(nC, encodeURIComponent(aValue)); else GM_setValue(nC, false); nc = null;};};

	function addGMcookieValue(aName, values, addNewDid) {
		var nV = '';
		for (var i = 0; i < values.length; i++){
			if (values[i] != ''){
				nV += values[i];
				if (i != values.length - 1) nV += '$';
			} else return;
		};
		var valC = getGMcookie(aName, addNewDid);
		if (valC != "false" && valC != '') valC += "$$" + nV; else valC = nV;
		setGMcookie(aName, valC, addNewDid);
		nV = null; valC = null;
	};


//////////////////////////////////////////////////////////////////////
function removeGMcookieValue(aName, indexNo, reloadPage, aFunctionToRunAfter, addNewDid)
{
   return function ()
   {
      if (confirm(T('DEL') + ". " + T('QSURE')))
      {
         var valC = getGMcookie(aName, addNewDid);
         if (valC != "false" && valC != '')
         {
            valC = valC.split("$$");
            valC.splice(indexNo, 1);
            valC = valC.join("$$");
            setGMcookie(aName, valC, addNewDid);
            removeElement($xf("//*[@id='" + aName + "']"));
            if (reloadPage) history.go(0);
            else aFunctionToRunAfter();
         };
      };
   };
};

