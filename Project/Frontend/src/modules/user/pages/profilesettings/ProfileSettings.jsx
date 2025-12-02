import UserRoutes from '../../../../routes/UserRoutes'
import UserSettingsRoute from '../../../../routes/UserSettingsRoute'
import SettingsSidebar from '../../components/settingssidebar/SettingsSidebar'
import styles from './ProfileSettings.module.css'

const ProfileSettings = () => {
  return (
    <div className={styles.profilesettings}>
        <SettingsSidebar />
        <div className={styles.settings_hero}>
            <UserSettingsRoute />
        </div>
    </div>
  )
}

export default ProfileSettings