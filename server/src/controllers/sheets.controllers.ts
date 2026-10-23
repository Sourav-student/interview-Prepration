import { Response, Request } from "express";
import { createSheetService, getAllSheetService } from "../services/sheets.service.js";

export async function createSheet(req: Request, res: Response) {
  try {
    const { sheet_link, author } = req.body;

    if(!author || !sheet_link){
      return res.status(401).json({
          message : "missing fields are require",
          success : false,
          data : []
      });
    }

    const sheet = await createSheetService(author, sheet_link);

    if(!sheet){
      return res.status(402).json({
        message : "No sheet create!",
        success : false,
        data : []
      })
    }

    return res.status(201).json({
      message : "created successfully!",
      success : true,
      data : {new_sheet_id : sheet._id}
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong!",
      success: false,
      data: []
    });
  }
}

export async function getAllSheets(req : Request, res : Response){
  try {
    const sheets = await getAllSheetService();

    return res.status(200).json({
      message : "all sheets are loaded!",
      success : true,
      data : sheets
    });
  } catch (error) {
    return res.status(500).json({
      message : "something went wrong!",
      success : false,
      data : []
    })
  }
}