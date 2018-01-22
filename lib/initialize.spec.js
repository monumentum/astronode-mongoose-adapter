const init = require('./initialize');

const expectOn = (mock, index, param) =>
    expect(mock.mock.calls[index][0]).toBe(param);

describe('Mongoose Initialize', () => {
    it('should exec initialize correcty', () => {
        const fakeConn = {
            on: jest.fn((name, cb) => cb()),
            close: jest.fn(cb => cb()),
        }

        process.on = jest.fn((name, cb) => cb());
        process.exit = jest.fn();

        return init(fakeConn).then(() => {
            expectOn(fakeConn.on, 0, 'error');
            expectOn(fakeConn.on, 1, 'disconnected');
            expectOn(fakeConn.on, 2, 'connected');
            expectOn(process.on, 0, 'SIGINT');
            expect(fakeConn.close).toHaveBeenCalledTimes(1);
        });
    });
});