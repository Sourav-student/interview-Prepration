import mongoose from "mongoose";
import { ProblemType } from "../types/models_type.js";

const ProblemSchema = new mongoose.Schema<ProblemType>({
    problem_title : {
      type : String,
      required : true,
      trim : true
    },

    problem_desc : {
      type : String,
      trim : true
    },

    problem_level : {
      type : String,
      trim : true,
      enum : ["Easy", "Medium", "Hard"],
    },

    problem_link : {
      type : String,
      trim : true,
      required : true
    },

    problem_platform_name : {
      type : String,
      trim : true,
      required : true
    }
})

export const Problems = mongoose.model<ProblemType>("Problems", ProblemSchema);