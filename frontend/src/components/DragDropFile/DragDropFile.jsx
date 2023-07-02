import { useState, useRef, useEffect} from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai';
import swal from 'sweetalert';

import './DragDropFile.scss'

const DragDropFile = ({ onUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([])
    const [previewFiles, setPreviewFiles] = useState([])
    const inputRef = useRef(null);
  
    // handle drag events
    const handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
        } else if (e.type === "dragleave") {
        setDragActive(false);
        }
    };

    // triggers when file is dropped in the upload box
    const handleDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // at least one file has been dropped so do something
            vailidateFiles(e.dataTransfer.files)
        }
    };

    // triggers when file is selected with click
    const handleChange = function(e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            // at least one file has been selected so do something
            vailidateFiles(e.target.files)
        }
    };

    const vailidateFiles = (files) => {
        const fileSizeLimit = 5 * 1024 * 1024;
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
        
        for(let i = 0; i < files.length; i++){
            const file = files[i];

            if(file.size > fileSizeLimit) {
                swal({
                    title:'Invalid File Size',
                    text: `File '${file.name}' size exceeds the limit (5mb). Please choose a smaller file.`,
                    icon: 'error'
                })
                setFiles([]);
                return;
            }

            if (!allowedFileTypes.includes(file.type)) {
                // Display an error message for files with unsupported types
                swal({
                    title:'Invalid File Type',
                    text: `File '${file.name}' has an unsupported file type. Only JPEG, PNG, and GIF files are allowed.`,
                    icon: 'error'
                })
                setFiles([]);
                return;
            }
        }
        setFiles(files);
        onUpload(files)
    }

    const onButtonClick = () => {
        inputRef.current.click();
      };
      
    useEffect(() => {
        if (files.length === 0) {
          setPreviewFiles([]);
          return;
        }
      
        const objectURLs = Array.from(files).map((file) => URL.createObjectURL(file));
        setPreviewFiles(objectURLs);
      
        return () => {
          objectURLs.forEach((objectURL) => URL.revokeObjectURL(objectURL));
        };
      }, [files]);

    return (
    <div id="form-file-upload" onDragEnter={handleDrag}>
       <input 
        ref={inputRef} 
        type="file" 
        id="input-file-upload" 
        multiple={true} 
        onChange={handleChange} 
        accept="image/jpeg, image/png, image/gif"
       />
      
        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
            <div>
                <AiOutlineCloudUpload />
                <p>
                    Drag and drop or 
                    <a className="upload-button" onClick={onButtonClick}>
                        browse
                    </a>
                </p>
                
            </div> 
        </label>
        { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
        <div id='ddf__preview'>
        {previewFiles.map((file,index) => {
            return (
                <img src={file} key={index} /> 
            )
        })}

       </div>
    </div>
    );
}

export default DragDropFile