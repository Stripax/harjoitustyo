import React from 'react';
import {useDropzone} from 'react-dropzone';

function DragDrop(props) {
    const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
        // Disable click and keydown behavior
        noClick: true,
        noKeyboard: true
      });
    
      const files = acceptedFiles.map(file => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ));
    
      return (
        <div className="container">
            <div {...getRootProps({className: 'dropzone'})}>
                <section className = "dragdrop">
                    <input {...getInputProps()} />
                    
                    <p>Raahaa tiedostot tähän</p>

                    <button type="button" onClick={open}>
                        Avaa resurssienhallinta
                    </button>
                    
                    <aside>
                        <h4>Tiedostot:</h4>
                        <ul>{files}</ul>
                    </aside>
                </section>
            </div>
        </div>
      );
    }

export default DragDrop