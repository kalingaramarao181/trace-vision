import axios from "axios"
import { useEffect, useState } from "react"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Popup from 'reactjs-popup';
import config from "../config";
const baseUrl = config.baseUrl


const CandidateOnboarding = (props) => {
    const {searchValueData} = props
    const [applicationData, setApplicationData] = useState([])
    const [isOpenEditView, setIsOpenEditView] = useState(false);
    const [isOpenDataView, setIsOpenDataView] = useState(false);
    const [editForm, setEditForm] = useState({})
    const [viewData, setViewData] = useState({})

    //GET APPLICATION DATA
    useEffect(() => {
        axios.get(`${baseUrl}candidate-onboarding-application-data`)
            .then(res => {
                setApplicationData(res.data)
            })
            .catch(err => {
                console.log(`Error ${err}`);
            })
    }, [])

    const handleEditFormData = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value })
        console.log(editForm);
    }

    const handleEditFileData = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.files[0]})
    }

    //USER DATA VIEW
    const onClickDataView = async (userId) => {
        await axios.get(`${baseUrl}candidate-onboarding-application/` + userId)
            .then(res => {
                setViewData(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        setIsOpenDataView(true)
        console.log(viewData);
    }


    //EDIT APPLICATION
    const handleUpdateForm = async (e) => {
        e.preventDefault()
        console.log(editForm);
        const formData = new FormData();
        Object.entries(editForm).forEach(([key, value]) => {
            formData.append(key, value)
        });

        const userId = viewData.id

        try {
            await axios.put(`${baseUrl}update-candidate-onboarding-application/` + userId, formData, {
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

    //DATA EDIT POPUP
    const dataEditPopup = () => {
        return (
            <Popup
                open={isOpenEditView}
                onClose={() => setIsOpenEditView(false)}
                closeOnDocumentClick
                contentStyle={{
                    width: "63vw",
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
                                                <option value="Recruiting">W2 Employement</option>
                                                <option value="Bench">1099 Employement</option>
                                         
                                            </select>
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Candidate Name : </td><td><span className="application-data-span">{viewData.candidatename}</span></td>
                                        <td>
                                            <input name="candidatename" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Email Address: </td><td><span className="application-data-span">{viewData.emailaddress}</span></td>
                                        <td>
                                            <input name="emailaddress" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Phone Number: </td><td><span className="application-data-span">{viewData.phonenumber}</span></td>
                                        <td>
                                            <input name="phonenumber" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>SSN: </td><td><span className="application-data-span">{viewData.ssn}</span></td>
                                        <td>
                                            <input name="ssn" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    
                                    <tr className="applicaton-data-name"><td>Passport: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.passport}`)}>Open Resume</button></td>
                                        <td>
                                            <input name="passport" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Driving License: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.drivinglicense}`)}>Driving License Copy</button></td>
                                        <td>
                                            <input name="drivinglicense" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Photo: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.photo}`)}>Open Photo</button></td>
                                        <td>
                                            <input name="photo" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>I9: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.i9}`)}>Open I9</button></td>
                                        <td>
                                            <input name="i9" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>W4: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.i9}`)}>Open w4</button></td>
                                        <td>
                                            <input name="w4" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Bank AHC Form: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.bankahcform}`)}>Open Bank AHC Form</button></td>
                                        <td>
                                            <input name="bankahcform" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>ADP Form: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.adpform}`)}>Open ADP Form</button></td>
                                        <td>
                                            <input name="adpform" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Medical Enrollment Form: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.medicalenrollmentform}`)}>Open I9</button></td>
                                        <td>
                                            <input name="medicalenrollmentform" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Experience: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.experience}`)}>Open Experience</button></td>
                                        <td>
                                            <input name="experience" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Employee Handbook: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.employeehandbook}`)}>Open Employee Handbook</button></td>
                                        <td>
                                            <input name="employeehandbook" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Offer Letter: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.offerletter}`)}>Open Offer Letter</button></td>
                                        <td>
                                            <input name="offerletter" type="file" onChange={handleEditFileData} className="tw-file-input" />
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

    //USER DATA EDIT
    const onClickEditUser = async (userId, application) => {
        setEditForm(application)
        await axios.get(`${baseUrl}candidate-onboarding-application/` + userId)
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

        await axios.delete(`${baseUrl}delete-candidate-onboarding/` + userId)
            .then(res => {
                console.log("User Deleted Successfully")
                window.location.reload()
            })
            .catch(err => console.log(err))
    }

    //OPEN FILE 
    const openFile = (filePath) => {
        window.open(filePath, '_blank');
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
                                    <tr className="applicaton-data-name"><td>Category: </td><td><span className="application-data-span">{viewData.category}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Candidate Name: </td><td><span className="application-data-span">{viewData.candidatename}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Email Address: </td><td><span className="application-data-span">{viewData.emailaddress}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Phone Number: </td><td><span className="application-data-span">{viewData.phonenumber}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>SSN : </td><td><span className="application-data-span">{viewData.ssn}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>passport: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.passport}`)}>Open passport</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Drivinglicense: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.drivinglicense}`)}>drivinglicense</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Photo: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.photo}`)}>photo</button></td></tr>
                                    <tr className="applicaton-data-name"><td>i9: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.i9}`)}>i9</button></td></tr>
                                    <tr className="applicaton-data-name"><td>w4: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.w4}`)}>w4</button></td></tr>
                                    <tr className="applicaton-data-name"><td>bankahcform: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.bankahcform}`)}>bankahcform</button></td></tr>
                                    <tr className="applicaton-data-name"><td>adpform: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.adpform}`)}>adpform</button></td></tr>
                                    <tr className="applicaton-data-name"><td>medicalenrollmentform: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.medicalenrollmentform}`)}>medicalenrollmentform</button></td></tr>
                                    <tr className="applicaton-data-name"><td>experience: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.experience}`)}>experience</button></td></tr>
                                    <tr className="applicaton-data-name"><td>employeehandbook: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.employeehandbook}`)}>employeehandbook</button></td></tr>
                                    <tr className="applicaton-data-name"><td>offerletter: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.offerletter}`)}>offerletter</button></td></tr>

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

    const searchedData = applicationData.filter(each => each.candidatename.toLowerCase().includes(searchValueData) || each.emailaddress.toLowerCase().includes(searchValueData))


    return (
        <div className="tw-data-view-container">
                <table className="data-view-table-container">
                    <thead>
                        <tr>
                            <th className="data-view-table-data">S No</th>
                            <th className="data-view-table-data">Candidate Name</th>
                            <th className="data-view-table-data">Applied For</th>
                            <th className="data-view-table-data">SSN</th>
                            <th className="data-view-table-data">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchedData.map((eachApplication, index) => {
                            return <tr key={index}>
                                <td className="data-view-table-data">{index + 1}</td>
                                <td className="data-view-table-data data-view-table-data-submittion">
                                    <p className="applicaton-data-name">Name : <span className="application-data-span">{eachApplication.candidatename}</span></p>
                                    <p className="applicaton-data-name">Email Address: <span className="application-data-span">{eachApplication.emailaddress}</span></p>
                                    <p className="applicaton-data-name">Phone Number: <span className="application-data-span">{eachApplication.phonenumber}</span></p>
                                </td>
                                <td className="data-view-table-data data-view-table-data-submittion">
                                    <p className="applicaton-data-name">Category : <span className="application-data-span">{eachApplication.category}</span></p>
                            
                                </td>
                                <td className="data-view-table-data">{eachApplication.ssn}</td>

                                <td className="data-view-table-data">
                                    <button type="button" onClick={() => onClickDataView(eachApplication.id)} className="action-view-button">View</button>
                                    <button type="button" onClick={() => onClickEditUser(eachApplication.id, eachApplication)} className="action-edit-button">Edit</button>
                                    <button type="button" onClick={() => deleteAlert(eachApplication.id, eachApplication)} className="action-delete-button">Delete</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {searchedData.length === 0 && <p>No Data Found</p>}
                {dataVewPopup()}
                {dataEditPopup()}

            </div>
    )
}

export default CandidateOnboarding