const mongoose = require('mongoose');
const mongoInit = require('./initialize');
const MongooseMethods = require('./methods');

const { omit, get, each } = require('lodash');
const { DataAdapter } = require('astronode-plugin');

mongoose.Promise = require('bluebird');

const createSchema = schema => new mongoose.Schema(schema);

class MongooseAdapter extends DataAdapter {
    constructor(opts) {
        super(MongooseMethods);
        this.uri = `mongodb://${opts.uri}:${opts.port}/${opts.database}`;
        this.opts = omit(opts, 'uri', 'port', 'database');
    }

    autoinitialize({ models }) {
        this.conn = mongoose.createConnection(this.uri, this.opts);

        return mongoInit(this.conn).then(() => {
            this._registerModels(models);
        });
    }

    _registerModels(models) {
        each(models, (schema, name) => {
            this.conn.model(name, createSchema(schema));
        });
    }
}

module.exports = MongooseAdapter;