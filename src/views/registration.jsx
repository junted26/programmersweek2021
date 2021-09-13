import React, { useState, useEffect } from 'react';
import { withTheme, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import RegistrationStyles from './common/common.module.css';
import axios from 'axios';
import BannerStyles from './registration.module.css';
import { TextField, Button, MenuItem,CircularProgress, Backdrop } from '@material-ui/core';

import CountrySelect from '../components/common/countrylist';
import {getAppInsights} from '../components/common/appInsights';


const shortid = require('shortid');

const styles = theme => ({
  column: {
    [theme.breakpoints.down('sm')]: {
      flex: 'unset'
    },
  },
  bannerText: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 'x-large',
     top: 210
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: 'x-large',
      textAlign: 'center',
      marginTop: 'unset'
    },
    [theme.breakpoints.between('md', 'lg')]: {
    }
  },
  row: {
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    },
  },
  submitButton: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      flexDirection: 'row',
      marginLeft: 10
    },
    '& button': {
      marginTop: 20,
      [theme.breakpoints.up('sm')]: {
        marginTop: 0,
      },
    }
  },
  salutationContainer: {
    padding: 10,
    [theme.breakpoints.down('sm')]: {
      display: 'flex'
    },
  },
  salutation: {
    width: 150,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
  }
});

const salutations = [
  {
    value: 'Mr.',
    label: 'Mr.'
  },
  {
    value:"Ms.",
    label:"Ms."
  },
];

const Registration = (props) => {
  useEffect(() => {
   
    let appInsights = getAppInsights();
    appInsights.trackEvent({ name: 'RegistrationRender', time: Date.now() });
  });
  const { classes } = props;
  let currentState = {};
  const submitRequest = (state) => {
    let valid = true;

    if (!state.firstName.value) {
      valid = false;
      currentState = {
        ...currentState,
        firstName: { value: '', validation: 'First name is required.' },
      };
    }

    if (!state.lastName.value) {
      valid = false;
      currentState = {
        ...currentState,
        lastName: { value: '', validation: 'Last name is required.' },
      };
    }

    if (!state.address.value) {
      valid = false;
      currentState = {
        ...currentState,
        address: { value: '', validation: 'Address is required.' },
      };
    }

    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(state.email.value)
    ) {
      valid = false;
      currentState = {
        ...currentState,
        email: { value: '', validation: 'Invalid email address.' },
      };
    }

    if (!state.phone.value) {
      valid = false;
      currentState = {
        ...currentState,
        phone: { value: '', validation: 'Please input your phone number.' },
      };
    }

    if (!salutation) {
      valid = false;
      currentState = {
        ...currentState,
        salutation: { value: '', validation: 'Salutation is required' },
      };
    }

    if (!valid) {
      setState({ ...state, ...currentState });
    }

    if (valid) {
      setState({
        ...state,
        showLoading: { value: true },
      });

      const dataParams = {
        Salutation: state.salutation.value,
        FirstName: state.firstName.value,
        LastName: state.lastName.value,
        Address: state.address.value,
        Country: state.country.value,
        Email: state.email.value,
        PhoneNumber: state.phone.value
      };

     
      setTimeout(() => {
        localStorage.setItem('participant', state.firstName.value);
        axios
          .post(
            '<put your API Management service link here>',
            JSON.stringify(dataParams),
              {
                headers: {
                  "Ocp-Apim-Subscription-Key": "<put your subscription key here>",
                  "Ocp-Apim-Trace": true
                },
                timeout: 30000
              }
          )
          .then(response => {
            console.log(response);
            if (response.status === 200){
              window.location = `/RegistrationComplete/${response.data}`;
            }
          })
          .catch(() => {
            console.log('This machine currently has problems communicating to the server. Please try again later.');
          })
          .finally(() => {
            setState({
              ...state,
              showLoading: { value: false },
            });
           
          });
      }, 1000);
    }
  };

  const [state, setState] = useState({
    firstName: { value: '', validation: '' },
    lastName:  { value: '', validation: '' },
    address: { value: '', validation: '' },
    country: { value: '', validation: '' },
    email: { value: '', validation: '' },
    phone: { value: '', validation: '' },
    phone2: { value: '', validation: '' },
    showLoading: { value: false },
    salutation: { value: '', validation: '' }
  });

  const [salutation, setSalutation]= useState("");

  const onCountryChange = (value) => {
    setState({
      ...state,
      country: { value: value, validation: '' },
    });
  };

  const handleChangeSalutation = (event) => {
    setSalutation(event.target.value);
    setState({
      ...state,
      salutation:  { value: event.target.value, validation: '' }
    });
  };

  const {
    firstName,
    lastName,
    address,
    country,
    email,
    phone,
    phone2,
    showLoading
  } = state;

  return (
    <>
      <form>
        <div className={RegistrationStyles.container}>
          <div className={BannerStyles.Banner} />
          <div className={clsx(BannerStyles.bannerText, classes.bannerText)}>Programmer's Week Registration</div>
            <div
              style={{
                alignContent: 'center',
                width: '80%',
                boxSizing: 'border-box',
              }}
            >
              <div className={clsx(BannerStyles.row, classes.row)}>
              <div className={classes.salutationContainer}>
              <TextField
               className={classes.salutation}
                  select
                  label="Salutation"
                  value={state.salutation.value}
                  onChange={handleChangeSalutation}
                  helperText={state.salutation.validation}
                  error={state.salutation.validation !== ''}
           
                  variant="outlined"
                >
                  {salutations.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                </div>
                <div className={clsx(BannerStyles.column, classes.column)}>
    
                  <TextField
                    required
                    id='outlined-required'
                    label='First Name'
                    variant='outlined'
                    error={firstName.validation !== ''}
                    helperText={firstName.validation}
                    value={firstName.value}
                    onChange={(e) => {
                      setState({
                        ...state,
                        firstName: { value: e.target.value, validation: '' },
                      });
                    }}
                  />
                </div>
                <div className={BannerStyles.column}>
                  <TextField
                    required
                    id='outlined-required'
                    label='Last Name'
                    variant='outlined'
                    value={lastName.value}
                    error={lastName.validation !== ''}
                    helperText={lastName.validation}
                    onChange={(e) => {
                      setState({
                        ...state,
                        lastName: { value: e.target.value, validation: '' },
                      });
                    }}
                  />
                </div>
              </div>
              <div className={clsx(BannerStyles.row, classes.row)}>
                <div className={clsx(BannerStyles.column, classes.column)}>
                  <TextField
                    required
                    id='outlined-required'
                    label='Address'
                    variant='outlined'
                    value={address.value}
                    error={address.validation !== ''}
                    helperText={address.validation}
                    onChange={(e) =>{
                      setState({
                        ...state,
                        address: { value: e.target.value, validation: '' },
                      });
                    }}
                  />
                </div>
                <div className={BannerStyles.column}>
                  {CountrySelect(country.value, onCountryChange)}
                </div>
              </div>

              <div className={clsx(BannerStyles.row, classes.row)}>
                <div className={BannerStyles.column}>
                <TextField
                    required
                    id='outlined-required'
                    label='Phone number'
                    variant='outlined'
                    value={phone.value}
                    error={phone.validation !== ''}
                    helperText={phone.validation}
                    onChange={(e) =>
                      setState({
                        ...state,
                        phone: { value: e.target.value, validation: '' },
                      })
                    }
                  />
                </div>
                <div className={BannerStyles.column}>
                <TextField
                    id='outlined-required'
                    label='Alternate Phone number'
                    variant='outlined'
                    value={phone2.value}
                    error={phone2.validation !== ''}
                    helperText={phone2.validation}
                    onChange={(e) =>
                      setState({
                        ...state,
                        phone2: { value: e.target.value, validation: '' },
                      })
                    }
                  />
                </div>
              </div>

              <div className={clsx(BannerStyles.row, classes.row)}>
                <div className={clsx(BannerStyles.column, classes.column)}>
                <TextField
                    required
                    id='outlined-required'
                    label='Email Address'
                    variant='outlined'
                    value={email.value}
                    error={email.validation !== ''}
                    helperText={email.validation}
                    onChange={(e) => {
                      setState({
                        ...state,
                        email: { value: e.target.value, validation: '' },
                      });
                    }}
                  />
                </div>
    
              </div>
              <div className={clsx(BannerStyles.submitButton, classes.submitButton)}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => submitRequest(state)}
                >
                  Submit
                </Button>
              </div>
            </div>
        </div>
      </form>
      {showLoading.value && (
        <div className={RegistrationStyles.loader}>
          <div
            style={{
              height: 300,
              width: 300,
              alignSelf: 'center',
            }}
          >
            <Backdrop className={classes.backdrop} open>
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
        </div>
      )}
    </>
    
  );
};

export default withTheme(withStyles(styles)(Registration));

