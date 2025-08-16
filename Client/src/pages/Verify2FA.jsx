import React from 'react'
import { useNavigate } from 'react-router-dom'
import TwoVerification from '../components/TwoVerification';

const Verify2FA = () => {
  const navigate = useNavigate();
  const handleVerification = async(data) =>{
    if(data){
      navigate("/");
    }
  };

  const handle2FAReset = async(data) => {
    if(data){
      navigate("/setup-2fa");
    }
  };


  return (
    <TwoVerification onverifySuccess={handleVerification} onResetSuccess={handle2FAReset}/>
  )
}

export default Verify2FA