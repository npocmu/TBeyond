//////////////////////////////////////////////////////////////////////
//update script (by Richard Gibson, changed by ms99, npocmu)
function updScript()
{
   var divUpd = $div(['id', 'updDiv'], T('CHECKUPDATE') );
   var aD = $g(IIF_TB4(ID_CONTENT,ID_MID1));
   if ( aD ) { aD.appendChild(divUpd); }

   GM_xmlhttpRequest(
   {
      method: 'GET',

      url: 'TB_USO_URL_META',

      headers: 
      {
         'Range': 'bytes=0-499',
      },

      onload: function (result)
      {
         removeElement(divUpd);

         if ( result.status === 200 || result.status === 206 ) 
         {
            if ( result.responseText.match(/@version\s+([\d.]+)/) ) 
            {
               var newVersion = RegExp.$1;
               var nv = newVersion.split('.');
               var iv = TB3O.version.split('.');
               var compareResult = 0;
               var i;
               // check version for each part independently
               for ( i = 0; i < iv.length && i < nv.length; ++i )
               {
                  if ( parseInt10(nv[i]) < parseInt10(iv[i]) ) { compareResult = -1; break; }
                  else if ( parseInt10(nv[i]) > parseInt10(iv[i]) ) { compareResult = 1; break; }
               }
               if ( compareResult === 0 )
               {
                  compareResult = nv.length - iv.length;
               }

               if ( compareResult === 0 )
               {
                  alert(T('NONEWVER') + ' (v' + TB3O.version + ') !');
               }
               else if ( compareResult < 0 )
               {
                  alert(T('BVER') + ' (v' + TB3O.version + ') ?!');
               }
               else if (window.confirm(T('NVERAV') + ' (v ' + newVersion + ')!\n\n' + T('UPDSCR') + '\n')) 
               {
                  window.location.href = TB3O.url;
               }
            }
            else
            {
               __LOG__(1,"Can't find script version information")
               __DUMP__(result)
               alert(T('ERRUPDATE'));
            }
         }
         else
         {
            __LOG__(1,"Update check failed, result.status="+result.status)
            __DUMP__(result)
            alert(T('ERRUPDATE'));
         }
      }
   });
}

//////////////////////////////////////////////////////////////////////
function uiCreateTBAbout()
{
   TB3O.TBEndTime = new Date().getTime();
   var tt = $div(['id', 'tbver']);

   addChildren(tt,[IF_TB3({{(docDir[0] === "right") ? "" : " | ",}})
                   $a(TB3O.shN, [['href', 'TB_USO_URL_HOME'], ['target', '_blank'], ['title', T('SCRPURL')]]),
                   "\u00A0(v",
                   $action(['title', T('CHKSCRV')], TB3O.version, updScript),
                   ") ",
                   $span(['class','tbExTime'],["time: ", $e("b",TB3O.TBTRT()), " ms"]),
                   $span(['class','tbTVer'],
                      IIF_TB4(
                         TB3O.ServerInfo.version.toFixed(2) + (TB3O.ServerInfo.mod ? " (" + TB3O.ServerInfo.mod + ")" : ""),
                         M4_DEBUG({{" | (" + (TB3O.T35 ? "T35" : "T3") + "-" + TB3O.M35 + ")" }})
                      )
                   )
                  ]);
   return tt;
}


