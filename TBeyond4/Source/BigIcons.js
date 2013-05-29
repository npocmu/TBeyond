//////////////////////////////////////////////////////////////////////
function uiModifyBigIconsBar()
{
   __ENTER__

   var biBar = $g(ID_MTOP);
   if ( !biBar )
   {
      var biBar = __TEST__($g(ID_HEADER));  // 4.2
   }
   if ( biBar )
   {
      var origWidth = biBar.clientWidth;

      if ( TB3O.T35 )
      {
         removeElement($xf("./div[@class='clear']",'f',biBar));
         strMapCbib = ["0,0,35,33", "35,0,70,33", "0,33,35,67", "35,33,70,67"];
         strMapMbib = ["0,0,70,33", "0,33,35,67", "35,33,70,67"];
      }
      else
      {
         strMapCbib = ["0,0,35,50", "35,0,70,50", "0,50,35,100", "35,50,70,100"];
         strMapMbib = ["0,0,70,50", "0,50,35,100", "35,50,70,100"];
      }

      biBar.style.display = 'none';

      //setup icon
      var sL = $action([['id', 'n9'], ['class','tb3BI']],
                       $img([['title', T('TB3SL',TB3O.shN)], ['src', xGIF]]), TB3Setup);


      //var aPlus = $xf("//div[@id='" + ID_TOP5 + "']//a[contains(@href, 'plus.php')] | //div[@id='" + ID_TOP1 + "']//a[contains(@href, 'plus.php')]");
      /*
      var aPlus = $xf(".//a[contains(@href, 'plus.php')]",'f',biBar);
      if ( aPlus )
      {
         removeElement(aPlus);
      } */
      

      if ( TBO_SHOW_BIG_ICON_MARKET === "1" )
      {
         TB3O.iBiC += 1;
         addChildren(biBar,
            $e("div",[['id','n12'],['class','tb3BI']],[
               $e("img", [['usemap','#market'], ['src',xGIF]]),
               $e("map", [['name','market']],[
                  $rect(strMapMbib[0],'build.php?gid=17',    T('SENDRES')),
                  $rect(strMapMbib[1],'build.php?gid=17&t=1',T('BUY')),
                  $rect(strMapMbib[2],'build.php?gid=17&t=2',T('SELL'))
               ])
            ])
         );
      }

      if ( TBO_SHOW_BIG_ICON_MILITARY === "1" )
      {
         TB3O.iBiC += 1;
         addChildren(biBar,
            $e("div",[['id','n7'],['class','tb3BI']],[
               $e("img", [['usemap','#militar'], ['src',xGIF]]),
               $e("map", [['name','militar']],[
                  $rect(strMapCbib[0], URL_RP_OVERVIEW, T('BN_GID16')),
                  $rect(strMapCbib[1], bksLnk,            T('BN_GID19')),
                  $rect(strMapCbib[2],'build.php?gid=20', T('BN_GID20')),
                  $rect(strMapCbib[3],'build.php?gid=21', T('BN_GID21'))
               ])
            ])
         );
      }

      if ( TBO_SHOW_BIG_ICON_MILITARY2 === "1" )
      {
         TB3O.iBiC += 1;
         addChildren(biBar,
            $e("div",[['id','n10'],['class','tb3BI']],[
               $e("img", [['usemap','#militar2'], ['src',xGIF]]),
               $e("map", [['name','militar2']],[
                  $rect(strMapCbib[0],'build.php?gid=24', T('BN_GID24')),
                  $rect(strMapCbib[1],'build.php?gid=37', T('BN_GID37')),
                  $rect(strMapCbib[2],'build.php?gid=12', T('BN_GID12')),
                  $rect(strMapCbib[3],'build.php?gid=13', T('BN_GID13'))
               ])
            ])
         );
      }

      if ( TBO_SHOW_BIG_ICON_MISC === "1" )
      {
         TB3O.iBiC += 1;
         addChildren(biBar,
            $e("div",[['id','n11'],['class','tb3BI']],[
               $e("img", [['usemap','#misc'], ['src',xGIF]]),
               $e("map", [['name','misc']],[
                  $rect(strMapCbib[0],'build.php?gid=26', T('BN_GID26')),
                  $rect(strMapCbib[1],'build.php?gid=25', T('BN_GID25')),
                  $rect(strMapCbib[2],'build.php?gid=22', T('BN_GID22')),
                  $rect(strMapCbib[3],'build.php?gid=27', T('BN_GID27'))
               ])
            ])
         );
      }

      if ( TBO_SHOW_BIG_ICON_ALLIANCE === "1" )
      {
         var target;
         var alfl = getGMcookie('alfl', false);
         if (alfl == "false" || alfl == "") 
         {
            alfl = "allianz.php?s=2";
         }
         else 
         {
            target = "_blank";
         }

         TB3O.iBiC += 1;
         addChildren(biBar,
            $e("div",[['id','n8'],['class','tb3BI']],[
               $e("img", [['usemap','#alliance'], ['src',xGIF], ['title',T('8')]]),
               $e("map", [['name','alliance']],[
                  $rect(strMapCbib[0], 'allianz.php',     T('8') + ':\u00A0' + T('OVERVIEW')),
                  $rect(strMapCbib[1], alfl,              T('8') + ':\u00A0' + T('FORUM'), target),
                  $rect(strMapCbib[2], 'allianz.php?s=3', T('8') + ':\u00A0' + T('ATTACKS')),
                  $rect(strMapCbib[3], 'allianz.php?s=4', T('8') + ':\u00A0' + T('NEWS'))
               ])
            ])
         );
      }

      insertFirst(biBar,sL);
      biBar.style.width = (origWidth + TB3O.iBiC * 70) + 'px';
      biBar.style.display = '';

      if ( docDir[0] === 'right' )
      { 
         sL.style.marginRight = "-70px";
      }
   }

   __EXIT__

   function $rect(coords,url,title,target)
   {
      return $e("area", [['shape','rect'], 
                         ['coords',coords], 
                         ['href',url], target ? ['target',target] : undefined, 
                         ['title',title] ]);
   }
}
