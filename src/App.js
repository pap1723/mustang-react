import React, { Component } from 'react';
import './App.css';
import ContactPerson from './ContactPerson.js';
import AddContact from './AddContact.js';
import Suggestions from './Suggestions.js';

// Main part of the React app that runs the rest of the code
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      query: '',
      results: [],
    };

    this.onDelete = this.onDelete.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onEditSubmit = this.onEditSubmit.bind(this);
    this.onSort = this.onSort.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  // Return the initial set of contacts (will be empty)
  componentWillMount() {
    const contacts = this.getContacts();
    this.setState({contacts});
  }

  // Fetch the index of contact URL's and then for each URL get the JSON for each
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
    
    // Set the state of the contact array to store locally
    this.setState({ contacts: JSON.parse(localStorage.getItem('contacts')) });
  }

  // Function to get the current contact list
  getContacts() {
    return this.state.contacts;
  }

  // Add a new contact and push it to the contacts array
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

  // When a contact is deleted, remove them from the array of contacts
  onDelete(firstName, lastName) {
    const contacts = this.getContacts();

    const filteredContacts = contacts.filter(contact => {
      return contact.firstName + contact.lastName !== firstName + lastName;
    });

    this.setState({contacts: filteredContacts});
  }

  /*  Some of the formatted JSON files are missing information and it creates null data. When trying to sort, there are errors
      and this eliminates all null data by creating an empty string instead.
  */
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

  // When a contact is edited, this function saves the information to the array
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

  // Sorts the data by the column that is clicked on by the user (calls the checkNull() function to avoid any errors)
  onSort(event, sortKey) {
    const contacts = this.getContacts();
    this.checkNull();
    contacts.sort((a,b) => a[sortKey].localeCompare(b[sortKey]));
    this.setState({ contacts });
  }

  // Used by the Search function. This returns the search term that is being typed
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

  // Allows the serach to show contacts in real time if they match any of the names to the search term
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

  /*  Function required by all React components that renders the actual data into usable HTML code. The data looks
      like HTML in places, but it has different syntax for some values and elements.
  */
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