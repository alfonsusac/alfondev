export function getErrorCode(error: unknown) {
  if (error instanceof Error) {
    return error.name
  }
  return "UnknownError"
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }
  return "An unknown error occurred."
}