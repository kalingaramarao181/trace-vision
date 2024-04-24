import { useState } from "react";
import Popup from 'reactjs-popup';

import "./index.css"

const Admin = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                        <button className="close" onClick={close}>
                            &times;
                        </button>
                        <div>
                            <h1>Application</h1>
                            <form className="tw-form-container">
                                <div className="tw-input-container">
                                    <label className="tw-label">Category:</label>
                                    <select className="tw-select">
                                        <option>--Select Category--</option>
                                        <option>Recruiting</option>
                                        <option>Bench</option>
                                        <option>Hot</option>
                                        <option>Jobs</option>
                                        <option>Prime</option>
                                        <option>Training</option>
                                        <option>Interview</option>
                                        <option>Candidate Onboarding</option>
                                        <option>Vendor Onboarding</option>
                                        <option>Immigration</option>
                                    </select>
                                </div>
                                <div className="tw-input-pack-container">
                                    <div className="tw-input-container">
                                        <label className="tw-label">Recruiter Name:</label>
                                        <select className="tw-select">
                                            <option>--Recruiter Name--</option>
                                            <option>Recruiting</option>
                                            <option>Bench</option>
                                            <option>Hot</option>
                                        </select>
                                    </div>
                                    <div className="tw-input-container">
                                        <label className="tw-label">Submittion Date</label>
                                        <input type="date" className="tw-input" />
                                    </div>
                                    <div className="tw-input-container">
                                        <label className="tw-label">Candidate Name</label>
                                        <input type="text" className="tw-input" />
                                    </div>
                                </div>
                                <div className="tw-input-pack-container">
                                    <div className="tw-input-container">
                                        <label className="tw-label">Client Name</label>
                                        <input type="text" className="tw-input" />
                                    </div>
                                    <div className="tw-input-container">
                                        <label className="tw-label">POC Name</label>
                                        <input type="text" className="tw-input" />
                                    </div>
                                    <div className="tw-input-container">
                                        <label className="tw-label">Feedback</label>
                                        <input type="text" className="tw-input" />
                                    </div>
                                </div>
                                <div className="tw-input-container">
                                    <label className="tw-label">Candidate Name</label>
                                    <input type="text" className="tw-input" />
                                </div>
                                <div className="tw-input-container">
                                    <label className="tw-label">Remarks</label>
                                    <textarea type="text" cols={20} rows={4} className="tw-textarea" />
                                </div>
                                <div className="tw-file-input-container">
                                    <input id="resume" name="resume" type="file" className="tw-file-input" />
                                    <label className="tw-file-input-label" htmlFor="resume">Resume</label>
                                </div>
                                <div className="tw-file-input-container">
                                    <input id="R2R" type="file" className="tw-input" />
                                    <label className="tw-file-input-label" htmlFor="R2R">R2R</label>
                                </div>
                                <div className="tw-file-input-container">
                                    <input id="driving" type="file" placeholder="Select " className="tw-input" />
                                    <label className="tw-file-input-label" htmlFor="driving">Driving Lisense</label>
                                </div>
                                <div className="tw-file-input-container">
                                    <input id="visa" type="file" className="tw-input" />
                                    <label className="tw-file-input-label" htmlFor="visa">Visa Copy</label>
                                </div>
                                <div className="tw-file-input-container">
                                    <input id="MSA" type="file" className="tw-input" />
                                    <label className="tw-file-input-label" htmlFor="MSA">MSA Copy</label>
                                </div>
                                <div className="tw-popup-button-container">
                                    <button className="popup-save">Save</button>
                                    <button onClick={() => setIsOpen(false)} className="popup-close">Close</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Popup>
        )
    }
    return (
        <div className="tw-admin-container">
            <div className="admin-sidebar">
                <button className="admin-sidebar-button">Recruiting</button>
                <button className="admin-sidebar-button">Bench</button>
                <button className="admin-sidebar-button">Hot</button>
                <button className="admin-sidebar-button">Jobs</button>
                <button className="admin-sidebar-button">Prime </button>
                <button className="admin-sidebar-button">Candidates</button>
                <button className="admin-sidebar-button">Training</button>
                <button className="admin-sidebar-button">Interview</button>
                <button className="admin-sidebar-button">Candidate Onboarding</button>
                <button className="admin-sidebar-button">Vendor Onboarding</button>
                <button className="admin-sidebar-button">Status </button>
                <button className="admin-sidebar-button">Users</button>
            </div>
            <div>
                <div className="tw-add-button-container">
                    <p className="tw-rec-name">Recruiting List</p>
                    <button onClick={() => setIsOpen(true)} className="tw-add-button">+ Add New</button>
                </div>
                <div className="tw-generate-button-bar">
                    <button className="tw-generate-button">Generate Report</button>
                    <button className="tw-generate-employe-button">Generate Employe Report - Barchart</button>
                    <button className="tw-pie-chart-button">Benchsale Pie Chart</button>
                </div>
                {formPopup()}
            </div>
        </div>
    )
}

export default Admin