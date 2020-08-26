const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        const query = Model.find().select('-description');
        const features = new APIFeatures(query, req.query)
            .limitFields();

        const docs = await features.query;
        res.status(200).json({
            status: 'success',
            results: docs.length,
            data: {
                data: docs
            }
        });
    });

exports.create = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        })
    });