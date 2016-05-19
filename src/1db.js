/**
 * Simple json file db
 */

import fs from 'fs';
import debug from 'debug';
const log = debug('1db');

export default class oneDB {
  constructor (dbPath = './db.json') {
    log('init');
    this.dbPath = dbPath;
    this.saveDelay = 5000;
    this._data = [];
    this._open();
  }

  /**
   * Open json file
   */
  async _open (dbPath = this.dbPath) {
    log(`open: ${path}`);
    this._data = await oneDB.readJsonFile(dbPath);
  }

  /**
   * Inser new item
   */
  async insert (obj) {
    log('insert');

    this.save();
  }

  /**
   * get single item base on query
   */
  async query (query) {
    log('query', query);

    this.save();
  }

  /**
   * get array of items base in query
   */
  async queryAll (query) {
    log('queryAll', query);

    this.save();
  }

  /**
   * delete items base in query
   */
  async delete (query) {
    log('delete', query);

    this.save();
  }

  async _save (force) {
    if (!force) {
      var _this = this;
      clearInterval(this.autoSaveTimeout);
      this.autoSaveTimeout = setTimeout(function () {
        _this.save(true);
      }, this.saveDelay);
    } else {
      log('Save db');
      oneDB.writeJsonFile(this.dbPath, this._data);
    }
  }

  async forceSave () {
    log('forceSave');
    this._save(true);
  }

  static async readJsonFile (path, defaultData = []) {
    log(`readJsonFile ${path}`);

    if (!fs.existsSync(path)) {
      writeJsonFile(file, defaultData);
      return defaultData;
    }

    let
    fileContent = fs.readFileSync(path),
    data = JSON.parse(fileContent)
    ;

    log(`${fileContent.length} characters and ${data.length} item loaded`);
    return data;
  }

  static async writeJsonFile(path, data) {
    log(`writeJsonFile ${path}`);
    let json = JSON.stringify(data, null, 2);
    log(`${json.length} characters and ${data.length} item saved`);
    return fs.writeFileSync(path, json);
  }

}
