const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "Username must be atleast 3 characters long"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be atleast 8 characters long"]
  },
  profileImage: {
    type: String,
  },
},
  { timestamps: true });

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    console.log("Error while hashing password:", error);
    next(error);
  }
});
const User = mongoose.model("User", userSchema);


const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  membersCount: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  fourDigitCode: {
    type: Number
  }
}, { timestamps: true })

const Projects = mongoose.model("Project", projectSchema)

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  assignedToEmail: {
    type: String,
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',  // Assuming you have a 'Project' model defined
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  dueDate: {
    type: Date
  }
}, { timestamps: true });
const Tasks = mongoose.model("Tasks", taskSchema)
module.exports = { User, Projects, Tasks};
