::********************************************************************
::****************************************************** TBEYOND SSE *
:: Distrubuted under Creative Commons Attribution-Noncommercial-Share 
:: Alike 3.0 License 
::                                           e-mail: npocmu@gmail.com 
::                          http://userscripts.org/scripts/show/98310 
::********************************************************************
:: FILE:       make.bat
:: CREATED:    Tue, 22 Feb 2011 15:24:06 +0200
:: AUTHORS:    npocmu
:: COPYRIGHT:  (c) npocmu 2011-2013
:: PROJECT:    Travian Beyond - SSE
:: PURPOSE:    Make TBeyond script
::********************************************************************
@ECHO OFF
:: Working files
SET $VCMD=%TEMP%\$VerInfo.cmd
SET $WF=%TEMP%\$TB4.js
SET $WF1=%TEMP%\$TB4_1.js
SET $WF2=%TEMP%\$TB4_2.js
::SET $WF1=$TB4_1.js

::CALL SetVar $V where VerInfo\VerInfo.xsl 
FOR /F %%I IN ("VerInfo\VerInfo.xsl") DO SET $V=%%~$PATH:I
msxsl VerInfo.xml "%$V%" -u 4.0 -o "%$VCMD%" cmd=export-revision export-revision-type=cmd 
IF EXIST "%$VCMD%" (
   CALL "%$VCMD%"
   ERASE "%$VCMD%"
) ELSE (GOTO BuildError)

SET $TF=Travian4_Beyond_SSE_r%VES_REVISION%
SET $M4ERR=%3
IF "%$M4ERR%"=="" SET $M4ERR=CON

@ECHO Prepare...
COPY Source\Main0.js + ^
     ..\Common\Source\BuildingsCost.js + Source\Images.js + ^
     ..\Common\Source\Languages\Default.js + ..\Common\Source\Languages\Other.js + ..\Common\Source\Languages\Repair.js + ^
     ..\Common\Source\Main1.js + ^
     Source\TravianCSS.js + ..\Common\Source\TBCSS.js + ..\Common\Source\Log.js + ^
     ..\Common\Source\Lib\Util.js + ..\Common\Source\Lib\DOM.js + ..\Common\Source\Lib\AJAX.js + ^
     ..\Common\Source\Lib\Persistence.js + ^
     ..\Common\Source\Cookies.js + ..\Common\Source\CookiesV2.js + ^
     ..\Common\Source\TBCommon.js + ..\Common\Source\Common.js + ^
     ..\Common\Source\Objects\MerchantsUnderwayInfo.js + ^
     ..\Common\Source\Objects\TroopDetailsInfo.js + ^
     ..\Common\Source\Objects\CulturePointsInfo.js + ^
     ..\Common\Source\Objects\TownHallInfo.js + ^
     ..\Common\Source\Objects\TrainingInfo.js + ^
     ..\Common\Source\Objects\UpgradeInfo.js + ^
     ..\Common\Source\GeneralInfo.js + ^
     ..\Common\Source\CommonUI1.js + ..\Common\Source\CommonUI.js + ^
     ..\Common\Source\Toolbar.js + ..\Common\Source\Tooltip.js + ^
     ..\Common\Source\Controls\ModalWindow.js + ^
     ..\Common\Source\Controls\UpDown.js + ^
     ..\Common\Source\Controls\RollDown.js + ^
     ..\Common\Source\VillageInfo.js + ..\Common\Source\BuildingsInfo.js + ^
     ..\Common\Source\Objects\TravianMenu.js + Source\TravianMenu.js + ^
     Source\Obsolete.js + Source\getResourcesInfo.js + ..\Common\Source\Resources.js + ^
     ..\Common\Source\Units.js + ^
     Source\getGeneralData.js + Source\Specific.js + Source\getOuterBuildings.js + Source\getInnerBuildings.js + ^
     Source\getStatisticsMenu.js + ^
     Source\AllPages.js + Source\BigIcons.js + ^
     ..\Common\Source\Links.js + ..\Common\Source\ExternalTools.js + ^
     Source\inlineMessagesLinks.js + ..\Common\Source\inlineLinks.js + ^
     Source\getTBOptionsDefaults.js + ..\Common\Source\TBSetup.js + ..\Common\Source\TBUpdate.js + ^
     ..\Common\Source\BiP.js + Source\getBiP.js + ^
     ..\Common\Source\TM.js + ^
     ..\Common\Source\TroopInfoTooltip.js + ..\Common\Source\TroopsAttDefInfo.js + ..\Common\Source\TroopMerchantDistInfo.js + ^
     Source\MessagesSpecific.js + ..\Common\Source\BattleReport.js +..\Common\Source\Messages.js + ^
     Source\ProfileAllianceSpecific.js + ..\Common\Source\ProfileAlliance.js + ^
     Source\ProfilePlayerSpecific.js + ..\Common\Source\ProfilePlayer.js + ^
     ..\Common\Source\Map.js + Source\MapSpecific.js + ^
     ..\Common\Source\Bookmarks.js + ..\Common\Source\Noteblock.js + ^
     ..\Common\Source\ResourcesBar.js + ..\Common\Source\SearchBar.js + ^
     Source\Dorf1Specific.js + ..\Common\Source\Dorf1.js + ^
     Source\Dorf2Specific.js + ..\Common\Source\Dorf2.js + ^
     Source\Overview.js + Source\Dorf3Specific.js + ..\Common\Source\Dorf3.js + ..\Common\Source\Dorf3_Refresh.js + ^
     Source\MarketSpecific.js + ..\Common\Source\MarketCommon.js + ..\Common\Source\MarketSend.js + ..\Common\Source\MarketOffer.js + ..\Common\Source\MarketRoutes.js + ^
     Source\PositionDetails.js + ^
     Source\RallyPointSpecific.js + ..\Common\Source\RallyPointOverview.js + ..\Common\Source\RallyPointSend.js + ..\Common\Source\RallyPointDismiss.js + ^
     ..\Common\Source\Culture.js + ..\Common\Source\TownHall.js + ..\Common\Source\UpgradeBuilding.js + ^
     Source\TrainingSpecific.js + ..\Common\Source\TrainingBuilding.js + ^
     Source\VillagesList.js + Source\SideBars.js + ^
     ..\Common\Source\VillagesList2.js + ^
     ..\Common\Source\Timers.js + ^
     Source\Main2.js + ..\Common\Source\Tail.js ^

     "%$WF%" /B > NUL


:BuildRelease
@ECHO Build release r%VES_REVISION%...
m4 -P -E -IInclude -I..\Common\Include -D__DEBUG__=0 TB.m4  Source\Head.js > "%$WF1%" 2> %$M4ERR%
m4 -P -E -IInclude -I..\Common\Include -D__DEBUG__=0 TB.m4  "%$WF%" > "%$WF2%" 2> %$M4ERR%
IF EXIST ..\Tools\Jazmin.exe (
   cat "%$WF2%" | ..\Tools\Jazmin.exe | cat "%$WF1%" - > "Install\Release\%$TF%.user.js"
) ELSE (
   COPY "%$WF2%" + "%$WF1%" "Install\Release\%$TF%.user.js" /B >NUL
)


:BuildDebug
@ECHO Build debug r%VES_REVISION%...
COPY Source\Head.js + "%$WF%" "%$WF1%" /B > NUL
m4 -P -E -IInclude  -I..\Common\Include -D__DEBUG__=2 TB.m4  "%$WF1%" > "Install\Debug\%$TF%D.user.js" 2> %$M4ERR%

:Cleanup
IF EXIST "%$WF%" ERASE "%$WF%"
IF EXIST "%$WF1%" ERASE "%$WF1%"
IF EXIST "%$WF2%" ERASE "%$WF2%"
GOTO Exit

:BuildError
@ECHO something wrong...
GOTO Exit

:Exit
SET $V=

::*************************** END OF FILE ****************************
