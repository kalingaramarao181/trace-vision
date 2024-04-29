import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import './index.css'


import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Tooltip,
    CartesianGrid
} from "recharts";
const baseUrl = config.baseUrl




const data1 = [
    {
        count: 809680,
        language: "devid",
    },
    {
        count: 4555697,
        language: "robort",


    },
    {
        count: 12345657,
        language: "ram",


    },
    {
        count: 12345657,
        tamil: "ragu",

    },
    {
        count: 12345657,
        tamil: "venky",

    },
    {
        count: 12345657,
        tamil: "jon",

    },
]
const data = [
    { name: 'Page A', uv: 400,},
    { name: 'Page B', uv: 300},
    { name: 'Page C', uv: 200},
    { name: 'Page D', uv: 100},
    { name: 'Page E', uv: 90},
    { name: 'Page F', uv: 60}
];

const Barchats = () => {

    const [dbData, setDbData] = useState([])

    useEffect(() => {
        axios.get(`${baseUrl}barchat-data`)
        .then(res => {
            setDbData(res.data)
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

    const newData = dbData.map(each => {
        return {name:each.recruitername, candidate:each.candidatename} 
    })

    

    console.log(newData);
    // Color mapping for different names
    const colorMap = {
        'Page A': '#f56342',
        'Page B': '#82ca9d',
        'Page C': '#ffc658',
        'Page D': '#ff7300',
        'Page E': '#0088aa',
        'Page F': '#ff0000',
    };
    return (
        <>
            <div>
                <h1 className="barchat-main-heading">EMPLOYEE SUBMISSION</h1>
            </div>
            <form className="barchat-search-container">
                <input type="date" className="barchat-date" />
                <input type="date" className="barchat-date" />
                <button type="submit" className="barchat-button">Search Name</button>
            </form>
            <div className="barchat-container">
                <BarChart width={600} height={300} data={data}>
                    <XAxis dataKey="name" stroke="#8884d8" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <Bar dataKey="uv" barSize={30}>
                        {data.map((entry, index) => (
                            <Bar key={index} fill={colorMap[entry.name]} />
                        ))}
                    </Bar>
                </BarChart>
                <ResponsiveContainer width="40%" height={300}>
                    <PieChart>
                        <Pie
                            cx="70%"
                            cy="40%"
                            data={data1}
                            startAngle={0}
                            endAngle={360}
                            innerRadius="40%"
                            outerRadius="70%"
                            dataKey="count"
                        >
                            <Cell name="devid" fill="#fecba6" />
                            <Cell name="robort" fill="#b3d23f" />
                            <Cell name="ram" fill="#a44c9e" />
                            <Cell name="ragu" fill="red" />
                            <Cell name="venky" fill="blue" />
                            <Cell name="jon" fill="green" />
                        </Pie>
                        <Legend
                            iconType="circle"
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default Barchats;
