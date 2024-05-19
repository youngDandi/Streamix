import './Login.css';
import logo from '../../assets/img/icons8-video-96.png';
import { Link } from "react-router-dom";


function Login() {
  return (
    <div className='todaPaginaL'>
        
        <div className='Section'>
            <div className="logotipo">
                <img src={logo} id="logo1" alt=""/>
                <h2 id="logoName1">Streamix</h2>
            </div>
            <div className="inputSection">
                <input placeholder='Email' type='text' className='input' id='base' required></input>
                
            </div>
            <div className="inputSection">
                <input placeholder='Palavra-passe' type='text' className='input' required></input>

            </div>
            <div className="inputSection">
                <button id='btn'>Login</button>
            </div>
            <Link to={"/SignUp"} className='link'> <p>Cria a tua conta!!</p></Link>
        </div>
        
    </div>
  );
}

export default Login;
