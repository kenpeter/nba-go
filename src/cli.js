/* eslint-disable no-param-reassign */

// cmd ui
import program from 'commander';
// text similarity
import didYouMean from 'didyoumean';
// support async await or not
import isAsyncSupported from 'is-async-supported';
// Beautiful cmd text
import chalk from 'chalk';

// Like cron, only update package info
import updateNotifier from 'update-notifier';
// player or game util
import nbaGo from './command';
// Different color for msg
import { error, bold, nbaRed, neonGreen } from './utils/log';
// Load the json
import pkg from '../package.json';

if (!isAsyncSupported()) {
  // It is like babel
  require('async-to-gen/register');
}

// Get package file, then notify...
(async () => {
  await updateNotifier({
    pkg,
  }).notify({ defer: false });
})();

// Get version
program.version(pkg.version);

// e.g. nba-go player name -r
// option: basic info
// option: regular season
// option: playoff
// Help, example
program
  .command('player <name>')
  .alias('p')
  .option('-i, --info', "Check the player's basic information")
  .option('-r, --regular', "Check the player's career regular season data")
  .option('-p, --playoffs', "Check the player's career playoffs data")
  .on('--help', () => {
    console.log('');
    console.log(
      "  Get player's basic information, regular season data and playoffs data."
    );
    console.log('');
    console.log('  Example:');
    console.log(
      `           ${neonGreen(
        'nba-go player Curry'
      )}    => Show both Seth Curry's and Stephen Curry's basic information.`
    );
    console.log(
      `           ${neonGreen(
        'nba-go player Curry -r'
      )} => Show both Seth Curry's and Stephen Curry's regular season data.`
    );
    console.log('');
    console.log(`  For more detailed information, please check the GitHub page: ${neonGreen(
      'https://github.com/xxhomey19/nba-go#player'
    )}
  `);
  })
  .action((name, option) => {
    // Can get option.xxx
    // nba-go player NAME -r -x -a
    if (!option.info && !option.regular && !option.playoffs) {
      option.info = true;
    }

    //
    nbaGo.player(name, option);
  });

// game
// which data, yesterday, today, tomorrow
// filter...
program
  .command('game')
  .alias('g')
  .option('-d, --date <date>', 'Watch games at specific date')
  .option('-y, --yesterday', "Watch yesterday's games")
  .option('-t, --today', "Watch today's games")
  .option('-T, --tomorrow', "Watch tomorrow's games")
  .option('-f, --filter <filter>', 'Filter game choices to watch')
  .on('--help', () => {
    console.log('');
    console.log('  Watch NBA live play-by-play, game preview and box score.');
    console.log("  You have to enter what day's schedule at first.");
    console.log(
      `  Notice that if you don't provide any option, default date will be ${neonGreen(
        'today'
      )}.`
    );
    console.log('');
    console.log('  Example:');
    console.log(
      `           ${neonGreen(
        'nba-go game -d 2017/11/11'
      )} => Show game schedule on 2017/11/11.`
    );
    console.log(
      `           ${neonGreen(
        'nba-go game -t'
      )}            => Show today's game schedule.`
    );
    console.log('');
    console.log(`  For more detailed information, please check the GitHub page: ${neonGreen(
      'https://github.com/xxhomey19/nba-go#game'
    )}
  `);
  })
  .action(option => {
    if (
      !option.date &&
      !option.yesterday &&
      !option.today &&
      !option.tomorrow
    ) {
      option.today = true;
    }
    nbaGo.game(option);
  });

// on long option
program.on('--help', () => {
  console.log('');
  console.log('');
  console.log(
    `  Welcome to ${chalk`{bold.hex('#0069b9') NBA}`} ${nbaRed('GO')} !`
  );
  console.log('');
  console.log(
    `  Wanna watch NBA game please enter: ${neonGreen('nba-go game')}`
  );
  console.log(
    `  Wanna check NBA player information please enter: ${neonGreen(
      'nba-go player <name>'
    )}`
  );
  console.log('');
  console.log(
    `  For more detailed information please check the GitHub page: ${neonGreen(
      'https://github.com/xxhomey19/nba-go'
    )}`
  );
  console.log(
    `  Or enter ${neonGreen('nba-go game -h')}, ${neonGreen(
      'nba-go player -h'
    )} to get more helpful information.`
  );
  console.log('');
});

// Check version from package.json
program.option('-v --version', pkg.version);

// Any cmd
// .action
program.command('*').action(command => {
  // Error
  error(`Unknown command: ${bold(command)}`);
  // cmds has list of cmd
  // Remove * cmd
  const commandNames = program.commands
    .map(c => c._name)
    .filter(name => name !== '*');

  // Single cmd match cmds
  const closeMatch = didYouMean(command, commandNames);

  if (closeMatch) {
    error(`Did you mean ${bold(closeMatch)} ?`);
  }
  process.exit(1);
});

if (process.argv.length === 2) program.help();

program.parse(process.argv);
