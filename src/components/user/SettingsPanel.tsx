import { useState } from "react";
import PasswordChangeForm from "../global/PasswordChangeForm";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const SettingsPanel = () => {
    const [activeTab, setActiveTab] = useState('email');
    const isGoogleAuth = useSelector((state: RootState) => state.user.user?.isGoogleAuth)

  return (
    <div className="bg-white border border-blue-900 rounded-[5px] shadow-md p-4 w-full md:w-2/3">
    <div className="flex justify-between mb-4 text-sm font-bold">
      <div
        className={`cursor-pointer ${activeTab === 'email' ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900'} px-3 py-1 w-full text-center border-blue-900 border ml-1 rounded-[2px]`}
        onClick={() => setActiveTab('email')}
      >
       Email Preferences
      </div>
      <div
        className={`cursor-pointer ${activeTab === 'password' ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900'} px-3 py-1 w-full text-center border-blue-900 border mx-1 rounded-[2px]`}
        onClick={() => setActiveTab('password')}
      >
        Password Settings
      </div>
      <div
        className={`cursor-pointer ${activeTab === 'privacy' ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900'} px-3 py-1 w-full text-center border-blue-900 border mr-1 rounded-[2px]`}
        onClick={() => setActiveTab('privacy')}
      >
        Privacy Settings
      </div>
    </div>
    {activeTab === 'password' && !isGoogleAuth && <PasswordChangeForm />}
    {activeTab === 'password' && isGoogleAuth && <>
      <div>
        You Logined With google
      </div>
    </>}

  </div>
  )
}

export default SettingsPanel