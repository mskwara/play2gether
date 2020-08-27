const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAll = (Model, exclude) =>
    catchAsync(async (req, res, next) => {
        const query = Model.find().select(`${exclude}`);
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

exports.getOne = Model => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)

    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
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

exports.update = (Model, excluded) => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});