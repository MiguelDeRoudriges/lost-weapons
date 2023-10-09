export const generalStatus = {
  ERROR: {
    status: 500,
    message: "serverError",
  },
  SUCCESS: {
    status: 200,
    message: "success",
  },
};

export class HttpError extends Error {
  constructor({ status, message }) {
    super(message);
    this.status = status;
  }
}

export const httpResponse = (res, httpStatus, data) => {
  const { status, message } = httpStatus;
  return res.status(status).json({ data, status: message });
};

export const httpResponseError = (res, error) => {
  if (error instanceof HttpError) {
    return httpResponse(res, { status: error.status, message: error.message });
  }
  console.error(error);
  return httpResponse(res, generalStatus.ERROR);
};
