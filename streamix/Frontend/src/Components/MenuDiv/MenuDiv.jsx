import './MenuDiv.css';
import logo from '../../assets/img/icons8-video-96.png';
import radio from '../../assets/img/icons8-rádio-50.png';
import home from '../../assets/img/icons8-home-page-50.png';
import favorito from '../../assets/img/icons8-heart-50.png';
import notificacao from '../../assets/img/icons8-notification-50.png';
import video from '../../assets/img/icons8-imac-50.png';
import audio from '../../assets/img/icons8-music-library-50.png';
import perfil from '../../assets/img/icons8-user-50.png';
import user from '../../assets/img/perfil.jpeg';
function MenuDiv() {
  return (
    
        <div className='BarraMenu'>
            <div className="appName">
                <img src={logo} id="logo" alt=""/>
                <h2 id="logoName">Streamix</h2>
            </div>
            
            <div className='Menu'>
                <div className='MenuButton'>
                    <img src={home} id="iconHome" alt=""/>
                    <h4 id='homeMenu'>Home</h4>
                </div>
                <div className='MenuButton'>
                    <img src={favorito} id="iconFavorito" alt=""/>
                    <h4 id='FavoritoMenu'>Favoritos</h4>
                </div>
                <div className='MenuButton'>
                    <img src={notificacao} id="iconNotificacao" alt=""/>
                    <h4 id='NotificacaoMenu'>Notificações</h4>
                </div>
                <div className='MenuButton'>
                    <img src={video} id="iconVideo" alt=""/>
                    <h4 id='VideoMenu'>Vídeos</h4>
                </div>
                <div className='MenuButton'>
                    <img src={radio} id="iconRadio" alt=""/>
                    <h4 id='radioMenu'>Rádio</h4>
                </div>
                <div className='MenuButton'>
                    <img src={audio} id="iconAudio" alt=""/>
                    <h4 id='AudioMenu'>Áudios</h4>
                </div>
                <div className='MenuButton'>
                    <img src={perfil} id="iconUser" alt=""/>
                    <h4 id='UserMenu'>Perfil</h4>
                </div>
            
            </div>

            <div className='Perfil'>
            <img src={user} id="FotoPerfil" alt=""/>
            </div>
        </div>

        
       
  );
}

export default MenuDiv;
