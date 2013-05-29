//////////////////////////////////////////////////////////////////////
//menu on the left side
function leftMenuLinks()
{
   __ENTER__

   var pFirst,xi,i,brs,tmp;
   var wsIndex,url;
   var aL;

   var menu = __TEST__($xf("//td[@class='menu']"));

   if ( !menu )
   {
      menu = $xf("//div[@id='" + ID_LEFT + "']/p", 'l');
      if ( menu.snapshotLength > 1 )
      {
         pFirst = menu.snapshotItem(0);
         for (xi = 1; xi < menu.snapshotLength; xi++)
         {
            while (tmp = menu.snapshotItem(xi).firstChild)
            {
               removeElement(tmp);
               pFirst.appendChild(tmp);
            }
            removeElement(menu.snapshotItem(xi));
         } // by j000
         menu = pFirst;
      }
      else { menu = menu.snapshotItem(0); }
   }

   // by j000
   brs = menu.childNodes;
   for ( i = 0; i < brs.length; i++ )
   {
      if ( TAG(brs[i]) === "BR" )
      {
         removeElement(brs[i]);
         --i;
      }
   }

   var warsimIndex = parseInt10(TBO_WARSIM_INDEX);
   if ( warsimIndex >= warsimLinks.length ) { warsimIndex = 0; }

   aL = 
   [
      0, 
      [T('LOGIN'), "login.php"], 
      (TB3O.O[8] !== "1" ? [T('8'), "allianz.php"] : ['', '']), 
      [T('SENDTROOPS'), "a2b.php"],
      [T('SIM'), warsimLinks[warsimIndex], "_blank"]
   ];

   if ( TBO_SHOW_MENU_SECTION3 === '1' )
   {
      var uiLang  = normalizeLangCode(arAvLang[TBO_SCRIPT_LANG]);

      var repIndex = parseInt10(TBO_REPSITE_INDEX);
      if ( repIndex >= repSites.length ) { repIndex = 0; }

      var mapIndex = parseInt10(TBO_MAP_ANALYSER_INDEX);
      if ( mapIndex >= mapAnalysers.length ) { mapIndex = 0; }

      var menuS3L = 
      [  
         0, 
         //[T('CROPFINDER'),  "http://" + uiLang + ".crop-finder.com/" + wsSName + "/" + actV.vx + "|" + actV.vy + "/", "_blank", T('CROPFINDER.TT')], 
         [repSites[repIndex][0], repSites[repIndex][2](repSites[repIndex][1]), "_blank", T('11.TT') + " (" + repSites[repIndex][1] + ")" ], 
         [T('KIRILLOID'),   "http://travian.kirilloid.ru/index.php?lang=" + uiLang, "_blank", T('KIRILLOID.TT')],
         //[T('TRAVIANDOPE'), "http://www.traviandope.com/?change_language=" + uiLang,  "_blank", T('TRAVIANDOPE.TT')],
         [T('TRAVIANDOPE'), "http://www.traviandope.com",  "_blank", T('TRAVIANDOPE.TT')],
         [T('TOOLBOX'),     "http://www.traviantoolbox.com/index.php?lang=" + uiLang, "_blank",T('TOOLBOX.TT')],
         [T('CRYTOOLS'),    "http://cry.travianteam.com/serverinfo.php?&lng=" + uiLang + "&s=" + wsSName, "_blank", T('CRYTOOLS.TT')],
         //['Travian Utility', "http://travianutility.netsons.org/index_en.php", "_blank"],
         [mapAnalysers[mapIndex][0], mapAnalysers[mapIndex][2](mapAnalysers[mapIndex][1],"server"), "_blank", T('29.TT') + " (" + mapAnalysers[mapIndex][1] + ")", "smap"]
      ];

      aL = aL.concat(menuS3L);
      menuS3L = null;

      // add all server analysers
      for ( wsIndex = 0; wsIndex < wsAnalysers.length; ++wsIndex )
      {
         url = wsAnalysers[wsIndex][2](wsAnalysers[wsIndex][1],"server");
         if ( url )
         {
            menuS3L = [ wsAnalysers[wsIndex][0], url, "_blank", T('WSS') + ", " + T('27.TT') + " (" + wsAnalysers[wsIndex][1] + ")", "globe"];
            aL.push(menuS3L);
         }
      }
   }

   for ( i = 0; i < aL.length; i++ )
   {
      if ( aL[i] )
      {
         if ( aL[i][1] !== '' )
         {
            var yh = (aL[i][0].length > 17 ? 40 : 20);
            var aLink = $lnk([ ['href', aL[i][1]],
                               ['style', 'height:' + yh + 'px !important;'] ]);

            if ( aL[i][4] ) { addChildren(aLink,[I(aL[i][4]),"\u00A0"]); }
            aLink.appendChild($txt(aL[i][0]));
            if ( aL[i][2] ) { $at(aLink, [ ['target', aL[i][2]] ]); }
            if ( aL[i][3] ) { $at(aLink, [ ['title',  aL[i][3]] ]); }
            menu.appendChild(aLink);
         }
      }
      else 
      { 
         menu.appendChild($e('HR')); 
      }
   }
   aL = null;

   __EXIT__
}
