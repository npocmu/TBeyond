function setTravianStyles()
{
   var acss = '';

   //Adjust Travian styles
   acss +=
   'div.build .gid16 #raidList .lastRaid {width:28%;}' +
   'div.build .gid16 #raidList .lastRaid .tbMsgPop {padding-' + docDir[0] + ':5px;}' +

   'div#content.reports table#overview:not(.reportSurround) td.sub div {padding-' + docDir[0] + ': 45px; padding-' + docDir[1] + ': 30px;}' + 
   'div#content.reports table#overview td.sub a.tbMsgPop {padding-' + docDir[0] + ':5px;}' +
   'div#content.messages table#overview td.subject a { margin-' + docDir[1] + ':15px; }' + 
   'div#content.messages table#overview a.tbInject.tbMsgPop img {height: auto; width: auto; vertical-align: middle; position: relative;top:0px; margin-top:-15px;top:-2px;}' +
   'div#content.messages div#message a.tbInject.tbMsgPop {position: static; float:none !important; padding-' + docDir[0] + ':5px;}' +

   'div#mr_tooltip  div#content {padding-left: 0px; padding-right: 0px; padding-top: 20px;}' +
   'div#mr_tooltip  div.paper {position: static;}' +
   (( TBO_SHOW_BLDBLINK === '1' ) ?  'div.village1 .underConstruction, div.village2 .underConstruction  {text-decoration: blink !important;}' : '') +

   'div.village1 div.level, div.village2 div#village_map div#levels div' +
                       '{font-family:Arial, Helvetica, Verdana, sans-serif; font-size:9pt; font-weight:bold; color:' + TBCN_COL_TXT + ';line-height:15px !important;' + 
                        'border:1px solid black; -moz-border-radius:2em; border-radius:2em; ' +
                        'padding-top:3px; text-align:center; position:absolute; width:21px; height:18px; cursor:pointer;' +
                        'background-image:none;margin-top:-2px;}'+
   //'div.village2 div#village_map div#levels div {background-image:none;}' +
   //'#navigation {margin-left:-15px !important;}' +
   (( TB3O.ServerInfo.version > 4.0 ) ? 'a#logo{left:73px;}' : '#navigation {margin-left:-70px !important;}') +

   'div#build.gid17 table#trading_edit td.res {padding: 0 0 0 7px;}' +
   'div#build.gid17 table#trading_edit td.res table.tbSendRes td {padding: 3px 3px;}' +
   'div#build.gid17 table#trading_edit td.res table.tbSendRes {width: ' + (( TB3O.ServerInfo.version > 4.0 )?342:340) +'px;  background-color: transparent; border: 1px solid silver;}' +
   'div#build.gid17 table#trading_edit td.res table.tbSendRes input {margin: -moz-initial;margin:initial;}' +
   'div#build.gid17 table#trading_edit td.res table.tbSendRes img {margin-right: auto;}' +

   'div#build.gid17 div.destination {float:' + docDir[1] + '; width:280px; margin-top:-75px;margin-bottom:15px;}' +
   '.traderCount img {vertical-align:middle;}' +

   'div#build div.action div.details input.text {width: 30px;}' +

   '#ingameManual {width:85px !important; height:100px !important;}' +
   '#mapContainer .ruler, #mapContainer .toolbar {z-index: 998;}'
   ;

   GM_addStyle(acss);
}

