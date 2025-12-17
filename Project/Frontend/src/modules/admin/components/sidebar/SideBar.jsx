import React, { useState } from 'react'
import styles from './SideBar.module.css'
import { HiDotsHorizontal, HiLogin, HiOutlineShoppingBag } from 'react-icons/hi'
import { FiCornerDownRight, FiSearch } from 'react-icons/fi'
import { RiDashboardFill, RiMoneyRupeeCircleFill } from 'react-icons/ri'
import { TbCategoryPlus, TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand, TbRulerMeasure2 } from 'react-icons/tb'
import { SiBrandfolder } from 'react-icons/si'
import { LuUsers } from 'react-icons/lu'
import { NavLink } from 'react-router'
import { MdError } from 'react-icons/md'
import { BsTags } from 'react-icons/bs'
import { FaMapMarkedAlt, FaMapMarkerAlt, FaPalette, FaTshirt } from 'react-icons/fa'

const SideBar = () => {
    const [change, setChange] = useState(true)

    return (
        <div className={styles.sidebar}   style={{ width: change ? "270px" : "75px" }}
>
            {
                change ? <>
                    <div className={styles.top}>
                        <span className={styles.logo}>WARDROBE</span>
                        <TbLayoutSidebarLeftCollapse className={styles.adjusting_icon} onClick={() => setChange((e) => !e)} />
                    </div>
                    <div className={styles.center}>
                        <ul>
                            <NavLink to='/admin/' end style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <RiDashboardFill className={styles.icon} />
                                    <span>Dashboard</span>
                                </li>
                            </NavLink>
                            <div className={styles.divider}></div>
                            <NavLink to="/admin/district" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <FaMapMarkedAlt className={styles.icon} />
                                    <span>District</span>
                                </li>
                            </NavLink>
                            <NavLink to="/admin/place" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <FaMapMarkerAlt className={styles.icon} />
                                    <span>Place</span>
                                </li>
                            </NavLink>
                            <div className={styles.divider}></div>
                            <NavLink to="/admin/category" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <TbCategoryPlus className={styles.icon} />
                                    <span>Category</span>
                                </li>
                            </NavLink>
                            <NavLink to="/admin/subcategory" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <FiCornerDownRight className={styles.icon} />
                                    <span>Subcategory</span>
                                </li>
                            </NavLink>
                            <div className={styles.divider}></div>
                            <NavLink to="/admin/brand" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <SiBrandfolder className={styles.icon} />
                                    <span>Brand</span>
                                </li>
                            </NavLink>
                            <NavLink to="/admin/type" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <BsTags className={styles.icon} />
                                    <span>Type</span>
                                </li>
                            </NavLink>
                            <NavLink to="/admin/size" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <TbRulerMeasure2 className={styles.icon} />
                                    <span>Size</span>
                                </li>
                            </NavLink>
                            <NavLink to="/admin/fit" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <FaTshirt className={styles.icon} />
                                    <span>Fit</span>
                                </li>
                            </NavLink>
                            <NavLink to="/admin/color" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <FaPalette className={styles.icon} />
                                    <span>Color</span>
                                </li>
                            </NavLink>

                            <div className={styles.divider}></div>
                            <NavLink to="/admin/user" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <LuUsers className={styles.icon} />
                                    <span>Users</span>
                                </li>
                            </NavLink>
                            <NavLink to="/admin/shop" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <HiOutlineShoppingBag className={styles.icon} />
                                    <span>Shops</span>
                                </li>
                            </NavLink>
                            <NavLink to="/admin/refunds" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <RiMoneyRupeeCircleFill className={styles.icon} />
                                    <span>Refunds</span>
                                </li>
                            </NavLink>
                            <NavLink to="/admin/complaint" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                <li>
                                    <MdError className={styles.icon} />
                                    <span>Complaints</span>
                                </li>
                            </NavLink>
                        </ul>
                        <div className={styles.divider}></div>
                        <div className={styles.bottom_container}></div>
                    </div>

                </> :
                    <>
                        <div className={styles.top}>
                            <TbLayoutSidebarLeftExpand className={styles.adjusting_icon} onClick={() => setChange((e) => !e)} />
                        </div>

                        <div className={styles.center}>
                            <ul>
                                <NavLink to='/admin/' end style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                    <li>
                                        <RiDashboardFill className={styles.icon} />
                                    </li>
                                </NavLink>
                                <div className={styles.divider}></div>
                                <NavLink to="/admin/category" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                    <li>
                                        <TbCategoryPlus className={styles.icon} />
                                    </li>
                                </NavLink>
                                <NavLink to="/admin/subcategory" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                    <li>
                                        <FiCornerDownRight className={styles.icon} />
                                    </li>
                                </NavLink>
                                <NavLink to="/admin/brand" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                    <li>
                                        <SiBrandfolder className={styles.icon} />
                                    </li>
                                </NavLink>
                                <NavLink to="/admin/type" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                    <li>
                                        <BsTags className={styles.icon} />
                                    </li>
                                </NavLink>
                                <NavLink to="/admin/size" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                    <li>
                                        <TbRulerMeasure2 className={styles.icon} />
                                    </li>
                                </NavLink>
                                <NavLink to="/admin/fit" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                    <li>
                                        <FaTshirt className={styles.icon} />
                                    </li>
                                </NavLink>
                                <NavLink to="/admin/color" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                    <li>
                                        <FaPalette className={styles.icon} />
                                    </li>
                                </NavLink>

                                <div className={styles.divider}></div>
                                <NavLink to="/admin/user" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                    <li>
                                        <LuUsers className={styles.icon} />
                                    </li>
                                </NavLink>
                                <NavLink to="/admin/shop" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                    <li>
                                        <HiOutlineShoppingBag className={styles.icon} />
                                    </li>
                                </NavLink>
                                <NavLink to="/admin/complaint" style={{ textDecoration: "none" }} className={({ isActive }) => isActive ? styles.activeMenu : ""}>
                                    <li>
                                        <MdError className={styles.icon} />
                                    </li>
                                </NavLink>
                            </ul>
                        </div>


                    </>

            }


        </div>

    )
}

export default SideBar