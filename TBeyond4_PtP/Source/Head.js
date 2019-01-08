// ==UserScript==
// @name 	VES_NAME
// @version 	4.VER_MAJOR.VER_MINOR.VES_REVISION
// @author	npocmu (Black_Cat, ms99, Nux, Lux, onetmt, Velonis Petros, Richard Laffers, Szabka, Victor Garcia-aka Croc-)
// @namespace 	T4
// @description	VES_COMMENT M4_DEBUG({{DEBUG build}})
// @source 	http://userscripts.org/scripts/show/TB_USO_NO
// @identifier 	http://userscripts.org/scripts/show/TB_USO_NO.user.js
// @copyright	© npocmu 2011-2013,2018-2019, © Black_Cat 2010 © ms99, 2008-2010 (parts of this script © Nux, Lux, onetmt, Velonis Petros, Richard Laffers, Szabka, Victor Garcia-aka Croc-)
// @license 	Creative Commons Attribution-Noncommercial-Share Alike 3.0 Germany License
// @grant 	GM_getValue
// @grant 	GM_setValue
// @grant 	GM_deleteValue
// @grant 	GM_log
// @grant 	GM_addStyle
// @grant 	GM_xmlhttpRequest
// @grant       unsafeWindow
// @run-at      document-end
// @include 	*://*.travian*.*/*.php*
// @exclude 	*://*.travian*.*/
// @exclude 	*://*.travian*.*/hilfe.php*
// @exclude	*://*.travian*.*/log*.php*
// @exclude 	*://*.travian*.*/index.php*
// @exclude 	*://*.travian*.*/anleitung.php*
// @exclude 	*://*.travian*.*/impressum.php*
// @exclude 	*://*.travian*.*/anmelden.php*
// @exclude 	*://*.travian*.*/gutscheine.php*
// @exclude 	*://*.travian*.*/spielregeln.php*
// @exclude 	*://*.travian*.*/links.php*
// @exclude 	*://*.travian*.*/geschichte.php*
// @exclude 	*://*.travian*.*/gold.php*
// @exclude 	*://*.travian*.*/tutorial.php*
// @exclude 	*://*.travian*.*/manual.php*
// @exclude 	*://*.travian*.*/manual.php*
// @exclude 	*://*.travian*.*/ajax.php*
// @exclude 	*://*.travian*.*/ad/*
// @exclude 	*://*.travian*.*/chat/*
// @exclude 	*://forum.travian*.*
// @exclude 	*://board.travian*.*
// @exclude 	*://shop.travian*.*
// @exclude 	*://*.travian*.*/activate.php*
// @exclude 	*://*.travian*.*/support.php*
// @exclude  	*://help.travian*.*
// @exclude  	*://analytics.traviangames.com/*
// @exclude 	*://*.traviantoolbox.com/*
// @exclude 	*://*.traviandope.com/*
// @exclude 	*://*.travianteam.com/*
// @exclude 	*://travianutility.netsons.org/*
// @exclude 	*.css
// @exclude 	*.js
// ==/UserScript==

/**
*The original script from Victor Garcia (aka Croc) is licensed under the
*Creative Commons Attribution-NonCommercial-ShareAlike 2.5 Spain License
*To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/2.5/es/
*
*The updated script from ms99 is licensed under the
*Creative Commons Attribution-Noncommercial-Share Alike 3.0 Germany License
*To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/de/
*
*An English translation of the "Creative Commons Attribution-Noncomercial-Share Alike 3.0 License"
*can be found here http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en
/*****************************************************************************
*Copyright © npocmu 2011-2013,2018-2019
*Copyright © ms99, 2008-2010
*Parts of this script Copyright © Nux, 2008
*Setup page behavior Copyright © Lux, 2008
*Big icons behavior (except default & except Setup) Copyright © onetmt, 2009
*Until then & Residue calculations Copyright © Velonis Petros (mail: velonis.gr) , 2009
*Parts of this script Copyright © Szabka, 2008
*Initial script Copyright Victor Garcia (aka Croc) ©, 2007
*Parts of this script (functions for moving a report/message displayed as a pop-up with the mouse) Copyright © Richard Laffers, 2007
*
*Parts of this code are provided or based on ideas and/or code written by others
*Additional images embedded in this script provided by ms99, Nux, Lux, DMaster, Brains, fr3nchlover, CuPliz13
*Translations to different languages are provided by users of this script
*
*IMPORTANT CONTRIBUTIONS TO THIS SCRIPT (listed in alphabetical order):
*ACE, Acr111, BmW, Brains, Chu Chee Meng, CuPliz13, Dakkie, digital012, david.macej, DMaster, Dream1, EXEMOK, ezGertieY,
*FitForTheLooneyVille, friedturnip, fr3nchlover, GotGs, Lassie, Lux, MarioCheng, matteo466, MrRyMan, napkin, Nux, onetmt,
*phob0z, rtellezi, Rypi, Sag, samad909, someweirdnobody, Thornheart, vampiricdust, Velonis Petros, yabash, zerokmatrix, Zippo
*
*Please have understanding if I've forgotten somebody with a relevant contribution to this script
*Please send a message via the userscripts.org mailing facility, for credits
*
*Other contributors' (nick)names may be provided in the header of (or inside) the functions
*SPECIAL THANKS to all contributors and translators of this script !
*
*FUCK-OFF swarnava/piece of stinky shit ! You're only a stupid, idiot copy-paster ! We all reject you as you're nothing else than an abortion !
*****************************************************************************/

