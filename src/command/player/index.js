import pMap from 'p-map';
import emoji from 'node-emoji';

import playerInfo from './info';
import seasonStats from './seasonStats';

import NBA from '../../utils/nba';
import { error } from '../../utils/log';

const catchError = (err, apiName) => {
  error(err);
  console.log('');
  error(`Oops, ${apiName} goes wrong.`);
  error(
    'Please run nba-go again.\nIf it still does not work, feel free to open an issue on https://github.com/xxhomey19/nba-go/issues'
  );
  process.exit(1);
};

// async func to player
const player = async (playerName, option) => {
  // Get new nba info
  await NBA.updatePlayers();

  // Find player
  const _players = await NBA.searchPlayers(playerName);

  // Array map
  pMap(
    // Many player
    _players,
    // Each player
    async _player => {
      // player info
      let commonPlayerInfo;
      // player head line
      let playerHeadlineStats;

      try {
        // const for multi var
        // Destructor
        const {
          // player commong info
          commonPlayerInfo: _commonPlayerInfo,
          // player headline
          playerHeadlineStats: _playerHeadlineStats,
        } = await NBA.playerInfo({
          // wait for player info
          // pass id
          PlayerID: _player.playerId,
        });

        //
        commonPlayerInfo = _commonPlayerInfo;
        playerHeadlineStats = _playerHeadlineStats;
      } catch (err) {
        catchError(err, 'NBA.playerInfo()');
      }

      // Build player info
      // ... means destruct all params and pass in
      if (option.info) {
        playerInfo({ ...commonPlayerInfo[0], ...playerHeadlineStats[0] });
      }

      // If regular season
      if (option.regular) {
        let seasonTotalsRegularSeason;
        let careerTotalsRegularSeason;

        try {
          // Regular season total pt
          // Regular season career total pt
          const {
            seasonTotalsRegularSeason: _seasonTotalsRegularSeason,
            careerTotalsRegularSeason: _careerTotalsRegularSeason,
          } = await NBA.playerProfile({
            PlayerID: _player.playerId,
          });

          seasonTotalsRegularSeason = _seasonTotalsRegularSeason;
          careerTotalsRegularSeason = _careerTotalsRegularSeason;
        } catch (err) {
          catchError(err, 'NBA.playerProfile()');
        }

        // New team?
        commonPlayerInfo[0].nowTeamAbbreviation =
          commonPlayerInfo[0].teamAbbreviation;

        // Final
        seasonStats({
          seasonTtpe: 'Regular Season',
          ...commonPlayerInfo[0],
          seasonTotals: seasonTotalsRegularSeason,
          careerTotals: careerTotalsRegularSeason[0],
        });
      }

      // Play off
      if (option.playoffs) {
        let seasonTotalsPostSeason;
        let careerTotalsPostSeason;
        try {
          const {
            seasonTotalsPostSeason: _seasonTotalsPostSeason,
            careerTotalsPostSeason: _careerTotalsPostSeason,
          } = await NBA.playerProfile({
            PlayerID: _player.playerId,
          });

          seasonTotalsPostSeason = _seasonTotalsPostSeason;
          careerTotalsPostSeason = _careerTotalsPostSeason;
        } catch (err) {
          catchError(err, 'NBA.playerProfile()');
        }

        if (careerTotalsPostSeason.length === 0) {
          console.log(
            `Sorry, ${_player.firstName} ${
              _player.lastName
            } doesn't have any playoffs data ${emoji.get('confused')}`
          );
        } else {
          commonPlayerInfo[0].nowTeamAbbreviation =
            commonPlayerInfo[0].teamAbbreviation;

          seasonStats({
            seasonTtpe: 'Playoffs',
            ...commonPlayerInfo[0],
            seasonTotals: seasonTotalsPostSeason,
            careerTotals: careerTotalsPostSeason[0],
          });
        }
      }
    },
    { concurrency: 1 }
  );
};

export default player;
