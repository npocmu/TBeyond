//Bookmarks on the right side
function showUserBookmarks()
{
   var aTb, parBM, ubXY;

   __ENTER__

   if ( TBO_SHOW_BOOKMARKS === "1" ) 
   {
       removeElement($g("userbookmarksTT"));
       removeElement($g("userbookmarks"));

       aTb = uiCreateUserBookmarksTable();
       uiModifyLinks(aTb, { add_send_troops2:true });

       IIF_TB3({{if ( TBO_FLOAT_BOOKMARKS !== "1" )
       {
          parBM = $g("parBM");
          if ( !parBM )
          {
             parBM = $e("P");
             parBM.id ="parBM";
             TB3O.nTAUb.appendChild(parBM);
          }
          parBM.appendChild(aTb);
       }
       else }})
       {
          var ubXY = TBO_BOOKMARKS_XY.split("|");
          $df(215, ubXY[0], ubXY[1], T('MARCADORES'), 'userbookmarks', "userbookmarksTT", true, aTb);
          if ( TBO_BOOKMARKS_STATE !== "1" ) { aTb.style.display = 'none'; }
       }
   }
   __EXIT__

   ///////////////////////////////////////////////////////////////////
   function uiCreateUserBookmarksTable()
   {
      var aTb = $t([['id', 'userbookmarks']]);
      //header row
      var uHr = $r();
      uHr.appendChild(uiCreateUserBookmarksHeader());
      aTb.appendChild(uHr);
      //bookmarks string
      var strBM = getGMcookie("marcadores", false);
      if (strBM == "false")
      {
         setGMcookie("marcadores", '', false);
         strBM = '';
      }

      if (strBM != '')
      {
         marcadores = new Array();
         strBM = strBM.split("$$");
         for (var i = 0; i < strBM.length; i++) marcadores[i] = strBM[i].split("$");
         for (var i = 0; i < marcadores.length; i++)
         {
            bmRow = $r();
            strBookmark = marcadores[i][0];
            if ( TBO_LOCK_BOOKMARKS != "1")
            {
               var aDel = $a(gIc["del"], [['href', jsVoid]]);
               aDel.addEventListener("click", removeGMcookieValue("marcadores", i, false, showUserBookmarks, false), 0);
               aC = $td();
               aC.appendChild(aDel);
               bmRow.appendChild(aC);

               bmRow.appendChild($td("&nbsp;"));

               upC = $td();
               if (i > 0)
               {
                  aUp = $a("", [['href', jsVoid]]);
                  aUp.appendChild($img([['src', image["aup"]]]));
                  aUp.addEventListener("click", moveUserBookmark(i, -1), false);
                  upC.appendChild(aUp);
               }
               bmRow.appendChild(upC);

               downC = $td();
               if (i < marcadores.length - 1)
               {
                  var aDown = $a("", [['href', jsVoid]]);
                  aDown.appendChild($img([['src', image["adn"]]]));
                  aDown.addEventListener("click", moveUserBookmark(i, 1), false);
                  downC.appendChild(aDown);
               }
               bmRow.appendChild(downC);

               bmRow.appendChild($td("&nbsp;"));
               eC = $td();
               aEdit = $a("", [['href', jsVoid]]);
               aEdit.appendChild($img([['src', image["editbookmark"]], ['title', T('EDIT')]]));
               aEdit.addEventListener("click", editUserBookmark(i), false);
               eC.appendChild(aEdit);
               bmRow.appendChild(eC);
               bmRow.appendChild($td("&nbsp;"));
            }
            else
            {
               aCl = 'noact';
               if (marcadores[i][1] == crtPage) aCl = 'act';
               var aC = $td([['class', aCl]], "<span>&#8226;&nbsp;&nbsp;</span>");
               bmRow.appendChild(aC);
            }
            //fr3nchlover
            if (marcadores[i][1].indexOf("*") != -1)
            {
               iL = $a(strBookmark + " ", [['href', marcadores[i][1].substring(0, marcadores[i][1].length - 1)], ['target', '_blank']]);
               iL.appendChild($img([['src', image["external"]]]));
            }
            else
            {
               iL = $a(strBookmark);
               if (marcadores[i][1] != "#") $at(iL, [['href', marcadores[i][1].substring(0, marcadores[i][1].length)]]);
            }
            bmC = $td(iL);
            bmRow.appendChild(bmC);
            aTb.appendChild(bmRow);
         }
      }
      return aTb;

      ////////////////////////////////////////////////////////////////
      function uiCreateUserBookmarksHeader()
      {
         var hText = $e("B", T('MARCADORES') + ':&nbsp;&nbsp;');
         var dI = (TB3O.O[82] != "1" ? ["unlocked" + docDir[0].substring(0, 1), '82.L', "1", '8'] : 
                                       ["locked", '82.U', "0", '2']);
         var toolbar = uiToolbar_Create(null,
                       [
                          uiCreateTool("addbookmark",  T('ANYADIR'),   onAddBookmark),
                          uiCreateTool("addbmthispage",T('ADDCRTPAGE'),onAddCurrentBookmark),
                          uiCreateTool("addbmspacer",  T('SPACER'),    onSeparator),
                          uiCreateTool(dI[0],          T(dI[1]),       onLockUnlock)
                       ]);

         var hCell = $td([['colspan', dI[3]]]);
         hCell.appendChild(hText);
         hCell.appendChild(toolbar);
         return hCell;

         /////////////////////////////////////////////////////////////
         function onAddBookmark() 
         {
            addUserBookmark();
         }

         /////////////////////////////////////////////////////////////
         function onAddCurrentBookmark() 
         {
            addUserBookmark(window.location.href);
         }

         /////////////////////////////////////////////////////////////
         function onSeparator() 
         {
            addGMcookieValue("marcadores", ["<hr size='2' width='100%' noshade color=darkgrey>", "#"], false);
            showUserBookmarks();
         }

         /////////////////////////////////////////////////////////////
         function onLockUnlock() 
         {
            TB3O.O[82] = dI[2];
            setGMcookieV2('TB3Setup', TB3O.O, 'SETUP');
            showUserBookmarks();
         }
      }
   }

   function addUserBookmark(ubURL)
   {
      if (!ubURL)
      {
         ubURL = prompt(T('UBU'), TB3O.crtBrT);
         if (!ubURL || ubURL == '') return;
      }
      var ubL = prompt(T('UBT'), TB3O.crtBrT);
      if (!ubL || ubL == '') return;
      addGMcookieValue("marcadores", [ubL, ubURL], false);
      showUserBookmarks();
      ubL = null;
   }

   function moveUserBookmark(i, updown)
   {
      return function ()
      {
         var ubC = getGMcookie("marcadores", false);
         var arrUbC = ubC.split("$$");
         var tmpUb = arrUbC[i + updown];
         arrUbC[i + updown] = arrUbC[i];
         arrUbC[i] = tmpUb;
         ubC = arrUbC.join("$$");
         setGMcookie("marcadores", ubC, false);
         showUserBookmarks();
         ubC = null;
         arrUbC = null;
         tmpUb = null;
      }
   }

   function editUserBookmark(i)
   {
      return function ()
      {
         var ubC = getGMcookie("marcadores", false);
         var arrUbC = ubC.split("$$");
         var tmpUb = arrUbC[i].split("$");
         var ubLabel = prompt(T('UBT'), tmpUb[0]);
         var ubURL = null;
         if (ubLabel != '') ubURL = prompt(T('UBU'), tmpUb[1]);
         if (!ubLabel) ubLabel = tmpUb[0];
         if (!ubURL) ubURL = tmpUb[1];
         if (ubLabel != '' && ubURL != '' && (ubLabel != tmpUb[0] || ubURL != tmpUb[1]))
         {
            arrUbC[i] = ubLabel + "$" + ubURL;
            ubC = arrUbC.join("$$");
            setGMcookie("marcadores", ubC, false);
            showUserBookmarks();
         }
         ubC = null;
         arrUbC = null;
         utLabel = null;
         ubURL = null;
      }
   }
}
