import './Radio.css';
import React, { useState, useEffect } from 'react';
import MenuDiv from "../Components/MenuDiv/MenuDiv";
import Display from "../Components/Display/Display";
import axios from 'axios';
function Radio() {

  

  return (
    <div className='todaPaginaR'>
        <MenuDiv></MenuDiv>
        <Display name='Kairos' soundType='Emissora' number="99.5"></Display>
        
        
    </div>
  );
}

export default Radio;
