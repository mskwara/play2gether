class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    sort(field) {
        if (field)
            this.query = this.query.sort(field)
        
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate(limit) {
        const page = this.queryString.page * 1 || 1;
        const skipFirst = this.queryString.skip * 1 || 0;
        const skip = (page - 1) * limit + skipFirst;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;