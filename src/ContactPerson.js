import React, { Component } from 'react';
import './App.css';

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

  onDelete() {
    const { onDelete, firstName, lastName } = this.props;
    onDelete(firstName, lastName);
  }

  onEdit() {
    this.setState({ isEdit: true });
  }

  onEditSubmit(event) {
    event.preventDefault();

    this.props.onEditSubmit(this.firstNameInput.value, this.lastNameInput.value, this.preferredNameInput.value, this.emailInput.value, this.phoneNumberInput.value, this.cityInput.value, this.stateInput.value, this.zipInput.value, this.latInput.value, this.lngInput.value, this.favoriteHobbyInput.value, this.props.firstName + this.props.lastName);
  
    this.setState ({ isEdit: false });
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