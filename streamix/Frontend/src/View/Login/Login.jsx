import './Login.css';
import  { useState } from 'react';
import logo from '../../assets/img/icons8-video-96.png';
import { Link, Navigate } from "react-router-dom";
import firebase from '../../../firebase.js';
import axios from 'axios';
import { useAuth } from '../../hooks/AuthContext.jsx';
function Login() {
  const  {login}  = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [redirectToHome, setRedirectToHome] = useState(false);

    const handleLogin = async () => {
      try {
        const response = await axios.post('http://192.168.1.9:3001/login', { email, password });
        const userData = response.data.user;
        alert(`Seja Bem-Vindo Sr.(a) ${userData.nome}`);
        
        // Aqui você pode adicionar a lógica para armazenar o usuário no contexto ou no local storage
        login(userData);  // Supondo que você tem uma função 'login' no contexto de autenticação para salvar o estado do usuário
  
        // Redireciona para a página Home após o login bem-sucedido
        setRedirectToHome(true);
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data.message);
        } else {
          setError('Erro desconhecido');
        }
        console.log("Error: ", error);
      }
    };

    if (redirectToHome) {
        return <Navigate to='/Home' />;
      }

    return (
        <div className='todaPaginaL'>
      <div className='Section'>
        <div className="logotipo">
          <img src={logo} id="logo1" alt="Logo Streamix"/>
          <h2 id="logoName1">Streamix</h2>
        </div>
        <div className="inputSection">
          <input
            placeholder='Email'
            type='text'
            className='input'
            id='base'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="inputSection">
          <input
            placeholder='Palavra-passe'
            type='password'
            className='input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="inputSection">
        <button id='btn' onClick={handleLogin}>Login</button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <Link to="/SignUp" className='link'>
          <p>Cria a tua conta!!</p>
        </Link>
      </div>
    </div>
  );
}

export default Login;
