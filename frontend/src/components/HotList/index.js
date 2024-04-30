import axios from "axios"
import { useEffect, useState } from "react"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Popup from 'reactjs-popup';
import config from "../config";
const baseUrl = config.baseUrl




const HotList = (props) => {
    const {searchValueData} = props
    const [applicationData, setApplicationData] = useState([])
    const [isOpenEditView, setIsOpenEditView] = useState(false);
    const [isOpenDataView, setIsOpenDataView] = useState(false);
    const [editForm, setEditForm] = useState({})
    const [viewData, setViewData] = useState({})

    //GET APPLICATION DATA
    useEffect(() => {
        axios.get(`${baseUrl}hotlist-application-data`)
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
        await axios.get(`${baseUrl}hotlist-application/` + userId)
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
            await axios.put(`${baseUrl}update-hotlist-application/` + userId, formData, {
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
                                    <tr className="applicaton-data-name"><td>Candidate Name: </td><td><span className="application-data-span">{viewData.candidatename}</span></td>
                                        <td>
                                            <input name="candidatename" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Email: </td><td><span className="application-data-span">{viewData.email}</span></td>
                                        <td>
                                            <input name="email" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Phone Number: </td><td><span className="application-data-span">{viewData.phonenumber}</span></td>
                                        <td>
                                            <input name="phonenumber" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Technology: </td><td><span className="application-data-span">{viewData.technology}</span></td>
                                        <td>
                                            <input name="technology" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Location: </td><td><span className="application-data-span">{viewData.location}</span></td>
                                        <td>
                                            <input name="location" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Visa Status: </td><td><span className="application-data-span">{viewData.visastatus}</span></td>
                                        <td>
                                            <input name="visastatus" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Remarks: </td><td><span className="application-data-span">{viewData.remarks}</span></td>
                                        <td>
                                            <textarea name="remarks" onChange={handleEditFormData} type="text" cols={20} rows={2} className="tw-textarea" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Resume: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.resumepath}`)}>Open Resume</button></td>
                                        <td>
                                            <input name="resumepath" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>R2R: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.r2rpath}`)}>R2R Copy</button></td>
                                        <td>
                                            <input name="r2rpath" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Driving License: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.drivingpath}`)}>Open Driving License</button></td>
                                        <td>
                                            <input name="drivingpath" type="file" onChange={handleEditFileData} className="tw-file-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Visa: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.visapath}`)}>Open Visa</button></td>
                                        <td>
                                            <input name="visacopypath" type="file" onChange={handleEditFileData} className="tw-file-input" />
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
        await axios.get(`${baseUrl}hotlist-application/` + userId)
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

        await axios.delete(`${baseUrl}delete-hotlist/` + userId)
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
                                    <tr className="applicaton-data-name"><td>Applied For: </td><td><span className="application-data-span">{viewData.category}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Candidate Name: </td><td><span className="application-data-span">{viewData.candidatename}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Email Address: </td><td><span className="application-data-span">{viewData.email}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Phone Number: </td><td><span className="application-data-span">{viewData.phonenumber}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Technology: </td><td><span className="application-data-span">{viewData.technology}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Current Location: </td><td><span className="application-data-span">{viewData.location}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Visa Status: </td><td><span className="application-data-span">{viewData.visastatus}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Remarks: </td><td><span className="application-data-span">{viewData.remarks}</span></td></tr>
                                    <tr className="applicaton-data-name"><td>Resume: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.resumepath}`)}>Open Resume</button></td></tr>
                                    <tr className="applicaton-data-name"><td>R2R: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.r2rpath}`)}>R2R Copy</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Driving License: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.drivingpath}`)}>Open Driving License</button></td></tr>
                                    <tr className="applicaton-data-name"><td>Visa: </td><td><button type="button" onClick={() => openFile(`${baseUrl}${viewData.visapath}`)}>Open Visa</button></td></tr>
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

    const searchedData = applicationData.filter(each => each.technology.toLowerCase().includes(searchValueData) || each.candidatename.toLowerCase().includes(searchValueData))


    return (
        <div className="tw-data-view-container">
                <table className="data-view-table-container">
                    <thead>
                        <tr>
                            <th className="data-view-table-data">S No</th>
                            <th className="data-view-table-data">Candidate Details</th>
                            <th className="data-view-table-data">Technology</th>
                            <th className="data-view-table-data">Location & VisaStatus</th>
                            <th className="data-view-table-data">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchedData.map((eachApplication, index) => {
                            return <tr key={index}>
                                <td className="data-view-table-data">{index + 1}</td>
                                <td className="data-view-table-data data-view-table-data-submittion">
                                    <p className="applicaton-data-name">Name: <span className="application-data-span">{eachApplication.candidatename}</span></p>
                                    <p className="applicaton-data-name">Applied For: <span className="application-data-span">{eachApplication.category}</span></p>
                                    <p className="applicaton-data-name">Email: <span className="application-data-span">{eachApplication.email}</span></p>
                                    <p className="applicaton-data-name">Phone No: <span className="application-data-span">{eachApplication.phonenumber}</span></p>
                                </td>
                                <td className="data-view-table-data">{eachApplication.technology}</td>
                                <td className="data-view-table-data data-view-table-data-submittion">
                                    <p className="applicaton-data-name">Current Location: <span className="application-data-span">{eachApplication.location}</span></p>
                                    <p className="applicaton-data-name">Visa Status: <span className="application-data-span">{eachApplication.visastatus}</span></p>
                                </td>
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

export default HotList