import { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import Users from "../Users";
import HotList from "../HotList";
import 'react-confirm-alert/src/react-confirm-alert.css';
import * as XLSX from 'xlsx';
import "./index.css"
import config from "../config";
const baseUrl = config.baseUrl

const Admin = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenUserForm, setIsOpenUserForm] = useState(false);
    const [isOpenHotForm, setIsOpenHotForm] = useState(false);
    
    const [isOpenDataView, setIsOpenDataView] = useState(false);
    const [isOpenEditView, setIsOpenEditView] = useState(false);
    const [applicationData, setApplicationData] = useState([])
    const [companyUserData, setCompanyUserData] = useState([])
    const [editForm, setEditForm] = useState({})
    const [searchValue, setSearchValue] = useState("")
    const [viewData, setViewData] = useState({})
    const [sidebarStatus, setSidebarStatus] = useState("Recruiting")
    const [formUser, setFormUser] = useState({})
    const [form, setForm] = useState({
        recruiter: "", category: "", recruiterid: "1234", candidatename: "",
        date: "", clientname: "", pocname: "", feedback: "", remarks: "", resumePath: "",
        r2rPath: "", drivingPath: "", visaPath: "", msaPath: "", cname: "", cemail: "",
        cphone: "", cssn: "", cpassport: "", cdriving: "", cphoto: "",
    })
    const [hotForm, setHotForm] = useState({})

    //GET APPLICATION DATA
    useEffect(() => {
        axios.get(`${baseUrl}application-data`)
            .then(res => {
                setApplicationData(res.data)
            })
            .catch(err => {
                console.log(`Error ${err}`);
            })
    }, [])

    useEffect(() => {
        axios.get(`${baseUrl}company-user`)
        .then(res => {
            setCompanyUserData(res.data)
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

    //HANDLE RECRUITING AND BENCH FORM TEXT
    const handleFormData = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    //HANDLE HOT FORM TEXT
    const handleHotFormData = (e) => {
        setHotForm({...hotForm, [e.target.name]: e.target.value})
    }

    //HANDLE USER FORM TEXT
    const handleUserFormData = (e) => {
        setFormUser({ ...formUser, [e.target.name]: e.target.value })
    }

    //HANDLE RECRUITING AND BENCH FORM FILES
    const handleFileData = (e) => {
        setForm({ ...form, [e.target.name]: e.target.files[0] })
    }

    //HANDLE HOT FORM FILES
    const handleHotFileData = (e) => {
        setHotForm({ ...hotForm, [e.target.name]: e.target.files[0]})
    }

    const handleEditFormData = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value })
    }

    const handleEditFileData = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.files[0]})
    }

    //SEARCH
    const searchedCategory = applicationData.filter(each => each.category === sidebarStatus)
    const searchedData = searchedCategory.filter(each => each.recruitername.toLowerCase().includes(searchValue) || each.candidatename.toLowerCase().includes(searchValue))

    

    //*USER CRUD*//
    //USER DATA VIEW
    const onClickDataView = async (userId) => {
        await axios.get(`${baseUrl}application/` + userId)
            .then(res => {
                setViewData(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        setIsOpenDataView(true)
    }
    //USER DATA EDIT
    const onClickEditUser = async (userId, application) => {
        setEditForm(application)
        await axios.get(`${baseUrl}application/` + userId)
            .then(res => {
                setViewData(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        setIsOpenEditView(true)
    }
    //USER DATA DELETE
    const onClickDeleteUser = async (userId, application) => {
        console.log(application);
        await axios.post(`${baseUrl}trashbin`, application)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))

        await axios.delete(`${baseUrl}delete-user/` + userId)
            .then(res => {
                console.log("User Deleted Successfully")
                window.location.reload()
            })
            .catch(err => console.log(err))
    }

    //DELETE CONFORM ALERT
    const deleteAlert = (appId, application) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this item?',
            backgroundColor: 'transparent',
            buttons: [
                {
                    label: 'Cancel',
                    onClick: () => console.log('Delete canceled')
                },
                {
                    label: 'Delete',
                    onClick: () => onClickDeleteUser(appId, application)
                }
            ]
        });
    }

    //SUBMIT RECRUITING AND BENCH FORM DATA
    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value)
        });

        try {
            await axios.post(`${baseUrl}form-data`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Application submitted successfully');
            window.location.reload()
        } catch (error) {
            console.error('Error submitting application:', error);
        }
    }

    //SUBMIT STAFF USER FORM
    const handleSubmitUser = (e) => {
        e.preventDefault()
        axios.post(`${baseUrl}company-user`, formUser)
        .then(res => {
            alert("Successfully Inserted Data");
            window.location.reload()
        })
        .catch(err => {
            console.log(err);
        })
    }

    //SUBMIT HOT LIST FORM
    const handleSubmitHot = async (e) => {
        e.preventDefault()
        console.log(hotForm);
        const formData = new FormData();
        Object.entries(hotForm).forEach(([key, value]) => {
            formData.append(key, value)
        });

        try {
            await axios.post(`${baseUrl}hotlist-form`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Application submitted successfully');
            window.location.reload()
        } catch (error) {
            console.error('Error submitting application:', error);
        }
    }

    //EDIT APPLICATION
    const handleUpdateForm = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        Object.entries(editForm).forEach(([key, value]) => {
            formData.append(key, value)
        });

        const userId = viewData.id

        try {
            await axios.put(`${baseUrl}update-form/` + userId, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Application Updated successfully');
            window.location.reload()
        } catch (error) {
            console.error('Error updating application:', error);
        }

    }

    //OPEN FILE 
    const openFile = (filePath) => {
        window.open(filePath, '_blank');
    }

    //DOWNLOAD EXCEL
    const downloadExcel = () => {
        // Convert data to Excel format
        const wb = XLSX.utils.book_new();
        wb.Props = {
          Title: `${sidebarStatus}-${searchValue}`,
          Author: 'Your Name',
        };
        const ws = XLSX.utils.json_to_sheet(searchedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
    
        // Generate Excel file and trigger download
        XLSX.writeFile(wb, `${sidebarStatus}-${searchValue}.xlsx`);
      };

      //GENERATE REPORT BUTTON
    const handleGenarateReport = () => {
        localStorage.setItem("barchartCategoery", sidebarStatus)
        props.history.push("/barchart")
        window.location.reload()
    }


    //ADD RECRUITING AND BENCH FORM
    const formPopup = () => {
        return (
            <Popup
                open={isOpen}
                onClose={() => setIsOpen(false)}
                closeOnDocumentClick
                contentStyle={{
                    width: "40vw",
                    padding: '3.5vw',
                    borderRadius: '10px',
                    boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    transition: 'opacity 0.5s ease-in-out', // Transition effect for opacity
                    backgroundColor: "white",
                    height: "80vh",
                    overflowY: "auto",
                    scrollbarWidth: "none", /* Firefox */
                }}
            >
                {close => (
                    <div className="tw-admin-popup-container">
                        <div>
                            <h1>Application</h1>
                            <form onSubmit={handleSubmit} className="tw-form-container">
                                <div className="tw-input-container">
                                    <label className="tw-label">Category:</label>
                                    <select name="category" onChange={handleFormData} className="tw-select" required>
                                        <option value="">--Select Category--</option>
                                        <option value="Recruiting">Recruiting</option>
                                        <option value="Bench">Bench</option>
                                        <option value="Hot">Hot</option>
                                        <option value="Jobs">Jobs</option>
                                        <option value="Prime">Prime</option>
                                        <option value="Training">Training</option>
                                        <option value="Interview">Interview</option>
                                        <option value="CandidateOnboarding">Candidate Onboarding</option>
                                        <option value="VendorOnboarding">Vendor Onboarding</option>
                                        <option value="Immigration">Immigration</option>
                                    </select>
                                </div>
                                <div className="tw-input-pack-container">
                                    <div className="tw-input-container">
                                        <label className="tw-label">Recruiter Name:</label>
                                        <select name="recruiter" onChange={handleFormData} className="tw-select" required>
                                            <option value="">--Recruiter Name--</option>
                                            {companyUserData.map((each, index) => {
                                                return <option key={index} value={each.username}>{each.username}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="tw-input-container">
                                        <label className="tw-label">Submittion Date</label>
                                        <input name="date" onChange={handleFormData} type="date" className="tw-input" required/>
                                    </div>
                                    <div className="tw-input-container">
                                        <label className="tw-label">Candidate Name</label>
                                        <input name="candidatename" onChange={handleFormData} type="text" className="tw-input" required/>
                                    </div>
                                </div>
                                <div className="tw-input-pack-container">
                                    <div className="tw-input-container">
                                        <label className="tw-label">Client Name</label>
                                        <input name="clientname" onChange={handleFormData} type="text" className="tw-input" required/>
                                    </div>
                                    <div className="tw-input-container">
                                        <label className="tw-label">POC Name</label>
                                        <input name="pocname" onChange={handleFormData} type="text" className="tw-input" required/>
                                    </div>
                                    <div className="tw-input-container">
                                        <label className="tw-label">Feedback</label>
                                        <input name="feedback" onChange={handleFormData} type="text" className="tw-input" required/>
                                    </div>
                                </div>
                                <div className="tw-input-container">
                                    <label className="tw-label">Remarks</label>
                                    <textarea name="remarks" onChange={handleFormData} type="text" cols={20} rows={4} className="tw-textarea" required/>
                                </div>
                                <div className="tw-file-input-container">
                                    <input id="resume" name="resume" type="file" onChange={handleFileData} className="tw-file-input" required/>
                                    <label className="tw-file-input-label" htmlFor="resume">Resume</label>
                                </div>
                                <div className="tw-file-input-container">
                                    <input id="R2R" name="r2r" type="file" onChange={handleFileData} className="tw-input" required/>
                                    <label className="tw-file-input-label" htmlFor="R2R">R2R</label>
                                </div>
                                <div className="tw-file-input-container">
                                    <input id="driving" name="driving" type="file" onChange={handleFileData} className="tw-input" required/>
                                    <label className="tw-file-input-label" htmlFor="driving">Driving Lisense</label>
                                </div>
                                <div className="tw-file-input-container">
                                    <input id="visa" name="visa" type="file" onChange={handleFileData} className="tw-input" required/>
                                    <label className="tw-file-input-label" htmlFor="visa">Visa Copy</label>
                                </div>
                                <div className="tw-file-input-container">
                                    <input id="MSA" name="msa" type="file" onChange={handleFileData} className="tw-input" required/>
                                    <label className="tw-file-input-label" htmlFor="MSA">MSA Copy</label>
                                </div>
                                <div className="tw-popup-button-container">
                                    <button type="submit" className="popup-save">Save</button>
                                    <button type="button" onClick={() => setIsOpen(false)} className="popup-close">Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Popup>
        )
    }

    //ADD USER FORM
    const userListFormPopup = () => {
        return (
            <Popup
                open={isOpenUserForm}
                onClose={() => setIsOpenUserForm(false)}
                closeOnDocumentClick
                contentStyle={{
                    width: "40vw",
                    padding: '3.5vw',
                    borderRadius: '10px',
                    boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    transition: 'opacity 0.5s ease-in-out', // Transition effect for opacity
                    backgroundColor: "white",
                    height: "40vh",
                    overflowY: "auto",
                    scrollbarWidth: "none", /* Firefox */
                }}
            >
                {close => (
                    <div className="tw-admin-popup-container">
                        <div>
                            <h1>Application</h1>
                            <form onSubmit={handleSubmitUser} className="tw-form-container">
                                <div className="tw-input-pack-container">
                                    <div className="tw-input-container">
                                        <label className="tw-label">Name</label>
                                        <input name="username" onChange={handleUserFormData} type="text" className="tw-input" />
                                    </div>
                                    <div className="tw-input-container">
                                        <label className="tw-label">User Name</label>
                                        <input name="email" onChange={handleUserFormData} type="text" className="tw-input" />
                                    </div>
                                </div>
                                <div className="tw-input-pack-container">
                                    <div className="tw-input-container">
                                        <label className="tw-label">Password</label>
                                        <input name="password" onChange={handleUserFormData} type="password" className="tw-input" />
                                    </div>
                                    <div className="tw-input-container">
                                        <label className="tw-label">User Type:</label>
                                        <select name="usertype" onChange={handleUserFormData} className="tw-select">
                                            <option value="Swain">--Selet User Type--</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Staff">Staff</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="tw-popup-button-container">
                                    <button type="submit" className="popup-save">Save</button>
                                    <button type="button" onClick={() => setIsOpenUserForm(false)} className="popup-close">Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Popup>
        )
    }

    //ADD HOTLIST FORM
    const hotFormPopup = () => {
        return (
                <Popup
                    open={isOpenHotForm}
                    onClose={() => setIsOpenHotForm(false)}
                    closeOnDocumentClick
                    contentStyle={{
                        width: "40vw",
                        padding: '3.5vw',
                        borderRadius: '10px',
                        boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        transition: 'opacity 0.5s ease-in-out', // Transition effect for opacity
                        backgroundColor: "white",
                        height: "80vh",
                        overflowY: "auto",
                        scrollbarWidth: "none", /* Firefox */
                    }}
                >
                    {close => (
                        <div className="tw-admin-popup-container">
                            <div>
                                <h1>Application</h1>
                                <form onSubmit={handleSubmitHot} className="tw-form-container">
                                    <div className="tw-input-container">
                                        <label className="tw-label">Category:</label>
                                        <select name="category" onChange={handleHotFormData} className="tw-select" required>
                                            <option value="">--Select Category--</option>
                                            <option value="Recruiting">Recruiting</option>
                                            <option value="Bench">Bench</option>
                                            <option value="Hot">Hot</option>
                                            <option value="Jobs">Jobs</option>
                                            <option value="Prime">Prime</option>
                                            <option value="Training">Training</option>
                                            <option value="Interview">Interview</option>
                                            <option value="CandidateOnboarding">Candidate Onboarding</option>
                                            <option value="VendorOnboarding">Vendor Onboarding</option>
                                            <option value="Immigration">Immigration</option>
                                        </select>
                                    </div>
                                    <div className="tw-input-pack-container">
                                    <div className="tw-input-container">
                                            <label className="tw-label">Candidate Name</label>
                                            <input name="candidatename" onChange={handleHotFormData} type="text" className="tw-input" required/>
                                        </div>
                                        <div className="tw-input-container">
                                            <label className="tw-label">Email Address</label>
                                            <input name="email" onChange={handleHotFormData} type="text" className="tw-input" required/>
                                        </div>
                                        <div className="tw-input-container">
                                            <label className="tw-label">Phone Number</label>
                                            <input name="phonenumber" onChange={handleHotFormData} type="text" className="tw-input" required/>
                                        </div>
                                    </div>
                                    <div className="tw-input-pack-container">
                                        <div className="tw-input-container">
                                            <label className="tw-label">Technology</label>
                                            <input name="technology" onChange={handleHotFormData} type="text" className="tw-input" required/>
                                        </div>
                                        <div className="tw-input-container">
                                            <label className="tw-label">Current Location</label>
                                            <input name="location" onChange={handleHotFormData} type="text" className="tw-input" required/>
                                        </div>
                                        <div className="tw-input-container">
                                            <label className="tw-label">Visa Status</label>
                                            <input name="visastatus" onChange={handleHotFormData} type="text" className="tw-input" required/>
                                        </div>
                                    </div>
                                    <div className="tw-input-container">
                                        <label className="tw-label">Remarks</label>
                                        <textarea name="remarks" onChange={handleHotFormData} type="text" cols={20} rows={4} className="tw-textarea" required/>
                                    </div>
                                    <div className="tw-file-input-container">
                                        <input id="resume" name="resume" type="file" onChange={handleHotFileData} className="tw-file-input" required/>
                                        <label className="tw-file-input-label" htmlFor="resume">Resume</label>
                                    </div>
                                    <div className="tw-file-input-container">
                                        <input id="R2R" name="r2r" type="file" onChange={handleHotFileData} className="tw-input" required/>
                                        <label className="tw-file-input-label" htmlFor="R2R">R2R</label>
                                    </div>
                                    <div className="tw-file-input-container">
                                        <input id="driving" name="driving" type="file" onChange={handleHotFileData} className="tw-input" required/>
                                        <label className="tw-file-input-label" htmlFor="driving">Driving Lisense</label>
                                    </div>
                                    <div className="tw-file-input-container">
                                        <input id="visa" name="visa" type="file" onChange={handleHotFileData} className="tw-input" required/>
                                        <label className="tw-file-input-label" htmlFor="visa">Visa Copy</label>
                                    </div>
                                    <div className="tw-popup-button-container">
                                        <button type="submit" className="popup-save">Save</button>
                                        <button type="button" onClick={() => setIsOpenHotForm(false)} className="popup-close">Close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </Popup>
            )
    }


    //DATA EDIT POPUP
    const dataEditPopup = () => {
        return (
            <Popup
                open={isOpenEditView}
                onClose={() => setIsOpenEditView(false)}
                closeOnDocumentClick
                contentStyle={{
                    width: "40vw",
                    padding: '3.5vw',
                    borderRadius: '10px',
                    boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    transition: 'opacity 0.5s ease-in-out', // Transition effect for opacity
                    backgroundColor: "white",
                    height: "80vh",
                    overflowY: "auto",
                    scrollbarWidth: "none", /* Firefox */
                }}
            >
                {close => (
                    <form onSubmit={handleUpdateForm} className="tw-admin-popup-container">
                        <div>
                            <h1>Data View</h1>
                            <hr />
                            <table>
                                <tbody>
                                    <tr className="applicaton-data-name"><td>Applied For: </td><td><span className="application-data-span">{viewData.category}</span></td>
                                        <td>
                                            <select name="category" onChange={handleEditFormData} className="tw-select">
                                                <option value="Recruiting">--Select Category--</option>
                                                <option value="Recruiting">Recruiting</option>
                                                <option value="Bench">Bench</option>
                                                <option value="Hot">Hot</option>
                                                <option value="Jobs">Jobs</option>
                                                <option value="Prime">Prime</option>
                                                <option value="Training">Training</option>
                                                <option value="Interview">Interview</option>
                                                <option value="CandidateOnboarding">Candidate Onboarding</option>
                                                <option value="VendorOnboarding">Vendor Onboarding</option>
                                                <option value="Immigration">Immigration</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Date: </td><td><span className="application-data-span">{viewData.submittiondate}</span></td>
                                        <td>
                                            <input name="submittiondate" onChange={handleEditFormData} type="date" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Recruiter Name: </td><td><span className="application-data-span">{viewData.recruitername}</span></td>
                                        <td>
                                            <select name="recruitername" onChange={handleEditFormData} className="tw-select" required>
                                                <option value="">--Recruiter Name--</option>
                                                {companyUserData.map((each, index) => {
                                                return <option key={index} value={each.username}>{each.username}</option>
                                            })}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Candidate Name: </td><td><span className="application-data-span">{viewData.candidatename}</span></td>
                                        <td>
                                            <input name="candidatename" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Client Name: </td><td><span className="application-data-span">{viewData.clientname}</span></td>
                                        <td>
                                            <input name="clientname" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>POC Name: </td><td><span className="application-data-span">{viewData.pocname}</span></td>
                                        <td>
                                            <input name="pocname" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Feedback: </td><td><span className="application-data-span">{viewData.feedback}</span></td>
                                        <td>
                                            <input name="feedback" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Remarks: </td><td><span className="application-data-span">{viewData.remarks}</span></td>
                                        <td>
                                            <textarea name="remarks" onChange={handleEditFormData} type="text" cols={20} rows={2} className="tw-textarea" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Resume: </td><td><button onClick={() => openFile(`${baseUrl}${viewData.resumefilepath}`)}>Open Resume</button></td>
                                        <td>
                                            <input name="resumefilepath" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Resume: </td><td><button onClick={() => openFile(`${baseUrl}${viewData.r2rfilepath}`)}>R2R Copy</button></td>
                                        <td>
                                            <input name="r2rfilepath" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Driving License: </td><td><button onClick={() => openFile(`${baseUrl}${viewData.drivinglisencefilepath}`)}>Open Driving License</button></td>
                                        <td>
                                            <input name="drivinglisencefilepath" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Visa: </td><td><button onClick={() => openFile(`${baseUrl}${viewData.visacopyfilepath}`)}>Open Visa</button></td>
                                        <td>
                                            <input name="visacopyfilepath" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>MSA: </td><td><button onClick={() => openFile(`${baseUrl}${viewData.msacopyfilepath}`)}>Open MSA Copy</button></td>
                                        <td>
                                            <input name="msacopyfilepath" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr />
                        </div>
                        <div className="tw-popup-button-container">
                            <button type="submit" className="popup-save">Update</button>
                            <button type="button" onClick={() => setIsOpenEditView(false)} className="popup-close">Close</button>
                        </div>
                    </form>
                )}
            </Popup>
        )
    }

    //DATA VIEW POPUP
    const dataVewPopup = () => {
        return (
            <Popup
                open={isOpenDataView}
                onClose={() => setIsOpenDataView(false)}
                closeOnDocumentClick
                contentStyle={{
                    width: "40vw",
                    padding: '3.5vw',
                    borderRadius: '10px',
                    boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    transition: 'opacity 0.5s ease-in-out', // Transition effect for opacity
                    backgroundColor: "white",
                    height: "80vh",
                    overflowY: "auto",
                    scrollbarWidth: "none", /* Firefox */
                }}
            >
                {close => (
                    <div className="tw-admin-popup-container">
                        <div>
                            <h1>Data View</h1>
                            <hr />
                            <table>
                                <tbody>
                                    <tr className="applicaton-data-name"><td>Applied For: </td><td><span className="application-data-span">{viewData.category}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Date: </td><td><span className="application-data-span">{viewData.submittiondate}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Recruiter Name: </td><td><span className="application-data-span">{viewData.recruitername}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Candidate Name: </td><td><span className="application-data-span">{viewData.candidatename}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Client Name: </td><td><span className="application-data-span">{viewData.clientname}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>POC Name: </td><td><span className="application-data-span">{viewData.pocname}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Feedback: </td><td><span className="application-data-span">{viewData.feedback}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Remarks: </td><td><span className="application-data-span">{viewData.remarks}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Resume: </td><td><button onClick={() => openFile(`${baseUrl}${viewData.resumefilepath}`)}>Open Resume</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Resume: </td><td><button onClick={() => openFile(`${baseUrl}${viewData.r2rfilepath}`)}>R2R Copy</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Driving License: </td><td><button onClick={() => openFile(`${baseUrl}${viewData.drivinglisencefilepath}`)}>Open Driving License</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Visa: </td><td><button onClick={() => openFile(`${baseUrl}${viewData.visacopyfilepath}`)}>Open Visa</button></td></tr>
                                    <tr className="applicaton-data-name"><td>MSA: </td><td><button onClick={() => openFile(`${baseUrl}${viewData.msacopyfilepath}`)}>Open MSA Copy</button></td></tr>
                                </tbody>
                            </table>
                            <hr />
                        </div>
                        <div className="tw-popup-button-container">
                            <button onClick={() => setIsOpenDataView(false)} className="popup-close">Close</button>
                        </div>
                    </div>
                )}
            </Popup>
        )
    }

    //VIEW APPLICATION DATA CATEGORY WISE
    const categoryDataView = () => {
        if (sidebarStatus === "Recruiting" || sidebarStatus === "Bench"){
        return (
            <div className="tw-data-view-container">
                <table className="data-view-table-container">
                    <thead>
                        <tr>
                            <th className="data-view-table-data">S No</th>
                            <th className="data-view-table-data">Submittion</th>
                            <th className="data-view-table-data">Recruiter</th>
                            <th className="data-view-table-data">Candidate Name</th>
                            <th className="data-view-table-data">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchedData.map((eachApplication, index) => {
                            return <tr key={index}>
                                <td className="data-view-table-data">{index + 1}</td>
                                <td className="data-view-table-data data-view-table-data-submittion">
                                    <p className="applicaton-data-name">Date: <span className="application-data-span">{eachApplication.submittiondate}</span></p>
                                    <p className="applicaton-data-name">Applied For: <span className="application-data-span">{eachApplication.category}</span></p>
                                    <p className="applicaton-data-name">Client Name: <span className="application-data-span">{eachApplication.clientname}</span></p>
                                </td>
                                <td className="data-view-table-data">{eachApplication.recruitername}</td>
                                <td className="data-view-table-data">{eachApplication.candidatename}</td>
                                <td className="data-view-table-data">
                                    <button onClick={() => onClickDataView(eachApplication.id)} className="action-view-button">View</button>
                                    <button onClick={() => onClickEditUser(eachApplication.id, eachApplication)} className="action-edit-button">Edit</button>
                                    <button onClick={() => deleteAlert(eachApplication.id, eachApplication)} className="action-delete-button">Delete</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {searchedData.length === 0 && <p>No Data Found</p>}
            </div>
        )
    }
    else if (sidebarStatus === "Users"){
        return <Users searchValueData={searchValue}/>
    }
    else if (sidebarStatus === "Hot"){
        return <HotList searchValueData={searchValue}/>
    }
    }


    //ADD BUTTONS VIEW
    const addFormButtonView = () => {
        switch (sidebarStatus){
            case "Recruiting":
            case "Bench":
                return <button onClick={() => setIsOpen(true)} className="tw-add-button">+ Add New</button>
            case "Hot":
                return <button onClick={() => setIsOpenHotForm(true)} className="tw-add-button">+ Add New</button>
            case "Users":
                return <button onClick={() => setIsOpenUserForm(true)} className="tw-add-button">+ Add User</button>;
            default:
                return <button onClick={() => setIsOpen(true)} className="tw-add-button">+ Add New</button>
        }
    }

    //ACTUAL DATA
    return (
        <div className="tw-admin-container">
            <div className="admin-sidebar">
                <button style={{ backgroundColor: sidebarStatus === "Recruiting" && "#0E0C49" }} onClick={() => setSidebarStatus("Recruiting")} className="admin-sidebar-button">Recruiting</button>
                <button style={{ backgroundColor: sidebarStatus === "Bench" && "#0E0C49" }} onClick={() => setSidebarStatus("Bench")} className="admin-sidebar-button">Bench</button>
                <button style={{ backgroundColor: sidebarStatus === "Hot" && "#0E0C49" }} onClick={() => setSidebarStatus("Hot")} className="admin-sidebar-button">Hot</button>
                <button style={{ backgroundColor: sidebarStatus === "Jobs" && "#0E0C49" }} onClick={() => setSidebarStatus("Jobs")} className="admin-sidebar-button">Jobs</button>
                <button style={{ backgroundColor: sidebarStatus === "Prime" && "#0E0C49" }} onClick={() => setSidebarStatus("Prime")} className="admin-sidebar-button">Prime </button>
                <button style={{ backgroundColor: sidebarStatus === "Candidates" && "#0E0C49" }} onClick={() => setSidebarStatus("Candidates")} className="admin-sidebar-button">Candidates</button>
                <button style={{ backgroundColor: sidebarStatus === "Training" && "#0E0C49" }} onClick={() => setSidebarStatus("Training")} className="admin-sidebar-button">Training</button>
                <button style={{ backgroundColor: sidebarStatus === "Interview" && "#0E0C49" }} onClick={() => setSidebarStatus("Interview")} className="admin-sidebar-button">Interview</button>
                <button style={{ backgroundColor: sidebarStatus === "CandidateOnboarding" && "#0E0C49" }} onClick={() => setSidebarStatus("CandidateOnboarding")} className="admin-sidebar-button">Candidate Onboarding</button>
                <button style={{ backgroundColor: sidebarStatus === "VendorOnboarding" && "#0E0C49" }} onClick={() => setSidebarStatus("VendorOnboarding")} className="admin-sidebar-button">Vendor Onboarding</button>
                <button style={{ backgroundColor: sidebarStatus === "Status" && "#0E0C49" }} onClick={() => setSidebarStatus("Status")} className="admin-sidebar-button">Status </button>
                <button style={{ backgroundColor: sidebarStatus === "Users" && "#0E0C49" }} onClick={() => setSidebarStatus("Users")} className="admin-sidebar-button">Users</button>
            </div>
            <div className="adimin-main-data-container">
                <div className="adimin-main-data-top-container">
                    <div className="tw-add-button-container">
                        <p className="tw-rec-name">{sidebarStatus} List</p>
                        {addFormButtonView()}
                    </div>
                    <div className="tw-generate-button-bar">
                        <button type="button" onClick={downloadExcel} className="tw-generate-button">Generate Report</button>
                        <button onClick={handleGenarateReport} className="tw-generate-employe-button">Generate Employe Report - Barchart</button>
                        <button onClick={handleGenarateReport} className="tw-pie-chart-button">Benchsale Pie Chart</button>
                    </div>
                    <div className="admin-search-input-container">
                        <h1 className="admin-search-head-element">{sidebarStatus} View</h1>
                        <input type="search" placeholder="Search" onChange={(e) => setSearchValue(e.target.value)} className="admin-search-input" />
                    </div>
                </div>
                {categoryDataView()}
                {formPopup()}
                {dataVewPopup()}
                {userListFormPopup()}
                {hotFormPopup()}
                {dataEditPopup()}
            </div>
        </div>
    )
}

export default Admin