// Import necessary modules
let express = require('express');
let mongoose = require('mongoose');
let app = express();
// app.use(cors());
let PORT = 3000;
app.use(express.json());


// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/PeopleDB')
    .then(() => {
        console.log("MongoDB Server is Connected on Port:27017");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Schema definition
let myschema = new mongoose.Schema({
    fname: String,
    lname: String,
    uname: String,
    roll: String,
    email: String,
    pass: String,
    course: String
});

// Model creation
let mymodel = new mongoose.model('children', myschema);

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true}));

// Route to serve the registration form
// app.get('/reg', (req, res) => {
//     console.log("This GET request is working");
//     res.sendFile("C:/Users/IJ/Desktop/CRUD/assignment/reg.html");
// });

// Route to handle form submission
app.post('/regis', (req, res) => {
    console.log(req.body); // Log received data to check if it's captured

    let mydata = new mymodel({
        fname: req.body.fname,
        lname: req.body.lname,
        uname: req.body.uname,
        roll: req.body.roll,
        email: req.body.email,
        pass: req.body.pass,
        course: req.body.cname
    });

    // Save data to the database
    mydata.save()
        .then(() => {
            res.send('Registration is successful');
        })
        .catch((error) => {
            console.error('Error saving data:', error);
            res.status(500).send('Error occurred during registration');
        });
});

//NEW
// app.post('/regis', async (req, res) => {
//     console.log(req.body); // Log received data to check if it's captured

//     try {
//         const existingUser = await mymodel.findOne({ uname: req.body.uname });

//         if (existingUser) {
//             // Username already exists
//             res.status(400).send('Username already exists. Please choose a different username.');
//         } else {
//             // Save data to the database
//             let mydata = new mymodel({
//                 fname: req.body.fname,
//                 lname: req.body.lname,
//                 uname: req.body.uname,
//                 roll: req.body.roll,
//                 email: req.body.email, 
//                 pass: req.body.pass,
//                 course: req.body.cname
//             });

//             await mydata.save();
//             res.send('Registration is successful');
//         }
//     } catch (error) {
//         console.error('Error saving data:', error);
//         res.status(500).send('Error occurred during registration');
//     }
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is connected on port ${PORT}`);
});


//show
// app.get('/showdata',(req,res)=>{
//     mymodel.find().then((users)=>{
//         //res.send(data);

//        let tableHTML = `<h1 align="center">User Details</h1><table border="1" align="center"><tr><th>FirstName</th><th>LastName</th><th>Username</th><th>RollNo</th><th>Paasword</th><th>Email</th><th>Course</th><th>Gender</th></tr>`;

//         users.forEach((users) => {
//             tableHTML += `<tr><td>${users.fname}</td><td>${users.lname}</td><td>${users.uname}</td><td>${users.roll}</td><td>${users.pass}</td><td>${users.email}</td><td>${users.course}</td><td>${users.gender}</td></tr>`;
//         });

//         tableHTML += '</table>';
//         res.send(tableHTML);
//     })
// })

//read OLD
// app.get('/log',(req,res)=>{
//     let user=req.query.uname;
//     let pass=req.query.pass;
//     mymodel.find({uname:user,pass:pass}).then((users)=>{
//         if(users.length > 0)
//         {
//             res.sendFile("C:/Users/IJ/Desktop/CRUD/assignment/success.html")
//         }
//         else
//         {
//             res.sendFile("C:/Users/IJ/Desktop/CRUD/assignment/fail.html")
//         }
//     })
// })

app.post('/login', async (req, res) => {
    console.log("Entered post request");
    const { uname, pass } = req.body;

    try {
        // Check the credentials in the MongoDB collection
        const user = await mymodel.findOne({ uname, pass });

        if (user) {
            // If credentials are correct, render the success page
            res.sendFile("C:/Users/IJ/Desktop/CRUD/assignment/success.html");
        } else {
            // If credentials are incorrect, render the failure page
            res.sendFile("C:/Users/IJ/Desktop/CRUD/assignment/fail.html");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/showDetails', async (req, res) => {
    const { username } = req.query;

    try {
        // Retrieve details by username from the MongoDB collection
        const details = await mymodel.findOne({ uname: username });

        // Check if user was not found
        if (!details) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Convert Mongoose document to a plain JavaScript object
        const plainDetails = details.toObject();

        // Exclude the password field
        delete plainDetails.pass;
        delete plainDetails._id;
        delete plainDetails.__v;
        // Send details as an HTML table in the response
        const tableRows = Object.entries(plainDetails).map(([key, value]) => {
            return `<tr><td>${key}</td><td>${value}</td></tr>`;
        });

        const htmlTable = `<table>${tableRows.join('')}</table>`;

        res.status(200).send(htmlTable);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





app.get('/showALL', async (req, res) => {
    try {
        // Retrieve all details from the MongoDB collection
        const details = await mymodel.find();

        // Check if there are no details found
        if (!details || details.length === 0) {
            return res.status(404).json({ error: 'No details found' });
        }

        // Convert Mongoose documents to plain JavaScript objects
        const plainDetailsArray = details.map(detail => {
            const plainDetail = detail.toObject();
            // Exclude fields you don't want to display (optional)
            delete plainDetail.pass;
            delete plainDetail._id;
            delete plainDetail.__v;
            return plainDetail;
        });

        // Send details as an HTML table in the response
        const tableRows = plainDetailsArray.map(detail => {
            return `<tr>${Object.entries(detail).map(([key, value]) => `<td>${value}</td>`).join('')}</tr>`;
        });

        const htmlTable = `<table>${tableRows.join('')}</table>`;

        res.status(200).send(htmlTable);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//         // Send details as JSON response
//         res.status(200).json(details);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });



app.get('/',(request,response)=>{
    response.sendFile("C:/Users/IJ/Desktop/CRUD/assignment/home.html");
})

app.get('/login',(request,response)=>{
    response.sendFile("C:/Users/IJ/Desktop/CRUD/assignment/login.html");
})

app.get('/edit',(request,response)=>{
    response.sendFile("C:/Users/IJ/Desktop/CRUD/assignment/edit.html");
})
app.get('/retrieveDetails',(request,response)=>{
    response.sendFile("C:/Users/IJ/Desktop/CRUD/assignment/show.html");
})
app.get('/retrieveALL',(request,response)=>{
    response.sendFile("C:/Users/IJ/Desktop/CRUD/assignment/showall.html");
})

//update
app.get('/ed',(req,res)=>{
    let fn1=req.query.fname;
    let ln1=req.query.lname;
    let un1=req.query.uname;
    let ps1= req.query.pass;
    let em1=req.query.mail;
    let ht1=req.query.roll;
    let cr1=req.query.cname;
    mymodel.updateOne({uname:un1,pass:ps1},{$set:{fname:fn1,lname:ln1,email:em1,roll:ht1,course:cr1}}).then((users)=>{
        if(users)
        {
            res.send(`<h2> Hello ${un1} <br> Your Profile is successful Changed <br> <a href='/'> Click Here goto Home page </a></h2>`);
        }
        else
        {
            res.send(`<h2>Sorry Invalid Username Or Password <br> <a href='/'> Click Here goto Home page </a> </h2>`)
        }
    })
})

app.get('/delete',(request,response)=>{
    response.sendFile("C:/Users/IJ/Desktop/CRUD/assignment/delete.html");
})

app.get('/del',(req,res)=>{
    let u=req.query.uname;
    let p=req.query.pass;
    mymodel.deleteOne({uname:u,pass:p}).then((users)=>{
        if(users)
        {
            res.send(`<h2>${u} is Successfully Deleted<br> <a href='/'> Click Here goto Home page </a> </h2>`);
        }
        else
        {
            res.send(`<h2>Invalid Details<br> <a href='/'> Click Here goto Home page </a> </h2>`);
        }
    })
})
