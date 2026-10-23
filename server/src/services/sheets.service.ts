import { Sheets } from "../models/DSA_Sheet.models.js";

export async function createSheetService(author : string, sheet_link : string){
   return await Sheets.create({author, sheet_link});
}

export async function getAllSheetService(){
  return await Sheets.find();
}

export async function getSheetById(id : string){
  return await Sheets.findById(id);
}