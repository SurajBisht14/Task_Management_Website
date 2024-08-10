require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer')
const jwt = require('jsonwebtoken')
const {uploadOnCloudinary } = require('./config/cloudniary.js');
const { User, Projects, Tasks} = require('./config/schema.js');
const auth = require('./auth/auth.js');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');


//   cors policy 
// app.use(cors({
//     origin: '',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true
//   }));
app.use(cors(
  {
    origin: 'http://localhost:5173', // Your client URL
    credentials: true, // Allow credentials (cookies) to be sent
  }
));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); //allowing cookies 

// connenction with database
const connect_Db = require('./config/database.js');
connect_Db()
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

async function generateUniqueCode() {
  const min = 1000;
  const max = 9999;
  let fourDigitCode;
  let isExist;

  do {
    fourDigitCode = Math.floor(Math.random() * (max - min + 1)) + min;
    isExist = await Projects.findOne({ fourDigitCode });
  } while (isExist);

  return fourDigitCode;
}



const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

//signup
app.post('/signup', upload.single("profileImage"), async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: "User already exists" });
  }
  try {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
      return res.status(500).json({ msg: 'Failed to upload image' });
    }
    else {
      let profileImage = uploadResult.secure_url;
      const newUser = new User({ username, email, password, profileImage });
      await newUser.save();

      // Send a success response
      return res.status(201).json({
        msg: "Sign Up Successfull"
      });
    }
  }
  catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ msg: errors.join(', ') });
    }
    return res.status(500).json({ msg: "Failed to sign up due to server error" });
  }
})

//login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({ msg: "Invalid mail or password" })
    }

    let comparedValue = await bcrypt.compare(password, userData.password);
    if (!comparedValue) {
      return res.status(400).json({ msg: "Invalid mail or password" })
    }
    const token = jwt.sign(
      { id: userData._id },
      process.env.SECRET_CODE_WEB_TOKENS,
      { expiresIn: '1d' }
    )
    // res.cookie('USER_COOKIE', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production', // true in production
    //   sameSite: 'None' // Required for cross-site cookie usage
    // });
    res.cookie('USER_COOKIE', token, {
      httpOnly: true,
    });

    let tokenExpiration = new Date().getTime() + 24 * 60 * 60 * 1000;

    return res.status(200).json({
      msg: "Login successfully",
      image: userData.profileImage,
      tokenValue: token,
      expirationTime: tokenExpiration
    })
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Failed to login due to server error" })
  }
})


app.post('/formData', auth, async (req, res) => {
  try {

    const { projectName, membersCount, members } = req.body;
    const createdBy = req.user.id;

    const fourDigitCode = await generateUniqueCode();


    const projectCreate = new Projects({ projectName, membersCount, createdBy, fourDigitCode });
    const project = await projectCreate.save();


    const taskPromises = [];
    members.forEach((member) => {
      member.tasks.forEach((task) => {
        const taskCreate = new Tasks({
          description: task.description,
          assignedToEmail: member.email,
          projectId: project._id,
          status: 'Pending',
          dueDate: task.deadline
        });

        // Collect promises to save tasks
        taskPromises.push(taskCreate.save());
      });
    });

    await Promise.all(taskPromises);

    return res.json({
      msg: "Successfully created ,Redirecting to workspace...",
    });

  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      msg: "Error while creating project",
      error: error.message
    });
  }
});


app.get('/getAllData', auth, async (req, res) => {
  try {
    let userId = req.user.id;
    let user = await User.findOne({ _id: userId });
    let isAdmin = await Projects.find({ createdBy: userId });

    let allProjects = [];
    let allTasks = await Tasks.find({ assignedToEmail: user.email });

    // Collect unique projects from tasks
    await Promise.all(allTasks.map(async (task) => {
      let projectId = task.projectId;
      let project = await Projects.findById(projectId);
      if (project && !allProjects.some(p => p._id.equals(project._id))) {
        allProjects.push(project);
      }
    }));

    // Combine and remove duplicates
    let finalArrayProjects = new Set(allProjects.map(p => p._id.toString()));

    if (isAdmin.length > 0) {
      isAdmin.forEach(project => finalArrayProjects.add(project._id.toString()));
    }

    finalArrayProjects = Array.from(finalArrayProjects);

    const finalProjects = await Projects.find({ _id: { $in: finalArrayProjects } });

    return res.json({
      msg: "Data received",
      allProjects: finalProjects
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Error retrieving data",
      error: error.message
    });
  }
});

app.post('/gettingProject', auth, async (req, res) => {
  const { projectId } = req.body;
  const userId = req.user.id;
  const user = await User.findById(userId);
  const userEmail = user.email;

  const isAdmin = await Projects.findOne({
    _id: projectId,
    createdBy: userId
  });

  let allTasks;
  if (isAdmin) {
    allTasks = await Tasks.find(
      {
        projectId: projectId,
      }
    );
  }
  else {
    allTasks = await Tasks.find(
      {
        projectId: projectId,
        assignedToEmail: userEmail
      }
    );
  }


  const allProjectIdProjects = await Tasks.find({
    projectId: projectId,
  })
  let emailArray = []
  allProjectIdProjects.forEach((e) => {
    if (!emailArray.includes(e.assignedToEmail)) {
      emailArray.push(e.assignedToEmail)
    }
  })

  let finalResult = await Promise.all(emailArray.map(async (email) => {
    let result = await User.findOne({
      email: email
    });
    return result;
  }));

  if (isAdmin) {
    return res.json({
      msg: "Project received",
      isAdmin: true,
      tasks: allTasks,
      allMembers: finalResult
    })
  }
  else {
    return res.json({
      msg: "Project received",
      isAdmin: false,
      tasks: allTasks,
      allMembers: finalResult
    })
  }

})

app.post('/updateTask', async (req, res) => {
  const { taskId, taskCompletedOrNot } = req.body;

  try {
    let updatedTask;
    if (taskCompletedOrNot) {
      updatedTask = await Tasks.findOneAndUpdate(
        { _id: taskId }, // Query to find the task
        { status: "Completed" }, // Update operation
        { new: true } // Option to return the updated document
      );
    }
    else {
      updatedTask = await Tasks.findOneAndUpdate(
        { _id: taskId }, // Query to find the task
        { status: "Pending" }, // Update operation
        { new: true } // Option to return the updated document
      );
    }


    if (updatedTask) {
      return res.status(200).json({
        msg: "Task updated",
        task: updatedTask // Optional: return the updated task
      });
    }
    else {
      return res.status(404).json({
        msg: "Task not found"
      });
    }
  }
  catch (error) {
    return res.status(500).json({
      msg: "Error updating task",
      error: error.message
    });
  }
});

//logout
app.get('/logout', (req, res) => {
  res.clearCookie('USER_COOKIE');
  res.status(200).json({
    msg: "Logout succesfully"
  });
})
const port = process.env.PORT || 7000;
app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});