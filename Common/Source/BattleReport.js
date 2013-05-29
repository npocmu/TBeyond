function battleReportV2(origT, aFrom)
{
   var tx = $xf("//table[@class='std reports_read']//table[@class='std'] | //table[@class='tbg']//table[@class='tbg']", 'l');
   if (tx.snapshotLength < 2) { tx = $xf("//table[@class='std reports_read']//table[@class='tbg']", 'l'); }
   if (tx.snapshotLength < 2) { tx = $xf("//table[starts-with(@id, 'attacker') or starts-with(@class, 'defender')]", 'l'); }
   if (tx.snapshotLength < 2) return false;

   if ( aFrom === "orig" )
   {
      var p1, p2;
      var neworigT = origT.cloneNode(true);
      var divlmid2 = origT.parentNode;
      divlmid2.removeChild(origT);
      divlmid2.appendChild(p2 = $e("p") );
      divlmid2.appendChild(p1 = $e("p",origT));
      //add a paragraph, a table with a text and a checkbox
      var input = $i([['type', 'checkbox'], ['id', 'tb_battlereport']]);
      input.addEventListener("click", function ()
      {
         shoBR(p1, neworigT, origT);
      }, false);

      var ptable = $t([['style', 'background-color:' + TB3O.DFc[1] + '; width:auto;']]);
      var aRow = $r([['class', 'tb3rnb']]);
      var aCell = $c(T('SOREP') + ":", [['class', 'tb3cnb'], ['style', 'text-align:' + docDir[0] + ';']]);
      aRow.appendChild(aCell);
      var bCell = $c("", [['class', 'tb3cnb'], ['style', 'text-align:' + docDir[0] + ';']]);
      bCell.appendChild(input);
      aRow.appendChild(bCell);
      ptable.appendChild(aRow);
      p2.appendChild(ptable);
   }

   //get the total booty info (PLUS accounts)
   var gBooty = $xf("//div[@class='carry']");
   var bgBooty = null;
   if (gBooty) bgBooty = gBooty.cloneNode(true);

   //get the total booty
   var booty = 0;
   var labelReward = gIc["capacity"];
   var imgRes = new Array;
   for (var i = 0; i < 4; i++)
   {
      imgRes[i] = gIc["r" + (i + 1)];
   }
   var stBooty = [0, 0, 0, 0];

   if (TB3O.T35 == false)
   {
      var aX = $xf("//tr[@class='cbg1'] | //table[@class='tbg']//tr", 'l');
      if (aX.snapshotLength >= 3)
      {
         var intToProcess = -1;
         for (var i = 0; i < aX.snapshotLength; i++)
         {
            if (aX.snapshotItem(i).childNodes.length == 4) intToProcess = i;
         }
         if (intToProcess > -1)
         {
            var b = aX.snapshotItem(intToProcess).childNodes[3];
         }
         else
         {
            var b = aX.snapshotItem(1).childNodes[1];
            if (b.innerHTML.indexOf('class="res"') == -1) b = aX.snapshotItem(2).childNodes[1];
         }
         if (b.childNodes.length == 8)
         {
            var qBooty = new Array();
            var infoBooty = '';
            for (var i = 0; i < 4; i++)
            {
               qBooty[i] = parseInt10(b.childNodes[i * 2 + 1].nodeValue);
               infoBooty += imgRes[i];
               infoBooty += qBooty[i];
               infoBooty += (i < 3 ? ' + ' : ' = ');
               stBooty[i] = qBooty[i];
            }
            booty = arrayToInt(qBooty);
            infoBooty += booty;
            b.innerHTML = infoBooty;
            if (bgBooty != null) b.appendChild(bgBooty);
         }
      }
   }
   else
   {
      var aX = tx.snapshotItem(0);
      var infoBooty = '';
      //var b1Table = aX.snapshotItem(0).parentNode;
      var b1Table = aX;
      if (!b1Table.rows[4]) return false;
      var xi = 4;
      var gata = false;
      while (xi < b1Table.rows.length && !gata)
      {
         var bootyCell = b1Table.rows[xi].cells[1];
         if (bootyCell.textContent.indexOf("|") != -1) gata = true;
         xi += 1;
      }
      if (gata)
      {
         var resInfo = bootyCell;
         for (var xi = 0; xi < bootyCell.childNodes.length; xi++)
         {
            var aChild = bootyCell.childNodes[xi];
            if (aChild.className == "goods" || aChild.className == "res") resInfo = aChild;
         }
         var aqBooty = resInfo.textContent.split("|");
         if (aqBooty.length > 1)
         {
            var qBooty = new Array();
            for (var i = 0; i < 4; i++)
            {
               qBooty[i] = parseInt10(aqBooty[i].replace(" ", "").replace(" ", ""));
               infoBooty += imgRes[i];
               infoBooty += qBooty[i];
               if (i < 3) infoBooty += ' + ';
               else infoBooty += ' = ';
               stBooty[i] = qBooty[i];
            }
            booty = arrayToInt(qBooty);
            infoBooty += booty;
            bootyCell.innerHTML = infoBooty;
            if (bgBooty != null) bootyCell.appendChild(bgBooty);
         }
      }
   }

   var arrLoss = new Array();
   var arrCarry = new Array();
   //there are more tables for the attack (1 = attacker, 1 = attacked and x = reinforcements)
   //tadPower => 0 = attack power; 1 = def_i power; 2 = def_c power; 3 = total loss; 4 = loss res 1; 5 = loss res 2; 6 = loss res 3; 7 = loss ress 4; 8 = crop consumption of killed troops; 9 = hero no.; 10 = crop consumption of initial troops
   var tadPower = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
   var atkLabelCell;
   var defLabelCell;
   var brCell = tx.snapshotItem(0).parentNode;

   for (var g = 0; g < tx.snapshotLength; g++)
   {
      arrCarry[g] = 0;
      tTable = tx.snapshotItem(g);
      attdefPower = [0, 0, 0];
      intNoOfCells = tTable.rows[1].cells.length - 1;
      if (intNoOfCells == 11)
      {
         //corrected by JOPS
         if (g == 0) tadPower[0][9] += 1;
         else tadPower[1][9] += parseInt10(tTable.rows[2].cells[11].textContent);
      }
      if (g == 0) atkLabelCell = tTable.rows[0].cells[0].textContent;
      else defLabelCell = tTable.rows[0].cells[0].textContent;
      for (var j = 1; j < 11; j++)
      {
         tImg = tTable.rows[1].cells[j].getElementsByTagName('img')[0];
         tInd = getTroopIndexTitleFromImg(tImg)[0];
         tNo = parseInt10(tTable.rows[2].cells[j].textContent);
         tNoLost = 0;
         if (tTable.rows[3]) tNoLost = parseInt10(tTable.rows[3].cells[j].textContent);
         if (!isNaN(tNo))
         {
            if (g == 0)
            {
               attdefPower[0] += uc[tInd][5] * tNo;
               tadPower[0][0] += uc[tInd][5] * tNo;
               tadPower[0][1] += uc[tInd][6] * tNo;
               tadPower[0][2] += uc[tInd][7] * tNo;
               tadPower[0][8] += uc[tInd][9] * tNoLost;
               tadPower[0][10] += uc[tInd][9] * tNo;
            }
            else
            {
               attdefPower[0] += uc[tInd][5] * tNo;
               attdefPower[1] += uc[tInd][6] * tNo;
               attdefPower[2] += uc[tInd][7] * tNo;
               tadPower[1][0] += uc[tInd][5] * tNo;
               tadPower[1][1] += uc[tInd][6] * tNo;
               tadPower[1][2] += uc[tInd][7] * tNo;
               tadPower[1][8] += uc[tInd][9] * tNoLost;
               tadPower[1][10] += uc[tInd][9] * tNo;
            }
         }
         u = uc[tInd];
         p = tTable.rows[3] ? tTable.rows[3].cells[j].innerHTML : 0;
         ptu = arrayByN(u, p);
         arrLoss[g] = arrayAdd(arrLoss[g], ptu.slice(0, 4));
         arrCarry[g] += (tTable.rows[2] ? tTable.rows[2].cells[j].innerHTML - p : 0) * u[4];
      }
      //add the attack/def power to the row[1].cells[0]
      var attdefCell = tTable.rows[1].cells[0];
      if (g == 0)
      {
         //the attacking power
         $at(attdefCell, [['style', 'font-size:8pt; color:#FF8000; text-align:center;']]);
         attdefCell.innerHTML = $ls(attdefPower[0]) + " " + gIc["att_all"];
      }
      else
      {
         //the defense power of the defender (per table)
         $at(attdefCell, [['style', 'font-size:8pt; color:green; text-align:center;']]);
         attdefCell.innerHTML = $ls(attdefPower[1]) + " " + gIc["def_i"] + "<br>" + $ls(attdefPower[2]) + " " + gIc["def_c"];
      }

      //add the loss row to the att/def table
      var iHTML = '';
      for (var i = 0; i < 4; i++)
      {
         iHTML += imgRes[i];
         iHTML += arrLoss[g][i];
         if (i < 3) iHTML += ' + ';
         else iHTML += ' = ';
         if (g == 0) tadPower[0][4 + i] += arrLoss[g][i];
         else tadPower[1][4 + i] += arrLoss[g][i];
      }
      var lossTotal = arrayToInt(arrLoss[g]);
      if (g == 0) tadPower[0][3] += lossTotal;
      else tadPower[1][3] += lossTotal;
      if (lossTotal > 0) iHTML += " <b><font color='red'>" + lossTotal + "</font></b>";
      else iHTML += lossTotal;
      var informe = $c(iHTML, [['colspan', intNoOfCells]]);
      var aRow = $r();
      aRow.appendChild($c(T('LOSS'), [['style', 'text-align:left;']]));
      aRow.appendChild(informe);
      tTable.appendChild(aRow);

      //For the attacker we'll compute the profit and efficiency of the attack
      if (g == 0)
      {
         //Profit compared to lossTotal
         var profit = 0;
         if (arrCarry[g] == 0)
         {
            booty = 0;
            for (var i = 0; i < 4; i++)
            {
               stBooty[i] = 0;
            }
         }
         else
         {
            profit = ((booty - lossTotal) * 100 / booty).toFixed(2);
         }
         if (booty == 0) if (lossTotal == 0) profit = 0;
         else profit = -100;
         var bCell = $c(profit + "%", [['colspan', intNoOfCells]]);
         var pRow = $r();
         pRow.appendChild($c(T('PROFIT'), [['style', 'text-align:left;']]));
         pRow.appendChild(bCell);
         tTable.appendChild(pRow);

         //Efficiency -> the entire booty compared to how much the attacker can carry back (considering only the troops that survived)
         var efficiency = 100 - ((arrCarry[g] - booty) * 100 / arrCarry[g]);
         if (arrCarry[g] == 0) efficiency = 0;
         var bCell = $c(efficiency.toFixed(2) + "% (" + booty + "/" + arrCarry[g] + ")", [['colspan', intNoOfCells]]);
         var eRow = $r();
         eRow.appendChild($c(T('EFICIENCIA'), [['style', 'text-align:left;']]));
         eRow.appendChild(bCell);
         tTable.appendChild(eRow);
      }
   }

   //add a simple statistics table
   var sTable = $t([['id', 'br_table']]);
   //add the title row
   var sTitleRow = $r();
   sTitleRow.appendChild($c(T('STAT'), [['class', 'tb3cbrh1']]));
   sTitleRow.appendChild($c(atkLabelCell, [['class', 'tb3cbrh2']]));
   sTitleRow.appendChild($c(defLabelCell, [['class', 'tb3cbrh3']]));
   sTable.appendChild(sTitleRow);
   //attack power row
   var atkRow = $r();
   atkRow.appendChild($c(gIc["att_all"], [['class', 'tb3cbrc']]));
   atkRow.appendChild($c($ls(tadPower[0][0])));
   atkRow.appendChild($c($ls(tadPower[1][0])));
   sTable.appendChild(atkRow);
   //def power rows
   var defiRow = $r();
   defiRow.appendChild($c(gIc["def_i"], [['class', 'tb3cbrc']]));
   defiRow.appendChild($c($ls(tadPower[0][1])));
   defiRow.appendChild($c($ls(tadPower[1][1])));
   sTable.appendChild(defiRow);
   var defcRow = $r();
   defcRow.appendChild($c(gIc["def_c"], [['class', 'tb3cbrc']]));
   defcRow.appendChild($c($ls(tadPower[0][2])));
   defcRow.appendChild($c($ls(tadPower[1][2])));
   sTable.appendChild(defcRow);
   //reward row (for the attacker only)
   var rewATotal = $c($ls(booty) + (TB3O.O[64] == '1' ? " " + T('TOTAL') : ''), [['class', 'tb3cbrbg']]);
   var rewRow1 = $r();
   var intDetailRowSpan = 1 + parseInt10(TB3O.O[64]);
   var rewLabelCell = $c(labelReward, [['class', 'tb3cbrc'], ['rowspan', intDetailRowSpan]]);
   rewRow1.appendChild(rewLabelCell);
   if (TB3O.O[64] == '1')
   {
      var rewA = '';
      for (var i = 1; i < 5; i++)
      {
         rewA += $ls(stBooty[i - 1]) + " " + imgRes[i - 1] + "<br>";
      }
      rewADetail = $c(rewA, [['class', 'tb3cbrg']]);
      rewRow1.appendChild(rewADetail);
   }
   else rewRow1.appendChild(rewATotal);
   rewRow1.appendChild($c('-', [['class', 'tb3cbrb'], ['rowspan', intDetailRowSpan]]));
   sTable.appendChild(rewRow1);
   if (TB3O.O[64] == '1')
   {
      var rewRow2 = $r();
      rewRow2.appendChild($c($ls(booty) + " " + T('TOTAL'), [['class', 'tb3cbrbg']]));
      sTable.appendChild(rewRow2);
   }
   //loss row
   var strLossATotal = $ls(tadPower[0][3]) + (TB3O.O[64] == '1' ? " " + T('TOTAL') : '');
   var lossATotal = $c(strLossATotal, [['class', 'tb3cbrb']]);
   if (tadPower[0][3] > 0) $at(lossATotal, [['class', 'tb3cbrbr']]);
   var strLossDTotal = $ls(tadPower[1][3] + booty) + (TB3O.O[64] == '1' ? " " + T('TOTAL') : '');
   lossDTotal = $c(strLossDTotal, [['class', 'tb3cbrb']]);
   if (tadPower[1][3] + booty > 0) $at(lossDTotal, [['class', 'tb3cbrbr']]);
   var lossRow1 = $r();
   lossRow1.appendChild($c(T('LOSS'), [['class', 'tb3cbrc'], ['rowspan', intDetailRowSpan]]));
   if (TB3O.O[64] == '1')
   {
      var iLossA = '';
      var iLossD = '';
      for (var i = 1; i < 5; i++)
      {
         iLossA += $ls(tadPower[0][i + 3]) + " " + imgRes[i - 1] + "<br>";
         iLossD += $ls(tadPower[1][i + 3] + stBooty[i - 1]) + " " + imgRes[i - 1] + "<br>";
      }
      var lossADetail = $c(iLossA);
      if (tadPower[0][3] > 0) $at(lossADetail, [['class', 'tb3cbrr']]);
      lossRow1.appendChild(lossADetail);
      var lossDDetail = $c(iLossD);
      if (tadPower[1][3] + booty > 0) $at(lossDDetail, [['class', 'tb3cbrr']]);
      lossRow1.appendChild(lossDDetail);
   }
   else
   {
      lossRow1.appendChild(lossATotal);
      lossRow1.appendChild(lossDTotal);
   }
   sTable.appendChild(lossRow1);
   if (TB3O.O[64] == '1')
   {
      var lossRow2 = $r();
      lossRow2.appendChild(lossATotal);
      lossRow2.appendChild(lossDTotal);
      sTable.appendChild(lossRow2);
   }
   //crop consumption of initial troops
   var ccRow = $r();
   ccRow.appendChild($c(gIc["r5"], [['class', 'tb3cbrc']]));
   ccRow.appendChild($c(tadPower[0][10] + " (-" + tadPower[0][8] + ")"));
   ccRow.appendChild($c(tadPower[1][10] + " (-" + tadPower[1][8] + ")"));
   sTable.appendChild(ccRow);
   //hero row
   var heroRow = $r();
   heroRow.appendChild($c(gIc["hero"], [['class', 'tb3cbrc']]));
   var accA = (tadPower[0][9] > 0 ? tadPower[1][8] : 0);
   var accD = (tadPower[1][9] > 0 ? Math.floor(tadPower[0][8] / tadPower[1][9]) : 0);
   heroRow.appendChild($c(accA, [['class', 'tb3cbrb']]));
   heroRow.appendChild($c(accD, [['class', 'tb3cbrb']]));
   sTable.appendChild(heroRow);
   //simple paragraph
   brCell.appendChild($e("P"));
   brCell.appendChild(sTable);

   return true;

   function shoBR(aP, nT, oT)
   {
      var iC = $g("tb_battlereport");
      if ( iC )
      {
         if ( iC.checked )
         {
            aP.removeChild(oT);
            aP.appendChild(nT);
         }
         else
         {
            aP.removeChild(nT);
            aP.appendChild(oT);
         }
      }
   }
}

