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
    const colors = ['#f56342', '#82ca9d', '#ffc658', '#ff7300', '#0088aa', '#ff0000', '#f56342', '#82ca9d', '#ffc658', '#ff7300', '#0088aa', '#ff0000']
    return (
        <div className="barchart-total-container">
            <div>
                <h1 className="barchat-main-heading">{barchartCategoery} - Employees Submissions Report</h1>
            </div>
            <hr />
            <form onSubmit={handileSubmit} className="barchat-search-container">
                <input onChange={(e) => setFromDate(e.target.value)} type="date" className="barchat-date" />
                <input onChange={(e) => setToDate(e.target.value)} type="date" className="barchat-date" />
                <button type="submit" className="barchat-button">Search Name</button>
                <button type="button" onClick={onClickGenarateReport} className="barchat-report-button">Excel Report</button>

            </form>
            <h1 className="analytics-repors-heading">Analytics Reports from <span className="submittion-date">{fromDate}</span> to <span className="submittion-date">{toDate}</span></h1>

            <div className="barchat-container">
                {data.length === 0 ? <p>No Data Found</p> : <>
                    <BarChart width={500} height={250} data={data}>
                        <XAxis dataKey="recruiter" stroke="#8884d8" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <Bar dataKey="submittions" barSize={30}>
                            {data.map((entry, index) => (
                                <Bar key={index} name={entry.recruiter} fill={colors[index]} />
                            ))}
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
                                {data.map((each, index) => (<Cell name={each.recruiter} fill={colors[index]} key={index} />))}
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
