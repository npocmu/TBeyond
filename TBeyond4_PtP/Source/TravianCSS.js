function setTravianStyles()
{
   var acss = '';

   var browser = ''
   var browserVersion = 0;

   var match = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);

   if ( match ) 
   {
      browser = 'Firefox';
      browserVersion = parseInt10(match[1]);
   }
   else
   {
      match = window.navigator.userAgent.match(/Chrome\/([0-9]+)\./);
      if ( match ) 
      {
         browser = 'Chrome';
         browserVersion = parseInt10(match[1]);
      }
   } 

   __DUMP__(browser, browserVersion)

   var levelCSS = 
     '{font-family:Arial, Helvetica, Verdana, sans-serif !important; font-size:12px !important; font-weight:bold !important;' +
      'color:' + TBCN_COL_TXT + ';line-height:15px !important;' + 
      'border:1px solid black; -moz-border-radius:2em; border-radius:2em; ' +
      'padding-top:4px; text-align:center; position:absolute; width:24px !important; height:20px !important; cursor:pointer;' +
      'background-image:none !important; margin-top:-2px;}';

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
   (( TBO_SHOW_BLDBLINK === '1' ) ?  'div.village1 .underConstruction, div.village2 .underConstruction  {animation: blink 1s steps(1) infinite;}' : '') +

   (( TBO_SHOW_COLOR_RES_LEVELS === '1' ) ?
      'div.village1 div.level' + levelCSS : '') +

   (( TBO_SHOW_COLOR_BLD_LEVELS === '1' ) ?
      'div.village2 div#village_map div.level' + levelCSS : '') +

   //'#navigation {margin-left:-15px !important;}' +
   (( TB3O.ServerInfo.version > 4.0 ) ? 'a#logo{left:73px;}' : '#navigation {margin-left:-70px !important;}') +

   'div#build.gid17 table#trading_edit td.res {padding: 0 0 0 7px;}' +
   'div#build.gid17 table#trading_edit td.res table.tbSendRes td {padding: 3px 3px;}' +
   'div#build.gid17 table#trading_edit td.res table.tbSendRes {width: ' + (( TB3O.ServerInfo.version > 4.0 )?342:340) +'px;  background-color: transparent; border: 1px solid silver;}' +
   'div#build.gid17 table#trading_edit td.res table.tbSendRes input {margin: -moz-initial;margin:initial !important;}' +
   'div#build.gid17 table#trading_edit td.res table.tbSendRes img {margin-right: auto;}' +

   'div#build.gid17 div.destination {float:' + docDir[1] + '; width:280px; margin-top:-75px;margin-bottom:15px;}' +
   '.traderCount img {vertical-align:middle;}' +

   'div#build div.action div.details input.text {box-sizing: content-box; width: 30px;}' +
   'div#build div.action div.details .tbOrg span.value { font-weight: bold; padding-' + docDir[1] + ':5px;}' + 

   // send troop
   'div.a2b table#troops input.text {width: 60px;}' +

   '#ingameManual {width:85px !important; height:100px !important;}' +
   '#mapContainer .ruler, #mapContainer .toolbar {z-index: 998;}';
   
   if ( (browser === 'Firefox' && browserVersion < 52) ||
        (browser === 'Chrome' && browserVersion < 57) )
   {
      // fix styles after 'hotdog' release 
      acss += 
      '.resourceWrapper, .resourceWrapper .resources, .resourceWrapper .resource, div#build .culturePointsAndPopulation .wrapper .unit,' + 
      'div.hero_inventory .resourcePick .resource,' +
      'div#build.gid17 table#trading_routes td.desc .res div' +
      '   {display:inline !important;}';
   }

   // fix styles after 'petchofix' release 
   acss += 'input[type="text"] { height: initial !important; }'

   GM_addStyle(acss);
}

