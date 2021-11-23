import React, { useState } from 'react';
import { useNavigationType } from 'react-router-dom';


const Home = () => {
  console.log(useNavigationType());

  return (
    <section>
      <div class="container">
        <img src="https://via.placeholder.com/1920x700/?text=Anima+Sola" alt="" />
        <h1 class="is-center">Lorem</h1>
        <div class="row">
          <div class="col"> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras auctor, arcu eget congue accumsan, ex libero malesuada enim, sit amet semper nibh tellus id mauris. Ut in iaculis orci. Duis porttitor dictum auctor. Sed tincidunt eleifend libero ac scelerisque. Morbi congue scelerisque lacus, in tincidunt massa viverra in. Sed vitae enim a nulla ullamcorper maximus et eget quam. Vestibulum pretium sagittis ullamcorper. Pellentesque feugiat sodales lacus, ac ultricies leo feugiat eu. Vestibulum eget facilisis urna, id suscipit nibh. Vivamus mollis commodo sapien, a egestas sapien ullamcorper eget</p> </div>
          <div class="col"> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras auctor, arcu eget congue accumsan, ex libero malesuada enim, sit amet semper nibh tellus id mauris. Ut in iaculis orci. Duis porttitor dictum auctor. Sed tincidunt eleifend libero ac scelerisque. Morbi congue scelerisque lacus, in tincidunt massa viverra in. Sed vitae enim a nulla ullamcorper maximus et eget quam. Vestibulum pretium sagittis ullamcorper. Pellentesque feugiat sodales lacus, ac ultricies leo feugiat eu. Vestibulum eget facilisis urna, id suscipit nibh. Vivamus mollis commodo sapien, a egestas sapien ullamcorper eget</p> </div>
          <div class="col"> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras auctor, arcu eget congue accumsan, ex libero malesuada enim, sit amet semper nibh tellus id mauris. Ut in iaculis orci. Duis porttitor dictum auctor. Sed tincidunt eleifend libero ac scelerisque. Morbi congue scelerisque lacus, in tincidunt massa viverra in. Sed vitae enim a nulla ullamcorper maximus et eget quam. Vestibulum pretium sagittis ullamcorper. Pellentesque feugiat sodales lacus, ac ultricies leo feugiat eu. Vestibulum eget facilisis urna, id suscipit nibh. Vivamus mollis commodo sapien, a egestas sapien ullamcorper eget</p> </div>
          <div class="col"> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras auctor, arcu eget congue accumsan, ex libero malesuada enim, sit amet semper nibh tellus id mauris. Ut in iaculis orci. Duis porttitor dictum auctor. Sed tincidunt eleifend libero ac scelerisque. Morbi congue scelerisque lacus, in tincidunt massa viverra in. Sed vitae enim a nulla ullamcorper maximus et eget quam. Vestibulum pretium sagittis ullamcorper. Pellentesque feugiat sodales lacus, ac ultricies leo feugiat eu. Vestibulum eget facilisis urna, id suscipit nibh. Vivamus mollis commodo sapien, a egestas sapien ullamcorper eget</p> </div>
        </div>
      </div>

    </section>
  );
}

export default <Home />
