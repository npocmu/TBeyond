m4_dnl ***************************************************************
m4_dnl ************************************************* TBEYOND SSE *
m4_dnl  Distrubuted under Creative Commons Attribution-Noncommercial-Share 
m4_dnl  Alike 3.0 License 
m4_dnl                                       e-mail: npocmu@gmail.com 
m4_dnl                      http://userscripts.org/scripts/show/98310 
m4_dnl ***************************************************************
m4_dnl  FILE:        Specific.m4
m4_dnl  CREATED:     Thu, 04 Oct 2012 09:12:26 +0300
m4_dnl  AUTHORS:     npocmu
m4_dnl  COPYRIGHT:   (c) npocmu 2012
m4_dnl  PROJECT:     Travian Beyond - SSE
m4_dnl  PURPOSE:     Set of M4 macros specific for Travian v4
m4_dnl ***************************************************************
M4_ECHO_OFF

m4_define({{TB4}},{{}})

m4_define({{TB_MAKE_URL}}, {{"build.php?m4_ifelse($2,,,newdid=" + $2 + "&)$1"}})

m4_define({{URL_RP_OVERVIEW}}, {{TB_MAKE_URL(tt=1&id=39,$1)}})

m4_define({{TB_MANY_FONT_SIZE}}, 7pt)

M4_ECHO_ON
m4_dnl ************************* END OF FILE *************************
