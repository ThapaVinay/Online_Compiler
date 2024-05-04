import React, { useContext, useState } from 'react';
import './style.css';
import EditorWindow from '../../components/dev/DevEditor';
import { Context } from '../../context/Provider';
import LanguageSelector from '../../components/dev/LanguageSelector';
import CustomInputWindow from '../../components/dev/CustomInputWindow';
import OutputWindow from '../../components/dev/OutputWindow';
import StatusReport from '../../components/dev/StatusReport';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dev() {
  const [loading, setLoading] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [outputDetails, setOutputDetails] = useState(null);
  const { codes, setCodes, language, setLanguage } = useContext(Context);

  function onLanguageChange(selectedLang) {
    setLanguage(selectedLang);
    setCodes('');
    setOutputDetails(null);
    console.log(language);
  }

  async function handleSubmit() {
    setLoading(true);

    const options = {
      method: 'POST',
      url: 'https://onecompiler-apis.p.rapidapi.com/api/v1/run',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST
      },
      data: {
        language: language?.value, 
        stdin: customInput,
        files: [
          {
            name: 'index.' + language?.value, 
            content: codes
          }
        ]
      }
    };

    try {
      const response = await axios.request(options);
      console.log("i am here ",response.data);
      setLoading(false);
      setOutputDetails(response.data);
      toast.success('Compiled successfully!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error('Something went wrong!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      });
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="Dev">
        <div className="leftContainer">
          <LanguageSelector onLanguageChange={onLanguageChange} />
          <EditorWindow onChange={setCodes} language={language?.value} code={codes} />
        </div>
        <div className="rightContainer">
          <OutputWindow outputDetails={outputDetails} />
          <CustomInputWindow customInput={customInput} setCustomInput={setCustomInput} />
          {outputDetails && <StatusReport outputDetails={outputDetails} />}
          <button className="submitButton" onClick={handleSubmit} disabled={!codes} style={{ opacity: !codes ? '0.4' : '1' }}>
            {loading ? 'Compiling...' : 'Run'}
          </button>
        </div>
      </div>
    </>
  );
}

export default Dev;
