import React, { useEffect, useRef, useState } from 'react'
import styles from './NavBar.module.css'
import { FiSearch } from 'react-icons/fi'
import profile from '../../../../assets/images/profile.jpg'
import { IoMdNotifications, IoMdSettings } from 'react-icons/io'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineLogout, MdSupportAgent } from 'react-icons/md'
const NavBar = () => {
  const [open, setOpen] = useState(false);

  const [openNotification, setOpenNotification] = useState(false);

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.navbar_container}>
      <div className={styles.search_container}>
        <FiSearch className={styles.search_icon}/>
        <input type="text" placeholder='Search' className={styles.search_input} />
      </div>
      <div className={styles.notification}>
        <IoMdNotifications className={styles.notification_icon} onClick={()=> setOpenNotification(!openNotification)}/>
      </div>
      <div ref={profileRef}
        className={styles.profile_container} onClick={() => setOpen(!open)}>
        <img src={profile} alt="Profile" className={styles.profile_img} />
        <span className={styles.profile_name}>James Morgan</span>
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className={styles.dropdown_menu}>
          <div className={styles.menu_options}>
            <CgProfile className={styles.option_icons} />
            <span className={styles.option_text}>My Profile</span>
          </div>
          <div className={styles.menu_options}>
            <IoMdSettings className={styles.option_icons} />
            <span className={styles.option_text}>Settings</span>
          </div>
          <div className={styles.menu_options}>
            <MdSupportAgent className={styles.option_icons} />
            <span className={styles.option_text}>Support</span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.menu_options}>
            <MdOutlineLogout className={styles.option_icons_logout} />
            <span className={styles.option_text}>Logout</span>
          </div>
        </div>
      )}

      {
        openNotification && (
          <div className={styles.notification_popup}>
            <div className={styles.notification_heading}>
              <span className={styles.heading_text}>Notifications</span>
            </div>
            <div className={styles.notification_list}>
               <div className={styles.image_container} >
                <img src={profile} alt="" className={styles.list_image}/>
               </div>
               <div className={styles.message_container}>
                <div className={styles.message_head}>
                  <span className={styles.head_name}>Neli Sims</span>
                  <span className={styles.head_time}>a few moments ago</span>
                </div>
                <div className={styles.message_content}>
                  Congratulations! Your latest upload is now live and available for users to view.
                </div>
               </div>
            </div>
            <div className={styles.notification_divider}></div>
            <div className={styles.bottom_option}>
              <span>View all</span>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default NavBar