/* eslint no-console: 0 */

import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ReactPhoneInput from 'react-phone-input';
import 'whatwg-fetch';
import styles from './App.css';

const style = {
  marginTop: 20
};

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
          console.log(data.log);
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
        <header>
          <h1>TelephoNY</h1>
          <h2>New York Times Health articles delivered to your voicemail</h2>
        </header>
        <article>
          <label htmlFor="phoneNumber">Enter phone number:</label>
          <ReactPhoneInput
            defaultCountry={'us'}
            onlyCountries={['us']}
            id="phoneNumber"
            ref="phoneNumber"
          />
          <RaisedButton
            label="Get NYT news!"
            onClick={this.onClick}
            style={style}
          />
        </article>
      </div>
    );
  }
}

export default App;
