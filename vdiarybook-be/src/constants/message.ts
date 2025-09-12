export const USER_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',

  // Email
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',

  // Name
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be a string',
  NAME_MUST_BE_BETWEEN_1_AND_20_CHARACTERS: 'Name must be between 1 and 20 characters',

  // Password
  PASS_IS_REQUIRED: 'Password is required',
  PASS_MUST_BE_STRING: 'Password must be a string',
  PASS_MUST_BE_BETWEEN_6_AND_20_CHARACTERS: 'Password must be between 6 and 20 characters',
  PASS_MUST_BE_STRONG: 'Password must be strong',
  PASS_IS_INCORRECT: 'Password is incorrect',
  CONFIRM_PASSWORD_MUST_BE_SAME_PASSWORD: 'Confirm password must be same password',

  // User
  USER_NOT_FOUND: 'User not found',
  USER_NOT_VERIFY: 'User not verified',
  INVALID_USER_ID: 'User ID is invalid',

  // Token
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IN_VALID: 'Refresh token is invalid',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found',

  // Auth success
  REGISTER_SUCCESS: 'Account created successfully',
  LOGIN_SUCCESS: 'Login successfully',
  LOGOUT_SUCCESS: 'Logout successfully',
  UNAUTHORIZED: "You are not authorized. Please log in.",
  

  // Email verification
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_IS_VERIFY_BEFORE: 'Email was already verified',
  EMAIL_VERIFY_SUCCESS: 'Email verification successful',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Verification email resent successfully',

  // Forgot password
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check your email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  INVALID_FORGOT_PASSWORD: 'Invalid forgot password token',
  VERIFY_PASSWORD_SUCCESS: 'Password verified successfully',
  RESET_PASSWORD_SUCCESS: 'Password reset successfully',

  // Profile
  UPDATE_PROFILE_SUCCESS: 'Profile updated successfully',
  UPLOAD_AVATAR_SUCCESS: 'Avatar uploaded successfully',
  BIO_MUST_BE_BETWEEN_1_AND_20_CHARACTERS: 'Bio must be between 1 and 20 characters',
  PROFILEPICTURE_MUST_BE_STRING: 'Profile picture must be string',

  // Password change
  OLD_PASSWORD_NOT_MATCH: 'Old password does not match',
  CHANGE_PASSWORD_SUCCESS: 'Password changed successfully',

} as const
export const POST_MESSAGES = {
  CAPTIONS_MUST_BE_STRING: 'Captions must be string',
  CAPTION_MUST_BE_BETWEEN_0_AND_2000_CHARACTERS: 'Password must be between 0 and 2000 characters',
  HASHTAGS_MUST_BE_STRING: 'Hashtag must be an array of user id',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions must be an array of user id',
  INVALID_POST_ID: 'Invalid post id',
  GET_POST_SUCCESS: 'Get post detail success',
  POST_SUCCESS: 'Post success',
  UPDATE_POST_SUCCESS: 'Post update success',
  DELETE_POST_SUCCESS: 'Post delete success'
} as const
export const LIKE_MESSAGES = {
  LIKE_SUCCESS: 'Like success',
  UNLIKE_SUCCESS: 'Unlike success',
  SEE_ALL_LIKE_OF_POST: 'See all like of post success',
  CHECK_LIKE: 'Check like success'
} as const
export const COMMENT_MESSAGES = {
  CREATE_SUCCESS: "Comment created successfully",
  CREATE_CHILD_SUCCESS: "Child comment created successfully",
  DELETE_SUCCESS: "Comment deleted successfully",
  DELETE_FORBIDDEN: "You are not authorized to delete this comment",
  NOT_FOUND: "Comment not found",
  GET_PARENT_SUCCESS: "Parent comments retrieved successfully",
  GET_CHILD_SUCCESS: "Child comments retrieved successfully",
  COUNT_SUCCESS: "Total comments counted successfully"
};