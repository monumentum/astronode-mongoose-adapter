jest.mock('./initialize');
jest.mock('./methods');

const mongoose = require('mongoose');
const MongooseAdapter = require('./mongoose');
const mongoInit = require.requireMock('./initialize');
const MongooseMethods = require.requireMock('./methods');

describe('Mongoose Adapter', () => {
    let adapter;
    const fakeConn = 'FAKE_CONN';
    const fakeSchemaReturn = { FAKE: 'SCHEMA' };
    const fakeOpts = {
        uri: 'test.com',
        port: 9090,
        database: 'foo',
        user: 'bar',
    };

    const fakeMongoUri = `mongodb://${fakeOpts.uri}:${fakeOpts.port}/${fakeOpts.database}`;
    const fakeMongoOpts = { user: fakeOpts.user };

    const fakeName = 'test';
    const fakeSchema = 'Schema {}';
    const fakeConfig = { models: { [fakeName]: fakeSchema }};

    const checkInitialization = () => {
        expect(adapter).toHaveProperty('uri', fakeMongoUri);
        expect(adapter).toHaveProperty('opts', fakeMongoOpts);
    }

    beforeEach(() => {
        adapter = new MongooseAdapter(fakeOpts);
        mongoose.createConnection = jest.fn().mockReturnValue(fakeConn);
        mongoose.Schema = jest.fn().mockImplementation(() => fakeSchemaReturn);
        mongoInit.mockImplementation().mockReturnValue(Promise.resolve());
        checkInitialization();
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should exec autoinitializate correctly', () => {
        adapter._registerModels = jest.fn();
        return adapter.autoinitialize(fakeConfig).then(() => {
            expect(mongoInit).toHaveBeenCalledWith(fakeConn);
            expect(adapter._registerModels).toHaveBeenCalledTimes(1);
            expect(adapter._registerModels).toHaveBeenCalledWith(fakeConfig.models);
        });
    });

    it('should register models correctly', () => {
        adapter.conn = { model: jest.fn().mockReturnValue() };
        adapter._registerModels(fakeConfig.models);
        expect(adapter.conn.model).toHaveBeenCalledWith(fakeName, fakeSchemaReturn);
    });
});