::********************************************************************
::****************************************************** TBEYOND SSE *
:: Distrubuted under Creative Commons Attribution-Noncommercial-Share 
:: Alike 3.0 License 
::                                           e-mail: npocmu@gmail.com 
::                          http://userscripts.org/scripts/show/98310 
::********************************************************************
:: FILE:       mergeImages.bat
:: CREATED:    Tue, 22 Feb 2011 11:08:57 +0200
:: AUTHORS:    npocmu
:: COPYRIGHT:  (c) npocmu 2011
:: PROJECT:    Travian Beyond - SSE
:: PURPOSE:    
::********************************************************************
@ECHO OFF
IF "%~1" == ""  GOTO Usage
CALL EnableCygWin.bat

ECHO var imP = 'data:image/gif;base64,';
ECHO var imPNG = 'data:image/png;base64,';
ECHO //base64 coded images
ECHO var image = {


FOR %%I IN (%~1\*.gif %~1\*.png) DO (
   gecho -n "'%%~nI'":
   IF "%%~xI" == ".gif" (gecho -en "\timP + '") ELSE (gecho -en "\timPNG + '")
   base64 -w0 %%~fI
   gecho "',"
)

ECHO };
GOTO Exit

:Usage
ECHO Not enougth args
GOTO Exit

:Exit

::*************************** END OF FILE ****************************
