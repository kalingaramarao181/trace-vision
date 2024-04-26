const express = require("express");
const mysql = require("mysql");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// DATABASE CONNECTION OBJECT
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tracevision'
});

// DATABASE CONNECTION STATUS
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Add CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Replace with your frontend URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())

// Ensure uploads directory exists, if not create it
const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
    console.log('Uploads directory created');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory); // Use the absolute path here
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


//GET APPLICATION DATA
app.get('/application-data', (req, res) => {
    // Fetch data from the database
    const sql = 'SELECT * FROM applications';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(result);
    });
});

//GET USER DATA
app.get('/application/:userId', (req, res) => {
    const userId = req.params.userId
    const sql = "SELECT * FROM applications WHERE id = ?"
    db.query(sql, [userId], (err, data) => {
        if(err) return res.json(err) 
        return res.json(data[0])
    })
})

// Route to handle multiple file uploads
app.post('/form-data', upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'r2r', maxCount: 1 },
    { name: 'driving', maxCount: 1 },
    { name: 'visa', maxCount: 1 },
    { name: 'msa', maxCount: 1 }
]), (req, res) => {
    const { 
        category, recruiter, recruiterid, date, candidatename,
        clientname, pocname, feedback, remarks, cname, cemail, 
        cphone, cssn, cpassport, cdriving, cphoto
    } = req.body;

    console.log(req.files['resume']);
    
    const resumePath = req.files['resume'] ? "uploads/" + req.files['resume'][0].filename : "";
    const r2rPath = req.files['r2r'] ? "uploads/" + req.files['r2r'][0].filename : "";
    const drivingPath = req.files['driving'] ? "uploads/" + req.files['driving'][0].filename : "";
    const visaPath = req.files['visa'] ? "uploads/" + req.files['visa'][0].filename : "";
    const msaPath = req.files['msa'] ? "uploads/" + req.files['msa'][0].filename : "";

    const values = [
        recruiter, category, recruiterid, candidatename, 
        date, clientname, pocname, feedback, remarks, resumePath, 
        r2rPath, drivingPath, visaPath, msaPath, cname, cemail,
        cphone, cssn, cpassport, cdriving, cphoto
    ]
    
    const sql = 'INSERT INTO applications (`recruitername`, `category`, `recruiterid`, `candidatename`, `submittiondate`, `clientname`, `pocname`, `feedback`, `remarks`, `resumefilepath`, `r2rfilepath`, `drivinglisencefilepath`, `visacopyfilepath`, `msacopyfilepath`, `cname`, `cemail`, `cphone`, `cssn`, `cpassport`, `cdriving`, `cphoto`) VALUES (?)';
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Data inserted successfully');
        res.status(201).json({ message: 'Application submitted successfully' });
    });
});

//UPDATE APPLICATION
app.put('/update-form/:userId', upload.fields([
    { name: 'resumefilepath', maxCount: 1 },
    { name: 'r2rfilepath', maxCount: 1 },
    { name: 'drivinglisencefilepath', maxCount: 1 },
    { name: 'visacopyfilepath', maxCount: 1 },
    { name: 'msacopyfilepath', maxCount: 1 }
]), (req, res) => {
    const { userId } = req.params; // Extract the ID from the URL
    const { 
        category, recruitername, recruiterid, submittiondate, candidatename,
        clientname, pocname, feedback, remarks, cname, cemail, 
        cphone, cssn, cpassport, cdriving, cphoto
    } = req.body;
    
    const resumePath = req.files['resumefilepath'] ? "uploads/" + req.files['resumefilepath'][0].filename : "";
    const r2rPath = req.files['r2rfilepath'] ? "uploads/" + req.files['r2rfilepath'][0].filename : "";
    const drivingPath = req.files['drivinglisencefilepath'] ? "uploads/" + req.files['drivinglisencefilepath'][0].filename : "";
    const visaPath = req.files['visacopyfilepath'] ? "uploads/" + req.files['visacopyfilepath'][0].filename : "";
    const msaPath = req.files['msacopyfilepath'] ? "uploads/" + req.files['msacopyfilepath'][0].filename : "";

    console.log(resumePath);

    const values = [
        recruitername, category, recruiterid, candidatename, 
        submittiondate, clientname, pocname, feedback, remarks, resumePath, 
        r2rPath, drivingPath, visaPath, msaPath, cname, cemail,
        cphone, cssn, cpassport, cdriving, cphoto, userId // Add the ID as the last value
    ];
    
    const sql = `
        UPDATE applications 
        SET 
            recruitername = ?, 
            category = ?, 
            recruiterid = ?, 
            candidatename = ?, 
            submittiondate = ?, 
            clientname = ?, 
            pocname = ?, 
            feedback = ?, 
            remarks = ?, 
            resumefilepath = ?, 
            r2rfilepath = ?, 
            drivinglisencefilepath = ?, 
            visacopyfilepath = ?, 
            msacopyfilepath = ?, 
            cname = ?, 
            cemail = ?, 
            cphone = ?, 
            cssn = ?, 
            cpassport = ?, 
            cdriving = ?, 
            cphoto = ?
        WHERE id = ?`; // Update query with placeholders for values

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Data updated successfully');
        res.status(200).json({ message: 'Data updated successfully' });
    });
});


//POST TO TRASHBIN
app.post('/trashbin', (req, res) => {
    const application = req.body;
    const dbAppData = JSON.stringify(application); // Optionally stringify the data
    const sql = "INSERT INTO trashbin (`trasheddata`) VALUES (?)";
    db.query(sql, [dbAppData], (err, data) => {
        if (err) {
            console.error("Error inserting data into trashbin:", err);
            return res.status(500).json(err);
        }
        console.log("Successfully inserted into trashbin");
        return res.json("Successfully Inserted into trashbin");
    });
});


// DELETE USER
app.delete('/delete-user/:userId', (req, res) => {
    const userId = req.params.userId
    const sql = "DELETE FROM applications WHERE id = ?"
    db.query(sql, [userId], (err, data) => {
        if(err) return (err)
        return res.json("User Deleted Successfully")
    })
})

// Route to fetch data from the database
app.get('/applications', (req, res) => {
    // Fetch data from the database
    const sql = 'SELECT * FROM demo';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data from database:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(result);
        console.log(result);
    });
});


// Route to handle single file upload
app.post('/applications', upload.single('file'), (req, res) => {
    const { name, email, phone } = req.body;
    const filePath = req.file ? req.file.path : null;
    console.log('File path:', filePath);
    const sql = 'INSERT INTO demo (`name`, `email`, `phone`, `file_path`) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, phone, filePath], (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Data inserted successfully');
        res.status(201).json({ message: 'Application submitted successfully' });
    });
});

// SERVER RUNNING STATUS
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
