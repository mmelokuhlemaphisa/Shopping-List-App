import React from 'react'
import { useAppSelector, useAppDispatch } from "../../ReduxHooks";

 
export default function Login() {
     const email = useAppSelector((state) => state.login.email);
     const username = useAppSelector((state) =>state.login.username)
     const dispatch = useAppDispatch();

  return (
    <div>
      <h1>{username}</h1>

      {email}
    </div>
  );
}
