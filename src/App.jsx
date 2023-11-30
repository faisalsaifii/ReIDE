import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'

const App = () => {
  const [showCodeWindow, setShowCodeWindow] = useState(true)
  const [showInputWindow, setShowInputWindow] = useState(true)
  const [showOutputWindow, setShowOutputWindow] = useState(true)

  const [code, setCode] = useState(localStorage.getItem('code') || '')
  const [input, setInput] = useState(localStorage.getItem('input') || '')
  const [output, setOutput] = useState(localStorage.getItem('output') || '')
  const [languageId, setLanguageId] = useState(
    localStorage.getItem('language_id') || 71
  );

  useEffect(() => {
    localStorage.setItem('code', code);
    localStorage.setItem('output', output);
    localStorage.setItem('language_id', languageId);
    localStorage.setItem('input', input);
  }, [code, languageId, input, output])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      language_id: languageId,
      source_code: btoa(code),
      stdin: btoa(input)
    })
    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions',
      params: {
        base64_encoded: 'true',
        wait: 'true',
        fields: '*'
      },
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      data: {
        language_id: languageId,
        source_code: btoa(code),
        stdin: btoa(input)
      }
    };
    try {
      const response = await axios.request(options);
      setOutput(atob(response.data["stdout"]));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className='top'>
        <button className='nav-btn' onClick={() => setShowCodeWindow(!showCodeWindow)}>Code</button>
        <button className='nav-btn' onClick={() => setShowInputWindow(!showInputWindow)}>Input</button>
        <button className='nav-btn' onClick={() => setShowOutputWindow(!showOutputWindow)}>Output</button>
      </div>
      <div className='container'>
        {
          showCodeWindow && (<div className='left'>
            <textarea name='input' className='code-box' value={code} onChange={e => setCode(e.target.value)} placeholder='Code here' />
          </div>)
        }

        <div className='right'>

          {
            showOutputWindow && (<textarea name='output' className='output-box' value={output} onChange={e => setOutput(e.target.value)} placeholder='Output' />)
          }
          {
            showInputWindow && (<textarea name='input' className='input-box' value={input} onChange={e => setInput(e.target.value)} placeholder='Input' />)
          }

          <div>
            <select onChange={e => setLanguageId(e.target.value)} value={languageId}>
              <option value='71'>Python</option>
              <option value='54'>C++</option>
              <option value='50'>C</option>
              <option value='62'>Java</option>
            </select>
            <button onClick={handleSubmit}>Run</button>

          </div>

        </div>
      </div>


    </>
  )
}

export default App
