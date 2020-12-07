import React from "react";
import './App.css';
import Map from './components/map';
import axios from 'axios';

function App() {
  
  const [state, setState] = React.useState({
    files: '',
    data:undefined,
  });

  
  const handleFileChange = (event) => {
    setState({
      ...state,
      files: event.target.files,
    });
  };

  const onSubmit = (event) =>{
		event.preventDefault()
		const data = new FormData()
    let files  = state.files;
    console.log(files)
    for(var i = 0; i < files.length;i++){
      data.append(`file${i}`, files[i]);
    }
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
            <input type="file" name="files[]" multiple onChange= {handleFileChange}/>
          <button>Submit File</button>
        </form>
      </div>
       <Map />
    </div>
  );
}

export default App;
