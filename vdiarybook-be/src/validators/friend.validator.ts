import { checkSchema } from "express-validator"
import { isValidObjectId } from "mongoose"
import { httpStatus } from "~/constants/httpStatus"
import { USER_MESSAGES } from "~/constants/message"
import { ErrorWithStatus } from "~/utils/errors/error"
import validate from "~/utils/validation"

export const handleFriendActionValidator = validate(
  checkSchema(
    {
      action: {
        isIn: {
          options: [['send', 'accept', 'reject', 'unfriend', 'follow', 'unfollow']],
          errorMessage: 'Invalid action'
        }
      },
      recipientId: {
        optional: true,
        custom: {
          options: async (value) => {
            if (!isValidObjectId(value)) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.INVALID_USER_ID,
                status: httpStatus.BAD_REQUEST
              })
            }
          }
        }
      },
      requestId: {
        optional: true,
        custom: {
          options: async (value) => {
            if (!isValidObjectId(value)) {
              throw new ErrorWithStatus({
                message: 'Invalid requestId',
                status: httpStatus.BAD_REQUEST
              })
            }
          }
        }
      },
      friendId: {
        optional: true,
        custom: {
          options: async (value) => {
            if (!isValidObjectId(value)) {
              throw new ErrorWithStatus({
                message: 'Invalid friendId',
                status: httpStatus.BAD_REQUEST
              })
            }
          }
        }
      }
    },
    ['body']
  )
)