import React, { Component } from 'react';
import './App.css';

// Component that process all of the individual Contacts data
class ContactPerson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,
      zipCode: ''
    };

    this.onDelete = this.onDelete.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onEditSubmit = this.onEditSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  // When the delete button is pressed, pass the name of the contact being deleted to the main function
  onDelete() {
    const { onDelete, firstName, lastName } = this.props;
    onDelete(firstName, lastName);
  }

  // When the user clicks the edit button, change the state that sets the format and allows for editing the data
  onEdit() {
    this.setState({ isEdit: true });
  }

  // When the user's edits are submitted, pass the information to the main app to save the edit and set the state back to regular
  onEditSubmit(event) {
    event.preventDefault();

    this.props.onEditSubmit(this.firstNameInput.value, this.lastNameInput.value, this.preferredNameInput.value, this.emailInput.value, this.phoneNumberInput.value, this.cityInput.value, this.stateInput.value, this.zipInput.value, this.latInput.value, this.lngInput.value, this.favoriteHobbyInput.value, this.props.firstName + this.props.lastName);
  
    this.setState ({ isEdit: false });
  }

  /*  When the user leaves the zip code field, this function will be called. This function first checks to see if the Zip Code is valid and
      then it sends a fetch request to the Node.JS server. The Node server executes a function that looks up the zip code in a JSON database of
      zip codes and then returns the City, State, Lat and Long data. If the City, State, Lat and Lng fields are empty, they will be auto-populated
      with the data returned from the server. If the City or State fields are not empty, and they do not match the new data returned by the 
      program, the user is prompted to see if they would like to overwrite the existing data.
  */
  onBlur() {
    let zipCode = this.zipInput.value;
    let isValidZip = /^\b\d{5}(-\d{4})?\b$/.test(zipCode);
    if (!isValidZip) {
      alert('The zip is invalid, please re-enter');
    } else {
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
        } else if (this.cityInput.value && this.cityInput.value !== res.city) {
          if (window.confirm("The city does not match the zip you entered, would you like to update it?")) {
            this.cityInput.value = res.city;
          } else { }
        }
        if (!this.stateInput.value) {
          this.stateInput.value = res.state;
        } else if (this.stateInput.value && this.stateInput.value !== res.state) {
          if (window.confirm("The state does not match the zip you entered, would you like to update it?")) {
            this.stateInput.value = res.state;
          } else { }
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

  /*  This renders the HTML of the individual contacts. Through some of the CSS 3 new formats, we can set classes to look and act like tables.
      I couldn't use tables here because forms cannot be split up inside of a table, but the individual parts of the form can be inside divs
      that can then be set to act like tables.
  */
  render() {
    const { firstName, lastName, preferredName, email, phoneNumber, city, state, zip, lat, lng, favoriteHobby } = this.props;
    let theReturn;
    
    if (this.state.isEdit) {
      theReturn = (
        <form className="tr" onSubmit = {this.onEditSubmit}>
          <div className="td" id="firstName"><input placeholder="First Name" ref={firstNameInput => this.firstNameInput = firstNameInput} defaultValue = {firstName} /></div>
          <div className="td"><input placeholder="Last Name" ref={lastNameInput => this.lastNameInput = lastNameInput} defaultValue = {lastName} /></div>
          <div className="td"><input placeholder="Preferred Name" ref={preferredNameInput => this.preferredNameInput = preferredNameInput} defaultValue = {preferredName} /></div>
          <div className="td"><input placeholder="E-mail" ref={emailInput => this.emailInput = emailInput} defaultValue = {email} /></div>
          <div className="td"><input placeholder="Phone Number" ref={phoneNumberInput => this.phoneNumberInput = phoneNumberInput} defaultValue = {phoneNumber} /></div>
          <div className="td"><input placeholder="City" ref={cityInput => this.cityInput = cityInput} defaultValue = {city} /></div>
          <div className="td"><input placeholder="State" ref={stateInput => this.stateInput = stateInput} defaultValue = {state} /></div>
          <div className="td"><input onBlur={this.onBlur} placeholder="Zip" ref={zipInput => this.zipInput = zipInput} defaultValue = {zip} /></div>
          <div className="td"><input placeholder="Latitude" ref={latInput => this.latInput = latInput} defaultValue = {lat} /></div>
          <div className="td"><input placeholder="Longitude" ref={lngInput => this.lngInput = lngInput} defaultValue = {lng} /></div>
          <div className="td"><input placeholder="Favorite Hobby" ref={favoriteHobbyInput => this.favoriteHobbyInput = favoriteHobbyInput} defaultValue = {favoriteHobby} /></div>
          <div className="td"><button>Save</button></div>
          <div className="td">{' '}</div>
        </form>
      );
    } else {
      theReturn = (
        <div className="tr">
          <div className="td" id="firstName">{firstName}</div>
          <div className="td">{lastName}</div>
          <div className="td">{preferredName}</div>
          <div className="td">{email}</div>
          
          <div className="td">{phoneNumber}</div>
          <div className="td">{city}</div>
          <div className="td">{state}</div>
          <div className="td">{zip}</div>
          <div className="td">{lat}</div>
          <div className="td">{lng}</div>
          <div className="td">{favoriteHobby}</div>
          <div className="td"><button onClick = {this.onEdit}>Edit</button></div>
          <div className="td"><button onClick = {this.onDelete}>Delete</button></div>
        </div>
      );
    }

    
    return (
      theReturn
      );
    }
  }

export default ContactPerson;