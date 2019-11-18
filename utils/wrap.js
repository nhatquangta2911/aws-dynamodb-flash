module.exports = {
    envelop = (res, statusCode = 200) => {
        let body;
        if(statusCode == 200) {
            body = JSON.stringify(res);
        } else {
            body = JSON.stringify({ errors: { body: [res]} })
        }
        return {
            statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body
        }
    }
}