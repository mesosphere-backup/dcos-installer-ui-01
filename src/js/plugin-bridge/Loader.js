// Provide webpack contexts for smarter build. Without these,
// webpack will try to be smart and auto create the contexts,
// doubling the built output
const requireExternalPlugin = require.context('../../../.external_plugins', true, /index/);
const requireComponents = require.context('../components', false);
const requireConstants = require.context('../constants', false);
const requireConfig = require.context('../config', false);
const requireIcons = require.context('../components/icons', false);
const requireUtils = require.context('../utils', false);

let pluginsList = {};
let externalPluginsList;

// Try loading the list of plugins.
try {
  externalPluginsList = requireExternalPlugin('./index');
} catch (err) {
  externalPluginsList = {};
}

// Return all available plugins
function getAvailablePlugins() {
  return {
    pluginsList,
    externalPluginsList
  };
}

/**
 * Removes a part of a filepath
 * @param  {Array} dirs    - Array of directories representing the path to a file
 * @param  {Int} atIndex - Index of directory to remove
 * @return {String}         - New path to file
 */
function removeDir(dirs, atIndex) {
  dirs.splice(atIndex, 1);
  return dirs.join('/');
}

/**
 * Finds component within subdirectories of components/
 * @param  {String} path - Path to module
 * @return {module}      - result of require
 */
function pluckComponent(path) {
  let dirs = path.split('/');
  switch (dirs[1]) {
    case 'icons':
      return requireIcons(removeDir(dirs, 1));
    default:
      return requireComponents(path);
  }
}

/**
 * Dynamic require of module with base directory and name
 * @param  {String} dir  - base directory of module
 * @param  {String} name - name of module
 * @return {module}      - result of require
 */
function requireModule(dir, name) {
  let path = './' + name;
  switch (dir) {
    case 'components':
      return pluckComponent(path);
    case 'constants':
      return requireConstants(path);
    case 'config':
      return requireConfig(path);
    case 'externalPlugin':
      return requireExternalPlugin(path);
    case 'utils':
      return requireUtils(path);
    default:
      throw Error('No loader for directory');
  }
}

module.exports = {
  getAvailablePlugins,
  requireModule
};
