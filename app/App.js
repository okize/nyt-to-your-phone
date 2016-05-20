/* eslint no-console: 0 */

import React from 'react';
import 'whatwg-fetch';
import styles from './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const phone = JSON.stringify({phone: this.refs.phoneNumber.value});
    fetch('/api/phone', {
      method: 'POST',
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: phone,
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data.phone);
        });
      } else {
        console.error('something has gone terribly wrong');
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <div className={styles.app}>
        <h1>New York Times Health... ON YOUR PHONE!</h1>
        <input type="phone" ref="phoneNumber" placeholder="Enter your phone number" />
        <button onClick={this.onClick}>Get NYT news</button>
      </div>
    );
  }
}

export default App;
