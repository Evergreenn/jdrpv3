import React, {useState} from 'react';
import {useNavigationType } from 'react-router-dom';


const Home = () => {
  console.log(useNavigationType());

  return (
    <div class="container">
      <div class="row">
        <div class="col"> home </div>
      </div>
    </div>
  );
}

export default <Home/>
