import React from 'react';
import { withTheme, withStyles } from '@material-ui/core/styles';
import MUIButton from '../components/common/button';

import BannerStyles from './registration.module.css';
import RegistrationStyles from './registration.module.css';
import {withRouter} from "react-router-dom";

const styles = theme => ({
  codeContainer: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'unset'
    },
  },
  codeText: {
    marginTop: 40, 
    marginRight: 20,
  },
  code: {
    marginTop: 20, 
    marginRight: 20,
    fontSize: 32,
    [theme.breakpoints.down('sm')]: {
      fontSize: 25
    },
  },
  
 
});

const RegistrationComplete = props => {
  const { classes } = props;
  const firstName = window.localStorage.getItem('participant')

  return (
    <div className={RegistrationStyles.container}>
      <div className={BannerStyles.Banner} />
        <div className={RegistrationStyles.contentContainer}>
          <div className={RegistrationStyles.regularTextContainer}>
          <span className={RegistrationStyles.focusText}>
            Welcome to Programmer's Week {firstName}! <br/>
          </span>
          </div>
          <br />
        </div>
    </div>
  );
};

export default withRouter(withTheme(withStyles(styles)(RegistrationComplete)));