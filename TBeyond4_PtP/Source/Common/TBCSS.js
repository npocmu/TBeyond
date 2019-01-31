//////////////////////////////////////////////////////////////////////
function setTBStyles()
{
   __ENTER__
   var acss = '';
   var blink_style = 'animation: blink 1s steps(1) infinite;';

   //TBeyond specific style declarations
   acss +=
   // Common classes defaults
   '.tbDist {color:blue;}' +
   '.tbCenter {text-align:center !important;}' +

   //
   'table.tb3tb	{width:100%; border-collapse:collapse; border:1px solid silver; font-size:8pt; text-align:center; background-color:' + TB3O.DFc[1] + '; padding:2px; margin:1px;}' +
   'table.tb3tb tr, table.tb3tb td {border:1px solid silver;}' +

   'table.tb3tbnb	{border-collapse:collapse; border:0px none white; font-size:8pt; text-align:center; padding:2px; margin:1px; background-color:' + TB3O.DFc[1] + ';}' +
   'table.tb3tbnb tr, table.tb3tbnb td, table.tb3tbnb td.tb3cnb {border:0px none white;}' +
   'tr.tb3rh		{background-color:#ECECEC; text-align:center; border:1px solid silver;}' +
   'tr.tb3rhb		{background-color:#ECECEC; text-align:center; border:1px solid silver; font-weight:bold;}' +
   'tr.tb3rhnb		{background-color:#ECECEC; text-align:center;}' +
   'tr.tb3r 		{border-collapse:collapse; border:1px solid silver; text-align:center;}' +
   'tr.tb3rnb		{border-collapse:collapse; border:0px none white; text-align:center;}' +
   'tr.cbgx td, td.cbgx, th.cbgx {background-color:#FFFFC0; border-collapse:collapse; border:1px solid silver; padding:2px; text-align:center;}' +
   'td.tb3chbb		{border:1px solid silver; background-color:#ECECEC; padding:2px; font-weight:bold; font-size:10pt;}' +
   'td.tb3chb		{border:1px solid silver; background-color:#ECECEC; padding:2px; font-weight:bold;}' +
   'td.tb3ch		{border:1px solid silver; background-color:#ECECEC; padding:2px; text-align:center;}' +
   'td.tb3chnb		{border:0px none white; background-color:#ECECEC; padding:2px; text-align:center;}' +
   'td.tb3c		{border:1px solid silver; background-color:transparent; padding:2px; border-collapse:collapse;}' +
   'td.tb3cnb		{border:0px none transparent; background-color:transparent; text-align:center; padding:2px;}' +
   'td.tb3cbt		{border-top:1px solid silver; font-size:8pt; color:#000000; text-align:center;}' +
   'td.tb3name          {text-align:' + docDir[0] +';}' +

   'div.CNBT {font-family:Arial, Helvetica, Verdana, sans-serif; font-size:9pt; font-weight:bold; color:' + TBCN_COL_TXT + ';line-height:15px;text-align:center;' + 
            'border:1px solid black; -moz-border-radius:2em; border-radius:2em; width:21px; height:18px; padding-top:3px;}' +
   'div.CN  {border:1px solid #CCCCCC; -moz-border-radius:2em; border-radius:2em;}' +

   // Script about info
   '#tbver {z-index:10; position:absolute; ' + docDir[0] + ':5px; top:3px; width:180px;' + 
   '        font-weight:normal; font-size:11px; color:#FFFFFF; direction:ltr;}' +
   '#tbver .tbAbout {text-shadow: black 1px 1px 0, black -1px -1px 0, black -1px 1px 0, black 1px -1px 0;}' +
   '#tbver a {font-weight:bold; color:#00FF00;}' +
   '#tbver .tbExTime, #tbver .tbTVer {display:block; color: black; text-shadow: white 0 0 2px;}' +
   '#tbver .tbExTime {margin-top: 5px;}' +

   // buildings upgrade table
   'table.tbUpgTable {width:682px; table-layout: fixed; border-collapse:collapse; border:1px solid silver; background-color:' + TB3O.DFc[1] + '; font-size:8pt; padding:2px; text-align:' + docDir[0] + '; empty-cells:show; line-height:16px;}' +
   'table.tbUpgTable table {background-color:transparent; border-collapse:collapse; border:0px none transparent; font-size:8pt; padding:2px; margin:1px; text-align:' + docDir[1] + '; vertical-align:top;}' +
   'table.tbUpgTable tr {background-color:transparent; border-collapse:collapse; border:0px none transparent; font-size:8pt; padding:2px; margin:1px; text-align:' + docDir[1] + '; vertical-align:top;}' +
   'table.tbUpgTable td {background-color:transparent; border:0px none transparent; font-size:8pt; text-align:' + docDir[1] + '; padding:2px; vertical-align:top;}' +
   'table.tbUpgTable td.tbCenter {vertical-align:middle;}' +
   'table.tbUpgTable td.tb3uthc {background-color:#ECECEC; border:1px solid silver; vertical-align:middle; font-weight:normal; text-align:center; width:25%; height:18px;}' +
   'table.tbUpgTable td.tb3utbc {background-color:transparent; border:1px solid silver; margin:0px; text-align:center; vertical-align:top; width:25%; height:18px;}' +
   'table.tbUpgTable a {font-size:8pt; font-weight:bold;}' +
   'table.tbUpgTable div.tbImgCnt {text-align:' + docDir[0] + ';}' +
   'table.tbUpgTable div.CNBT {position:relative; top:-31px;' + docDir[0] + ':9px; z-index:100;}' +
   'table.tbUpgTable a < div {width:0%;}' +
   IF_TB4({{'table#tb_bldupg a img.building {margin-left:-10px;width:110px;}' +}})

   'div#resupgTT table#tb_resupg,' +
   'div#bupgTT   table#tb_bldupg {margin-top:1px;}' +

IF_TB3({{
   'div#resDiv {position:absolute; z-index:26;}' +
   'div#resDiv div.CNBT {position:absolute; cursor:pointer; z-index:26;}' +
}})

   // time and resources needed for upgrade
   'table.rNt {background-color:transparent; border-collapse:collapse; border:0px none transparent; padding:2px; vertical-align:top;}' +
   'table.tbUpgTable table.rNt {margin:1px;}' +
   'table.rNt * {font-size:8pt !important; text-align:' + docDir[1] + ' !important;}' +
   'table.rNt .tbMany * {font-size:TB_MANY_FONT_SIZE !important;}' +
   'table.rNt tr, table.rNt th, table.rNt td {background-color:transparent; padding:2px; vertical-align:top;}' +
   'table.rNt tr {border-collapse:collapse; border:0px none transparent; margin:1px;}' +
   'table.rNt th {border-top:1px solid silver;}' +
   'table.tbUpgTable table.rNt tr:first-child th {border-top:0px;}' +
   'table.rNt td {border:0px none transparent;}' +
   'table.rNt td.tbCenter {vertical-align:middle;}' +
   'table.rNt .tbCC, table.rNt .tbCP {text-align:' + docDir[0] + ' !important;}' +
   'table.rNt .tbCC *, table.rNt .tbCP * {vertical-align:middle;}' +
   'table.rNt .tbCC {color:red;}' +
   'table.rNt .tbCP {color:blue;}' +
   'table.rNt .tbCapReached {color:red;' + blink_style + '}' +

   '.tbInject table.rNt {width:IIF_TB4(40,30)%;}' +

   //Table of neighbors on the map
   'table#mapTable {width:682px; border-collapse:collapse; border:1px solid silver; background-color:' + TB3O.DFc[1] + '; font-size:8pt; margin:0px; padding:0px; text-align:center; empty-cells:show; line-height:16px;}' +
   'table#mapTable thead td {border:1px solid silver; background-color:#ECECEC; font-size:9pt; font-weight:bold; text-align:center; padding:1px; cursor:default; vertical-align:middle;}' +
   'table#mapTable thead td.tb3mthcp {cursor:pointer;}' +
   'table#mapTable td {border:1px solid silver; background-color:transparent; padding:1px; margin:0px; font-size:8pt; font-weight:normal; text-align:center; vertical-align:middle;}' +
   'table#mapTable td.tbMyself {font-weight:bold; color:blue;}' +
   'table#mapTable td.tb3mtcp {padding-' + docDir[1] + ':10px; color:black; text-align:' + docDir[1] + ';}' +

   'div#updDiv {position:absolute; top:200px; ' + docDir[0] + ':120px; display:block; padding:16px 4px; z-index:50; clear:both; border:2px solid #C0C0C0; background-color:black; color:yellow; font-weight:bold;}' +

   'table#userbookmarks {border-collapse:collapse; border:0px none transparent; background-color:' + TB3O.DFc[1] + '; line-height:16px;}' +
   'table#userbookmarks tr {text-align:' + docDir[0] + '; vertical-align:middle; padding:0 0 0 2px; margin:0px; white-space:nowrap; border-collapse:collapse; border:0px none transparent;}' +	
   'table#userbookmarks td {border:0px none transparent; background-color:' + TB3O.DFc[1] + '; text-align:' + docDir[0] + '; font-size:13px; font-weight:normal; color:black; padding:2px; vertical-align:middle;}' +
   'table#userbookmarks td.noact {width:10px;}' +
   'table#userbookmarks td.act {width:10px; color:#FF8000;}' +
   'table#userbookmarks td.tb3sep hr {width:100%; color:darkgrey; margin:2px 0px;}' +
   'table#userbookmarks img {cursor:pointer;}' +
   'table#userbookmarks span {padding:0 0 0 4px;}' +

   'table#mkls {width:100%; border-collapse:collapse; border:1px solid silver; font-size:8pt; text-align:center; background-color:' + TB3O.DFc[1] + '; padding:2px; margin:1px; line-height:18px;}' +
   'table#mkls tr {background-color:transparent;}' +
   'table#mkls td {background-color:transparent; border:1px solid silver; font-weight:normal; font-size:8pt; color:black; text-align:' + docDir[1] + '; vertical-align:middle; padding:2px 3px 2px 3px; white-space:nowrap;}' +
   'table#mkls td.mklshh {background-color:#ECECEC; text-align:center; width:16%;}' +
   'table#mkls td.mklsc {text-align:center;}' +

   'table#br_table, table#br_table tr {background-color:transparent; border:1px solid #C2C2C2; text-align:center; padding:0px; margin:0px; border-collapse:collapse; width:100%;}' +
   'table#br_table td {background-color: transparent; border:1px solid #C2C2C2; font-size:8pt; text-align:' + docDir[1] + '; padding:2px 7px 2px 2px; margin:0px;}' +
   'table#br_table td.tb3cbrh1 {background-color:#F3F3F3; font-size:10pt; font-weight:bold; color:#000000; text-align:center;}' +
   'table#br_table td.tb3cbrh2 {background-color:#F3F3F3; font-size:10pt; font-weight:bold; color:#FF8000; text-align:center;}' +
   'table#br_table td.tb3cbrh3 {background-color:#F3F3F3; font-size:10pt; font-weight:bold; color:#71D000; text-align:center;}' +
   'table#br_table td.tb3cbrc {text-align:center;}' +
   'table#br_table td.tb3cbrb {font-weight:bold;}' +
   'table#br_table td.tb3cbrr {color:red;}' +
   'table#br_table td.tb3cbrg {color:darkgreen;}' +
   'table#br_table td.tb3cbrbr {font-weight:bold; color:red;}' +
   'table#br_table td.tb3cbrbg {font-weight:bold; color:darkgreen;}' +

   'div.tbTip {text-align:center; font-size:8pt; font-weight:normal; line-height:16px; padding:3px 5px;}' + 
   'div.tbTip hr {margin-top:10px; margin-bottom:5px;}' + 
   'div.tbTip .tbTitle {font-weight:bold; font-size:10pt;}' + 
   'div.tbTip + div.tbTip {margin-top:5px;}' + 
   'div.tbTip table {border-collapse:collapse; border:0px none transparent; padding:2px;' + 
               'font-weight:normal; font-size:8pt; text-align:' + docDir[1] + ';  background-color:transparent; empty-cells:show; line-height:16px; white-space:nowrap;}' +
   'div.tbTip table tr {border:0px none transparent;}' +
   'div.tbTip table td, div.tbTip table th {background-color:transparent; border:0px none transparent; font-weight:normal; font-size:8pt; text-align:' + docDir[1] + '; padding:2px; margin:0px; vertical-align:middle;}' +
   'div.tbTip table th {font-weight:bold; text-align:center;font-size:10pt;IF_TB3(background-image:none;)}' +
   'div.tbTip table td.tbIco {text-align:' + docDir[0] + '; width:40px;}' +
   'div.tbTip table td.tbVal {text-align:' + docDir[1] + ';}' +
   'div.tbTip .tbHeading {font-size:10pt !important; font-weight:bold; color:green;' + 
                         'border-bottom:1px solid grey; padding: 2px 0px; margin-bottom: 5px !important;}' +

   'div.tbTip div.tbMapInfo {margin:5px 0px 0px; padding:5px 10px; border-top:1px solid grey; border-bottom:1px solid grey;}' +
   'div.tbTip div.tbMapInfo th, div.tbTip div.tbMapInfo td {font-size:9pt;font-weight:normal;text-align:' + docDir[0] + ';}' +
   'div.tbTip div.tbMapInfo td {font-weight:bold;}' +
   'div.tbTip div.tbMapInfo td.tbMyself {color:blue;}' +

   'table.tbAttDefInfo thead th {font-weight:bold; text-align:center; font-size:8pt; background-color:transparent; background-image:none; }' +
   'table.tbAttDefInfo td.tbIco {text-align:' + docDir[0] + '; width:40px;}' +
   'table.tbAttDefInfo td.tbVal {text-align:' + docDir[1] + ';}' +
   'table.tbAttDefInfo tfoot td {text-align:' + docDir[0] + '; font-size:8pt;}' +

   'table.tbAttDefInfo2 {margin:0px;}' +
   'table.tbAttDefInfo2 tr {text-align:' + docDir[0] + ';}' +
   'table.tbAttDefInfo2 td span.tbVal {padding-' + docDir[0] + ':20px; padding-' + docDir[1] + ':3px;}' +
   'table.tbAttDefInfo2 td {padding:IIF_TB4(3,2)px 7px;}' +
   'table.tbAttDefInfo2 td img {float:' + docDir[0] + ';}' +
   'table.tbAttDefInfo2 td *, table.tbAttDefInfo2 th * {vertical-align:middle;}' +

   'table.tbDistInfo {border-collapse:collapse; empty-cells:show; white-space:nowrap;}' + 
   'table.tbDistInfo td {vertical-align:middle !important;}' + 
   'table.tbDistInfo * {vertical-align:middle;}' + 
   'table.tbDistInfo,' +
   'table.tbDistInfo tr,' +
   'table.tbDistInfo td {border:0px none transparent;background-color:transparent;text-align:' + docDir[1] + ';}' +
   'table.tbDistInfo td {padding:2px;}' +
   'table.tbDistInfo td[class*="tbMerc"] {color:blue;}' +
   'table.tbDistInfo td.tbCenter {padding: 2px 0px;}' +
   'table.tbDistInfo td.tbTravelT img {padding-' + docDir[1] + ':3px;}' + 
   'table.tbDistInfo td.tbArrivalT img {padding-' + docDir[1] + ':7px;}' +
   'table.tbDistInfo td.tbArrivalT {padding-' + docDir[0] + ':7px;}' +
   'table.tbDistInfo td.tbIco {text-align:' + docDir[0] + '; padding-' + docDir[0] + ':2px; padding-' + docDir[1] + ':10px;}' +
   'table.tbDistInfo td.tbIco.tbMercRet {text-align:center}' +

   IF_TB3({{'div#tb_unitsdest table.tbDistInfo td { font-size:11px; }' +}})

   'table#tb_distTT.tbDistInfo { padding:2px; margin:1px; font-weight:normal; font-size:8pt; line-height:16px; }' +
   'table#tb_distTT.tbDistInfo td {margin:0px; font-size:11px;}' +

   '#trading_edit + #tb_unitsdest { position: relative; float: '+docDir[0]+'; border: 1px solid silver; margin-'+docDir[0]+': 219px; margin-top: -60px; width: 283px; }' + 
   '#trading_edit + #tb_unitsdest tr.tbInfo td { font-size:11px; }' + 

   'table#tb_unitstime {margin-top:15px;width:' + ((TB3O.AvailableRaces.length === 3) ? '350':'550') + 'px;}' +
   'table#tb_unitstime.tbDistInfo tr.tbInfo td {margin:0px; font-size:11px;}' +
   'table#tb_unitstime.tbDistInfo td.tbEmpty {width:30px;}' +

   // !important rules required for non floating resource bar
   'table.tbResBar    {border-collapse:collapse; border:1px solid silver; background-color:' + TB3O.DFc[1] + 
                      '; width:auto; margin:0px;  white-space:nowrap;}' +
   'table.tbResBar *  {vertical-align:middle !important; line-height:13px !important; font-weight:normal; font-size:8pt !important;}' +
   'table.tbResBar tr {border-collapse:collapse; border:0px none transparent; padding:0px !important;}' +
   'table.tbResBar td {border:1px solid silver; padding:2px !important;}' +
   'table.tbResBar tr.tb3pph {border-top:2px solid silver; border-bottom:2px solid silver; background-color:#ECECEC;}' +
   'table.tbResBar td.tb3c {text-align: center !important; background-color:' + TB3O.DFc[1] + '; margin:1px; width:auto; }' +
   'table.tbResBar td.tb3c span  {text-align: right !important;}' +
   'table.tbResBar tr.tb3pph td.tb3c, table.tbResBar tr.tb3pph td.tb3ctotv {background-color:#ECECEC;}' +
   'table.tbResBar td.lr       {background-color:transparent;text-align:' + docDir[1] + ' !important; padding:1px !important;}' +
   'table.tbResBar td.tb3ttf   {text-align:' + docDir[1] + ' !important;padding:0px 1px !important;font-size:7pt !important;}' +
   'table.tbResBar td.tb3ttf.tbInfinity {font-size:12pt !important; text-align:center !important;}' +
   'table.tbResBar td.tb3cvn   {text-align:center !important; font-weight:bold; color:blue; background-color:#E9EEFC;}' +
   'table.tbResBar td.tb3chtot {text-align:center !important; font-weight:bold; border-' + docDir[0] + ':2px solid silver; background-color:#FFFFC0; }' +
   'table.tbResBar td.tb3ctot  {text-align:' + docDir[1] + ' !important;border-' + docDir[0] + ':2px solid silver; background-color:#FFFFC0; }' +
   'table.tbResBar td.tb3ctotv {text-align:' + docDir[1] + ' !important;}' +
   'table.tbResBar td.tb3cresbar {border:1px solid silver; background-color:' + TB3O.DFc[1] + '; padding:0px !important; height:17px;}' +
   'table.tbResBar td.tb3cresbar .rbrtb {width:100px !important;}' +
   'div#resbarTT table#tb_resbar {margin-top:1px;}' +

   'table.rbrtb {border-collapse:collapse; border:0px none transparent; background-color:transparent; float:left; height:100%; width:100% !important;}' +
   'table.rbrtb tr.rbrtbr,' + 
   'table.rbrtb td {border-collapse:collapse !important; border:0px none transparent !important; padding:0px !important;}' +

   'table#vl2table {border-collapse:collapse; border:0 none transparent; background-color:' + TB3O.DFc[1] + '; text-align:center; padding:2px; margin:0px; white-space:nowrap; vertical-align:middle;}' +
   'table#vl2table td {border:0 none transparent; background-color:transparent; text-align:' + docDir[0] + '; padding:2px; margin:0px; font-weight:normal; font-size:8pt; line-height:12px;}' +
   'table#vl2table td.tbIco {padding:0px 2px; text-align:' + docDir[0] + '; padding-' + docDir[1] + ':0px;}' +
   'table#vl2table td.tbIco img.tbiCP {background-position:-3px; width:10px;}' +
   'table#vl2table td.tbVal {text-align:' + docDir[1] + ';}' +
   'table#vl2table td.tbActive {background-color: #E7F0CA;}' +
   'table#vl2table td.tbMark0  {padding-' + docDir[0] + ': 6px; padding-' + docDir[1] + ': 4px;}' +
   'table#vl2table td.tbMark0.tbActive {color:#FF8000;}' +
   'table#vl2table td.tbEmpty {width:10px;}' +
   'table#vl2table td.tbCoord {direction:ltr;max-width:60px;}' +
   'table#vl2table td.tbName.tbActive a, table#vl2table td.tbCoord.tbActive a {color:black;}' +
   'table#vl2table td.tbName a, table#vl2table td.tbCoord a {color:dimgray;}' +
   'table#vl2table td.tbTool {padding:0px 1px;width:16px;max-width:16px;min-width:16px;text-align:center;}' +
   'table#vl2table td.tb3sep {border-top: 2px inset gray;}' +

   'form#searchform   {padding:10px; border:1px solid #C0C0C0;}' + 
   'form#searchform * {font-size:8pt; margin:2px;}' + 
   'form#searchform select#searchtype {padding:0px;}' + 
   'div#searchbarTT form#searchform {margin-top:18px;}' +

   'div.fldiv {position:absolute; display:block; padding:1px; z-index:50; clear:both; border:1px solid #C0C0C0; background-color:' + TB3O.DFc[1] + '; z-index:1000;}' +
   'div.dragdiv {text-align:center; font-weight:bold; height:18px; float:' + docDir[0] + '; cursor: pointer; border-bottom:1px solid #C0C0C0; background-color:#ECECEC; z-index:1000; vertical-align:middle;}' +
   'div.mmdiv {height:18px; float:' + docDir[0] + '; cursor: pointer; border-bottom:1px solid #C0C0C0; background-color:' + TB3O.DFc[1] + '; width:25px;}' +
   'div.closediv {height:18px; float:' + docDir[1] + '; cursor: pointer; border-bottom:1px solid #C0C0C0; background-color:' + TB3O.DFc[1] + '; width:25px;}' +

   'p.delacc {position:absolute; display:block; padding:4px; z-index:2; border:1px solid #00C000; background-color:#FEFFE3; width:130px; text-align:center; ' + docDir[1] + ':0px; top:0px;}' +
   'p.delacc span {color:orange;}' +

   'table#noteblock {border-collapse:collapse; border:0px none white; text-align:center; padding:2px; margin:1px; background-color:' + TB3O.DFc[1] + ';}' +
   'table#noteblock tr {background-color:transparent; border:0px none transparent;}' +
   'table#noteblock td {border:0px none transparent; background-color:transparent; text-align:center; padding:2px;}' +
   '#noteblockcontent {border:1px solid silver; padding:0px 2px 0px 2px; overflow:auto; font-size:10pt; white-space:nowrap;}' +

   'table#sell td.tbOfferG {background-color:#D0F0F0;}' +
   'table#sell td.tbOption {height:20px;}' +
   'table#sell td.tra      input[type="text"]{width:20px !important; box-sizing: content-box;}' +
   'table#sell td.tbOption input[type="text"]{width:30px; box-sizing: content-box;}' +
   'table#sell td.tbOption input[type="checkbox"]{margin-top:3px;' + (docDir[0] === 'right' ? 'margin-right:0px' : 'margin-right:3px') + '; margin-bottom:3px;' + (docDir[0] === 'right' ? 'margin-left:3px' : 'margin-left:0px') + '; padding:0px;}' +
   'table#sell td.tbOption span img {vertical-align:middle; padding-bottom:3px;}' +

   // sell offers
   'table#tb_offers {width:100%; border-collapse:collapse; border:1px solid silver; font-size:8pt; text-align:center; background-color:' + TB3O.DFc[1] + '; color:black; line-height:18px;}' +
   'table#tb_offers thead td   {background-color:#F3F3F3; text-align:center; width:13%;}' +
   'table#tb_offers thead *    {font-weight:bold}' +
   'table#tb_offers tr         {background-color:transparent;}' +
   'table#tb_offers tr.tbOfferG td {background-color:#D0F0F0;}' +
   'table#tb_offers td         {border:1px solid silver; text-align:' + docDir[1] + '; vertical-align:middle; IF_TB3(padding:2px 3px 2px 1px;) white-space:nowrap;}' +
   'table#tb_offers td.tbRatio {width:6%;}' +
   'table#tb_offers td.tbVal   {text-align:left;}' +
   'table#tb_offers td.soffc   {text-align:center;}' +
   'table#tb_offers td.tbSave  {text-align:center; padding-top:3px;}' +

   // send resource pad table
   '.tbSendRes td.tbInject {text-align:center;}' +
   '.tbSendRes td.tbInject, .tbSendRes td.tbInject * {vertical-align:middle !important;}' +
//   '.tbSendRes td.tbUseThem {padding:0px !important;}' +
   '.tbSendRes td.val input.text {width: 68px !important;  box-sizing: content-box;}' +
   '.tbSendRes td.tbUseThem input {padding:initial !important; margin: initial !important; width: initial !important;}' +
   '.tbSendRes td.tbTool    {padding-top:0px !important; padding-bottom:0px !important;}' +
   '.tbSendRes td.tbInject a.tbQCarry {IF_TB3(font-size:8pt;)white-space:nowrap;}' +
   '.tbSendRes td.tbInject a.tbMCap   {border-bottom:1px dotted;}' +

   '#tb_usetraders {width: 20px; box-sizing: content-box;}' +
   '#trading_edit span.tbUseTradersCtrl a * {vertical-align:middle;}' +
   '#trading_edit span.tbUseTradersCtrl {position: relative;top: -2px;}' +

   'h4 .tbRollDown {float:' + docDir[1] + ';}' +

   // market send (all underway tables)
   'table.traders .tbiDup {float:' + docDir[1] + ';}' +

   // market send (modify arrival tables)
   IF_TB3('table.tbIncomingMerc td.tbArrivalT {font-size:8pt;}' +)
   'table.tbIncomingMerc tbody.tbInject * {vertical-align:middle;}' +
   'table.tbIncomingMerc td.tbArrivalRes {padding:0px !important;}' +
   'table.tbIncomingMerc td.tbArrivalRes table {border-collapse:collapse; border-color:silver; height:100%;}' +
   'table.tbIncomingMerc td.tbArrivalRes table td {border-color:silver; width:20%; padding-' + docDir[1] + ':2px !important; font-size:8pt;}' +
   'table.tbIncomingMerc td.tbOver,' +
   'table.tbIncomingMerc td.tbUnder {padding:2px !important; padding-' + docDir[0] + ':27px !important; font-size:8pt;}' +
   'td.tbOver,' +
   'td.tbUnder {font-weight:bold; color:white;}' +
   'td.tbOver  {background-color:darkgreen;}' +
   'td.tbUnder {background-color:red;}' +
   'table.tbIncomingMerc td.tbCapReached {color:red;' + blink_style + '}' +

   // market send - cumulative arrivals table/arrivals progress table)
   'table#tb_arrm_progress, ' +
   'table#tb_arrm  {border-collapse:collapse; border:1px solid silver; margin-bottom:15px;}' +
   'table#tb_arrm th, table#tb_arrm_progress th,' +
   'table#tb_arrm td, table#tb_arrm_progress td {border:1px solid silver; text-align:center; padding:2px;}' +
   'table#tb_arrm th, table#tb_arrm_progress th {background-color:#F3F3F3; font-weight:bold; background-image:none; height:18px;}' +
   'table#tb_arrm td.cbgx {font-weight:bold;}' +
   'table#tb_arrm td.tbTotal {font-weight:bold; width:17%;}' +
   'table#tb_arrm td.tbTotal .tbiIn {margin-top:2px; margin-' + docDir[0] + ':5px; float:' + docDir[0] + ';}' +
   'table#tb_arrm td.tbTotal .tbiOut {margin-top:2px; margin-' + docDir[1] + ':5px; float:' + docDir[1] + ';}' +
   // padding = image margin + image width
   'table#tb_arrm td.tbTotal .tbIncoming {padding-' + docDir[1] + ':17px;}' +
   'table#tb_arrm td.tbTotal .tbOutcoming {padding-' + docDir[0] + ':17px;}' +
   'table#tb_arrm .tbTimeout.tbOver.tbSoon,' +
   'table#tb_arrm .tbTimeout.tbUnder.tbSoon {color:white;' + blink_style + '}' +
   'table#tb_arrm .tbTimeout.tbOver.tbDecrease,' +
   'table#tb_arrm .tbTimeout.tbUnder.tbDecrease {color:white;}' +
   'table#tb_arrm .tbTimeout.tbOver.tbCapReached,' +
   'table#tb_arrm .tbTimeout.tbUnder.tbCapReached {color:yellow;}' +
   'table#tb_arrm .tbRollDown {float:' + docDir[1] + ';margin-left:-13px;}' +

   // market send  - arrivals resource progress table
   'table#tb_arrm_progress td {line-height:14px; font-size:8pt; padding:2px 4px; text-align:' + docDir[1] +';}' +
   'table#tb_arrm_progress td * {vertical-align:middle;}' +
   'table#tb_arrm_progress td.tbTravelT  {max-width:60px;}' +
   'table#tb_arrm_progress td.tbEvent img {margin:0px 4px;}' +
   'table#tb_arrm_progress td.tbEvent img.tbiMerc {margin:0px;}' +
   'table#tb_arrm_progress td.tbEvent.tbOver, table#tb_arrm_progress td.tbEvent.tbUnder {text-align:center; background-color:' + TB3O.DFc[1] + ';}' +
   'table#tb_arrm_progress td.tbEvent.tbIncoming {text-align:' + docDir[0] +';}' +
   'table#tb_arrm_progress td.tbEvent.tbOutcoming {text-align:' + docDir[1] +';}' +

   'table#tb_arrm_progress td.tbFillPerc {max-width:30px; padding:2px;}' +
   'table#tb_arrm_progress td.tbCapReached {color:red;' + blink_style + '}' +
   'table#tb_arrm_progress td.tbResourceMeter {padding:0px; min-width:100px;height:18px;}' +
   'table#tb_arrm_progress td.tbResourceMeter .tbMeterTextContainer {padding-top:2px}' +
   'table#tb_arrm_progress th.tbTitle {font-weight:bold; padding: 0px; background-color:#F5FFF0;}' +

   // resource production buildings - hint table
   'table.tbBuildHint {margin-bottom: 10px; position:relative; z-index:10;}' +
   'table.tbBuildHint th {background-color:#F3F3F3; color: black;}' +
   'table.tbBuildHint th.tbTotal {width:20%;}' +
   'table.tbBuildHint th.tbProd  {width:30%;}' +
   'table.tbBuildHint th.tbTimeSpan {width:35%;}' +
   'table.tbBuildHint td {text-align:center;}' +

   // training quick bar
   IF_TB4({{
   'table.tbTrainContract {width:100%; border-collapse:collapse; border:0px none white;}' +
   'table.tbTrainContract td.tbOrg {white-space:nowrap;}' +
   'table.tbTrainContract td.tbContainer {width:100%;}' +
   'table.tbTrainQuick {display:inline-table; vertical-align:bottom; margin-bottom: 2px; width:100%; height:16px; border-collapse:collapse; border:0px none white;}' +
   'table.tbTrainQuick td {width:17%; text-align:center;}' +
   'table.tbTrainQuick td.tbSep  {width:3%; font-weight: bold;}' +
   'table.tbTrainQuick td.tbQDel {width:6%;}' +
   'table.tbTrainQuick td.tbQAdd {padding:0px 2px;}' +
   'table.tbTrainQuick td.tbQSet {width:20%;padding:0px 1px;}' +
   'table.tbTrainQuick td.tbQMax .a {font-weight:bold;}' +
   'table.tbTrainQuick .CN.a {font-weight:normal; font-size:11px; color:darkgreen; text-shadow: 0px 0px 2px white;}' +
   'table.tbTrainQuick .CN.a:hover {text-shadow: 0px 0px 2px lightgreen;}' +
   }})

   // training building summary
   'table.tbTrainingSummary td.desc img {margin-' + docDir[1] + ':5px; position:relative; top:3px;}' +
   'table.tbTrainingSummary td img { margin-' + docDir[1] + ':4px;}' +
   'table.tbTrainingSummary td.avg {width:10%;}' +
   'table.tbTrainingSummary td.dur {width:20%;}' +
   'table.tbTrainingSummary td.fin {width:25%;}' +
   'table.tbTrainingSummary tr.cbgx td {border:0px;font-weight:bold;}' +
   IF_TB3({{
   'table.tbTrainingSummary td {padding: 2px 7px;}' +
   'table.tbTrainingSummary td.desc img {margin-' + docDir[0] + ':5px;}' +
   }})

   // setup dialog
   'table#TB3S {width:801px; border-collapse:collapse; border:1px solid silver; IF_TB3(font-size:8pt; )text-align:center; background-color:' + TB3O.DFc[1] + '; padding:2px; }' +
   'table#TB3S tr.srh {background-color:#ECECEC; text-align:center; border:1px solid silver;}' +
   'table#TB3S td {border:1px solid silver; background-color:transparent; padding:2px; border-collapse:collapse; text-align:' + docDir[0] + ';IF_TB3(font-size:8pt;)}' +
   'table#TB3S .srst td {padding-' + docDir[0] + ':18px; background-color:#ECECEC; font-size:IIF_TB4(110%,9pt); font-weight:bold; color:darkblue; IF_TB4(line-height:19px;)}' +
   'table#TB3S .srst input {position: absolute;' + docDir[0] + ':0px;}' +
   'table#TB3S td.srsc1 {padding-' + docDir[0] + ':2em;}' +
   'table#TB3S td.srsc2 {padding-left:4px; padding-right:4px;}' +
   'table#TB3S td.tbCol1 {background-color:#ECECEC; text-align:center; width:60%; font-weight:bold; font-size:120%;}' +
   'table#TB3S td.tbCol2 {background-color:#ECECEC; text-align:center; width:20%;}' +
   'table#TB3S td.tbCol3 {background-color:#ECECEC; text-align:center; width:20%;}' +
   IF_TB3({{'table#TB3S select, table#TB3S input {font-size:8pt;}' +}})
   'table#TB3S span {font-weight: bold; IF_TB3(font-size:8pt;)}' +
   'table#TB3S input[name="alfl"],' +
   'table#TB3S input[name="marcadores"],' +
   'table#TB3S input[name="ventas"] {width:98%;}' +

   'table#cptable {width:100%; border-collapse:collapse; border:1px solid silver; padding:2px; margin:1px;}' +
   'table#cptable * {text-align:center !important;  font-size:8pt !important;}' +
   'table#cptable tr, table#cptable td {border-collapse:collapse; border:1px solid silver; padding:2px; }' +
   'table#cptable thead td {background-color:#ECECEC; font-weight:bold;}' +
   'table#cptable td.CG {background-color:#C8FFC8;}' +
   'table#cptable td.CR {background-color:#FFE1E1;}' +

   'table#mbuyf {width:100%; border-collapse:collapse; border:1px solid silver; font-size:8pt; text-align:center; background-color:' + TB3O.DFc[1] + '; padding:2px; margin:1px;}' +
   'table#mbuyf tr {border-collapse:collapse; border:1px solid silver; text-align:center;}' +
   'table#mbuyf td {border:1px solid silver; background-color:transparent; padding:2px; border-collapse:collapse;}' +
   'table#mbuyf td.sf {background-color:#FFE4B5;}' +

   'table.allvtroops, table.allvtroops tr td {border-collapse:collapse; border:1px solid silver; text-align:center; padding:2px;}' +
   'table.allvtroops tr th {border-collapse:collapse; border:1px solid silver; text-align:' + docDir[0] + '; padding:2px 7px; width:20%;}' +

   // send troops menu
   'table.tbSendTroopsMenu {width:auto;}' +
   'table.tbSendTroopsMenu td {text-align:' + docDir[0] + '; font-size:8pt;}' +
   'table.tbSendTroopsMenu td * {vertical-align:middle;}' +
   'table.tbSendTroopsMenu span.none {font-weight: bold;}' +
   'input#tb_selectscoutnumber {width:30px;}' + 
   'input[id^="tb_faketroop"] {margin-' + docDir[1] + ':10px;}' +

   // send troops stat
   'table#tb_sendtroopstat {IIF_TB4(margin-bottom,margin-top):15px;}' +
   'table#tb_traintroopstat {margin-top:15px;}' +

   // last attack table
   'table#stla {width:100%; border-collapse:collapse; border:1px solid silver; font-weight:normal; font-size:8pt; color:black; text-align:center; background-color:' + TB3O.DFc[1] + '; padding:0px; margin:0px; line-height:18px;}' +
   'table#stla {IIF_TB4(margin-bottom,margin-top):15px;}' +
   'table#stla tr {background-color:transparent;}' +
   'table#stla td {border:1px solid silver; font-size:8pt; text-align:' + docDir[1] + '; vertical-align:middle; padding:1px 2px 1px 2px; white-space:nowrap;}' +
   'table#stla td.stlahh {background-color:#ECECEC; text-align:center; width:5%;}' +
   'table#stla td.stlahh1 {background-color:#ECECEC; text-align:center; width:10%;}' +
   'table#stla td.stlahh2 {background-color:#ECECEC; text-align:center;}' +
   'table#stla td.stlac {background-color:transparent; text-align:center;}' +

   // dismiss troops table
   'table.troop_details a.tbTool {text-align:center;}' +
   'table.troop_details .tbUpDown {float:' + docDir[1] + ';margin-' + docDir[0] + ':2px;}' +
   'table.troop_details tr.tbInject td {padding-top:IIF_TB4(3,2)px; padding-bottom:IIF_TB4(3,2)px;}' +
   'table.troop_details tr.tbInject a {font-size:8pt;vertical-align:middle;}' +
   'table.troop_details tr.tbInject a.tbMany {font-size:TB_MANY_FONT_SIZE;}' +
   'table.tbAttDefInfo2 + table.tbAttDefInfo2 {margin-top:15px; IF_TB4(margin-bottom:15px;)}' +
   'table#tb_dismisstroopsdist {width:50%; IF_TB4(margin-top:15px;)}' + 

   'table#dorf3table    {width:100%; border-collapse:collapse; border:1px solid silver; text-align:center; font-size:10pt; background-color:' + TB3O.DFc[1] + '; padding:2px; margin:0px; }' +
   'table#dorf3table tr {margin:1px;}' +
   'table#dorf3table td {border:1px solid silver;}' +
   'table#dorf3table tr.tb3sep 	{border-top: 2px inset gray;}' +
   'table#dorf3table th *    {vertical-align: middle; color:black;}' +
   'table#dorf3table td input {vertical-align: middle;}' +
   'table#dorf3table td.tb3name {width:150px; text-align:' + docDir[0] +'; white-space: nowrap; overflow:hidden;text-overflow:ellipsis;}' +
   'table#dorf3table td.tbMerc  {text-align:center;}' +
   'table#dorf3table td.tbInfinity {font-size:14pt;}' +
   'table#dorf3table td.tbEmpty {height:2px;}' +
   'table#dorf3table tr.tbTotal td {font-weight:bold;}' +
   'table#dorf3table tr.tbTotal td.tbTitle {text-align:center;}' +
   'table#dorf3table td.tbWait {padding:0px;}' +
   'table#dorf3table.tb3d3_2 td.tb3name {max-width:110px;}' +
   'table#dorf3table.tb3d3_2 td.tb3cnb  {font-size:8pt; text-align:' + docDir[1] + ';}' +
   'table#dorf3table.tb3d3_2 td.tbMerc  {font-size:8pt;}' +
   'table#dorf3table.tb3d3_3 td.tb3name {max-width:150px;}' +
   'table#dorf3table.tb3d3_5 td.tb3name {max-width:110px;}' +
   'table#dorf3table.tb3d3_5 td.tb3cnb  {font-size:8pt; color:black; }' +
   'table#dorf3table.tb3d3_5 td.tb3none {color:lightgrey;}' +
   /*
table tbody tr.hover:hover th, table tbody tr.hover:hover td {
    background-color: #FCE6C4;
}    */


   'tr#aRselecttraintroops {border-collapse:collapse; background-color:' + TB3O.DFc[1] + ';}' +
   'tr#aRselecttraintroops td {border:0px none transparent; background-color:transparent; text-align:center; padding:0px 2px 0px 7px;}' +

   // search reports
   '#tb_searchreports {margin-top:14px;}' + 
   '#tb_searchreports * {vertical-align:middle;}' +
   '#tb_searchreports img {padding-left:2px; padding-right:2px}' +

   // delete reports
   'table#tb_delreptable {width:100%; border-collapse:collapse; border:1px solid silver; font-size:8pt; text-align:center; background-color:' + TB3O.DFc[1] + '; padding:2px; margin:14px 0px 0px 0px;}' +
   'table#tb_delreptable tr {border:1px solid silver;}' +
   'table#tb_delreptable td {border:1px solid silver; padding:2px; text-align:center;}' +
   'table#tb_delreptable tr.r1 {background-color:#ECECEC;  border:1px solid silver;}' +
   'table#tb_delreptable tr.r1 .tbTool img {float:' + docDir[1] + '}' +
   'table#tb_delreptable tr.r2 td {IF_TB3(font-weight:bold; font-size:10pt;)}' +
   'table#tb_delreptable tr.r2 img {padding-left:2px; padding-right:2px}' +

   // Troop Info tooltip
   'table#tb_TITT th {text-align:center; font-size:8pt; font-weight:bold;}' +
   'table#tb_TITT th img {vertical-align:middle;}' +
   'table#tb_TITT td {padding: 2px; font-size: 8pt; text-align:' + docDir[1] + '}' +
   'table#tb_TITT td.ico {text-align:' + docDir[0] + ';}' +
   'table#tb_TITT td.tb3r1 {border-bottom:1px silver solid;}' +
   'table#tb_TITT td.tb3c1,' +
   'table#tb_TITT td.tb3c2 {border-' + docDir[1] + ':1px silver solid;}' +
   'table.tbCost thead th {font-size:8pt;}' +
   'table.tbCost td.tbIco {width:22px;}' +
   'table.tbCost tr.tbTotal {border-top:1px silver solid;}' +
   'table.tbCost tr.tbTotal td {font-weight:bold;}' +

   // Merchants Info tooltip
   'table#tb_MITT img.tbPrefix {padding-' + docDir[1] + ':5px;}' +
   'table#tb_MITT td.tbTitle {text-align:center;}' +
   'table#tb_MITT td.tbTotal {padding-' + docDir[0] + ':15px;}' +

   // Village bulding info tooltip
   'table#tb_BiPTM    {width:100px; border-collapse:collapse; border:1px solid silver; margin:0px; background-color:' + TB3O.DFc[1] + ';}' +
   'table#tb_BiPTM tr {border:0px none transparent;}' +
   'table#tb_BiPTM td {border:1px solid silver; font-size:8pt; padding:4px; white-space:nowrap; text-align:' + docDir[0] + ';}' +
   'table#tb_BiPTM td.tbTitle {text-align:center;}' +
   'table#tb_BiPTM td img {vertical-align:middle; margin-bottom:2px; margin-' + docDir[1] + ':4px;}' +

   'a.tbTool img {margin:0px !important;}' +
   'div.tbToolbar {display:inline;}' +

   'div.tbWait {width: 100%; text-align:center;}' + 

   '.tbRollDown {cursor:pointer; width: 11px; height:11px; line-height:11px; font-size:8px; text-align:center; display: inline-block; color:#787878; background-color:#F0F0F0; border:1px solid #71D000; -moz-border-radius:2em; border-radius:2em;}' + 
   '.tbRollDown:hover {border-color:#787878; }' + 

   '.tbUpDown {height:17px; width:8px; position:relative; display:inline;}' +
   '.tbUpDown img {position:absolute !important; cursor:pointer; ' + docDir[0] + ':0px !important; margin:0px !important; padding: 0px !important;}' +
   '.tbUpDown img.tbiUp   {top:0px !important;}' +
   '.tbUpDown img.tbiDown {top:9px !important;}' +

   '.tbUpDown.tbBuiltin {width:9px;}' +
   '.tbUpDown.tbBuiltin {top:-9px;vertical-align:middle;}' +
   '.tbUpDown.tbBuiltin img {border-color:IIF_TB4(#CCCCCC,#71D000); border-width:1px; border-' + docDir[0] + '-style:solid;}' +
   '.tbUpDown.tbBuiltin img.tbiDown {top:8px !important; border-top-style:solid;}' +

   '.control {box-sizing: content-box; background-color: transparent; display: inline-block;' +
   '    position:absolute !important; overflow: hidden; margin: 0; border-' + docDir[0] + ': solid 1px; font-family: Courier, monospace;}' +

   '.control .up, .control .down  { position:absolute !important;  background-color: inherit; ' +
   '   width: 100%; cursor: pointer;  margin:0px !important;  padding: 0px !important; text-align: center !important;' +
   '   vertical-align: middle; display: table-cell;' +
   '   user-select: none; -moz-user-select: none; -ms-user-select: none; -webkit-user-select: none; }'+

   '.control .down  { border-top: solid 1px; }' +  

   '.tbMeter {width: 100%; height: 100%; display: inline-block; position: relative; }' +
   '.tbMeterFill, tbMeterEmpty {display: inline-block; height: 100%;}' +
   '.tbMeterFill {float: left;}' +
   '.tbMeterEmpty {float: right;}' +
   '.tbMeterForeground {position: absolute; width: 100%; height: 100%;}' +
   '.tbMeterTextContainer {text-align:center; vertical-align:middle;}' +
   '.tbMeterText {font-weight:bold; color: white; text-shadow: black 1px 1px 0, black -1px -1px 0, black -1px 1px 0, black 1px -1px 0;}' +
   	
   'div#tb_tooltip {position:absolute; display:none; padding:2px; z-index:9000; border:1px solid #00C000; background-color:#FFFFCC; -moz-border-radius:5px; border-radius:5px;}' +

   'div.npc-general {margin:3px 0 0; font-size:7pt; float:none;} ' +
   'span.npc-red {color:#DD0000;} ' +
   'span.npc-green {color:#009900;}' +

   'td.desc, td.desc div, td.desc span {font-size:8pt;}' +

   'a.tbInject img {display:inline; border:0px none white; }' +
   'a.tbInject.tbExtStat img {margin:0px 2px -2px 3px;}' +
   'a.tbInject.tbExtMap img {margin:0px 2px -1px 3px;}' +
   'a.tbInject.tbMail img {margin:3px 0px 1px 3px;}' +
   'a.tbInject.tbAttDef img {vertical-align: middle;}' +
   'a.tbInject.tbRes img {vertical-align: middle;}' +

M4_ECHO_OFF
//////////////////////////////////////////////////////////////////////
"Open report/message in popup icon" test cases:
- message list - must be displayed in extreme left/right position
- report list  - must be displayed in extreme left/right position
- alliance reports  - must be displayed in extreme left/right position
- raid list (gold club) - must be displayed in extreme left/right position
- message body - must be displayed inline (following link to report)
- user links - must be displayed inline (following link to report)
//////////////////////////////////////////////////////////////////////
M4_ECHO_ON

   'a.tbInject.tbMsgPop {line-height: inherit; height: inherit; position:relative; float:' + docDir[1] + ' !important; margin:0px !important;}' +
   '#userbookmarks a.tbInject.tbMsgPop {position: static; float:none !important; padding-' + docDir[0] + ':5px; vertical-align: middle;}' + 
   IF_TB3({{'.message a.tbInject.tbMsgPop {position: static; float:none !important; padding-' + docDir[0] + ':5px;}' +}})

   '.tbTimeout {color:darkgreen;}' +
   '.tbTimeout.tbDecrease {color:red;}' +
   '.tbTimeout.tbSoon     {color:red;}' +
   '.tbTimeout.tbCapReached {color:red;' + blink_style + '}' +

   '.tbFillPerc.tbSoon,' +
   '.tbFillPerc.tbCapReached {animation:' + blink_style + '}' +

   '.tbSelected * {background-color:#ECECEC !important;}' +

   'td.ratio_l  {IF_TB3(font-size:8pt;) background-color:#FFE1E1; color:red;}' +
   'td.ratio_e  {IF_TB3(font-size:8pt;)}' +
   'td.ratio_g  {IF_TB3(font-size:8pt;) background-color:#C8FFC8; color:darkgreen;}' +

   '.tbMany  {font-size:TB_MANY_FONT_SIZE !important;}' +

   '.tbCount.tbNew {color:green;}' +

   'div.tbBullet {display: inline-block; border:1px solid black; -moz-border-radius:2em; border-radius:2em; margin:0 2px; }' +
   'div.tbSmall {width:8px; height:8px; margin:2px;}' +
   'div.tbGreat {width:12px; height:12px; }' +

   '.tbUpg   {background-color:' + TBCN_COL_NEUTRAL + ' !important;}' + 
   '.tbMax   {background-color:' + TBCN_COL_MAXLVL + ' !important;}' + 
   '.tbNoRes {background-color:' + TBCN_COL_NORES + ' !important;}' + 
   '.tbNPCUpg{background-color:' + TBCN_COL_NPCUPGRADE + ' !important;}' + 
   '.tbNoCap {background-color:' + TBCN_COL_NOCAP + ' !important;}' +
   (( TBO_SHOW_BLDBLINK === '1' ) ?  '.tbUpgNow {' + blink_style + '}' : '') +

   '@keyframes blink { 50% { color: transparent; } }' + 

   //icons styles
   IF_TB3('img.r0 {width:18px; height:12px; background-image: url(' + image['r0'] + ');}' +)
   'img.r4 {width:20px; height:12px; background-image: url(' + image['r4'] + ');}' +
   'img.r5 {width:20px; height:12px; background-image: url(' + image['r5'] + ');}' +
   'img.tbiCoords, img.tbiIn  {width:12px; height:12px; background-image: url(' + image['incom' + docDir[0].substr(0, 1)] + ');}' +
   'img.tbiDist,   img.tbiOut {width:12px; height:12px; background-image: url(' + image['dist' + docDir[0].substr(0, 1)] + ');}' +
   'img.tbiCP {width:18px; height:12px; background-image: url(' + image['cp'] + ');}' +
   'img.tbiHourglass {width:18px; height:12px; background-image: url(' + image['hourglass'] + ');}' +
   'img.tbiCentermap {width:16px; height:16px; background-image: url(' + image['centermap'] + ');}' +
   'img.tbiMerc {width:10px; height:12px; background-image: url(' + image['merchant'] + ');}' +
   'img.tbiIV   {width:12px; height:12px; background-image: url(' + image['iv'] + ');}' +
   'img.tbiOV   {width:12px; height:12px; background-image: url(' + image['ov'] + ');}' +
   'img.tbiAttacks  {width:10px; height:10px; background-image: url(' + image['attacks'] + ');}' +
   'img.tbiInfo     {width:12px; height:12px; background-image: url(' + image['info'] + ');}' +
   'img.tbiDup      {width:16px; height:16px; background-image: url(' + image['dup'] + ');}' +
   'img.tbiOptions  {width:16px; height:16px; background-image: url(' + image['editbookmark'] + ');}' +
   'img.tbiUp,   img.tbiArrowUp   {background-image: url(' + image['aup'] + ');}' +
   'img.tbiDown, img.tbiArrowDown {background-image: url(' + image['adn'] + ');}' +
   'img.tbiUp   {width:8px; height:8px; background-size:8px 8px;}' +
   'img.tbiDown {width:8px; height:8px; background-size:8px 8px;}' +
   'img.tbiArrowUp   {width:16px; height:16px;}' +
   'img.tbiArrowDown {width:16px; height:16px;}' 
   ;

   IF_TB3({{
   acss += '.reslevel {position:absolute; z-index:1; width:17px; height:12px;}' +
   '.rf1 {left: 93px; top:27px;}' +
   '.rf2 {left: 156px; top:26px;}' +
   '.rf3 {left: 216px; top:41px;}' +
   '.rf4 {left: 38px; top:59px;}' +
   '.rf5 {left: 130px; top:67px;}' +
   '.rf6 {left: 195px; top:87px;}' +
   '.rf7 {left: 253px; top:81px;}' +
   '.rf8 {left: 23px; top:111px;}' +
   '.rf9 {left: 74px; top:104px;}' +
   '.rf10 {left: 205px; top:136px;}' +
   '.rf11 {left: 260px; top:139px;}' +
   '.rf12 {left: 33px; top:165px;}' +
   '.rf13 {left: 84px; top:158px;}' +
   '.rf14 {left: 151px; top:178px;}' +
   '.rf15 {left: 230px; top:192px;}' +
   '.rf16 {left: 79px; top:211px;}' +
   '.rf17 {left: 132px; top:223px;}' +
   '.rf18 {left: 182px; top:227px;}'
   ;
   }})

   // map overlays
   acss += 
   'img.tbiMr1, img.tbiMr2, img.tbiMr3, img.tbiMr4 {height: 12px; width: 18px; background-image: url(' + image['mapinfo'] + ');}' +
   'img.tbiMr2 {background-position: -18px 0;}' +
   'img.tbiMr3 {background-position: -36px 0;}' +
   'img.tbiMr4 {background-position: -54px 0;}' +
   IIF_TB4({{
   'div[id^="tb_map_info_"] {position:relative;}' +
   'div[id^="tb_map_info_"] img {position:absolute;z-index:1;top:2px;left:2px;}' +
   'div[id^="tb_map_info_"] img.tbMo13 {top:2px;left:2px;z-index:1;}' +
   'div[id^="tb_map_info_"] img.tbMo23 {top:2px;left:12px;z-index:1;}' +
   'div[id^="tb_map_info_"] img.tbMo33 {top:10px;left:6px;z-index:2;}' +
   'div[id^="tb_map_info_"] img.tbMo22 {left:8px;z-index:1;}' 
   }},{{
   'div[id^="tb_map_info_"] img {position:absolute;z-index:8000;top:47px;left:12px;}' +
   'div[id^="tb_map_info_"] img.tbMo13 {top:42px;left:12px;z-index:8001;}' +
   'div[id^="tb_map_info_"] img.tbMo23 {top:42px;left:22px;z-index:8001;}' +
   'div[id^="tb_map_info_"] img.tbMo33 {top:50px;left:16px;z-index:8002;}' +
   'div[id^="tb_map_info_"] img.tbMo22 {left:18px;z-index:8001;}' 
   }});

   //big icons styles
   acss += 
   '.tb3BI img   {width:70px; height:67px;}' +
   '.tb3BI       {float:' + docDir[0] + ';background-repeat:no-repeat;}' +
   '.tb3BI       {margin-top:10px;z-index:100;}' +
   '.tb3BI:hover {background-position:bottom;}' +
   '#n7.tb3BI       {background-image: url(' + image['militargs'] + ');}' +
   '#n7.tb3BI:hover {background-image: url(' + image['militar'] + ');}' +
   '#n9.tb3BI       {background-image: url(' + image['setup'] + ');position:relative;float:' + docDir[1]+'}' +
   '#n9.tb3BI img   {height:52px;}' +
   '#n9.tb3BI:hover {background-position:0px -67px;}' +
   '#n10.tb3BI      {background-image: url(' + image['militar2gs'] + ');}' +
   '#n10.tb3BI:hover{background-image: url(' + image['militar2'] + ');}' +
   '#n11.tb3BI      {background-image: url(' + image['miscgs'] + ');}' +
   '#n11.tb3BI:hover{background-image: url(' + image['misc'] + ');}' +
   '#n12.tb3BI      {background-image: url(' + image['mercadogs'] + ');}' +
   '#n12.tb3BI:hover{background-image: url(' + image['mercado'] + ');}' 
   ;

   //------------------------------------------
   //Modified by Lux
   //------------------------------------------
   acss += 
   '.MsgPageOff {visibility:hidden; display:none; position:absolute; top:-100px; left:-100px;}' +
   '.OuterMsgPageOn {position:absolute; top:0px; left:0px; visibility:visible; width:100%; height:100%; background-color:#000000; z-index:1998; opacity:0.75;}' +
   '.InnerMsgPageOn {position: absolute; left:50%; top:0px; padding: 30px 0px; visibility:visible; opacity:1; z-index:1999;}';

   GM_addStyle(acss);

   __EXIT__
}

