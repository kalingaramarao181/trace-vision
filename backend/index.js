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


//GET DATA FROM APPLICATIONS (RECRUITING & BENCH)
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

//GET DATA FROM HOTLISTAPPLICATION (HOTLIST)
app.get('/hotlist-application-data', (req, res) => {
    // Fetch data from the database
    const sql = 'SELECT * FROM hotlistapplication';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(result);
    });
});

//GET DATA FROM APPLICATIONS USING ID (RECRUITING & BENCH)
app.get('/application/:userId', (req, res) => {
    const userId = req.params.userId
    const sql = "SELECT * FROM applications WHERE id = ?"
    db.query(sql, [userId], (err, data) => {
        if(err) return res.json(err) 
        return res.json(data[0])
    })
})

//GET DATA FROM HOTLISTAPPLICATION USING ID (HOTLIST)
app.get('/hotlist-application/:userId', (req, res) => {
    const userId = req.params.userId
    const sql = "SELECT * FROM hotlistapplication WHERE id = ?"
    db.query(sql, [userId], (err, data) => {
        if(err) return res.json(err) 
        return res.json(data[0])
    })
})

//GET DATA FROM USERDATA USING ID (STAFF USER)
app.get('/company-user/:userId', (req, res) => {
    const userId = req.params.userId
    const sql = "SELECT * FROM userdata WHERE id = ?"
    db.query(sql, [userId], (err, data) => {
        if(err) return res.json(err) 
        return res.json(data[0])
    })
})

//GET DATA FROM USERDATA (STAFF USER)
app.get("/company-user", (req, res) => {
    const sql = "SELECT * FROM userdata"
    db.query(sql, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

//GET DATA FROM APPLICATIONS FOR BARCHART (RECRUITING & BENCH)
app.get("/barchat-data", (req, res) => {
    const { fromDate, toDate, barchartCategoery } = req.query;
    const sql = `SELECT * FROM applications WHERE submittiondate BETWEEN ? AND ? AND category = ?`;
    db.query(sql, [fromDate, toDate, barchartCategoery], (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

//POST TO USERDATA (STAFF USER)
app.post('/company-user', (req, res) => {
    const {username, email, password, usertype} = req.body
    const values = [username, email, password, usertype]
    const sql = "INSERT INTO userdata (`username`, `email`, `password`, `usertype`) VALUES (?)"
    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err)
        return(res.json(data))
    })
})

// POST TO APPLICATIONS (RECRUITING & BENCH)
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


// POST TO HOTLISTAPPLICATION (HOTLIST)
app.post('/hotlist-form', upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'r2r', maxCount: 1 },
    { name: 'driving', maxCount: 1 },
    { name: 'visa', maxCount: 1 }
]), (req, res) => {
    const { category, candidatename, email, phonenumber, technology, location,  visastatus, remarks, resume} = req.body;    
    const resumePath = req.files['resume'] ? "uploads/" + req.files['resume'][0].filename : "";
    const r2rPath = req.files['r2r'] ? "uploads/" + req.files['r2r'][0].filename : "";
    const drivingPath = req.files['driving'] ? "uploads/" + req.files['driving'][0].filename : "";
    const visaPath = req.files['visa'] ? "uploads/" + req.files['visa'][0].filename : "";
    const values = [category, candidatename, email, phonenumber, technology, location,  visastatus, remarks, resumePath, r2rPath, drivingPath, visaPath]

    console.log(resume);
    const sql = 'INSERT INTO hotlistapplication (`category`, `candidatename`, `email`, `phonenumber`, `technology`, `location`, `visastatus`, `remarks`, `resumepath`, `r2rpath`, `drivingpath`, `visapath`) VALUES (?)';
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

//UPDATE APPLICATIONS (RECRUITING & BENCH)
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
    
    const resumePath = req.files['resumefilepath'] ? "uploads/" + req.files['resumefilepath'][0].filename : req.body.resumefilepath;
    const r2rPath = req.files['r2rfilepath'] ? "uploads/" + req.files['r2rfilepath'][0].filename : req.body.r2rfilepath;
    const drivingPath = req.files['drivinglisencefilepath'] ? "uploads/" + req.files['drivinglisencefilepath'][0].filename : req.body.drivinglisencefilepath;
    const visaPath = req.files['visacopyfilepath'] ? "uploads/" + req.files['visacopyfilepath'][0].filename : req.body.visacopyfilepath;
    const msaPath = req.files['msacopyfilepath'] ? "uploads/" + req.files['msacopyfilepath'][0].filename : req.body.msacopyfilepath;

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

//UPDATE HOTLISTAPPLICATION (HOTLIST)
app.put('/update-hotlist-application/:userId', upload.fields([
    { name: 'resumepath', maxCount: 1 },
    { name: 'r2rpath', maxCount: 1 },
    { name: 'drivingpath', maxCount: 1 },
    { name: 'visapath', maxCount: 1 },
]), (req, res) => {
    const { userId } = req.params; // Extract the ID from the URL
    const {category, candidatename, email, phonenumber, technology, location,  visastatus, remarks, resume} = req.body;
    
    const resumePath = req.files['resumepath'] ? "uploads/" + req.files['resumepath'][0].filename : req.body.resumepath;
    const r2rPath = req.files['r2rpath'] ? "uploads/" + req.files['r2rpath'][0].filename : req.body.r2rpath;
    const drivingPath = req.files['drivingpath'] ? "uploads/" + req.files['drivingpath'][0].filename : req.body.drivingpath;
    const visaPath = req.files['visapath'] ? "uploads/" + req.files['visapath'][0].filename : req.body.visapath;
    const values = [category, candidatename, email, phonenumber, technology, location,  visastatus, remarks, resumePath, r2rPath, drivingPath, visaPath, userId ];
    const sql = `
        UPDATE hotlistapplication
        SET 
            category = ?,
            candidatename = ?, 
            email = ?, 
            phonenumber = ?, 
            technology = ?, 
            location = ?, 
            visastatus = ?, 
            remarks = ?, 
            resumepath = ?, 
            r2rpath = ?, 
            drivingpath = ?, 
            visapath = ?
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


//UPDATE USERDATA (STAFF USER)
app.put('/update-user-form/:userId', (req, res) => {
    const { userId } = req.params; // Extract the ID from the URL
    const { username, email, password, usertype } = req.body;
    const values = [ username, email, password, usertype, userId];
    console.log(username, email, password, usertype);
    const sql = `
        UPDATE userdata 
        SET 
            username = ?, 
            email = ?, 
            password = ?, 
            usertype = ?
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

//POST TO TRASHBIN (DELETED DATA)
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


// DELETE FROM APPLICATIONS (RECRUITING & BENCH)
app.delete('/delete-user/:userId', (req, res) => {
    const userId = req.params.userId
    const sql = "DELETE FROM applications WHERE id = ?"
    db.query(sql, [userId], (err, data) => {
        if(err) return (err)
        return res.json("User Deleted Successfully")
    })
})

// DELETE FROM HOTLISTAPPLICATION (HOTLIST USER)
app.delete('/delete-hotlist/:userId', (req, res) => {
    const userId = req.params.userId
    const sql = "DELETE FROM hotlistapplication WHERE id = ?"
    db.query(sql, [userId], (err, data) => {
        if(err) return (err)
        return res.json("User Deleted Successfully")
    })
})

// DELETE FROM USERDATA (STAFF USER)
app.delete('/delete-company-user/:userId', (req, res) => {
    const userId = req.params.userId
    const sql = "DELETE FROM userdata WHERE id = ?"
    db.query(sql, [userId], (err, data) => {
        if(err) return (err)
        return res.json("User Deleted Successfully")
    })
})



// SERVER RUNNING STATUS
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
