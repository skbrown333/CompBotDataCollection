import axios from "axios";
import * as Mongoose from "mongoose";
import { MatchModel } from "./models/Matches/match.model";
import { ChampionModel } from "./models/Champions/champion.model";
import * as Discord from "discord.js";

Mongoose.connect("mongodb://localhost:27017/compBot");

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const RIOT_TOKEN = process.env.RIOT_TOKEN;
const LEAGUE = process.argv[2];

const client = new Discord.Client();
let channel;
client.login(DISCORD_TOKEN);

//@ts-ignore
client.on("ready", () => {
  channel = client.channels.cache.get("709396049692721152");
  getPlayers({ queue: 420 });
});

let axiosInstance = axios.create({
  baseURL: "https://na1.api.riotgames.com/lol/",
  timeout: 10000,
  headers: { "X-Riot-Token": RIOT_TOKEN },
});

/**
 * Get a list of populated matches based on a list of players
 *
 * @param {Object} params - params for filtering player matches
 */
async function getPlayers(params) {
  let page = 1;
  let done = false;
  let division = 4;
  while (division >= 1) {
    while (!done) {
      try {
        let matchCount = await MatchModel.countDocuments();
        logProgress(channel, LEAGUE, getDivision(division), page, matchCount);
        let url = `league/v4/entries/RANKED_SOLO_5x5/${LEAGUE}/${getDivision(
          division
        )}`;
        let response = await axiosInstance.get(url, {
          params: {
            page,
          },
        });
        let players = response.data;
        if (!players.length) {
          done = true;
          break;
        }
        for (let i = 0; i < players.length; i++) {
          let player = players[i];
          await populatePlayer(player, params);
        }
        page++;
      } catch (error) {
        logError(channel, error);
        done = true;
        break;
      }
    }
    division--;
  }
}

async function populatePlayer(player, params) {
  let summonerUrl = encodeURI(
    `summoner/v4/summoners/by-name/${player.summonerName}`
  );
  try {
    let response = await axiosInstance.get(summonerUrl);
    let playerAccount = response.data;

    let matchUrl = encodeURI(
      `match/v4/matchlists/by-account/${playerAccount.accountId}`
    );
    let matchConfig = {
      params,
    };
    response = await axiosInstance.get(matchUrl, matchConfig);
    let matchList = response.data.matches;

    for (let j = 0; j < matchList.length; j++) {
      let match = matchList[j];
      let matchExists = await MatchModel.findById(match.gameId);
      if (matchExists) continue;
      populateMatch(match);
      await timer(2000);
    }

    return matchList;
  } catch (error) {
    logError(channel, error);
  }
}

async function populateMatch(match) {
  let matchUrl = encodeURI(`match/v4/matches/${match.gameId}`);
  let CHAMPIONS = await buildChampionMap();

  try {
    let response = await axiosInstance.get(matchUrl);
    let populatedMatch = response.data;
    let champs = [];
    for (let i = 0; i < populatedMatch.participants.length; i++) {
      let par = populatedMatch.participants[i];
      await ChampionModel.updateOneOrCreate({
        _id: par.championId,
        name: CHAMPIONS[par.championId],
        dmg_taken: par.stats.totalDamageTaken,
        dmg_mitigated: par.stats.damageSelfMitigated,
        cc_duration: par.stats.totalTimeCrowdControlDealt,
        healing: par.stats.totalHeal,
        magic_dmg: par.stats.magicDamageDealtToChampions,
        physical_dmg: par.stats.physicalDamageDealtToChampions,
        true_dmg: par.stats.trueDamageDealtToChampions,
      });
      champs.push(par.championId);
    }
    let winner = populatedMatch.teams[0].win === "Win" ? 0 : 1;
    let params = {
      _id: populatedMatch.gameId,
      league: LEAGUE,
      winning_team: winner,
      match_length: populatedMatch.gameDuration,
      team_0: champs.slice(0, 5),
      team_1: champs.slice(5, champs.length),
    };

    await MatchModel.findOneOrCreate(params);
  } catch (error) {
    logError(channel, error);
  }
}

/**
 * Builds a object for mapping championId to
 * champion name
 */
async function buildChampionMap() {
  try {
    let response = await axiosInstance.get(
      "http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion.json"
    );
    let champions = response.data.data;
    let map = {};
    let championKeys = Object.keys(champions);

    for (let i = 0; i < championKeys.length; i++) {
      let key = championKeys[i];
      let champion = champions[key];
      map[champion.key] = champion.name;
    }

    return map;
  } catch (error) {
    logError(channel, error);
  }
}

function getDivision(division) {
  switch (division) {
    case 4:
      return "IV";
    case 3:
      return "III";
    case 2:
      return "II";
    case 1:
      return "I";
  }
}

function logError(channel, error) {
  if (error.response) {
    channel.send(
      `\`\`\`ERROR\ncode: ${error.response.status}\nmessage: ${error.response.statusText}\`\`\` `
    );
  } else {
    channel.send(`\`\`\`ERROR\n${error}\`\`\` `);
  }
}

function logProgress(channel, league, division, page, count) {
  channel.send(
    `\`\`\`${league} ${division}\n\tpage: ${page}\n\tmatches: ${count}\`\`\` `
  );
}

function timer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
