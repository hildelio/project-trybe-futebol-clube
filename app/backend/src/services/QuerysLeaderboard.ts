const QueryHome = `SELECT TMS.team_name AS name,
SUM(MTS.home_team_goals > MTS.away_team_goals) * 3 +
SUM(MTS.home_team_goals = MTS.away_team_goals) AS totalPoints,
COUNT(*) AS totalGames,
SUM(MTS.home_team_goals > MTS.away_team_goals) AS totalVictories,
SUM(MTS.home_team_goals = MTS.away_team_goals) AS totalDraws,
SUM(MTS.home_team_goals < MTS.away_team_goals) AS totalLosses,
SUM(MTS.home_team_goals) AS goalsFavor,
SUM(MTS.away_team_goals) AS goalsOwn,
SUM(MTS.home_team_goals - MTS.away_team_goals) AS goalsBalance,
ROUND((SUM(MTS.home_team_goals > MTS.away_team_goals) * 3 +
    SUM(MTS.home_team_goals = MTS.away_team_goals)) / (COUNT(*) * 3) * 100, 2) AS efficiency
FROM TRYBE_FUTEBOL_CLUBE.matches AS MTS
JOIN TRYBE_FUTEBOL_CLUBE.teams AS TMS ON MTS.home_team_id = TMS.id
WHERE MTS.in_progress = 0
GROUP BY TMS.team_name
ORDER BY totalPoints DESC, totalVictories DESC, goalsBalance DESC, goalsFavor DESC;`;

const QueryAway = `SELECT TMS.team_name AS name,
SUM(MTS.away_team_goals > MTS.home_team_goals) * 3 +
SUM(MTS.away_team_goals = MTS.home_team_goals) AS totalPoints,
COUNT(*) AS totalGames,
SUM(MTS.away_team_goals > MTS.home_team_goals) AS totalVictories,
SUM(MTS.away_team_goals = MTS.home_team_goals) AS totalDraws,
SUM(MTS.away_team_goals < MTS.home_team_goals) AS totalLosses,
SUM(MTS.away_team_goals) AS goalsFavor,
SUM(MTS.home_team_goals) AS goalsOwn,
SUM(MTS.away_team_goals - MTS.home_team_goals) AS goalsBalance,
ROUND((SUM(MTS.away_team_goals > MTS.home_team_goals) * 3 +
    SUM(MTS.away_team_goals = MTS.home_team_goals)) / (COUNT(*) * 3) * 100, 2) AS efficiency
FROM TRYBE_FUTEBOL_CLUBE.matches AS MTS
JOIN TRYBE_FUTEBOL_CLUBE.teams AS TMS ON MTS.away_team_id = TMS.id
WHERE MTS.in_progress = 0
GROUP BY TMS.team_name
ORDER BY totalPoints DESC, totalVictories DESC, goalsBalance DESC, goalsFavor DESC;`;

export {
  QueryHome,
  QueryAway,
};
