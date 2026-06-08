import { Response } from "express";

export function getSuccess(res : Response, message : string = "something went wrong", status : number, data : any[]) : Response{
  return res.status(status).json({
    message : message,
    status : status,
    success : true,
    data : data
  })
}