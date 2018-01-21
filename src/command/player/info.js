// color
import chalk from 'chalk';

// date format info
import format from 'date-fns/format';
// Color
import { getMainColor } from 'nba-color';

// cm and kg lib
import { convertToCm, convertToKg } from '../../utils/convertUnit';
// table
import table from '../../utils/table';
// log bold
import { bold } from '../../utils/log';

// Align center
const alignCenter = columns =>
  columns.map(content => ({ content, hAlign: 'center', vAlign: 'center' }));

// Player detail info
const info = playerInfo => {
  const playerTable = table.basicTable();
  const {
    teamAbbreviation,
    jersey,
    displayFirstLast,
    height,
    weight,
    country,
    birthdate,
    seasonExp,
    draftYear,
    draftRound,
    draftNumber,
    pts,
    reb,
    ast,
  } = playerInfo;

  const teamMainColor = getMainColor(teamAbbreviation);
  const playerName = chalk`{bold.white.bgHex('${
    teamMainColor ? teamMainColor.hex : '#000'
  }') ${teamAbbreviation}} {bold.white #${jersey} ${displayFirstLast}}`;

  const draft =
    draftYear !== 'Undrafted'
      ? `${draftYear} Rnd ${draftRound} Pick ${draftNumber}`
      : 'Undrafted';

  playerTable.push(
    [{ colSpan: 9, content: playerName, hAlign: 'center', vAlign: 'center' }],
    alignCenter([
      bold('Height'),
      bold('Weight'),
      bold('Country'),
      bold('Born'),
      bold('EXP'),
      bold('Draft'),
      bold('PTS'),
      bold('REB'),
      bold('AST'),
    ]),
    alignCenter([
      `${height} / ${convertToCm(height)}`,
      `${weight} / ${convertToKg(weight)}`,
      country,
      `${format(birthdate, 'YYYY/MM/DD')}`,
      `${seasonExp} yrs`,
      draft,
      pts,
      reb,
      ast,
    ])
  );

  console.log(playerTable.toString());
};

export default info;
