import './SignUp.css';
import logo from '../../assets/img/icons8-video-96.png';
import { Link } from "react-router-dom";


function Login() {
  return (
    <div className='todaPaginaS'>
        
        <div className='SectionS'>
            <div className="logotipoS">
                <img src={logo} id="logo1S" alt=""/>
                <h2 id="logoName1S">Streamix</h2>
            </div>
            <div className="inputSectionS">
                <input placeholder='Email' type='text' className='inputS' id='baseS' required></input>
                
            </div>
            <div className="inputSectionS">
                <input placeholder='Palavra-passe' type='text' className='inputS' required></input>

            </div>
            <div className="inputSectionS">
                <button id='btn'>Cadastrar</button>
            </div>
            
        </div>
        
    </div>
  );
}

export default Login;
