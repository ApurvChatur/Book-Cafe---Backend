class APIFeature {
    // Intro
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // Search
    search() {
        const keyword = 
            this.queryString.title ? {
                title: {
                    $regex: this.queryString.title,
                    $options: "i"
                }
            }
            :
            this.queryString.sub_title ? {
                sub_title: {
                    $regex: this.queryString.sub_title,
                    $options: "i"
                }
            }
            :
            {}

        this.query = this.query.find({ ...keyword })
        return this;
    }

    // Filter 
    filter() {
        const queryCopy = { ...this.queryString };
        
        const removeFields = ["title", "sub_title", "page", "limit"];
        removeFields.forEach(key => delete queryCopy[key])

        let queryCopyString = JSON.stringify(queryCopy)
        queryCopyString = queryCopyString.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)

        this.query = this.query.find(JSON.parse(queryCopyString))
        return this;
    }

    // Pagination
    pagination(resultPerPage) {
        const currentPage = Number(this.queryString.page) || 1

        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this;
    }

}

module.exports = APIFeature
