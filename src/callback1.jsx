
import './App.css';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import ReactGA from "react-ga4";


function Callback1() {

  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();


  function getToken() {

    const param1 = searchParams.get("code");

    if (process.env.REACT_APP_GA_ID) {
      ReactGA.event({ action: 'get token', category: 'get token' });
    }
    

    if (!param1) {
      toast.error('no code received. Redirecting to root...');
      navigate('/');
    }
    else {
      console.log("code is:" + param1);
    
      let url = '/api/token';

      const params = new URLSearchParams()
      params.append('grant_type', 'authorization_code');
      params.append('code', param1);
      params.append('redirect_uri', process.env.REACT_APP_NOTIFY_REDIRECT_URI);
      params.append('client_id', process.env.REACT_APP_NOTIFY_CLIENT_ID);
      params.append('client_secret', process.env.REACT_APP_NOTIFY_CLIENT_SECRET);

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },

      }

      //POST to LINE Notify API
      axios.post(url, params, config, { withCredentials: false })
        .then((result) => {
          if (result.status == 200) {
            toast.success('Access Token Acquired');
            localStorage.setItem('notify_token', result.data.access_token);
            document.getElementById("btnToken").style.display = 'none';
            document.getElementById("msg1").style.display = 'block';
            document.getElementById("btnDeleteToken").style.display = 'block';
          }
          else  {
            toast.error('Failed to get Access Token');
          }


        })
        .catch((err) => {
          toast.error('Failed to get Access Token');
          console.log(JSON.stringify(err));
        })
    }


  }
  function sendMsg() {

    if (process.env.REACT_APP_GA_ID) {
      ReactGA.event({ action: 'send notif', category: 'send notif' });
    }

    let toSend = document.getElementById('text1').value;

    if (!toSend) {
      toast.error('cannot send null value');
    }
    else {

      let url = '/api/notify'

      const params = new URLSearchParams()
      params.append('message', toSend);

      let token1 = localStorage.getItem('notify_token');
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + token1,
        },
        withCredentials: false,
      }

      //POST to LINE Notify
      axios.post(url, params, config, { withCredentials: false })
        .then((result) => {
          if (result.status == 200) {
            toast.success('Notification sent');
          }
          else {
            toast.error('error sending notification');
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        })


    }
  }

  function deleteToken() {

    if (process.env.REACT_APP_GA_ID) {
      ReactGA.event({ action: 'delete token', category: 'delete token' });
    }

    let url = '/api/revoke'

    const params = new URLSearchParams()

    let token1 = localStorage.getItem('notify_token');
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token1,
      },
      withCredentials: false,
    }

    axios.post(url, params, config, { withCredentials: false })
      .then((result) => {
        if (result.status == 200) {
          toast.success('Token Revoked');

        }
        else {
          toast.error('Error revoking token');
        }
        localStorage.clear();
        navigate('/');
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
      })


  }

  useEffect(() => {

     //GA Init
     if (process.env.REACT_APP_GA_ID) {
      ReactGA.initialize(process.env.REACT_APP_GA_ID);
      ReactGA.send({ hitType: "pageview", page: "/callback01" });

    }
    axios.defaults.withCredentials = false;

    const paramAccToken = localStorage.getItem('notify_token');

    if (!paramAccToken) {
      document.getElementById("btnDeleteToken").style.display = 'none';
      document.getElementById("msg1").style.display = 'none';
    }
    else {
      document.getElementById("btnToken").style.display = 'none';
    }


  }, [])
  return (
    <div className="App">
      <ToastContainer />
      <header className="App-header">        
        <p>
          Callback Page
        </p>
        <Button id="btnToken" variant='primary' onClick={() => getToken()}>Get Token</Button>

        <div id="msg1">
          <label for="exampleFormControlTextarea1" class="form-label">Type your notification below</label>
          <textarea id="text1" className="form-control m-2" rows="3"></textarea>
          <Button variant='primary' onClick={() => sendMsg()}>Send Notification</Button>
        </div>
        <Button id="btnDeleteToken" className='mt-2' variant='primary' onClick={() => deleteToken()}>Delete Access Token</Button>

      </header>
    </div>
  );
}

export default Callback1;
