/**
 * Simple json file db
 */

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import {mkdirSync} from './1utill.js';
import debug from 'debug';
const log = debug('1db');

export default class oneDB {
  constructor (dbPath = './db.json') {
    log('init');
    this.dbPath = path.resolve(dbPath);
    this.saveDelay = 5000;
    this.data = [];
    this.open();
  }

  /**
   * Open json file
   */
  open (dbPath = this.dbPath) {
    log(`open: ${dbPath}`);
    let fileData = oneDB.readJsonFile(dbPath, {data: {}});
    this.data = fileData.data;
  }

  /**
   * Inser new item
   */
  insert (id, obj) {
    log(`insert ${id}`);
    this.data[id] = obj;
    this.save();
  }

  /**
   * get single item base on query
   */
  query (query) {
    log('query', query);
    let id = query.replace(' ', '_');
    return this.data[id] || null;
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
      oneDB.writeJsonFile(this.dbPath, {data: this.data});
    }
  }

  forceSave () {
    log('forceSave');
    this.save(true);
  }

  static readJsonFile (dbPath, defaultData) {
    log(`readJsonFile ${dbPath}`);

    if (!fs.existsSync(dbPath)) {
      mkdirSync(path.dirname(dbPath));
      oneDB.writeJsonFile(dbPath, defaultData);
      return defaultData;
    }

    let
    fileContent = fs.readFileSync(dbPath),
    data = JSON.parse(fileContent)
    ;

    log(`${fileContent.length} characters loaded`);
    return data;
  }

  static writeJsonFile(dbPath, data) {
    log(`writeJsonFile ${dbPath}`);
    let json = JSON.stringify(data, null, 2);
    log(`${json.length} characters saved`);
    return fs.writeFileSync(dbPath, json);
  }

}
