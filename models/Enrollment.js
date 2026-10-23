import mongoose from "mongoose";

// student ID, course ID, status, enrolledAt

const enrollmentSchema = new mongoose.Schema(
      {
            student_id: {
                  type: mongoose.Schema.Types.ObjectId,
                  required: true,
                  ref: "Student",
            },
            course_id: {
                  type: mongoose.Schema.Types.ObjectId,
                  required: true,
                  ref: "Course",
            },
            status: {
                  type: String,
                  enum: ["enrolled", "completed", "withdrawn"],
                  default: "enrolled",
            },
            enrolledAt: {
                  type: Date,
                  default: Date.now(),
            },
      },
      { timestamps: true },
);

const enrollmentModel = mongoose.model("Enrollment", enrollmentSchema);

export default enrollmentModel;