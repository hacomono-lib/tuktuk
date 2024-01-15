#!/usr/bin/env node
import { run } from '@tuktuk/core'
import { defineCommand, runMain } from 'citty'
import { description } from '../../../package.json'
import { version }  from '../package.json'
import { loadConfig } from './config'

const command = defineCommand({
  meta: {
    name: 'tuktuk',
    version,
    description,
  },
  async run(context) {
    const config = await loadConfig()
    await run(config)
  },
})

runMain(command)
