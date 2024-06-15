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

    const handleLogin = () => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          return firebase.firestore().collection('users').doc(user.uid).get();
        })
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            alert(`Seja Bem-Vindo Sr.(a) ${userData.nome}`);
            setRedirectToHome(true);
            
          } else {
            alert('Usuário não encontrado');
          }
        })
        .catch((error) => {
          if (error.code === 'auth/user-not-found') {
            alert('Usuário não encontrado');
          } else {
            setError(error.message);
          }
          console.log("Error: ", error.code, error.message);
        });
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
