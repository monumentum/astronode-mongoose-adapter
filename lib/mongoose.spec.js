// jest.mock('mongoose');
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
        return adapter.autoinitialize().then(() => {
            expect(mongoInit).toHaveBeenCalledWith(fakeConn);
            expect(adapter._registerModels).toHaveBeenCalledTimes(1);
        });
    });

    it('should register models correctly', () => {
        const fakeName = 'test';
        const fakeSchema = 'Schema {}';
        const fakeModel = 'Model {}';

        global.astronode = { models: { [fakeName]: fakeSchema }};
        adapter.conn = { model: jest.fn().mockReturnValue(fakeModel) };
        adapter._registerModels();

        expect(adapter.conn.model).toHaveBeenCalledWith(fakeName, fakeSchemaReturn);
        expect(astronode.models[fakeName]).toBe(fakeModel);
    });
});