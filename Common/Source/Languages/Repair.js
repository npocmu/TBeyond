function repairLanguage()
{
   //additional setup items
   if ( !t['80'] )  { t['80']  = t['53']; }
   if ( !t['81'] )  { t['81']  = t['54']; }
   if ( !t['86'] )  { t['86']  = t['28'] + " &<br>" + t['30']; }

   IF_TB4(delete t['BN_GID{{}}GID_SMITHY'];)
}

