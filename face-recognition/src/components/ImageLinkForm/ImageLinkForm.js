import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onPictureSubmit }) => {
    return (
        <div>
            <p className='f3'>
                {'Paste an image url below, which contains a face. The app shows you where is the face on the pic.'}
            </p>
            <p className='f4'>
                {'Like:'}
            </p>
            <p className='f4'>
                {'https://georgiaonline.ge/wp-content/uploads/2021/01/Who-Was-Bjorn-Ironside_-1.png'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' type='text' placeholder='Link to the image' onChange={onInputChange} />
                    <br />
                    <button className='w-50 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onPictureSubmit}>
                        Show me
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;
