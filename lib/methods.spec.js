const MongooseMethods = require('./methods');
const { each } = require('lodash');

describe('Mongoose Methods', () => {
    let methods;
    const fakeReturn = 'FAKE_RETURN'
    const fakeReq = { params: { id: 1}, body: 'TEST'};
    const findReturn = { exec: jest.fn().mockReturnValue(Promise.resolve(fakeReturn)) };
    const modelMocks = {
        find: jest.fn().mockReturnValue(findReturn),
        findOne: jest.fn().mockReturnValue(findReturn),
        create: jest.fn().mockReturnValue(Promise.resolve(fakeReturn)),
        findById: jest.fn().mockReturnValue(Promise.resolve(fakeReturn)),
        findByIdAndUpdate: jest.fn().mockReturnValue(Promise.resolve(fakeReturn)),
        findByIdAndRemove: jest.fn().mockReturnValue(Promise.resolve(fakeReturn)),
        save: jest.fn().mockReturnValue(Promise.resolve(fakeReturn)),
    };

    const fakeModel = jest.fn();
    each(modelMocks, (mock, method) => fakeModel[method] = mock);

    fakeModel.mockImplementation(() => fakeModel);

    beforeEach(() => {
        methods = new MongooseMethods();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should exec correctly .find from MongooseMethods', () => {
        return methods.find(fakeModel)(fakeReq).then(response => {
            expect(response).toBe(fakeReturn);
            expect(fakeModel.find).toHaveBeenCalledTimes(1);
            expect(findReturn.exec).toHaveBeenCalledTimes(1);
        });
    });

    it('should exec correctly .find from MongooseMethods', () => {
        return methods.findOne(fakeModel)(fakeReq).then(response => {
            expect(response).toBe(fakeReturn);
            expect(fakeModel.findOne).toHaveBeenCalledTimes(1);
            expect(findReturn.exec).toHaveBeenCalledTimes(1);
        });
    });

    it('should exec correctly .findById from MongooseMethods', () => {
        return methods.findById(fakeModel)(fakeReq).then(response => {
            expect(response).toBe(fakeReturn);
            expect(fakeModel.findById).toHaveBeenCalledWith(fakeReq.params.id);
            expect(fakeModel.findById).toHaveBeenCalledTimes(1);
        });
    });

    it('should exec correctly .findByIdAndUpdate from MongooseMethods', () => {
        return methods.update(fakeModel)(fakeReq).then(response => {
            expect(response).toBe(fakeReturn);
            expect(fakeModel.findByIdAndUpdate).toHaveBeenCalledWith(fakeReq.params.id, { $set: fakeReq.body });
            expect(fakeModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        });
    });

    it('should exec correctly .findByIdAndRemove from MongooseMethods', () => {
        return methods.delete(fakeModel)(fakeReq).then(response => {
            expect(response).toBe(fakeReturn);
            expect(fakeModel.findByIdAndRemove).toHaveBeenCalledWith(fakeReq.params.id);
            expect(fakeModel.findByIdAndRemove).toHaveBeenCalledTimes(1);
        });
    });

    it('should exec correctly .create from MongooseMethods', () => {
        return methods.create(fakeModel)(fakeReq).then(response => {
            expect(response).toBe(fakeReturn);
            expect(fakeModel).toHaveBeenCalledWith(fakeReq.body);
            expect(fakeModel.save).toHaveBeenCalledTimes(1);
        });
    });
});