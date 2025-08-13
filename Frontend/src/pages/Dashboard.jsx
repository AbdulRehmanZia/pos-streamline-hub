import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';


export default function Dashboard() {
  const {user} = useContext(UserContext)
  return (
    <>
    Hello {user.email}
    {/* Hello User */}
    </>
  );
}







