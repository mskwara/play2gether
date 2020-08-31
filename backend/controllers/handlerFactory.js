const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAll = (Model, exclude, sortOpt) =>
    catchAsync(async (req, res, next) => {
        let filter = {};
        if (req.params.convId)
            filter = { conversation: req.params.convId };

        const query = Model.find(filter).select(`${exclude}`);
        const features = new APIFeatures(query, req.query)
            .sort(sortOpt)
            .limitFields()
            .paginate();

        const docs = await features.query;
        res.status(200).json({
            status: 'success',
            results: docs.length,
            data: {
                data: docs
            }
        });
    });

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions)
        query = query.populate(popOptions);

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