import { IoClose } from 'react-icons/io5'
import styles from './AnnouncementBar.module.css'
import { useState } from 'react'

const AnnouncementBar = () => {

    const [visibility, setVisibility] = useState(true);
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => setVisibility(false), 500); // remove after animation completes
    };

    if (!visibility) return null;

    return (
        <div className={`${styles.bar} ${closing ? styles.slideUp : ""}`}>
            <span className={styles.bar_msg}>SIGNUP TO GET <strong>25%</strong> OFF</span>

            <div className={styles.close_opt} onClick={handleClose}>
                <p className={styles.close_txt}>CLOSE</p>
                <IoClose className={styles.close_icon} />
            </div>
        </div>
    )
}

export default AnnouncementBar