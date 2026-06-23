const mongoose = require('mongoose');

/**
 * - JD
 * - Resume text
 * - Self description
 * 
 * - Technical questions : []
 * - Behavioral questions
 * - Skills gaps
 * - Preparation plan 
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, "Skill is required" ]
    },
    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required" ]
    },
    missingTopics: [ {
        type: String
    } ]
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, "Day is required" ]
    },
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks: [ {
        type: String,
        required: [ true, "Task is required" ]
    } ]
}, {
    _id: false
})
const priorityLearningPlanSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ["urgent", "high", "medium", "low"],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    estimatedTime: {
        type: String,
        required: true
    },
    learningOrder: {
        type: Number,
        required: true
    }
}, {
    _id: false
})
const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, 'Job description is required' ]
    },
    resume : {
        type: String,
        default: "",
    },
    selfDescription: {
        type: String,
        default: "",
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    technicalQuestions: [ technicalQuestionSchema ],
    behavioralQuestions: [ behavioralQuestionSchema ],
    skillGaps: [ skillGapSchema ],
    priorityLearningPlan: [ priorityLearningPlanSchema ],
    preparationPlan: [ preparationPlanSchema ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, {
    timestamps: true
})

const InterviewReportModel = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = InterviewReportModel;
