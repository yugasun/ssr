#!/usr/bin/env node

import { spawn } from 'child_process'
import * as yargs from 'yargs'
import { Argv } from 'ssr-types'
import { parseYml, parseRoutesFromYml, parseFeRoutes, processError } from 'ssr-server-utils'
import { init } from './init'

const ymlContent = parseYml('./f.yml')
const ymlRoutes = parseRoutesFromYml(ymlContent)

try {
  yargs
    .command('init', 'init Project', {}, async (argv: Argv) => {
      await init()
    })
    .command('start', 'Start Server', {}, async (argv: Argv) => {
      process.env.NODE_ENV = 'development'
      const { start } = require('./start')
      argv.faasRoutes = ymlRoutes
      await parseFeRoutes(argv)
      await start(argv)
    })
    .command('build', 'build server and client files', {}, async (argv: Argv) => {
      process.env.NODE_ENV = 'production'
      const { build } = require('./build')
      argv.faasRoutes = ymlRoutes
      await parseFeRoutes(argv)
      await build(argv)
    })
    .command('deploy', 'deploy function to aliyun cloud or tencent cloud', () => {
      const { stdout } = spawn('node', ['node_modules/.bin/f.js', 'deploy'])

      stdout.on('data', (data) => {
        console.log(data.toString())
      })
    })
    .demandCommand(1, 'You need at least one command before moving on')
    .option('version', {
      alias: 'v',
      default: false
    })
    .parse()
} catch (error) {
  processError(error)
}
