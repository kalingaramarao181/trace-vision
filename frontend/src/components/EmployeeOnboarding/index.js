import axios from "axios"
import { useEffect, useState } from "react"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Popup from 'reactjs-popup';
import config from "../config";
const baseUrl = config.baseUrl




const EmployeeOnbording = (props) => {
    const { searchValueData } = props
    const [applicationData, setApplicationData] = useState([])
    const [isOpenEditView, setIsOpenEditView] = useState(false);
    const [isOpenDataView, setIsOpenDataView] = useState(false);
    const [editForm, setEditForm] = useState({})
    const [viewData, setViewData] = useState({})

    //GET APPLICATION DATA
    useEffect(() => {
        axios.get(`${baseUrl}employee-onboarding-application-data`)
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
        setEditForm({ ...editForm, [e.target.name]: e.target.files[0] })
    }

    //USER DATA VIEW
    const onClickDataView = async (userId) => {
        await axios.get(`${baseUrl}employee-onboarding-application/` + userId)
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
        const formData = new FormData();
        Object.entries(editForm).forEach(([key, value]) => {
            formData.append(key, value)
        });

        const userId = viewData.id

        try {
            await axios.put(`${baseUrl}update-employee-onboarding-application/` + userId, formData, {
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
                    width: "55vw",
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
                                                <option value="Recruiting">Interview</option>
                                                <option value="Bench">Employees</option>

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
                                    <tr className="applicaton-data-name"><td>HR Manager: </td><td><span className="application-data-span">{viewData.hrmanager}</span></td>
                                        <td>
                                            <input name="hrmanager" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Exam date: </td><td><span className="application-data-span">{new Date(viewData.examdate).toLocaleDateString('en-US')}</span></td>
                                        <td>
                                            <input name="examdate" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr><tr className="applicaton-data-name"><td>Location: </td><td><span className="application-data-span">{viewData.location}</span></td>
                                        <td>
                                            <input name="location" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr><tr className="applicaton-data-name"><td>Father Name: </td><td><span className="application-data-span">{viewData.fathername}</span></td>
                                        <td>
                                            <input name="fathername" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr><tr className="applicaton-data-name"><td>Mother Name: </td><td><span className="application-data-span">{viewData.mothername}</span></td>
                                        <td>
                                            <input name="mothername" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr><tr className="applicaton-data-name"><td>Parent Phone Number: </td><td><span className="application-data-span">{viewData.parentphonenumber}</span></td>
                                        <td>
                                            <input name="parentphonenumber" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr><tr className="applicaton-data-name"><td>Feedback 1: </td><td><span className="application-data-span">{viewData.feedback1}</span></td>
                                        <td>
                                            <input name="feedback1" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr><tr className="applicaton-data-name"><td>Feedback 2: </td><td><span className="application-data-span">{viewData.feedback2}</span></td>
                                        <td>
                                            <input name="feedback2" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr><tr className="applicaton-data-name"><td>Feedback 3: </td><td><span className="application-data-span">{viewData.feedback3}</span></td>
                                        <td>
                                            <input name="feedback3" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>

                                    <tr className="applicaton-data-name"><td>Resume: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.resume}`)}>Open resume</button></td>
                                        <td>
                                            <input name="resume" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>preofferletter: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.preofferletter}`)}>preofferletter</button></td>
                                        <td>
                                            <input name="preofferletter" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>onlinetest: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.onlinetest}`)}>Open onlinetest</button></td>
                                        <td>
                                            <input name="onlinetest" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>10thmarkssheet: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.markssheet10th}`)}>Open markssheet10th</button></td>
                                        <td>
                                            <input name="markssheet10th" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>markssheet12th: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.markssheet12th}`)}>Open markssheet12th</button></td>
                                        <td>
                                            <input name="markssheet12th" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>degreeorbtech: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.degreeorbtech}`)}>Open degreeorbtech</button></td>
                                        <td>
                                            <input name="degreeorbtech" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>pancard: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.pancard}`)}>Open pancard</button></td>
                                        <td>
                                            <input name="pancard" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>aadharcard: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.aadharcard}`)}>Open aadharcard</button></td>
                                        <td>
                                            <input name="aadharcard" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>experienceletters: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.experienceletters}`)}>Open experienceletters</button></td>
                                        <td>
                                            <input name="experienceletters" type="file" onChange={handleEditFileData} className="tw-file-input" />
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
        await axios.get(`${baseUrl}employee-onboarding-application/` + userId)
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

        await axios.delete(`${baseUrl}delete-employee-onboarding/` + userId)
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
                                    <tr className="applicaton-data-name"><td>HR Manager : </td><td><span className="application-data-span">{viewData.hrmanager}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Exam Date : </td><td><span className="application-data-span">{new Date(viewData.examdate).toLocaleDateString('en-US')}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Location  : </td><td><span className="application-data-span">{viewData.location}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Father Name : </td><td><span className="application-data-span">{viewData.fathername}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Mother Name : </td><td><span className="application-data-span">{viewData.mothername}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Parent Phone Number  : </td><td><span className="application-data-span">{viewData.parentphonenumber}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Feedback 1   : </td><td><span className="application-data-span">{viewData.feedback1}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Feedback 2   : </td><td><span className="application-data-span">{viewData.feedback2}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Feedback 3  : </td><td><span className="application-data-span">{viewData.feedback3}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Resume: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.resume}`)}>Open Resume</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Pre Offer Letter: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.preofferletter}`)}>Pre Offer Letter</button></td></tr>
                                    <tr className="applicaton-data-name"><td>onlinetest: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.preofferletter}`)}>onlinetest</button></td></tr>
                                    <tr className="applicaton-data-name"><td>10th Marks Sheet: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.markssheet10th}`)}>10th Marks Sheet</button></td></tr>
                                    <tr className="applicaton-data-name"><td>12th Marks Sheet: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.markssheet12th}`)}>12th Marks Sheet</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Degree Or B.tech: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.degreeorbtech}`)}>Degree Or B.tech</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Pan Card: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.pancard}`)}>Pan Card</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Aadhar Card: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.aadharcard}`)}>Aadhar Card</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Experience Letters: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.experienceletters}`)}>experienceletters</button></td></tr>

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
                        <th className="data-view-table-data">Email Address</th>
                        <th className="data-view-table-data">phonenumber</th>
                        <th className="data-view-table-data">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {searchedData.map((eachApplication, index) => {
                        return <tr key={index}>
                            <td className="data-view-table-data">{index + 1}</td>
                            <td className="data-view-table-data">{eachApplication.candidatename}</td>
                            <td className="data-view-table-data">{eachApplication.emailaddress}</td>
                            <td className="data-view-table-data">{eachApplication.phonenumber}</td>
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

export default EmployeeOnbording