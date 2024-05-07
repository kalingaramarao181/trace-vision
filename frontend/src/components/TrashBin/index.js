import axios from "axios"
import "./index.css"
import { useEffect, useState } from "react"
import config from "../config"
import { confirmAlert } from "react-confirm-alert"
const baseUrl = config.baseUrl

const TrashBin = () => {
    const [binData, setBinData] = useState([])

    useEffect(() => {
        axios.get(`${baseUrl}trashbin`)
            .then(res => {
                const dbData = res.data.map(element => {
                    return {
                        id: element.id,
                        data: JSON.parse(element.trasheddata)
                    }
                });
                setBinData(dbData)
            }).catch(err => {
                console.log(err);
            })
    }, [])

    const onClickReplace = async (insertData, dataId) => {
        await axios.post(`${baseUrl}trashbin-to`, insertData)
            .then(res => {
                alert(res.data);
                window.location.reload()
            })
            .catch(err => {
                console.log(err);
            })
        await axios.delete(`${baseUrl}delete-trashbin/${dataId}`)
    }

    const onClickDelete = (appId) => {
        axios.delete(`${baseUrl}delete-trashbin/${appId}`)
            .then(res => {
                if (res.status === 200 || res.status === 204) {
                    console.log("User Deleted Successfully");
                    window.location.reload();
                } else {
                    console.log("Unexpected response from server:", res);
                }
            })
            .catch(err => {
                console.error("Error deleting user:", err);
            });
    };

    const onClickClearAll = () => {
        axios.delete(`${baseUrl}delete-trashbin-all`)
            .then(res => {
                console.log("Deleted Successfully All");
                window.location.reload()
            })
            .catch(err => {
                console.log(err);
            })
    }


    //DELETE CONFORM ALERT
    const deleteAlert = (appId) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete all items?',
            backgroundColor: 'transparent',
            buttons: [
                {
                    label: 'Cancel',
                    onClick: () => console.log('Delete canceled')
                },
                {
                    label: 'Delete',
                    onClick: () => onClickDelete(appId)
                }
            ]
        });
    }



    const deleteClearAllAlert = (appId) => {
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
                    onClick: () => onClickClearAll()
                }
            ]
        });
    }
    

    return (
        <div className="trashbin-main-container">
            <button className="trashbin-allclear-button" onClick={deleteClearAllAlert}>Clear All</button>
            <div className="trashbin-container">
                {binData.length !== 0 ? <>
                    {binData.map((each, index) => (
                        <div key={index} className="trashbin-card">
                            <p className="trashbin-name">{each.id}</p>
                            <p className="trashbin-name">{each.data.category}</p>
                            <div>
                                <button type="button" onClick={() => onClickReplace(each.data, each.id)} className="trashbin-replace-button">Replace</button>
                                <button type="button" onClick={() => deleteAlert(each.id)} className="trashbin-delete-button">Delete</button>
                            </div>
                        </div>
                    ))}</> : <p className="no-data-reaction">No Data Found</p>}
            </div>
        </div>
    )
}

export default TrashBin