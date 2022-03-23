/* eslint-disable class-methods-use-this */
const ClientError = require('../../exceptions/ClientError');
const { failResponse, errorResponse } = require('../../utils');

class ErrorHandler {
  // how to create method in class?
  errorHandler(request, h) {
    const { response } = request;

    // ClientError
    if (response instanceof ClientError) {
      return failResponse(h, response);
    }
    // generic error
    if (response instanceof Error) {
      const { statusCode, payload } = response.output;
      if (statusCode === 500) {
        return errorResponse(h);
      }
      return h.response(payload).code(statusCode);
    }
    return response.continue || response;
  }
}

module.exports = ErrorHandler;
