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
     Source\Common\BuildingsCost.js + Source\Images.js + ^
     Source\Common\Languages\Default.js + Source\Common\Languages\Other.js + Source\Common\Languages\Repair.js + ^
     Source\Common\Main1.js + ^
     Source\TravianCSS.js + Source\Common\TBCSS.js + Source\Common\Log.js + ^
     Source\Common\Lib\Util.js + Source\Common\Lib\DOM.js + Source\Common\Lib\AJAX.js + ^
     Source\Common\Lib\Persistence.js + ^
     Source\Common\Cookies.js + Source\Common\CookiesV2.js + ^
     Source\Common\TBCommon.js + Source\Common\Common.js + ^
     Source\Common\Objects\ConstructionInfo.js + ^
     Source\Common\Objects\MerchantsUnderwayInfo.js + ^
     Source\Common\Objects\TroopDetailsInfo.js + ^
     Source\Common\Objects\CulturePointsInfo.js + ^
     Source\Common\Objects\TownHallInfo.js + ^
     Source\Common\Objects\TrainingInfo.js + ^
     Source\Common\Objects\UpgradeInfo.js + ^
     Source\GeneralInfo.js + Source\Common\UserInfo.js + ^
     Source\Common\CommonUI1.js + Source\Common\CommonUI.js + ^
     Source\Common\Toolbar.js + Source\Common\Tooltip.js + ^
     Source\Common\Controls\ModalWindow.js + ^
     Source\Common\Controls\UpDown.js + ^
     Source\Common\Controls\RollDown.js + ^
     Source\Common\Controls\MeterBar.js + ^
     Source\Common\VillageInfo.js + Source\Common\Buildings.js + Source\Common\BuildingsInfo.js + ^
     Source\Common\Objects\TravianMenu.js + Source\TravianMenu.js + ^
     Source\Obsolete.js + Source\getResourcesInfo.js + Source\Common\Resources.js + ^
     Source\Common\Units.js + ^
     Source\getGeneralData.js + Source\Specific.js + Source\getOuterBuildings.js + Source\getInnerBuildings.js + ^
     Source\getStatisticsMenu.js + ^
     Source\AllPages.js + Source\BigIcons.js + ^
     Source\Common\Links.js + Source\Common\ExternalTools.js + ^
     Source\inlineMessagesLinks.js + Source\Common\inlineLinks.js + ^
     Source\getTBOptionsDefaults.js + Source\Common\TBSetup.js + Source\Common\TBUpdate.js + ^
     Source\Common\BiP.js + Source\getBiP.js + ^
     Source\Common\TM.js + ^
     Source\Common\TroopInfoTooltip.js + Source\Common\TroopsAttDefInfo.js + Source\Common\TroopMerchantDistInfo.js + ^
     Source\MessagesSpecific.js + Source\Common\Messages.js + ^
     Source\ProfileAllianceSpecific.js + Source\Common\ProfileAlliance.js + ^
     Source\ProfilePlayerSpecific.js + Source\Common\ProfilePlayer.js + ^
     Source\Common\Map.js + Source\MapSpecific.js + ^
     Source\Common\Bookmarks.js + Source\Common\Noteblock.js + ^
     Source\Common\ResourcesBar.js + Source\Common\SearchBar.js + ^
     Source\Dorf1Specific.js + Source\Common\Dorf1.js + ^
     Source\Dorf2Specific.js + Source\Common\Dorf2.js + ^
     Source\Overview.js + Source\Dorf3Specific.js + Source\Common\Dorf3.js + Source\Common\Dorf3_Refresh.js + ^
     Source\MarketSpecific.js + Source\Common\MarketCommon.js + Source\Common\MarketSend.js + Source\Common\MarketOffer.js + Source\Common\MarketRoutes.js + ^
     Source\PositionDetails.js + ^
     Source\RallyPointSpecific.js + Source\Common\RallyPointOverview.js + Source\Common\RallyPointSend.js + Source\Common\RallyPointDismiss.js + ^
     Source\Common\Culture.js + Source\Common\TownHall.js + Source\Common\UpgradeBuilding.js + ^
     Source\TrainingSpecific.js + Source\Common\TrainingBuilding.js + ^
     Source\VillagesList.js + Source\SideBars.js + ^
     Source\Common\VillagesList2.js + ^
     Source\Common\Timers.js + ^
     Source\Main2.js + Source\Common\Tail.js ^

     "%$WF%" /B > NUL


:BuildRelease
@ECHO Build release r%VES_REVISION%...
m4 -P -E -IInclude -D__DEBUG__=0 TB.m4  Source\Head.js > "%$WF1%" 2> %$M4ERR%
m4 -P -E -IInclude -D__DEBUG__=0 TB.m4  "%$WF%" > "%$WF2%" 2> %$M4ERR%
IF EXIST ..\Tools\Jazmin.exe (
   cat "%$WF2%" | ..\Tools\Jazmin.exe | cat "%$WF1%" - > "Install\Release\%$TF%.user.js"
) ELSE (
   COPY "%$WF2%" + "%$WF1%" "Install\Release\%$TF%.user.js" /B >NUL
)


:BuildDebug
@ECHO Build debug r%VES_REVISION%...
COPY Source\Head.js + "%$WF%" "%$WF1%" /B > NUL
m4 -P -E -IInclude -D__DEBUG__=2 TB.m4  "%$WF1%" > "Install\Debug\%$TF%D.user.js" 2> %$M4ERR%

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
