export class LateCheckInValidationError extends Error {
  constructor() {
    super('The check-in must be validate 20 minute after its creation')
  }
}