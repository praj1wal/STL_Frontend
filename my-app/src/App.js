import React from "react";
import './App.css';
import Map from './components/map';
import axios from 'axios';

function App() {
  
  const [state, setState] = React.useState({
    file: '',
    data:undefined,
  });

  
  const handleFileChange = (event) => {
    setState({
      ...state,
      file: event.target.files[0],
    });
  };

  const onSubmit = (event) =>{
		event.preventDefault()
		const data = new FormData()
		let file  = state.file;
		data.append('file',file)
      		axios
        		.post(
          			"/",
				data
          			,
         		{
              headers: {
                "Content-Type":"multipart/form-data"
              }
          	}
        		)
			.then(res => {
        console.log(res.data);
        setState({
          ...state,
          data:res.data,
        })

      })
		}

  return (
    <div className="App">
      <div>
        <form onSubmit={onSubmit}>
            <input type="file" name="file"  onChange= {handleFileChange}/>
          <button>Submit File</button>
        </form>
      </div>
       <Map />
    </div>
  );
}

export default App;
