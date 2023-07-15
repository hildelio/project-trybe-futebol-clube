import { Response } from 'express';
import ServiceResponse from '../Interfaces/IServiceResponse';

const response = <T>(res: Response, payload: ServiceResponse<T>): Response => {
  const { type, message } = payload;
  if (type > 300) {
    return res.status(type).json({ message });
  }
  return res.status(type).json(message);
};

const responseWithData = <T>(res: Response, payload: ServiceResponse<T>): Response => {
  const { type, message, data: { value } } = payload;
  if (type > 300) {
    return res.status(type).json({ message });
  }
  return res.status(type).json(value);
};

const responseWithToken = <T>(res: Response, payload: ServiceResponse<T>): Response => {
  const { type, message, data: { token } } = payload;
  if (type > 300) {
    return res.status(type).json({ message });
  }
  return res.status(type).json({ token });
};

const responseWithoutMessage = <T>(res: Response, payload: ServiceResponse<T>): Response | void => {
  const { type, message } = payload;
  if (type > 300) {
    return res.status(type).json({ message });
  }
  return res.status(type).end();
};

export {
  response,
  responseWithData,
  responseWithToken,
  responseWithoutMessage,
};
