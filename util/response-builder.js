function ResponseBuilder() {
    var status,
        error,
        data;

    return {
        setStatus: setStatus,
        setData: setData,
        setError: setError,
        build: build
    };

    function setStatus(status) {
        this.status = status;
        return this;
    }

    function setData(data) {
        this.data = data;
        return this;
    }

    function setError(error) {
        this.error = error;
        return this;
    }

    function build() {
        var ret = {};
        if (!this.status) {
            ret.status = 1;
        } else {
            ret.status = this.status;
        }

        //error and data cannot coexist in a response, according to JSON API Spec.
        if (this.error) {
            ret.message = this.error;
            ret.status = 0;
        } else {
            if (this.data) {
                ret.data = this.data;
            }
        }
        if (log && log.trace)
            log.trace("ResponseBuilder: (st:", this.status, ") (error:", this.error, ") (data:", this.data, ")");
        return ret;
    }

}

module.exports = ResponseBuilder;
