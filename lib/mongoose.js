const mongoose = require('mongoose');
const mongoInit = require('./initialize');
const MongooseMethods = require('./methods');
const Schema = mongoose.Schema;

const { omit, get, each, mapValues } = require('lodash');
const { DataAdapter } = require('astronode-plugin');

mongoose.Promise = require('bluebird');

const createSchema = schema =>
    schema instanceof Schema ?
        schema : new mongoose.Schema(schema);
class MongooseAdapter extends DataAdapter {
    constructor(opts) {
        super(MongooseMethods);
        this.uri = `mongodb://${opts.uri}:${opts.port}/${opts.database}`;
        this.opts = omit(opts, 'uri', 'port', 'database');
    }

    autoinitialize(config) {
        this.conn = mongoose.createConnection(this.uri, this.opts);

        return mongoInit(this.conn).then(() => {
            const models = this._registerModels(config.models);
            super.autoinitialize({ models });
        });
    }

    _registerModels(models) {
        return mapValues(models, (schema, name) => {
            return this.conn.model(name, createSchema(schema));
        });
    }
}

module.exports = MongooseAdapter;