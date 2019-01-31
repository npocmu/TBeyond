//////////////////////////////////////////////////////////////////////
//Bookmarks on the right side
function showUserBookmarks()
{
   //-----------------------------------------------------------------
   function Bookmarks()
   {
      this._ = [];
   }

   //-----------------------------------------------------------------
   Bookmarks.prototype.remove = function remove(idx) 
   {
      this._.splice(idx,1);

      return this;
   };

   //-----------------------------------------------------------------
   Bookmarks.prototype.swap = function swap(idx1, idx2) 
   {
      var tmp = this._[idx2];
      this._[idx2] = this._[idx1];
      this._[idx1] = tmp;

      return this;
   };

   //-----------------------------------------------------------------
   Bookmarks.prototype.load = function load() 
   {
      //bookmarks string
      var strBM = loadPersistentUserValue("marcadores", "");

      if ( strBM !== "" )
      {
         var i, records = strBM.split("$$");
         for (var i = 0; i < records.length; i++)
         { 
            this._[i] = records[i].split("$");
         }
      }
   };

   //-----------------------------------------------------------------
   Bookmarks.prototype.save = function save() 
   {
      var strBM = this._.map(function f(rec) { return rec.join("$"); }).join("$$");
      savePersistentUserValue("marcadores", strBM);
   };

   //-----------------------------------------------------------------
   var aTb, parBM, ubXY;
   var bookmarks = new Bookmarks();

   __ENTER__

   if ( TBO_SHOW_BOOKMARKS === "1" ) 
   {
       removeElement($g("userbookmarksTT"));
       removeElement($g("userbookmarks"));

       bookmarks.load();
       //__DUMP__(bookmarks)

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
      var aTb = $t([['id', 'userbookmarks']], $r(uiCreateUserBookmarksHeader()));

      for (var i = 0; i < bookmarks._.length; i++)
      {
         var aC, iL;
         var bmRow = $r();
         var strBookmark = bookmarks._[i][0];
         var lnkBookmark = bookmarks._[i][1];

         var bIsSeparator = ( !isStrValid(lnkBookmark) || lnkBookmark === "#" );

         if ( TBO_LOCK_BOOKMARKS !== "1" )
         {
            aC = $td(['class', 'tbDel'], uiCreateTool("del", null, bind(deleteUserBookmark,[i])));
            bmRow.appendChild(aC);

            aC = $td(['class', 'tbMoveUp']);
            if ( i > 0 )
            {
               var aUp = uiCreateTool("tbiArrowUp", null, bind(moveUserBookmark,[i,-1]));
               aC.appendChild(aUp);
            }
            bmRow.appendChild(aC);

            aC = $td(['class', 'tbMoveDown']);
            if ( i < bookmarks._.length - 1 )
            {
               var aDown = uiCreateTool("tbiArrowDown", null, bind(moveUserBookmark,[i,1]));
               aC.appendChild(aDown);
            }
            bmRow.appendChild(aC);

            aC = $td(['class', 'tbEdit'], uiCreateTool("tbiOptions", ['title', T('EDIT')], bind(editUserBookmark,[i])));
            bmRow.appendChild(aC);
         }
         else if ( !bIsSeparator )
         {
            aC = $td([['class', ( lnkBookmark === crtPage) ? 'act' : 'noact']], $span("&#8226"));
            bmRow.appendChild(aC);
         }
         
         aC = $td();
         if ( bIsSeparator )
         {
            $at(aC, [['colspan','2'],['class','tb3sep']]);
            iL = $e("hr");
         }
         else
         {
            if ( lnkBookmark.indexOf("*") !== -1 )
            {
               iL = $lnk([['href', lnkBookmark.substring(0, lnkBookmark.length - 1)], 
                          ['target', '_blank']], strBookmark + " ");
               iL.appendChild($img([['src', image["external"]]]));
            }
            else
            {
               iL = $lnk(['href', lnkBookmark], strBookmark);
            }
         }

         aC.appendChild(iL);
         bmRow.appendChild(aC);
         aTb.appendChild(bmRow);
      }
      return aTb;

      ////////////////////////////////////////////////////////////////
      function deleteUserBookmark(idx)
      {
         bookmarks.remove(idx);
         bookmarks.save();
         showUserBookmarks();
      }

      ////////////////////////////////////////////////////////////////
      function moveUserBookmark(idx, updown)
      {
         bookmarks.swap(idx, idx + updown);
         bookmarks.save();
         showUserBookmarks();
      }

      ////////////////////////////////////////////////////////////////
      function editUserBookmark(idx)
      {
         var oldLabel = bookmarks._[idx][0];
         var oldURL   = bookmarks._[idx][1];

         var ubLabel = prompt(T('UBT'), oldLabel);
         if ( isStrValid(ubLabel) )
         {

            var ubURL = prompt(T('UBU'), oldURL);
            if ( !isStrValid(ubURL) )
            {
               ubURL = oldURL;
            }

            if ( ubLabel !== oldLabel || ubURL !== oldURL )
            {
               bookmarks._[idx] = [ubLabel, ubURL];
               bookmarks.save();
               showUserBookmarks();
            }
         }
      }

      ////////////////////////////////////////////////////////////////
      function uiCreateUserBookmarksHeader()
      {
         var hText = $e("B", T('MARCADORES') + ':&nbsp;&nbsp;');
         var dI = (TBO_LOCK_BOOKMARKS != "1" ) ? 
                     ["tbiUnlocked", '82.L', "1", '8'] : 
                     ["tbiLocked",   '82.U', "0", '2'];
         var toolbar = uiToolbar_Create(null,
                       [
                          uiCreateTool("tbiAddBookmark",     T('ANYADIR'),   onAddBookmark),
                          uiCreateTool("tbiAddBookmarkThis", T('ADDCRTPAGE'),onAddCurrentBookmark),
                          uiCreateTool("tbiAddBookmarkSep",  T('SPACER'),    onSeparator),
                          uiCreateTool(dI[0],                T(dI[1]),       onLockUnlock)
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
            bookmarks._.push(["#", "#"]);
            bookmarks.save();
            showUserBookmarks();
         }

         /////////////////////////////////////////////////////////////
         function onLockUnlock() 
         {
            TBO_LOCK_BOOKMARKS = dI[2];
            saveTBOptions();
            showUserBookmarks();
         }
      }
   }

   //-----------------------------------------------------------------
   function addUserBookmark(ubURL)
   {
      if ( !ubURL )
      {
         ubURL = prompt(T('UBU'), TB3O.crtBrT);
         if ( !isStrValid(ubURL) ) return;
      }
      var ubL = prompt(T('UBT'), TB3O.crtBrT);
      if ( !isStrValid(ubL) ) return;

      bookmarks._.push([ubL, ubURL]);
      bookmarks.save();
      showUserBookmarks();
   }
}
