// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure .ico files are treated as assets
config.resolver.assetExts.push('ico');

module.exports = config;