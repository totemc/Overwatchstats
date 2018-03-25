// Imports
const request = require('superagent')

// Globals
const BASE_URI = 'https://owapi.net/api/v3/u'
const PLATFORMS = ['pc', 'psn', 'xbl']
const REGIONS = ['eu', 'us', 'kr', 'any']

class OWStats {
  /**
   * Stats Constructor
   * @constructor
   * @param {Object} raw - Data passed from load function
   */
  constructor (raw) {
    // Save Raw Data
    this._raw = raw

    // Extract Useful Things
    this._battleTag = raw.meta.battleTag
    this._platform = raw.meta.platform
    this._sourceUrl = raw.meta.sourceUrl
    this._data = raw.body
  }

  /**
   * Check Valid BattleTag
   * @private
   * @param {string} tag - BattleTag to Check
   * @returns {boolean}
   */
  static get _checkBattleTag () { return _checkBattleTag }

  /**
   * Normalise BattleTag
   * @private
   * @param {string} tag - BattleTag to Check
   * @returns {string}
   */
  static get _normalizeTag () { return _normalizeTag }

  static load (tag, pltform = 'pc') {
    // Check Platform
    if (PLATFORMS.indexOf(pltform.toLowerCase()) === -1) throw new Error(`Invalid Platform: '${platform}'`)

    // Validate BattleTag if on PC
    if (pltform.toLowerCase() === 'pc') {
      if (!_checkBattleTag(tag)) console.log('Problem with API');
    }

    // Set Local Variables
    let battleTag = this._battleTag = _normalizeTag(tag)
    let platform = this._platform = pltform.toLowerCase()
    let url = this._url = `${BASE_URI}/${this._battleTag}/blob?platform=${this._platform}`

    return new Promise((resolve, reject) => {
      // Load the data
      request
        .get(url)
        .set('Accept', 'application/json')
        .timeout({
    response: 10000,  // Wait 5 seconds for the server to start sending,
    deadline: 60000, // but allow 1 minute for the file to finish loading.
  })
        .end((err, res) => {
          if (err) { reject(err) } else {
            // Resolve with New Instance
            resolve({
              meta: {
                battleTag: battleTag,
                platform: platform,
                sourceUrl: url,
              },
              body: res.body,
            })
          }
        })
    })
  }

  /**
   * Get all regions the user is in
   * @returns {Promise.<Array>} - Array of regions
   * @throws {Promise.<Error>}
   */
  getRegions () {
    let data = this._data
    return _getRegions(data)
  }

  /**
   * Get user's most active region (Highest player level)
   * @returns {Promise.<string>} - Region String
   * @throws {Promise.<Error>}
   */
  getActiveRegion () {
    let data = this._data
    return _getActiveRegion(data)
  }

  /**
   * Gets data for that user
   * @param {string} [region] - Region to test. (If none specified, defaults to most active)
   * @returns {Promise.<Object>} - Data Object
   * @throws {Promise.<Error>}
   */
  getData (region = undefined) {
    let tag = this._battleTag
    let platform = this._platform
    let data = this._data
    if (region === undefined) {
      return new Promise(resolve => {
        _getActiveRegion(data)
          .then(region => _getData(data, tag, region, platform))
          .then(resolve)
      })
    } else {
      return _getData(data, tag, region, platform)
    }
  }
}

/**
 * Get all regions a user is in
 * @private
 * @param {Object} data - Data Object
 * @returns {Promise.<array>} - Array of regions
 * @throws {Promise.<Error>}
 */
const _getRegions = data => new Promise(resolve => {
  // Define array
  let regions = []

  // Iterate over regions
  for (let region of REGIONS) {
    // If user is in region, push to array
    if (data[region] !== null) regions.push(region)
  }

  // Resolve regions array
  resolve(regions)
})

/**
 * Get the user's active region
 * @private
 * @param {Object} data - Data Object
 * @returns {Promise.<string>} - User's active region
 * @throws {Promise.<Error>}
 */
const _getActiveRegion = data => new Promise(resolve => {
  // Define Regions Array
  let regions = []

  // Iterate over regions
  for (let region of REGIONS) {
    // If user is in region
    if (data[region] !== null) {
      // Set local data variable
      let json = data[region]
      // Add region with level
      regions.push({
        region: region,
        level: (json.stats.quickplay.overall_stats.prestige * 100) + json.stats.quickplay.overall_stats.level,
      })
    }
  }

  // Sort regions by level
  regions.sort((a, b) => a.level < b.level)
  // Resolve active region
  resolve(regions[0].region)
})

/**
 * Get a user's data
 * @private
 * @param {Object} data - Data to parse
 * @param {string} tag - User's BattleTag
 * @param {string} region - Region to test
 * @param {string} platform - User's Platform
 * @returns {Promise.<Object>} - Parsed Data
 * @throws {Promise.<Error>}
 */
const _getData = (data, tag, region, platform) => new Promise(resolve => {
  let json = data[region]
  if (json.stats.competitive !== null) {
    // Competitive Tier Image
    let tier_image = parseCompImage(json.stats.competitive.overall_stats.tier || null)

    // Better user stats
    json.stats.overall_stats = {
      avatar: json.stats.competitive.overall_stats.avatar,
      tier: json.stats.competitive.overall_stats.tier,
      comprank: json.stats.competitive.overall_stats.comprank,
      tier_image: tier_image,
      prestige: json.stats.competitive.overall_stats.prestige,
      level: json.stats.competitive.overall_stats.level,
      level_full: (json.stats.quickplay.overall_stats.prestige * 100) + json.stats.quickplay.overall_stats.level,
    }
  } else {
    // Better user stats
    json.stats.overall_stats = {
      avatar: json.stats.quickplay.overall_stats.avatar,
      prestige: json.stats.quickplay.overall_stats.prestige,
      level: json.stats.quickplay.overall_stats.level,
      level_full: (json.stats.quickplay.overall_stats.prestige * 100) + json.stats.quickplay.overall_stats.level,
    }
  }

  if (platform === 'pc') {
    json.stats.user_data = {
      battletag_raw: tag,
      battletag: tag.replace('-', '#'),
      username: tag.split('-').shift(),
      discriminator: tag.split('-').pop(),
      user_profile: `https://playoverwatch.com/en-us/career/${platform}/${region}/${tag}`,
      platform: platform.toLowerCase(),
      region: region.toLowerCase(),
    }
  } else {
    json.stats.user_data = {
      battletag_raw: tag,
      battletag: tag,
      username: tag,
      discriminator: '',
      user_profile: `https://playoverwatch.com/en-us/career/${platform}/${tag}`,
      platform: platform.toLowerCase(),
      region: region.toLowerCase(),
    }
  }

  resolve(json)
})

/**
 * Check Valid BattleTag
 * @private
 * @param {string} tag - BattleTag to Check
 * @returns {boolean}
 */
const _checkBattleTag = tag => tag.match(/^[a-zA-Z0-9]{3,12}#[0-9]+$/) !== null

/**
 * Normalise BattleTag
 * @private
 * @param {string} tag - BattleTag to Check
 * @returns {string}
 */
const _normalizeTag = tag => tag.replace('#', '-')

/**
 * Parse a competitive tier to it's image
 * @param {string} tier - Competitive tier string
 * @returns {string} - Image URL
 */
const parseCompImage = tier => {
  let tier_image
  switch (tier) {
    case 'bronze':
      tier_image = 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-1.png'
      break
    case 'silver':
      tier_image = 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-2.png'
      break
    case 'gold':
      tier_image = 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-3.png'
      break
    case 'platinum':
      tier_image = 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-4.png'
      break
    case 'diamond':
      tier_image = 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-5.png'
      break
    case 'master':
      tier_image = 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-6.png'
      break
    case 'grandmaster':
      tier_image = 'https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-7.png'
      break
    default:
      tier_image = null
  }
  return tier_image
}

module.exports = OWStats
