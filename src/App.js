import './App.css';
import React from "react";
import UserData from './component/userData';

export default function App() {
  return (
    <React.Fragment>
    <div className="App">
      {/* <h1 className='mt-3'> User Datatable </h1> */}
    <div className='container'>
      <div className='row'>
        <div className='col-md-12'>
          <UserData />
        </div>
      </div>
    </div>
    </div>
    </React.Fragment>
  );
}