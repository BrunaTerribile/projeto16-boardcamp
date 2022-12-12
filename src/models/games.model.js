import joi from 'joi';

export const gameSchema = joi.object({
    name: joi.string().required(),
    stockTotal: joi.number().required().min(1),
    pricePerDay: joi.number().required().min(1)
})