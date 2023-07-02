import { useState } from 'react';
import swal from 'sweetalert';

import './Contact.scss';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Problems downloading my file');
  const [message, setMessage] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        category: category,
        message: message
      })
    })
    .then(result => result.json())
    .then(data => {
      if(data) {
        swal({
          title: 'Message sent successfully!',
          text: 'We have received your message and will get back to you soon',
          icon:'success'
        });
        setName('');
        setEmail('');
        setCategory('Problems downloading my file');
        setMessage('');
      } else {
        swal({
          title: 'Something went wrong',
          text: 'Please try again',
          icon:'error'
        });
      }
    })
  }

  return (
    <div className='app__contact section__padding page__margin'>
      <h1 className='page__title'>Contact us</h1>
      <div className='app__contact-content'>
        <div className='app__contact-content_info'>
          <div>
            <h4>Customer Support hours</h4>
            <p>Monday - Saturday 8:00AM - 5:00 PM</p>
            <p>Holidays - Closed</p>
          </div>
          <p>support@weedigitals.com</p>
          <p>(+63) 956-935-2427</p>
          <p>Please, make sure you read the FAQ's here before contacting us. Your inquiry may be answered here.</p>
          <p>Our response time is within 24 business hours. Please, be patient, we will get back to you!</p>
          <div className='app__contact-content_faq'>
            <a>{`> Why I haven’t receive my template?`}</a>
            <a>{`> Do you have instructions on how to use the template?`}</a>
          </div>
        </div>

        <div className='app__contact-content_form'>
          <form onSubmit={sendMessage}>
            <div>
              <label htmlFor='fullName'>Full Name</label>
              <input 
                id='fullName' 
                className='custom__input' 
                type='text' 
                placeholder='Enter your first and last name' 
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='email'>Email</label>
              <input 
                id='email' 
                className='custom__input' 
                type='email' 
                placeholder='Enter your email'  
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='about'>What is your message about?</label>
              <select id='about' className='custom__input' value={category} onChange={e => setCategory(e.target.value)}>
                <option>Problems downloading my file</option>
                <option>Feedback in using template</option>
                <option>New template suggestion</option>
              </select>
            </div>
            <div>
              <label htmlFor='message'>Message</label>
              <textarea 
                id='message' 
                className='custom__input' 
                rows={10} 
                placeholder='Enter your message'
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            <button  className='custom__button' type='submit'>SUBMIT</button>
          </form>
        </div>
      </div>

    </div>
  )
}

export default Contact