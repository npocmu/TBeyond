
m4_define(COL_PNAME,  IIF_TB4(0,1))
m4_define(COL_POP,    IIF_TB4(1,2))
m4_define(COL_VCOUNT, IIF_TB4(2,3))
m4_define(COL_BULLET, IIF_TB4(0,4))

/////////////////////////////////////////////////////////////////////
function getMemberTitles(aTb)
{
   var memberTitles = {};
   if ( aTb && aTb.rows )
   {
      var i;
      for ( i = 0; i < aTb.rows.length; i++ )
      {
         var uid;
         var post = aTb.rows[i].cells[0].textContent;
         var uLink = $nth_tag(aTb.rows[i].cells[1],"a",0);
         if ( uLink )
         {
            uid = parseUri(uLink.href).queryKey.uid;
         }
         if ( post && uid )
         {
            memberTitles[uid] = post;
         }
      }
   }
   return memberTitles;
}


/////////////////////////////////////////////////////////////////////
function uiModifyAllianceMembersTable(aTb, memberTitles)
{
   if ( aTb && aTb.rows && aTb.rows.length > 1 )
   {
      var i,j;
      var cells;
      var totP = 0;
      var totV = 0;
      var playersCount = aTb.rows.length - 1;
      var columns = aTb.rows[1].cells.length;
      var totalBullets = [[0, ""], [0, ""], [0, ""], [0, ""], [0, ""]]; //blue, green, yellow, red, grey
      var boolIsMyAlly = true;

      IF_TB4(insertFirst(aTb.rows[0],$td(['style','width:6%'])); ++columns;)

      __DUMP__(playersCount,columns,memberTitles)

      for ( i = 1; i < aTb.rows.length; i++ )
      {
         cells = aTb.rows[i].cells;
         var uLink = $nth_tag(cells[COL_PNAME],"a",0);
         if ( uLink )
         {
            var uid = parseUri(uLink.href).queryKey.uid;
            if ( TB3O.UserID == uid )
            {
               addClass(aTb.rows[i],"hl");
            }

            var post = memberTitles[uid];
            if ( post )
            {
               insertAfter(uLink,$txt(" (" + post + ")"));
            }
         }

         totP += parseInt10(cells[COL_POP].textContent);
         totV += parseInt10(cells[COL_VCOUNT].textContent);

         if ( boolIsMyAlly )
         {
            j = 0;
            if ( cells[COL_BULLET] )
            {
               var imgBullet = $nth_tag(cells[COL_BULLET],"img",0);
               if ( imgBullet )
               {
                  if (imgBullet.src.indexOf("x.gif") === -1)
                  {
                     var xf = basename(imgBullet.src).replace("b", "").replace(".gif", "");
                     j = parseInt10(xf);
                     totalBullets[j - 1][0] += 1;
                     totalBullets[j - 1][1] = imgBullet.title;
                  }
                  else 
                  {
                     var aClass = imgBullet.className;
                     if ( aClass.match(/online/) && aClass.search(/(\d)/) !== -1 )
                     {
                        j = RegExp.$1;
                        totalBullets[j - 1][0] += 1;
                        totalBullets[j - 1][1] = imgBullet.title;
                     }
                  }
               }
            }

            if ( j === 0 )
            {
               boolIsMyAlly = false;
            }
         }

         IF_TB4({{
         insertFirst(aTb.rows[i],$td(String(i)+"."))
         }})
      }

      var avgP = Math.round(totP / playersCount);
      var avgV = Math.round(totV / playersCount);

      for ( i = 1; i < aTb.rows.length; i++ )
      {
         cells = aTb.rows[i].cells;
         var pop = parseInt10(cells[2].textContent);
         var vil = parseInt10(cells[3].textContent);

         if ( pop > avgP*3/2 )
         {
            cells[2].style.backgroundColor = '#E8FFE8';
         }
         if ( pop < avgP*2/3 )
         {
            cells[2].style.backgroundColor = 'bisque';
         }
         else if ( pop < avgP )
         {
            cells[2].style.backgroundColor = 'cornsilk';
         }

         if ( vil > avgV*3/2 )
         {
            cells[3].style.backgroundColor = '#E8FFE8';
         }
         if ( vil < avgV*2/3 )
         {
            cells[3].style.backgroundColor = 'bisque';
         }
         else if ( vil < avgV )
         {
            cells[3].style.backgroundColor = 'cornsilk';
         }
      }

      // total member of aliance
      var trT = $r(['class', 'tb3r']);
      trT.appendChild($td([['class', 'tb3chnb'], ["colspan", "2"]], T('TOTAL')));
      trT.appendChild($td([['class', 'tb3chnb'], ['style', 'text-align:center']], totP));
      trT.appendChild($td([['class', 'tb3chnb'], ['style', 'text-align:center']], totV));
      if ( columns > 4 ) { trT.appendChild($td([['class', 'tb3chnb'], ["colspan", columns-4]])); }
      aTb.appendChild(trT);

      //average population per member of aliance
      var trAv = $r(['class', 'tb3r']);
      trAv.appendChild($td([['class', 'tb3chnb'], ["colspan", "2"]], T('AVPPP')));
      trAv.appendChild($td([['class', 'tb3chnb'], ['style', 'text-align:center']], avgP));
      trAv.appendChild($td([['class', 'tb3chnb'], ['style', 'text-align:center']], avgV));
      if ( columns > 4 ) { trAv.appendChild($td([['class', 'tb3chnb'], ["colspan", columns-4]])); }
      aTb.appendChild(trAv);

      //average population per village
      trAv = $r(['class', 'tb3r']);
      trAv.appendChild($td([['class', 'tb3chnb'], ["colspan", "2"]], T('AVPPV')));
      trAv.appendChild($td([['class', 'tb3chnb'], ["colspan", "2"], ['style', 'text-align:center']], Math.round(totP / totV)));
      if ( columns > 4 ) { trAv.appendChild($td([['class', 'tb3chnb'], ["colspan", columns-4]])); }
      aTb.appendChild(trAv);

      //number of bullets by type
      if ( boolIsMyAlly )
      {
         var rowBullets = $r(['class', 'tb3r']);
         var cellBullets = $td([['class', 'tb3chnb'], ['colspan', columns], ['style', 'text-align:center']]);
         for ( j = 0; j < 5; j++ )
         {
            if (totalBullets[j][0] > 0) 
            {
               if ( cellBullets.firstChild )
               {
                  addChildren(cellBullets," | ");
               }
               addChildren(cellBullets,[I("b" + (j + 1),[['title',totalBullets[j][1]]]),"\u00A0=\u00A0" + totalBullets[j][0]]);
            }
         }
         rowBullets.appendChild(cellBullets);
         aTb.appendChild(rowBullets);
      }
   }
}

/////////////////////////////////////////////////////////////////////
function uiModifyAllianceProfile()
{
   __ENTER__

   var aProfile = searchAllianceProfileTable();
   if ( aProfile )
   {
      var memberTitles = getMemberTitles(searchAllianceAuthoritiesTable());
      
      uiModifyAllianceProfileName(aProfile);
      uiModifyAllianceProfileDescription(aProfile);

      uiModifyAllianceMembersTable(searchAllianceMembersTable(),memberTitles);
   }

   __EXIT__
}


/////////////////////////////////////////////////////////////////////
function uiModifyAllianceForum()
{
   __ENTER__

   var i;
   var posts = $xf("//table[@id='posts']//div[contains(@class,'text')]", 'l');
   for ( i = 0; i < posts.snapshotLength; i++ )
   {
      uiModifyMsgBody(posts.snapshotItem(i));
   }

   __EXIT__
}

