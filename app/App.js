/* eslint no-console: 0 */

import React from 'react';
import ReactPhoneInput from 'react-phone-input';
import 'whatwg-fetch';
import styles from './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const phone = JSON.stringify({ phone: this.refs.phoneNumber.getValue() });

    fetch('/api/phone', {
      method: 'POST',
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: phone,
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data.title);
        });
      } else {
        response.json().then((data) => {
          console.error(data);
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <div className={styles.app}>
        <h1>New York Times Health... ON YOUR PHONE!</h1>
        <label for="phoneNumber">Enter phone number:</label>
        <ReactPhoneInput defaultCountry={'us'} onlyCountries={['us']} id="phoneNumber" ref="phoneNumber" />
        <button onClick={this.onClick}>Get NYT news</button>
      </div>
    );
  }
}

export default App;
