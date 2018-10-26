//////////////////////////////////////////////////////////////////////
// value: 0-100
// color: any CSS color
// text, title: any string (optional)
function uiCreateMeterBar(value, color, text/*opt*/, title/*opt*/)
{
   var meter = $div([['class','tbMeter'],['title',title]]);

   if ( isStrValid(text) )
   {
      meter.appendChild($div(['class','tbMeterForeground'],
                           $div(['class','tbMeterTextContainer'],
                              $span(['class','tbMeterText'],$txt(text)))));
   }

   var fillPercent = Math.round(value);

   addChildren(meter,[
      $div([['class','tbMeterFill'],['style', 'width:' + fillPercent + '%; background-color:' + color + ';']]),
      $div([['class','tbMeterEmpty'],['style', 'width:' + (100 - fillPercent) + '%;']])
   ]);

   return meter;
}

//////////////////////////////////////////////////////////////////////
function uiCreateResourceMeterBar(resourcesInfo, ri)
{
   var title = "" + Math.floor(resourcesInfo.Res[ri]) + "/" + resourcesInfo.Cap[ri];
   var fillPercent = getFillPercent(resourcesInfo, ri);
   var prC = getBackColorForResourceBar(fillPercent,resourcesInfo.EPpH[ri]);

   return uiCreateMeterBar(fillPercent, prC, fillPercent+'%', title);
}
