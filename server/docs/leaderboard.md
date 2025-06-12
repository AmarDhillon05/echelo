
GET /
just returns "hello" type beat



POST /createLeaderboard
params: {
    name, 
    host,
}
returns confirmation



POST /createSubmission
params: {
    name, 
    leaderboard, 
    contributors, 
    ... (anything specified in required)
}
returns confirmation