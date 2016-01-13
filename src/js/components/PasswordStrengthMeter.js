import classnames from 'classnames';
import IconPasswordStrength from './icons/IconPasswordStrength';
import React from 'react';

const PASSWORD_INDICATOR_VALUES = 4;

const STRONG_PASSWORD_SCORE = 10;

const STRONG_PASSWORD_LENGTH = 24;
const WEAK_PASSWORD_LENGTH = 1;

const LENGTH_MULTIPLIER = 1;
const DIGIT_MULTIPLIER = 0.7;
const UPPERCASE_CHARACTER_MULTIPLIER = 1;
const SPECIAL_CHARACTER_MULTIPLIER = 1;

class PasswordStrength extends React.Component {
  getNumberOfMatches(string, pattern) {
    return (string.match(pattern) || []).length;
  }

  getPasswordStrength() {
    let password = this.props.password;

    if (!password) {
      return 0;
    }

    let score = 0;
    let lengthScore = 0;

    if (password.length >= WEAK_PASSWORD_LENGTH) {
      // Calculate the ratio of the user's password length compared to
      // STRONG_PASSWORD_LENGTH, awarding the user for exceeding the strong
      // password length.
      let ratioToStrongLength = password.length / STRONG_PASSWORD_LENGTH;
      lengthScore = ratioToStrongLength * STRONG_PASSWORD_SCORE;
    }

    let numberOfDigits = this.getNumberOfMatches(password, /\d/g);

    let numberOfUppercaseCharacters =
      this.getNumberOfMatches(password, /[A-Z]/g);

    let numberOfSpecialCharacters =
      this.getNumberOfMatches(password, /[^a-z\d]/gi);

    score += lengthScore * LENGTH_MULTIPLIER;
    score += numberOfDigits * DIGIT_MULTIPLIER;
    score += numberOfUppercaseCharacters * UPPERCASE_CHARACTER_MULTIPLIER;
    score += numberOfSpecialCharacters * SPECIAL_CHARACTER_MULTIPLIER;

    let scoreRatio = score / STRONG_PASSWORD_SCORE;

    let finalScore = Math.floor(scoreRatio * PASSWORD_INDICATOR_VALUES);

    if (finalScore > PASSWORD_INDICATOR_VALUES) {
      return PASSWORD_INDICATOR_VALUES;
    } else if (scoreRatio > 0 && finalScore === 0) {
      return 1;
    } else {
      return finalScore;
    }
  }

  render() {
    let passwordStrength = this.getPasswordStrength();

    let classes = classnames(this.props.className,
      `password-strength-${passwordStrength}`, `strength-${passwordStrength}`);

    return (
      <IconPasswordStrength supplementalClassName={classes} />
    );
  }
}

PasswordStrength.defaultProps = {
  className: 'password-strength-indicator',
  password: ''
};

PasswordStrength.propTypes = {
  className: React.PropTypes.string,
  password: React.PropTypes.string
};

module.exports = PasswordStrength;
