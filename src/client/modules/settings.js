/**
 * BetterDiscord Settings Module
 * Copyright (c) 2015-present Jiiks - https://jiiks.net
 * All rights reserved.
 * https://github.com/Jiiks/BetterDiscordApp - https://betterdiscord.net
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
 */

'use strict';

const fs = require('fs');
const IPC = require('./ipc');
const Utils = require('./utils');

class SettingsModule {

    constructor() {}

    static init() {
        let self = this;
        if(self.filePath !== undefined) {
            console.log("Attempt to reinitialize SettingsModule has been blocked");
            return;
        }

        let getSettings = IPC.sendSync({ 'command': 'getsettings' });
        let { paths } = getSettings;
        self.filePath = `${paths.dataPath}/user.settings.json`;
        self.load();
    }

    static load() {
        let self = this;
        let settings = Utils.tryParse(fs.readFileSync(self.filePath));
        if(settings === null) {
            //Load default settings
            return;
        }
        self.settings = settings;
    }

    static save() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.settings));
    }

    static get getCoreSettings() { return this.getSettings("core"); }
    static get getUiSettings() { return this.getSettings("ui"); }
    static get getEmoteSettings() { return this.getSettings("emotes"); }
    static getSettings(key) { return this.settings[key]; }

    static getCoreSetting(key)  { return this.getSetting("core",   key); }
    static getUiSetting(key)    { return this.getSetting("ui",     key); }
    static getEoteSetting(key) { return this.getSetting("emotes", key); }
    static getSetting(sub, key) {
        return this.settings[sub].filter(value => value.key === key)[0];
    }

    static setCoreSetting(key, enabled) { this.setSetting("core", key, enabled); }
    static setUiSetting(key, enabled) { this.setSetting("ui", key, enabled); }
    static setEmoteSetting(key, enabled) { this.setSetting("emotes", key, enabled); }
    static setSetting(sub, key, enabled) {
        this.getSetting(sub, key).enabled = enabled;
        this.save();
    }
}

module.exports = SettingsModule; 