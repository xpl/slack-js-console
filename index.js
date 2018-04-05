const log = require ('ololog').handleNodeErrors ()
const { yellow } = require ('ansicolor')

const { WebClient } = require ('@slack/client')
const { accessToken } = require ('./config.json')

if (accessToken) {
    log.bright.green ('Using access token:', yellow (accessToken))
} else {
    log.bright.red ('No access token provided! Please check your config.json')
}

