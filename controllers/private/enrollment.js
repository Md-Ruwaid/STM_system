import express from "express";
import enrollmentModel from "../../models/Enrollment.js";
import studentModel from "../../models/Student.js";
import courseModel from "../../models/course.js";

const router = express.Router();

router.post("/enroll", async (req, res) => {
      try {
            let details = req.body;
            let studentExists = await studentModel.findOne({
                  _id: req.user.id,
                  status: "active",
            });
            if (!studentExists) {
                  return res.status(404).json({ message: "Student not found" });
            }
            let courseExists = await courseModel.findOne({
                  _id: details.course_id,
                  isActive: true,
            });
            if (!courseExists) {
                  return res.status(404).json({ message: "Course not found" });
            }
            // details.student_id = req.user.id;
            let newEnrollment = {
                  student_id: req.user.id,
                  ...details,
            };
            let enrollment = await enrollmentModel.create(newEnrollment);
            res.status(201).json({
                  message: "Student enrolled successfully",
                  enrollment,
            });
      } catch (error) {
            console.error(error.message);
            res.status(500).json({
                  message: "Internal Server Error",
                  error: error.message,
            });
      }
});

router.get("/enrollments", async (req, res) => {
      try {
            let studentId = req.user.id;
            let studentExists = await studentModel.findOne({
                  _id: studentId,
                  status: "active",
            });
            if (!studentExists) {
                  return res.status(404).json({ message: "Student not found" });
            }
            let enrollments = await enrollmentModel
                  .find({ student_id: studentId })
                  .select("-_id student_id status enrolledAt")
                  .populate("student_id", "name email gender -_id")
                  .populate("course_id", "title code instructor fee -_id")
            res.status(200).json({
                  message: "All your enrollments",
                  enrollments,
            });
      } catch (error) {
            console.error(error.message);
            res.status(500).json({
                  message: "Internal Server Error",
                  error: error.message,
            });
      }
});

export default router;