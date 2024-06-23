import './MenuDiv.css';
import logo from '../../assets/img/icons8-video-96.png';
import radio from '../../assets/img/icons8-rádio-50.png';
import home from '../../assets/img/icons8-home-page-50.png';
import favorito from '../../assets/img/icons8-heart-50.png';
import notificacao from '../../assets/img/icons8-notification-50.png';
import video from '../../assets/img/icons8-imac-50.png';
import audio from '../../assets/img/icons8-music-library-50.png';
import perfil from '../../assets/img/icons8-user-50.png';

import sair from "../../assets/img/sair.png";
import { useAuth } from '../../hooks/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

function MenuDiv() {
  // Usando o hook useAuth para obter os dados do usuário logado
const { user, logout } = useAuth();
const navigate = useNavigate(); // Hook useNavigate para navegação


  const [scrollY, setScrollY] = useState(0);
  const windowHeight = window.innerHeight;
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const handleLogout = () => {
 
  alert("Até já Sr(a). "+user.nome);
  navigate('/Login'); // Redireciona para a tela de login após o logout
};



  return (
    <motion.div
      className='BarraMenu'
      style={{ 
        transform: `translateY(${scrollY}px)`,
        maxHeight: windowHeight  // Aplicar altura máxima com base na altura da janela
      }}
    >
      <div className="appName">
        <img src={logo} id="logo" alt=""/>
        <h2 id="logoName">Streamix</h2>
      </div>
      
      <div className='Menu'>
        <Link to={"/Home"} className='link'>
          <div className='MenuButton'>
            <img src={home} id="iconHome" alt=""/>
            <h4 id='homeMenu'>Home</h4>
          </div>
        </Link>
        
        <div className='MenuButton'>
          <img src={favorito} id="iconFavorito" alt=""/>
          <h4 id='FavoritoMenu'>Favoritos</h4>
        </div>

        <div className='MenuButton'>
          <img src={notificacao} id="iconNotificacao" alt=""/>
          <h4 id='NotificacaoMenu'>Notificações</h4>
        </div>

        <Link to={"/Video"} className='link'>
          <div className='MenuButton'>
            <img src={video} id="iconVideo" alt=""/>
            <h4 id='VideoMenu'>Vídeos</h4>
          </div>
        </Link>

        <Link to={"/Radio"} className='link'>
          <div className='MenuButton'>
            <img src={radio} id="iconRadio" alt=""/>
            <h4 id='radioMenu'>Rádio</h4>
          </div>
        </Link>

        <Link to={"/Audio"} className='link'>
          <div className='MenuButton'>
            <img src={audio} id="iconAudio" alt=""/>
            <h4 id='AudioMenu'>Áudios</h4>
          </div>
        </Link>

        <div className='MenuButton'>
          <img src={perfil} id="iconUser" alt=""/>
          <h4 id='UserMenu'>Perfil</h4>
        </div>

        <div className='MenuButton' onClick={handleLogout}>
          <img src={sair} id="iconSair" alt=""/>
          <h4 id='UserMenu'>Sair</h4>
        </div>
      </div>
      
      
    </motion.div>
  );
}

export default MenuDiv;
