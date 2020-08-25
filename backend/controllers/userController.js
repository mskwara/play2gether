exports.hello = async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'rafal to pajac'
    });
};