import React, { Component } from 'react';
import './App.css';
import ContactPerson from './ContactPerson.js';
import AddContact from './AddContact.js';
import Suggestions from './Suggestions.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      currentContact: 0,
      query: '',
      results: [],
    };

    this.onDelete = this.onDelete.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onEditSubmit = this.onEditSubmit.bind(this);
    this.onSort = this.onSort.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentWillMount() {
    const contacts = this.getContacts();
    this.setState({contacts});
  }

  componentDidMount() {
    const contacts = this.getContacts();
    fetch('https://mustang-index.azurewebsites.net/index.json')
    .then((results) => results.json())
    .then((data) => {
      for (let i=0; i < data.length; i++) {
        fetch(data[i].ContactURL)
          .then((res) => res.json())
          .then((contactList) => {
            contacts.push(contactList)
            console.log(contactList);
            localStorage.setItem('contacts', JSON.stringify(contacts));
          })
      }
    });
    
    console.log(contacts);
    this.setState({ contacts: JSON.parse(localStorage.getItem('contacts')) });
  }

  getContacts() {
    return this.state.contacts;
  }

  onAdd(firstName, lastName, preferredName, email, phoneNumber, city, state, zip, lat, lng, favoriteHobby) {
    const contacts = this.getContacts();

    contacts.push({
      firstName,
      lastName,
      preferredName,
      email,
      phoneNumber,
      city,
      state,
      zip,
      lat,
      lng,
      favoriteHobby
    })

    this.setState({ contacts });
  }

  onDelete(firstName, lastName) {
    const contacts = this.getContacts();

    const filteredContacts = contacts.filter(contact => {
      return contact.firstName + contact.lastName !== firstName + lastName;
    });

    this.setState({contacts: filteredContacts});
  }

  checkNull() {
    let contacts = this.getContacts();

    contacts = contacts.map(contact => {
      if (!contact.firstName) {
        contact.firstName = '';
      }
      if (!contact.lastName) {
        contact.lastName = '';
      }
      if (!contact.preferredName) {
        contact.preferredName = '';
      }
      if (!contact.email) {
        contact.email = '';
      }
      if (!contact.phoneNumber) {
        contact.phoneNumber = '';
      }
      if (!contact.city) {
        contact.city = '';
      }
      if (!contact.state) {
        contact.state = '';
      }
      if (!contact.zip) {
        contact.zip = '';
      }
      if (!contact.lat) {
        contact.lat = '';
      }
      if (!contact.lng) {
        contact.lng = '';
      }
      if (!contact.favoriteHobby) {
        contact.favoriteHobby = '';
      }
      return contact;
    });

    this.setState({ contacts });
  }

  onEditSubmit(firstName, lastName, preferredName, email, phoneNumber, city, state, zip, lat, lng, favoriteHobby, originalName) {
    let contacts = this.getContacts();

    contacts = contacts.map(contact => {
      if (contact.firstName + contact.lastName === originalName) {
        contact.firstName = firstName;
        contact.lastName = lastName;
        contact.preferredName = preferredName;
        contact.email = email;
        contact.phoneNumber = phoneNumber;
        contact.city = city;
        contact.state = state;
        contact.zip = zip;
        contact.lat = lat;
        contact.lng = lng;
        contact.favoriteHobby = favoriteHobby;
      }
      return contact;
    });

    this.setState({ contacts });
  }

  onSort(event, sortKey) {
    const contacts = this.getContacts();
    this.checkNull();
    contacts.sort((a,b) => a[sortKey].localeCompare(b[sortKey]));
    this.setState({ contacts });
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value.toLowerCase()
    }, () => {
      if (this.state.query && this.state.query.length > 0) {
        this.onSearch()
      } else if (!this.state.query) {
        this.setState({results: []});
      }
    });
  }

  onSearch() {
    const contacts = this.getContacts();
    
    const searchResults = contacts.filter(contact => {
      const nameConcat = contact.firstName + contact.lastName + contact.preferredName
      return (  
        nameConcat.toLowerCase().indexOf(this.state.query) >= 0
      )
    });

    this.setState({results: searchResults});

  }

  render(){
      return(
        <div className="App">
          <h1>Mustang React Contact Manager</h1>
            <div className="container">
              <AddContact
                onAdd = {this.onAdd}
              />
              <div className="search">
              <h2>Search Contacts</h2>
                <form>
                <input placeholder="Search for..." ref={input => this.search = input} onChange={this.handleInputChange} />
                <div className="suggest">
                  <Suggestions results={this.state.results} />
                </div>
                </form>
              </div>
            </div>
            <hr />
            <p className="instructions">By clicking on any of the headers in the table, you can sort the information in descending order.</p>
            <div className="contact-list">
              <div className="table">
                <div className="thead">
                  <div className="tr">
                    <div className="td" onClick={e => this.onSort(e, 'firstName')}>First Name</div>
                    <div className="td" onClick={e => this.onSort(e, 'lastName')}>Last Name</div>
                    <div className="td" onClick={e => this.onSort(e, 'preferredName')}>Preferred Name</div>
                    <div className="td" onClick={e => this.onSort(e, 'email')}>Email Address</div>
                    <div className="td" onClick={e => this.onSort(e, 'phoneNumber')}>Phone Number</div>
                    <div className="td" onClick={e => this.onSort(e, 'city')}>City</div>
                    <div className="td" onClick={e => this.onSort(e, 'state')}>State</div>
                    <div className="td" onClick={e => this.onSort(e, 'zip')}>Zip</div>
                    <div className="td" onClick={e => this.onSort(e, 'lat')}>Lat</div>
                    <div className="td" onClick={e => this.onSort(e, 'lng')}>Lng</div>
                    <div className="td" onClick={e => this.onSort(e, 'favoriteHobby')}>Favorite Hobby</div>
                    <div className="td">Edit</div>
                    <div className="td">Delete</div>
                  </div>
                </div>
                <div className="tbody">
                {
                  this.state.contacts.map(contact => {
                    return (
                      <ContactPerson
                        key = {contact.firstName + contact.lastName}
                        // ES6 Spread Operator
                        {...contact}

                        onDelete = {this.onDelete}
                        onEditSubmit = {this.onEditSubmit}
                      />
                    );
                  })
                }
                </div>
              </div>
            </div>
          }
        </div>
      );
  }
}

export default App;