import "./index.css";
import { FaHome } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import { FaDatabase } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";
import { FaToolbox } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { LiaGraduationCapSolid } from "react-icons/lia";
import { HiOutlineMenu } from "react-icons/hi";
import { HiMiniComputerDesktop } from "react-icons/hi2";
import { SiOnlyoffice } from "react-icons/si";
import { PiBuildingOfficeBold } from "react-icons/pi";
import {Link} from "react-router-dom"
const Home = () => {
    return (
        <>
            <div className="home-main-container">
                <div>
                    <h1 className="Home-heading">
                        {" "}
                        <span className="home-e2e-spantag">E2E</span> TRACKING SERVICES{" "}
                    </h1>
                    <p className="home-paragraph">
                        Our comprehensive E2E tracking services, managing recruiting, bench
                        sales, hot lists, jobs, prime vendors, clients, candidates,
                        training, recruiter interviews, bench sales interviews, and employee
                        status records is seamless and efficient. Harnessing the power of
                        our E2E tracking service modules, we streamline operations from
                        recruiting to employee status record management, ensuring a cohesive
                        and effective process throughout.
                    </p>
                    <Link to="login"><button className="home-button">Login</button></Link>
                </div>
                <div>
                    <img
                        className="home-image"
                        src="https://www.plethorainfo.com/img/resources/HR-solution.png"
                        alt="homeImage"
                    />
                </div>
            </div>
            <h1 className="home-head2">THE E2E TRACKING SERVICE MODULES ARE BELOW</h1>
            <div className="home-main-card-containter">
                <div className="continuous-horizontal-scroll-container">
                    <div className="content">
                        <div className="content-item">
                            <div className="home-card-container">
                                <div className="home-icons" >
                                    <FaHome className="icon" />
                                    <h1 className="home-head-recruting">Recruiting</h1>
                                </div>
                                <p className="home-para-recruting">
                                    Manages the sourcing, screening, and hiring process of potential
                                    candidates for various job positions within the organization.
                                </p>
                            </div>
                        </div>
                        <div className="content-item">
                            <div className="home-card-container">
                                <div className="home-icons" >
                                    <FaUserTie className="icon" />
                                    <h1 className="home-head-recruting">Bench Sales</h1>
                                </div>
                                <p className="home-para-recruting">
                                    Facilitates the placement of consultants who are currently not
                                    assigned to projects, ensuring their deployment to suitable
                                    projects through effective sales strategies.
                                </p>
                            </div>
                        </div>
                        <div className="content-item">
                            <div className="home-card-container">
                                <div className="home-icons" >
                                    <FaDatabase className="icon" />
                                    <h1 className="home-head-recruting">Hot List</h1>
                                </div>
                                <p className="home-para-recruting">
                                    Maintains a dynamic list of top-priority job openings and
                                    high-demand skill sets to expedite the recruitment process and
                                    fill critical positions promptly.
                                </p>
                            </div>
                        </div>
                        <div className="content-item">
                            <div className="home-card-container">
                                <div className="home-icons" >
                                    <FaBook className="icon" />
                                    <h1 className="home-head-recruting">Jobs</h1>
                                </div>

                                <p className="home-para-recruting">
                                    Tracks and manages all active job postings, including their
                                    status, requirements, and progress, ensuring efficient
                                    coordination between recruiters, candidates, and hiring
                                    managers.
                                </p>
                            </div>
                        </div>
                        <div className="content-item">
                            <div className="home-card-container">
                                <div className="home-icons" >
                                    <FaToolbox className="icon" />
                                    <h1 className="home-head-recruting">Prime Vendors</h1>
                                </div>
                                <p className="home-para-recruting">
                                    Establishes and maintains partnerships with key vendors who
                                    provide essential services or contribute to the recruitment
                                    process, ensuring smooth collaboration and resource allocation.
                                </p>
                            </div>
                        </div>
                        <div className="content-item">
                            <div className="home-card-container">
                                <div className="home-icons" >
                                    <FaUsers className="icon" />
                                    <h1 className="home-head-recruting">Clients</h1>
                                </div>
                                <p className="home-para-recruting">
                                    Manages relationships with existing and potential clients,
                                    including communication, feedback, and service delivery, to meet
                                    client needs and foster long-term partnerships.
                                </p>
                            </div>
                        </div>
                        <div className="content-item">
                            <div className="home-card-container">
                                <div className="home-icons" >
                                    <LiaGraduationCapSolid className="icon" />
                                    <h1 className="home-head-recruting">Candidates</h1>
                                </div>
                                <p className="home-para-recruting">
                                    Tracks the progress of candidates throughout the recruitment
                                    lifecycle, from initial application to onboarding, ensuring a
                                    positive candidate experience and efficient hiring process.
                                </p>
                            </div>
                        </div>
                        <div className="content-item">
                            <div className="home-card-container">
                                <div className="home-icons" >
                                    <HiOutlineMenu className="icon" />
                                    <h1 className="home-head-recruting">Training</h1>
                                </div>
                                <p className="home-para-recruting">
                                    Organizes and tracks training programs for employees, including
                                    scheduling, attendance, and performance tracking, to enhance
                                    skills and knowledge development within the organization.
                                </p>
                            </div>
                        </div>
                        <div className="content-item">
                            <div className="home-card-container">
                                <div className="home-icons" >
                                    <HiMiniComputerDesktop className="icon" />
                                    <h1 className="home-head-recruting">Recruiters Interview</h1>
                                </div>
                                <p className="home-para-recruting">
                                    Records and evaluates interviews conducted by recruiters, assessing candidate suitability and fit for specific job roles and organizational culture.
                                </p>
                            </div>
                        </div>
                        <div className="content-item">
                            <div className="home-card-container">
                                <div className="home-icons" >
                                    <SiOnlyoffice className="icon" />
                                    <h1 className="home-head-recruting">Benchsales Interview</h1>
                                </div>
                                <p className="home-para-recruting">
                                    Evaluates interviews conducted during the bench sales process, assessing consultant skills, experience, and compatibility with client requirements for project placements.
                                </p>
                            </div>
                        </div>
                        <div className="content-item">
                            <div className="home-card-container">
                                <div className="home-icons" >
                                    <PiBuildingOfficeBold className="icon" />
                                    <h1 className="home-head-recruting">Employee Status Record</h1>
                                </div>
                                <p className="home-para-recruting">
                                    Maintains up-to-date records of employee status, including employment history, performance evaluations, and any changes in position or responsibilities, ensuring accurate and efficient HR management.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
