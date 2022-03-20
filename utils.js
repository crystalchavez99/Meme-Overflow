const { check, validationResult } = require('express-validator');
const csrf = require("csurf");

const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    // If the validation errors are not empty,
    if (!validationErrors.isEmpty()) {
        // Generate an array of error messages
        const errors = validationErrors.array().map((err) => err.msg);

        // Generate a new `400 Bad request.` Error object
        // and invoke the next function passing in `err`
        // to pass control to the global error handler.
        const err = Error("Bad request.");
        err.status = 400;
        err.title = "Bad request.";
        err.errors = errors;
        return next(err);
    }

    // Invoke the next middlware function
    next();
};

const isAuthorized = (req, res, resource) => ((res.locals.user) && (resource.userId === res.locals.user.id));

const styleResources = (resources, size) => {
    resources.forEach((resource, i) => {
        resource.colorIndex = i % size;
    });
}

module.exports = {
    asyncHandler,
    handleValidationErrors,
    csrfProtection,
    isAuthorized,
    styleResources,
};
