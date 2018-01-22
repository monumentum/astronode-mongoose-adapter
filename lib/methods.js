const { DataMethods } = require('astronode-plugin');

class MongooseMethods extends DataMethods {
    constructor() {
        super();
    }

    find(model) {
        return () => model.find().exec();
    }

    findById(model) {
        return req => model
            .findById(req.params.id)
    }

    create(model) {
        return req => (new model(req.body)).save();
    }

    update(model) {
        return req => model.findByIdAndUpdate(req.params.id, {$set:req.body});
    }

    delete(model) {
        return req => model.findByIdAndRemove(req.params.id);
    }
}

module.exports = MongooseMethods;