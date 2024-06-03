import  { useState } from 'react';
import './SignUp.css';
import logo from '../../assets/img/icons8-video-96.png';
import firebase from '../../../firebase.js';
import axios from 'axios';

function SignUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    axios.post('http://localhost:3001/register',{
      nome: nome,
      email: email,
      tipo: tipo,
      password: password 
    }).then((response)=>
    {
      // Redirect to another page or update UI
      alert("User data saved successfully!");
    
    }).catch((error) =>{
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
      alert("Error:" + errorCode + " " + errorMessage);
    })
    
  };

  return (
    <div className='todaPaginaS'>
      <div className='SectionS'>
        <div className="logotipoS">
          <img src={logo} id="logo1S" alt="Logo do Streamix"/>
          <h2 id="logoName1S">Streamix</h2>
        </div>
        <div className="inputSectionS">
          <input
            placeholder='Nome'
            type='text'
            className='inputS'
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="inputSectionS">
          <input
            placeholder='Email'
            type='email'
            className='inputS'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="inputSectionS">
          <select
            className='inputS'
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value="" disabled>Selecione o Tipo</option>
            <option value="Gestor">Gestor</option>
            <option value="Artista">Artista</option>
          </select>
        </div>
        <div className="inputSectionS">
          <input
            placeholder='Palavra-passe'
            type='password'
            className='inputS'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="inputSectionS">
          <button id='btn' onClick={handleSignUp}>Cadastrar</button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default SignUp;
