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
   return __TEST__($qf(".allianceMembers"));
}

/////////////////////////////////////////////////////////////////////
function uiModifyAllianceProfileName(aProfile)
{
   var allyName = aProfile.rows[0].cells[1].textContent;
   var aid = crtUrl.queryKey.aid;
   if ( aid !== undefined )
   {
      aProfile.rows[0].cells[1].innerHTML = " <a href='" + crtUrl.path +  "?aid=" + aid + "'>" + allyName + "</a>";
   }
}

/////////////////////////////////////////////////////////////////////
function uiModifyAllianceProfileDescription(aProfile)
{
   uiModifyPlayerProfileDescription();
}

