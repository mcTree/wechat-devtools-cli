#!/usr/bin/env node

const Lanucher = require("./utils/wrap");
const { devtools } = require("./utils");

Lanucher(async (argv0, argv1, command, ...options) => {
  devtools(command, options)
});
