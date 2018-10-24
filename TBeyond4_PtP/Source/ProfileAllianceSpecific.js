/////////////////////////////////////////////////////////////////////
function searchAllianceProfileTable()
{
   return __TEST__($xf("//div[@id='details']/table"));
}

/////////////////////////////////////////////////////////////////////
function searchAllianceAuthoritiesTable()
{
   return __TEST__($xf("//div[@id='memberTitles']/table"));
}

/////////////////////////////////////////////////////////////////////
function searchAllianceMembersTable()
{
   return __TEST__($g("member"));
}

/////////////////////////////////////////////////////////////////////
function uiModifyAllianceProfileName(aProfile)
{
   var allyName = aProfile.rows[0].cells[1].textContent;

   aProfile.rows[0].cells[1].innerHTML = " <a href='" + crtPage + "'>" + allyName + "</a>";
}

/////////////////////////////////////////////////////////////////////
function uiModifyAllianceProfileDescription(aProfile)
{
   uiModifyPlayerProfileDescription();
}

