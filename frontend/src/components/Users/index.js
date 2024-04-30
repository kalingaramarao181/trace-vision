import axios from "axios"
import { useEffect, useState } from "react"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Popup from 'reactjs-popup';
import config from "../config";
const baseUrl = config.baseUrl




const Users = (props) => {
    const {searchValueData} = props
    const [userData, setUserData] = useState([])
    const [isOpenEditView, setIsOpenEditView] = useState(false);
    const [editForm, setEditForm] = useState({})
    const [viewData, setViewData] = useState({})

    useEffect(() => {
        axios.get(`${baseUrl}company-user`)
        .then(res => {
            setUserData(res.data)
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

    const handleEditFormData = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value })
        console.log(editForm);
    }


    const handleUpdateForm = async (e) => {
        e.preventDefault()
        const userId = viewData.id

        try {
            await axios.put(`${baseUrl}update-user-form/` + userId, editForm);
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
                                    <tr className="applicaton-data-name"><td>Name: </td><td><span className="application-data-span">{viewData.username}</span></td>
                                        <td>
                                            <input name="username" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>User Name: </td><td><span className="application-data-span">{viewData.email}</span></td>
                                        <td>
                                            <input name="email" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>Password: </td><td><span className="application-data-span">***********</span></td>
                                        <td>
                                            <input name="password" onChange={handleEditFormData} type="text" className="tw-input" />
                                        </td>
                                    </tr>
                                    <tr className="applicaton-data-name"><td>User Type: </td><td><span className="application-data-span">{viewData.usertype}</span></td>
                                        <td>
                                            <select name="usertype" onChange={handleEditFormData} className="tw-select">
                                                <option value="">--Recruiter Name--</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Staff">Staff</option>
                                            </select>
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
        await axios.get(`${baseUrl}company-user/` + userId)
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

        await axios.delete(`${baseUrl}delete-company-user/` + userId)
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

    let searchedData = userData.filter(each => each.username.toLowerCase().includes(searchValueData)) || userData.filter(each => each.email.includes(searchValueData))


    return (
        <div className="tw-data-view-container">
                <table className="data-view-table-container">
                    <thead>
                        <tr>
                            <th className="data-view-table-data">S No</th>
                            <th className="data-view-table-data">Name</th>
                            <th className="data-view-table-data">User Name</th>
                            <th className="data-view-table-data">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchedData.map((eachApplication, index) => {
                            return <tr key={index}>
                                <td className="data-view-table-data">{index + 1}</td>
                                <td className="data-view-table-data">{eachApplication.username}{eachApplication.usertype === "Admin" &&<span className="user-admin-span">Admin</span>}</td>
                                <td className="data-view-table-data">{eachApplication.email}</td>
                                <td className="data-view-table-data">
                                    <button onClick={() => onClickEditUser(eachApplication.id, eachApplication)} className="action-edit-button">Edit</button>
                                    <button onClick={() => deleteAlert(eachApplication.id, eachApplication)} className="action-delete-button">Delete</button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {searchedData.length === 0 && <p>No Data Found</p>}
                {dataEditPopup()}
            </div>
    )
}

export default Users