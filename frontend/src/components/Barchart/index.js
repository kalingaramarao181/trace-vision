import React, { useState } from "react";
import axios from "axios";
import config from "../config";
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, Cell, PieChart, Pie, Tooltip, CartesianGrid } from "recharts";
import './index.css'

const baseUrl = config.baseUrl
const barchartCategoery = localStorage.getItem("barchartCategoery")

const Barchats = () => {
    const [data, setData] = useState([])
    const [excelData, setExcelData] = useState([])
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")

    const onClickGenarateReport = () => {
        if (excelData.length !== 0) {
            const wb = XLSX.utils.book_new();
            wb.Props = {
                Title: `${barchartCategoery}-${fromDate} to ${toDate}`,
                Author: 'Your Name',
            };
            const ws = XLSX.utils.json_to_sheet(excelData);
            XLSX.utils.book_append_sheet(wb, ws, `${barchartCategoery}`);

            // Generate Excel file and trigger download
            XLSX.writeFile(wb, `${barchartCategoery}-${fromDate} to ${toDate}.xlsx`);
        } else {
            alert("No Data Found")
        }
    }

    const handileSubmit = (e) => {
        e.preventDefault()
        axios.get(`${baseUrl}barchat-data`, {
            params: {
                fromDate,
                toDate,
                barchartCategoery
            }
        })
            .then(res => {
                const recruiters = res.data.map(each => {
                    return {
                        recruiter: each.recruitername
                    }
                })
                const submittionCount = {}
                recruiters.forEach(item => {
                    const recruiter = Object.values(item)
                    recruiter.forEach(option => {
                        if (submittionCount[option]) {
                            submittionCount[option]++
                        } else {
                            submittionCount[option] = 1;
                        }
                    })
                });
                const formatedData = Object.entries(submittionCount).map(([recruiter, submittions]) => ({
                    recruiter,
                    submittions
                }))
                const dbData = res.data.map((item, index) => {
                    return {
                        SerialNo: index + 1,
                        Date: item.submittiondate,
                        RecruiterName: item.recruitername,
                        CandidateDetails: item.candidatename,
                        VisaStatus: item.remarks,
                        ClientName: item.clientname,
                        Feedback: item.feedback
                    }
                })
                setExcelData(dbData)
                setData(formatedData);
            })
            .catch(err => {
                console.log(err);
            })
    }
    const colors = ['#AF2424', '#9A3503', '#966E0E', '#828A0F', '#3B7304', '#FA062E', '#3B0192', '#10535D', '#860DF8', '#24402D' ]
    return (
        <div className="barchart-total-container">
            <div>
                <h1 className="barchat-main-heading">{barchartCategoery} - Employees Submissions Report</h1>
            </div>
            <hr />
            <form onSubmit={handileSubmit} className="barchat-search-container">
                <input onChange={(e) => setFromDate(e.target.value)} type="date" className="barchat-date" />
                <input onChange={(e) => setToDate(e.target.value)} type="date" className="barchat-date" />
                <button type="submit" className="barchat-button">Search Date</button>
                <button type="button" onClick={onClickGenarateReport} className="barchat-report-button">Excel Report</button>
            </form>
            <h1 className="analytics-repors-heading">Analytics Reports from <span className="submittion-date">{fromDate !==  "" ?  new Date(fromDate).toLocaleDateString('en-US') : ""}</span> to <span className="submittion-date">{toDate !== "" ? new Date(fromDate).toLocaleDateString('en-US') : ""}</span></h1>
            <hr />
            <div className="barchat-container">
                {data.length === 0 ? <p>No Data Found</p> : <>
                    <BarChart
                        width={550}
                        height={350}
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="recruiter" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar barSize={30} dataKey="submittions" fill="#8884d8" >
                            {
                                data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))
                            }
                        </Bar>
                    </BarChart>
                    <ResponsiveContainer width="40%" height={300}>
                        <PieChart>
                            <Pie
                                cx="70%"
                                cy="40%"
                                data={data}
                                startAngle={0}
                                endAngle={360}
                                innerRadius="40%"
                                outerRadius="70%"
                                dataKey="submittions"
                            >
                                {data.map((each, index) => (<Cell name={each.recruiter} fill={colors[colors.length - 1 - index]} key={index} />))}
                            </Pie>
                            <Tooltip />
                            <Legend
                                iconType="circle"
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </>
                }
            </div>
        </div>
    );
};

export default Barchats;
