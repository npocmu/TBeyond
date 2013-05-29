//////////////////////////////////////////////////////////////////////
function uiCreateModalWindow()
{
   var innerPane = $g('InnerMsgPage');
   if ( !innerPane )
   {
      var div = $div(null,[
         $div([['id','OuterMsgPage'],['class','MsgPageOff']]),
         innerPane = $div([['id','InnerMsgPage'],['class','MsgPageOff']]),
      ]);
      insertFirst(document.body,div);
   }

   return innerPane;
}

//////////////////////////////////////////////////////////////////////
//Modified by Lux
function uiDisplayModalWindow(aState)
{
   scroll(0, 0);
   var outerPane = $g('OuterMsgPage');
   var innerPane = $g('InnerMsgPage');
   if ( outerPane && innerPane )
   {
      if ( aState )
      {
         outerPane.className = 'OuterMsgPageOn';
         innerPane.className = 'InnerMsgPageOn';

         var D = document;
         var height = Math.max(
             Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
             Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
             Math.max(D.body.clientHeight, D.documentElement.clientHeight)
         );
         $at(outerPane, [['style', 'height:' + height + 'px;']]);
         $at(innerPane, [['style', 'margin-left:-' + innerPane.firstChild.clientWidth/2+ 'px;']]);

      }
      else
      {
         outerPane.className = 'MsgPageOff';
         innerPane.className = 'MsgPageOff';
      }
   }
}

//////////////////////////////////////////////////////////////////////
function uiHideModalWindow()
{
   uiDisplayModalWindow(false);
}
