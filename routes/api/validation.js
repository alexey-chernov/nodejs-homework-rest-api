const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidLengthName, StatusCode } = require('../../config/constants');

const MIN_LENGTH_NAME = ValidLengthName.MIN_LENGTH_NAME;
const MAX_LENGTH_NAME = ValidLengthName.MAX_LENGTH_NAME;
const BAD_REQUEST = StatusCode.BAD_REQUEST;


const validContact = Joi.object({
    name: Joi.string()
        .min(MIN_LENGTH_NAME)
        .max(MAX_LENGTH_NAME)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    phone: Joi.string()
        .pattern(/\(\d{3}\)\s\d{3}-\d{4}/)
        .required(),
    favorite: Joi.boolean().optional(),
});

const validUpdateContact = Joi.object({
    name: Joi.string()
        .min(MIN_LENGTH_NAME)
        .max(MAX_LENGTH_NAME)
        .optional(),
    email: Joi.string()
        .email()
        .optional(),
    phone: Joi.string()
        .pattern(/\(\d{3}\)\s\d{3}-\d{4}/)
        .optional(),
    favorite: Joi.boolean().optional(),
}).min(1);

const validPutContact = Joi.object({
    name: Joi.string()
        .min(MIN_LENGTH_NAME)
        .max(MAX_LENGTH_NAME)
        .optional(),
    email: Joi.string()
        .email()
        .optional(),
    phone: Joi.string()
        .pattern(/\(\d{3}\)\s\d{3}-\d{4}/)
        .optional(),
    favorite: Joi.boolean().optional(),
});

const validStatusContact = Joi.object({
    favorite: Joi.boolean().required(),
});

const validId = Joi.object({
    contactId: Joi.objectId().required(),
});

const validate = async (schema, obj, res, next) => {
    try {
        await schema.validateAsync(obj);
        next();
    } catch (err) {
        res.status(BAD_REQUEST).json({
            status: 'error',
            code: BAD_REQUEST,
            message: `Field ${err.message.replace(/"/g, '')}`,
        });
    }
};

module.exports.validContact = (req, res, next) => {
    return validate(validContact, req.body, res, next);
};

module.exports.validUpdateContact = (req, res, next) => {
    return validate(validUpdateContact, req.body, res, next);
};

module.exports.validPutContact = (req, res, next) => {
    return validate(validPutContact, req.body, res, next);
};

module.exports.validStatusContact = (req, res, next) => {
    return validate(validStatusContact, req.body, res, next);
};

module.exports.validId = (req, res, next) => {
    return validate(validId, req.params, res, next);
};