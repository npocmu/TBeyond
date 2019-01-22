//////////////////////////////////////////////////////////////////////
function saveTBOptions()
{
   setGMcookieV2('TB3Setup', TB3O.O, 'SETUP');
}

//////////////////////////////////////////////////////////////////////
// load setup options
// return: true - if option cookie present
//         false - cookie absent, load defaults
function loadTBOptions()
{
   __ENTER__

   var bResult = false;
   var aTB3S = getGMcookieV2("TB3Setup");

   if ( aTB3S && aTB3S['SETUP'] )
   {
      TB3O.O = aTB3S['SETUP'];
      bResult = true;

      if ( TB3O.O.length !== getTBOptionsDefaults.count )
      {
         //setup additional new TB3Setup cookies
         var OD = getTBOptionsDefaults();

         for ( var xi in OD )
         {
            if ( !(xi in TB3O.O) ) { TB3O.O[xi] = OD[xi]; }
         }
         saveTBOptions();
      }
   }
   else
   {
      TB3O.O = getTBOptionsDefaults();
      saveTBOptions();
   }

   for (var i = 1; i < 5; i++)
   {
      if (TB3O.O[64 + i] != '')  { TB3O.CNc[i] = TB3O.O[64 + i]; }
   }
   if ( TBO_CN_COL_NOCAP != '')  { TBCN_COL_NOCAP = TBO_CN_COL_NOCAP; }

   __EXIT__

   return bResult;
}


//////////////////////////////////////////////////////////////////////
//TB3 Setup page
function TB3Setup()
{
M4_ECHO_OFF-----------------------------------------------------------
Setup dialog descriptor format:
aTBS[i] - array about dialog table row with given index
aTBS[i][0] - type of record:
  1 - section header row descriptor, array[5]
      [0] - always 1 
      [1] - text label name (in uppercase)
      [2] - header type
            "TR" - ordinary header row 
            "RD" - header row with checkbox that open/hide subsection with settings
      [3] - help topic name 
      [4] - unused for "TR" type, setup setting descriptor if row type is "RD" 
  2 - setup setting descriptor, array[5]
      [0] - always 2 
      [1] - text label name  (in uppercase)
      [2] - control type ("CB" - checkbox, "T" - input text, "SEL" - select, "SP" - read only text)
      [3] - array of available options when the control type is the select control or null 
      [4] - if number then setting index for options from TB3O.O/TB3O.U or -1 for others
            if string then setting name for loadPersistentUserObject/savePersistentUserObject
------------------------------------------------------------M4_ECHO_ON

   //TB3 Setup parameters
   var aTBS = 
   [
         [1, "0", "TR", "", -1],
             [2, "0", "SEL", arAvLang, 0],
         [1, "ACCINFO", "TR", "SH1", -1],
             [2, "U.3", "SP", "", 3],
             [2, "U.6", "SP", "", 6],
             [2, "U.2", "SP", "", 2],
IF_TB3({{[1, "BIC", "TR", "", -1],}})
    IF_TB3({{[2, "4", "CB", "", 4],}})
    IF_TB3({{[2, "5", "CB", "", 5],}})
    IF_TB3({{[2, "6", "CB", "", 6],}})
    IF_TB3({{[2, "7", "CB", "", 7],}})
    IF_TB3({{[2, "alfl", "T", "", -1],}})
IF_TB3({{[1, "MNUL", "TR", "", -1],}})
    IF_TB3({{[2, "9", "CB", "", 9],}})
    IF_TB3({{[2, "10", "SEL", [T('WSIMO1'), T('WSIMO2')], 10],}})
    IF_TB3({{[2, "11", "SEL", [], 11],}})
IF_TB3({{// Main village list
         [1, "VGL", "TR", "", -1],
             [2, "17", "CB", "", 17],
             [2, "114","CB", "", 115],
             [2, "15", "CB", "", 15],
             [2, "16", "CB", "", 16],
             [2, "12", "CB", "", 12],
             [2, "13", "CB", "", 13],
             [2, "19", "CB", "", 19],
             [2, "85", "CB", "", 14],
             [2, "112","CB", "", 113],
             [2, "91", "CB", "", 91],}})
         // Additional village list
         [1, "VGL2","RD", "", [2, "18", "CB", "", 18]],
             [2, "117","SEL", ["1", "2", "3", "4"], 117],
             [2, "17", "CB", "", 110],
             [2, "114","CB", "", 114],
             [2, "15", "CB", "", 108],
             [2, "16", "CB", "", 109],
             [2, "12", "CB", "", 105],
             [2, "13", "CB", "", 106],
             [2, "19", "CB", "", 111],
             [2, "85", "CB", "", 107],
             [2, "112","CB", "", 112],
//    IF_TB4({{[2, "91", "CB", "", 91],}})
         // Bookmarks section
         [1, "MARCADORES", "RD", "", [2, "21", "CB", null, 20]],
             [2, "MARCADORES", "T", "", "marcadores"],
         // Noteblock section
         [1, "NBO", "RD", "",        [2, "23", "CB", null, 22]],
             [2, "24", "SEL", [T('NBSA'), T('NBSN'), T('NBSB')], 24],
             [2, "25", "SEL", [T('NBHK'), T('NBHAX')], 25],
         // Resource bar section
         [1, "RBTT", "RD", "",       [2, "40", "CB", null, 39]],
             [2,"102", "CB", "",102],
         // NPC Assistant section
         [TB3O.bIsNPCAvailable ? 1: 0, "NPCO", "TR", "", -1],
             [TB3O.bIsNPCAvailable ? 2 : 0, "26", "CB", "", 26],
         [1, "STAT", "TR", "", -1],
             [2, "27", "SEL", [], 27],
             [2, "119","T",  "", 119],
             [2, "29", "SEL", [], 29],
             [2, "33", "CB", "", 32],
         [1, "TTT", "TR", "", -1],
             [2, "53", "CB", "", 53],
             [2, "54", "CB", "", 54],
         [1, "GENLNK", "TR", "", -1],
             [2, "28", "CB", "", 28],
             [2, "30", "CB", "", 30],
             [2, "31", "CB", "", 31],
             [2, "85", "CB", "", 99],
         [1, "UPGTB", "TR", "", -1],
             [2, "34", "CB", "", 34],
             [2, "35", "CB", "", 35],
             [2, "36", "CB", "", 36],
             [TB3O.bIsNPCAvailable ? 2 : 0, "26", "CB", "", 103],
         [1, "RESF", "TR", "", -1],
             [2, "37", "CB", "", 37],
             [2, "38", "CB", "", 38],
         [1, "VLC", "TR", "", -1],
             [2, "41", "CB", "", 41],
             [2, "42", "CB", "", 42],
             //[2, "43", "CB", "", 43],
             [2, "44", "CB", "", 44],
             [2, "45", "CB", "", 45],
         // marketplace
         [1, "BN_GID17", "TR", "", -1],
             [2, "121", "CB", "", 121],
             [2,  "46", "CB", "",  46],
    IF_TB3({{[2,  "47", "CB", "",  47],}})
    IF_TB3({{[2,  "48", "SEL", ["1", "2", "3", "4", "5"], 48],}})
             [2, "VENTAS", "T", "", "ventas"],
             [2,  "87", "CB", "",  87],
             [2, "120", "CB", "", 120],
         // rally point
         [1, "BN_GID16", "TR", "", -1],
             [2, "49", "SEL", [T('AT2'), T('AT3'), T('AT4')], 49],
             [2, "50", "T", "", 50],
             [2, "51", "CB", "", 51],
             [2, "52", "CB", "", 52],
             [2, "80", "CB", "", 80],
             [2, "81", "CB", "", 81],
             [2, "85", "CB", "", 85],
             [2, "86", "CB", "", 86],
         // map (only work on old style maps)
         [1, "MAPO", "TR", "", -1],
             [2, "56", "CB", "", 56],
             [2, "118","CB", "",118],
             [2, "57", "CB", "", 57],
             [2, "58", "CB", "", 58],
         // Reports & Messages
         [1, "MEREO", "TR", "", -1],
             //[2, "59", "SEL", ["1", "2", "3", "4", "5"], 59],
             [2, "60", "CB", "", 60],
             [2, "61", "CB", "", 61],
             [2, "62", "CB", "", 62],
             //[2, "63", "CB", "", 63],
             //[2, "64", "CB", "", 64],
         [1, "COLO", "TR", "SH2", -1],
             [2,  "65", "T", "",  65],
             [2,  "66", "T", "",  66],
             [2,  "67", "T", "",  67],
             [2, "101", "T", "", 101],
             [2,  "68", "T", "",  68],
         M4_DEBUG({{
         [1, "DBGO", "TR", "", -1],
             [2, "69", "SEL", ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], 69],
         }})
   ];
   //no aTBS items from 70 to 79
   var i, j;

   //DL additional initialization
   for ( i = 0; i < aTBS.length; i++ )
   {
      var srcArr = null;
      switch ( aTBS[i][4] )
      {
         case 11:
            srcArr = repSites; break;

         case 27:
            srcArr = wsAnalysers; break;

         case 29:
            srcArr = mapAnalysers; break;
      }

      if ( srcArr )
      {
         aTBS[i][3].length = srcArr.length;
         for ( j = 0; j < srcArr.length; j++ )
         {
            aTBS[i][3][j] = srcArr[j][0];
         }
      }
   }

   //Modified by Lux
   if ( $g('TB3S') )
   {
      uiDisplayModalWindow(true);
      return;
   }

   var innerPane = uiCreateModalWindow();

   var setupTb = $t(['id', 'TB3S'], createHeaderFooterRow());

   var bVisible = true;
   for ( i = 0; i < aTBS.length; i++ )
   {
      var aCell, aImg, pS;
      var rd = aTBS[i];
      if ( rd[0] === 1 )
      {
         if ( rd[2] === "RD" )
         {
            pS = createSettingControl(rd[4]);
            $at(pS, [['title', T(rd[4][1].toUpperCase())]]);
            pS.addEventListener('change', onShowHideSubsection, false);
            bVisible = pS.checked;
         }
         else
         {
            pS = null;
            bVisible = true;
         }

         aCell = $td(['colspan', '3'], [pS,T(rd[1].toUpperCase())]);
         if ( rd[3] !== "" )
         {
            addChildren(aCell, [" ", aImg = I("help")]);
            uiAddTooltip(aImg, bind(createHelpTooltip,[rd[3]]));
         }
         setupTb.appendChild($r(['class', 'srst'], aCell));
      }
      else if ( rd[0] === 2 )
      {
         pS = createSettingControl(rd);
       
         setupTb.appendChild($r((bVisible ? null : ['style','display:none;']), [
            $td(['class', 'srsc1'], T(rd[1].toUpperCase())),
            $td([['class', 'srsc2'], ['colspan', '2']], pS)
         ]));
      }
   }

   setupTb.appendChild(createHeaderFooterRow());

   innerPane.appendChild(setupTb);
   uiDisplayModalWindow(true);

   //-------------------------------------------------------------
   function createHeaderFooterRow() 
   {
      var aRow =
      $r(['class', 'srh'],[
         $td(['class', 'tbCol1'], [T('TB3SL',TB3O.shN) + " - " + TB3O.version,(TB3O.sn ? [$e("br"),TB3O.sn] : "")]),
         $td(['class', 'tbCol2'], uiCreateTool("bSave", T('SAVE'),  TB3SetupSave)),
         $td(['class', 'tbCol3'], uiCreateTool_Close(uiHideModalWindow))
      ]);
      return aRow;
   }

   //-------------------------------------------------------------
   function onShowHideSubsection(e) 
   {
      var bVisible = e.target.checked;
      var aSubRow = e.target.parentNode.parentNode.nextSibling;
      while ( aSubRow && !hasClass(aSubRow,"srst") )
      {
         aSubRow.style.display = bVisible ? '' : 'none';
         aSubRow = aSubRow.nextSibling;
      }
   }

   //-------------------------------------------------------------
   function getSettingValue(sn) 
   {
      var aValue = "";

      if ( typeof(sn) === "number" )
      { 
         if ( sn !== -1 )
         {
            aValue = TB3O.O[sn];
         }
      } 
      else if ( typeof(sn) === "string" )
      {
         aValue = loadPersistentUserValue(sn, "");
      }
      return aValue;
   }

   //-------------------------------------------------------------
   function setSettingValue(name, value)
   {
      var aName = parseInt10(name);
      if ( !isNaN(aName) ) 
      {
         TB3O.O[aName] = value;
      }
      else if ( typeof(name) === "string" )
      {
         savePersistentUserValue(name, value);
      }
   }

   //-------------------------------------------------------------
   function createSettingControl(rd) 
   {
      var pS;

      var sVal = getSettingValue(rd[4]);

      switch ( rd[2] )
      {
         case "CB":
            pS = $i([['type', 'CHECKBOX']]);
            if ( sVal === "1" ) { $at(pS, [['checked', true]]); }
            break;

         case "T":
            pS = $i([['type','TEXT'], IF_TB4({{['class','text'],}}) ['value',sVal]]);
            break;

         case "SEL":
            pS = $e('SELECT');
            for ( j = 0; j < rd[3].length; j++ ) 
            {
               pS.options.add(new Option(rd[3][j], j, false, false),null);
            }
            if ( !isIntValid(parseInt10(sVal)) ) { sVal = "0"; }
            pS.selected = sVal;
            pS.value = parseInt10(sVal);
            break;

         case "SP":
            pS = $span(TB3O.U[rd[4]]);
            break;
      }
      pS.name = String(rd[4]).toLowerCase();

      return pS;
   }

   //-------------------------------------------------------------
   function createHelpTooltip(aT) 
   {
      return $e("p",['style','margin:5px; font-size:8pt'], T(aT.toUpperCase()));
   }

   //-------------------------------------------------------------
   function TB3SetupSave()
   {
      var i;
      var crtValue;
      var setupTb = $g("TB3S");
      var aS = setupTb.getElementsByTagName("SELECT");
      for ( i = 0; i < aS.length; i++ )
      {
         crtValue = aS[i].value;
         setSettingValue(aS[i].name, crtValue === "" ? "0" : crtValue);
      }

      aS = setupTb.getElementsByTagName("INPUT");
      for ( i = 0; i < aS.length; i++)
      {
         if ( aS[i].type === 'checkbox' ) { crtValue = (aS[i].checked ? '1' : '0'); }
         else { crtValue = aS[i].value; }
         setSettingValue(aS[i].name, crtValue);
      }
      
      saveTBOptions();

      var nbnotes = $g('noteblockcontent');
      if ( nbnotes ) { savePersistentUserValue("notas", nbnotes.value); }

      alert(T('SAVED') + ".");
      window.location.reload(false);
   }
}
