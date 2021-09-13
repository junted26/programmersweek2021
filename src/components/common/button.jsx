import React from 'react';
import ButtonStyles from './button.module.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

const styleClasses = makeStyles({
  root: {
  width: 144,
  height: 40,
  background: "transparent linear-gradient(100deg, #61893c 0%, #40c267 46%, #87c240 100%) 0% 0% no-repeat padding-box",
  borderRadius: 20,
  color: "whitesmoke",
  opacity: 1
  }
});

const MUIButton = props => {
  const buttonStyles = styleClasses();
  return <div className={ButtonStyles.buttonContainer}>
      <Button classes={{
        root: buttonStyles.root
      }}
        onClick={props.onClick}>
        {props.text}
      </Button>
  </div>;
};

export default MUIButton;
