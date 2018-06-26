import React, { Component } from 'react';
import './App.css';

// Component that allows the user to add a new contact person to the local storage
class AddContact extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  // Function that adds the new contact to storage. Passes the data to the main function to process and clears the inputs
  onSubmit(event) {
    event.preventDefault();

    this.props.onAdd(this.firstNameInput.value, this.lastNameInput.value, this.preferredNameInput.value, this.emailInput.value, this.phoneNumberInput.value, this.cityInput.value, this.stateInput.value, this.zipInput.value, this.latInput.value, this.lngInput.value, this.favoriteHobbyInput.value, this.props.firstName + this.props.lastName);
    
    fetch('https://dan-nodejs.azurewebsites.net', {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: this.firstNameInput.value,
        lastName: this.lastNameInput.value,
        preferredName: this.preferredNameInput.value,
        email: this.emailInput.value,
        phoneNumber: this.phoneNumberInput.value,
        city: this.cityInput.value,
        state: this.stateInput.value,
        zip: this.zipInput.value,
        lat: this.latInput.value,
        lng: this.lngInput.value,
        favoriteHobby: this.favoriteHobbyInput.value
      })
    })
    .then((res) => console.log(res))

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

  /*  When the user leaves the zip code field, this function will be called. This function first checks to see if the Zip Code is valid and
      then it sends a fetch request to the Node.JS server. The Node server executes a function that looks up the zip code in a JSON database of
      zip codes and then returns the City, State, Lat and Long data. If the City, State, Lat and Lng fields are empty, they will be auto-populated
      with the data returned from the server.
  */
  onBlur() {
    let zipCode = this.zipInput.value;
    let isValidZip = /^\b\d{5}(-\d{4})?\b$/.test(zipCode);
    if (!isValidZip) {
      alert('The zip is invalid, please re-enter');
    } else {
      fetch('https://dan-nodejs.azurewebsites.net/zip', {
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
  }

  // Creates the HTML for the form that is filled out by the users to add a new contact
  render() {
    return (
      <div className="add-new">
        <h2>Add New Contact</h2>
        <form className="add-contact" onSubmit = {this.onSubmit}>
          
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
