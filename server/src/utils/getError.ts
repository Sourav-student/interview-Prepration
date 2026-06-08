import { Response } from "express";

export function getError(res : Response, message : string = "something went wrong", status : number): Response {
  return res.status(status).json({
    message : message,
    status : status,
    success : false
  });
}