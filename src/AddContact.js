import React, { Component } from 'react';
import './App.css';

class AddContact extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.onAdd(this.firstNameInput.value, this.lastNameInput.value, this.preferredNameInput.value, this.emailInput.value, this.phoneNumberInput.value, this.cityInput.value, this.stateInput.value, this.zipInput.value, this.latInput.value, this.lngInput.value, this.favoriteHobbyInput.value, this.props.firstName + this.props.lastName);

    this.firstNameInput.value = '';
    this.lastNameInput.value = '';
    this.preferredNameInput.value = '';
    this.emailInput.value = '';
    this.phoneNumberInput.value = '';
    this.cityInput.value = '';
    this.stateInput.value = '';
    this.zipInput.value = '';
    this.latInput.value = '';
    this.lngInput.value = '';
    this.favoriteHobbyInput.value = '';
  }

  onBlur() {
    let zipCode = this.zipInput.value;
    fetch('https://dan-nodejs.azurewebsites.net', {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        zip: zipCode
      })
    })
    .then((res) => res.json())
    .then((res) => {
      if (!this.cityInput.value) {
        this.cityInput.value = res.city;
      }
      if (!this.stateInput.value) {
        this.stateInput.value = res.state;
      }
      if (!this.latInput.value) {
        this.latInput.value = res.lat.toString();
      }
      if (!this.lngInput.value) {
        this.lngInput.value = res.lng.toString();
      }
      console.log(res)
    })
  }

  render() {
    return (
      <div className="add-new">
        <form className="add-contact" onSubmit = {this.onSubmit}>
          <h2>Add New Contact</h2>
          <ul className="add-form">
            <li><label>Full Name <span className="required">*</span></label>
              <input className="names" placeholder="First" ref={firstNameInput => this.firstNameInput = firstNameInput}/>
              <input className="names" placeholder="Last" ref={lastNameInput => this.lastNameInput = lastNameInput}/>
              <input className="names" placeholder="Preferred Name" ref={preferredNameInput => this.preferredNameInput = preferredNameInput}/>
            </li>
            <li><label>Email Address <span className="required">*</span></label>
              <input placeholder="E-mail" ref={emailInput => this.emailInput = emailInput}/>
            </li>
            <li><label>Phone Number</label>
              <input placeholder="Phone Number" ref={phoneNumberInput => this.phoneNumberInput = phoneNumberInput}/>
            </li>
            <li><label>Location <span className="required">*</span></label>
              <input id="zip-code" onBlur={this.onBlur} placeholder="Zip" ref={zipInput => this.zipInput = zipInput}/><br />
              <input className="location" placeholder="City" ref={cityInput => this.cityInput = cityInput}/>
              <input className="location" placeholder="State" ref={stateInput => this.stateInput = stateInput}/>
              <input className="lat-lng" placeholder="Lat." ref={latInput => this.latInput = latInput}/>
              <input className="lat-lng" placeholder="Long." ref={lngInput => this.lngInput = lngInput}/>
            </li>
            <li><label>Favorite Hobby <span className="required">*</span></label>
              <input placeholder="Hobby" ref={favoriteHobbyInput => this.favoriteHobbyInput = favoriteHobbyInput}/>
              <button>Add Contact</button>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}

export default AddContact;
