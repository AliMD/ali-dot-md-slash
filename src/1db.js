/**
 * Simple json file db
 */

import fs from 'fs';
import _ from 'lodash';
import debug from 'debug';
const log = debug('1db');

export default class oneDB {
  constructor (dbPath = './db.json') {
    log('init');
    this.dbPath = dbPath;
    this.saveDelay = 5000;
    this._data = [];
    this.open();
  }

  /**
   * Open json file
   */
  open (dbPath = this.dbPath) {
    log(`open: ${dbPath}`);
    let fileData = oneDB.readJsonFile(dbPath, {data: {}});
    this._data = fileData.data;
  }

  /**
   * Inser new item
   */
  insert (obj) {
    log('insert');

    this.save();
  }

  /**
   * get single item base on query
   */
  query (query) {
    log('query', query);
    let id = query.replace(' ', '_');
    return this._data[id] || null;
  }

  /**
   * get array of items base in query
   */
  queryAll (query) {
    log('queryAll', query);
  }

  /**
   * delete items base in query
   */
  delete (query) {
    log('delete', query);

    this.save();
  }

  save (force) {
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

  forceSave () {
    log('forceSave');
    this.save(true);
  }

  static readJsonFile (path, defaultData) {
    log(`readJsonFile ${path}`);

    if (!fs.existsSync(path)) {
      oneDB.writeJsonFile(path, defaultData);
      return defaultData;
    }

    let
    fileContent = fs.readFileSync(path),
    data = JSON.parse(fileContent)
    ;

    log(`${fileContent.length} characters and ${data.length} item loaded`);
    return data;
  }

  static writeJsonFile(path, data) {
    log(`writeJsonFile ${path}`);
    let json = JSON.stringify(data, null, 2);
    log(`${json.length} characters and ${data.length} item saved`);
    return fs.writeFileSync(path, json);
  }

}
