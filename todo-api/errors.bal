// Shared Error-schema response builders for 400 and 404 responses.

function notFoundError(string todoId) returns ErrorNotFound {
    return {
        body: {
            code: 404,
            message: "Not Found",
            description: string `No todo with id '${todoId}'`
        }
    };
}

function badRequestError(string description) returns ErrorBadRequest {
    return {
        body: {
            code: 400,
            message: "Bad Request",
            description
        }
    };
}
