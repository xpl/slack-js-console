(async function main () {
    
    const log = require ('ololog').handleNodeErrors ()
    const { yellow, magenta, cyan } = require ('ansicolor')
    const stringify = require ('string.ify')
    const unescape = require ('lodash.unescape')

    const { RTMClient, WebClient } = require ('@slack/client')
    const { accessToken, channel = 'javascript' } = require ('./config.json')

    if (accessToken !== '<YOUR ACCESS TOKEN HERE>') {
        log.bright.green ('Using access token:', yellow (accessToken))

    } else {
        log.bright.red ('No access token provided! Please check your config.json')
        process.exit (1)
    }

    const rtm = new RTMClient (accessToken)
        , web = new WebClient (accessToken)

    rtm.start ()

    const { channels } = await web.channels.list ()
    const { id } = channels.find (c => c.name === channel)

    rtm.on ('message', async ({ text }) => {

        text = unescape (text).replace (/“|”/g, '"').replace (/‘|’/g, "'")

        log ('Received',  cyan (text))

        try {
            const result = stringify (await eval ('(async () => (' + text + ')) ()'))

            log ('Result is', magenta (result))

            await rtm.sendMessage ('```\n' + result + '```', id)

        } catch (e) {

            await rtm.sendMessage ('```\n' + log.before ('render') (e) + '```', id)
        }
    })

}) ()