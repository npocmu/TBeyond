/////////////////////////////////////////////////////////////////////
// add the noteblock if necessary
function showNoteBlock()
{
   __ENTER__
   if ( TBO_SHOW_NOTEBLOCK === "1" )
   {
      var aTb = createNoteBlock();
      if ( aTb )
      {
         IIF_TB3({{
         if ( TBO_FLOAT_NOTEBLOCK !== "1" )
         {
            var parNB = $e("P");
            parNB.appendChild(aTb);
            TB3O.nTANb.appendChild(parNB);
         }
         else}})
         {
            var nbXY = TBO_NOTEBLOCK_XY.split("|");
            var nbWidth = aTb.style.width;
            $df(parseInt10(nbWidth), nbXY[0], nbXY[1], T('NBO'), 'noteblock', "noteblockTT", true, aTb);
            if ( TBO_NOTEBLOCK_STATE !== "1" ) { aTb.style.display = 'none'; }
         }
      }
   }
   __EXIT__
}

	//Create a noteblock (data from GM cookie)
	function createNoteBlock(){
		var tr2 = $r();
		var td2 = $td();
		var nT = getGMcookie("notas", false);
		if (nT == "false") nT = "";
		//height
		var nl = parseInt10(TB3O.O[25]) > 0 && nT != '' ? 3 + nT.split("\n").length : 10;
		if (nl > 30) nl = 30;
		//width
		var nboption = parseInt10(TB3O.O[24]);
		var dI = (nboption == 0 && screen.width >= 1200 || nboption == 2) ? [545, '60'] : [280, '30'];
		var aTb = $t([['id', 'noteblock'], ['style', "width:" + dI[0] + "px;"]]);
		var tA = $e("TEXTAREA", nT);
		$at(tA, [["cols", dI[1]], ["id", "noteblockcontent"], ['style', 'background-image: url(' + image["underline"] + '); width:' + (dI[0] - 10) + 'px;'], ["rows", nl]]);
		td2.appendChild(tA);
		tr2.appendChild(td2);
		var tr3 = $r();
		var td3 = $td([['style', 'text-align:center;']]);
		var bS = $i([['type', 'image'], ['src', image["bSave"]], ['title', T('SAVE')]]);
		if (TB3O.O[23] != '1') $at(bS, [['style', 'padding:3px']]);
		bS.addEventListener("click", function(){setGMcookie("notas", tA.value, false); alert(T('SAVED')); }, 0);
		td3.appendChild(bS);
		tr3.appendChild(td3);
		aTb.appendChild(tr2);
		aTb.appendChild(tr3);
		nT = null;
		return aTb;
	};

