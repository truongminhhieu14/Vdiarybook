import { checkSchema } from "express-validator";
import { USER_MESSAGES } from "~/constants/message";
import UserModel, { IUser } from "~/modules/auth/auth.model";
import validate from "~/utils/validation";
import bcrypt from "bcrypt";
import { checkEmail } from "~/modules/auth/auth.service";


export const loginValidator = validate(
    checkSchema(
        {
            email: {
                isEmail: {
                    errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
                },
                notEmpty: {
                    errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
                },
                trim: true,
                custom: {
                    options: async (value, {req})=> {
                        const user : IUser | null = await UserModel.findOne({email: value})
                        if(user === null) throw new Error(USER_MESSAGES.USER_NOT_FOUND)
                        else {
                            const isMatch = await bcrypt.compare(req.body.password, user.password)
                            if(!isMatch) throw new Error(USER_MESSAGES.PASS_IS_INCORRECT)                               
                        }
                        req.user = user
                        return true;    
                    }
                }
            },
            password: {
                notEmpty: {
                    errorMessage: USER_MESSAGES.PASS_IS_REQUIRED
                },
                isString: {
                    errorMessage: USER_MESSAGES.PASS_MUST_BE_STRING
                },
                isLength: {
                    options: {
                        min: 6,
                        max: 20
                    },
                    errorMessage: USER_MESSAGES.PASS_MUST_BE_BETWEEN_6_AND_20_CHARACTERS
                },
                // isStrongPassword: {
                //     options: {
                //         minLength: 6,
                //         minLowercase: 1,
                //         minNumbers: 1,
                //         minUppercase: 1,
                //         minSymbols: 0
                //     },
                //     errorMessage: USER_MESSAGES.PASS_MUST_BE_STRONG
                // }
            }
        },
        ['body']
    )
)

export const registerValidator = validate(
    checkSchema(
        {
            name: {
                isLength: {
                    options: {
                        min: 1,
                        max: 20
                    },
                    errorMessage: USER_MESSAGES.NAME_MUST_BE_BETWEEN_1_AND_20_CHARACTERS
                },
                notEmpty: {
                    errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
                },
                isString: {
                    errorMessage: USER_MESSAGES.NAME_MUST_BE_STRING
                }, 
                trim: true
            },
            email: {
                isEmail: {
                    errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
                },
                notEmpty: {
                    errorMessage:USER_MESSAGES.EMAIL_IS_REQUIRED
                },
                trim: true,
                custom: {
                    options: async (value) => {
                        const result = await checkEmail(value)
                        if(result) throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
                        return result;
                    }
                }
            },
            password: {
                notEmpty: {
                    errorMessage: USER_MESSAGES.PASS_IS_REQUIRED
                },
                isString: {
                    errorMessage: USER_MESSAGES.PASS_MUST_BE_STRING
                },
                isLength: {
                    options: {
                        min: 6,
                        max: 20
                    },
                    errorMessage: USER_MESSAGES.PASS_MUST_BE_BETWEEN_6_AND_20_CHARACTERS
                }
            },
            confirmPassword: {
                notEmpty: {
                    errorMessage: USER_MESSAGES.PASS_IS_REQUIRED
                },
                isString: {
                    errorMessage: USER_MESSAGES.PASS_MUST_BE_STRING
                },
                isLength: {
                    options: {
                        min: 6,
                        max: 20
                    },
                    errorMessage: USER_MESSAGES.PASS_MUST_BE_BETWEEN_6_AND_20_CHARACTERS
                },
                custom: {
                    options: async(value, {req}) => {
                        const {password} = req.body
                        if(value !== password) {
                            throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_SAME_PASSWORD)
                        }
                        return true;
                    }
                }
            }
        },
        ['body']
    )
)

export const getNewAccessToken = validate(
    checkSchema(
        {
            
        }
    )
)

export const updateUserValidator = validate(
    checkSchema(
        {
           name: {
            isLength: {
                options: {
                    min: 1,
                    max: 20
                },
                errorMessage: USER_MESSAGES.BIO_MUST_BE_BETWEEN_1_AND_20_CHARACTERS
            },
            isString: {
                errorMessage: USER_MESSAGES.NAME_MUST_BE_STRING
            },
            trim: true,
            optional: true
           },
           avatar: {
            isString: {
                errorMessage: USER_MESSAGES.PROFILEPICTURE_MUST_BE_STRING
            },
            trim: true,
            optional: true
           },
           background: {
            isString: {
                errorMessage: USER_MESSAGES.PROFILEPICTURE_MUST_BE_STRING
            },
            trim: true,
            optional: true
           } 
        },
        ['body']
    )
)