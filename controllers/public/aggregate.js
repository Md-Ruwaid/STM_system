import express from "express";
import mongoose from "mongoose";
import studentModel from "../../models/Student.js";
import courseModel from "../../models/course.js";
import enrollmentModel from "../../models/Enrollment.js";

const router = express.Router();

router.get("/aggregate/get-all-enrollments", async (req, res) => {
    try {
        const studentId = req.user?.id || req.query.studentId;

        if (!studentId) {
            return res.status(400).json({ message: "Student id is required" });
        }

        const studentObjectId = new mongoose.Types.ObjectId(studentId);
        const enrolled = await enrollmentModel
            .find({ student_id: studentObjectId })
            .populate("student_id", "name email age gender -_id")
            .populate("course_id", "title code instructor fee -_id");

        if (enrolled.length === 0) {
            const studentExists = await studentModel.findOne({
                _id: studentObjectId,
                status: "active",
            });

            if (!studentExists) {
                return res.status(404).json({ message: "Student does not exist with this id" });
            }

            return res.status(200).json({ message: "No enrollments found for this student", enrollments: [] });
        }

        return res.status(200).json({
            message: "All courses registered from this student",
            enrollments: enrolled,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/aggregate/instructor/:name", async (req, res) => {
    try {
        const instructorName = req.params.name;
        const courses = await courseModel
            .find({ instructor: instructorName, isActive: true })
            .select("title code instructor fee duration tags -_id");

        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found for this instructor" });
        }

        return res.status(200).json({ message: "Courses fetched successfully", courses });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/aggregate/courses", async (req, res) => {
    try {
        const allCourses = await courseModel
            .find({ isActive: true })
            .select("title code fee tags duration -_id");

        if (allCourses.length === 0) {
            return res.status(200).json({
                message: "There are no courses available at the moment. Please check later!",
            });
        }

        return res.status(200).json({
            message: "These are all the courses available",
            allCourses,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

router.get("/aggregate/course/:code", async (req, res) => {
    try {
        const courseCode = req.params.code;
        const course = await courseModel
            .findOne({ code: courseCode, isActive: true })
            .select("title code fee tags duration -_id");

        if (!course) {
            return res.status(404).json({
                message: `Course with code:${courseCode} does not exist`,
            });
        }

        return res.status(200).json({
            message: `The details of course with code:${courseCode} are`,
            course,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

router.get("/aggregate/withdrawn-enrollments", async (req, res) => {
    try {
        const studentId = req.user?.id || req.query.studentId;

        if (!studentId) {
            return res.status(400).json({ message: "Student id is required" });
        }

        const withdrawn = await enrollmentModel
            .find({ student_id: new mongoose.Types.ObjectId(studentId), status: "withdrawn" })
            .populate("course_id", "title code instructor fee -_id");

        if (withdrawn.length === 0) {
            return res.status(200).json({
                message: "No cancelled enrollments found",
                count: 0,
                withdrawn: [],
            });
        }

        return res.status(200).json({
            message: "Withdrawn enrollments fetched successfully",
            count: withdrawn.length,
            withdrawn,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

export default router;