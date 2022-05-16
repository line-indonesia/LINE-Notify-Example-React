
import './App.css';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer } from 'react-toastify';
import ReactGA from "react-ga4";


function Page1() {

  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  function goToOAuth() {

    if (process.env.REACT_APP_GA_ID) {
      ReactGA.event({ action: 'login', category: 'login' });
    }

    const params = new URLSearchParams();
    params.append("response_type", "code");
    params.append("client_id", process.env.REACT_APP_NOTIFY_CLIENT_ID);
    params.append("redirect_uri", process.env.REACT_APP_NOTIFY_REDIRECT_URI);
    params.append("scope", "notify");
    params.append("state", uuidv4());

    window.location.replace('https://notify-bot.line.me/oauth/authorize?' + params.toString());

  }

  useEffect(() => {

    //GA Init
    if (process.env.REACT_APP_GA_ID) {
      ReactGA.initialize(process.env.REACT_APP_GA_ID);
      ReactGA.send({ hitType: "pageview", page: "/" });

    }

    const paramAccToken = localStorage.getItem('notify_token');
    if (paramAccToken) {
      navigate('/callback01');
    }

  }, [])
  return (
    <div className="App">
      <ToastContainer />
      <header className="App-header">
        <p>
          Login Page
        </p>
        <Button id="btnLogin" variant="primary" onClick={() => goToOAuth()}>Login</Button>

      </header>      
    </div>
  );
}

export default Page1;
