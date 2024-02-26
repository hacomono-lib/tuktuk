---
title: Development
description: How to develop tuktuk.
---

## Setup

1. Install [Figma Desktop App.](https://www.figma.com/ja/downloads/)
2. Install [Node.js](https://nodejs.org/) and [yarn](https://yarnpkg.com/).

## Start development

1. clone [this repository](https://github.com/hacomono-lib/tuktuk).
2. run `yarn install` to install dependencies.
3. run `yarn dev` to start the development server.

## Install Local Figma plugin

1. run `yarn dev` and check to exists `./packages/plugin-figma/manifest.json`
2. Open Figma Desktop App and open any file.
3. Click Menu > Plugins > Development > `Import plugin from manifest...`
4. select `manifest.json`
5. Click Menu > Plugins > Development > `tuktuk`
