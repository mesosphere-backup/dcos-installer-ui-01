const SetupForm = [
  [
    {
      fieldType: 'text',
      name: 'description',
      placeholder: 'First name',
      showError: 'Setting "showError" will make a field display an error'
    },
    {
      fieldType: 'text',
      name: 'uid',
      placeholder: 'Last name',
      required: true
    }
  ],
  {
    fieldType: 'password',
    name: 'Password',
    required: true,
    showLabel: true,
    validation: function (value) {
      return value && value.length > 8;
    },
    validationErrorText: 'Password needs to be greater than 8 characters'
  },
  {
    fieldType: 'checkbox',
    value: [
      {
        name: 'isManager',
        label: 'Manager',
        checked: false
      },
      {
        name: 'isDeveloper',
        label: 'Developer',
        checked: false
      },
      {
        name: 'isSRE',
        label: 'SRE',
        checked: false
      }
    ],
    showLabel: 'What is your role?',
    name: 'role',
    validation: function (value) {
      let result = false;
      value.forEach(function (item) {
        if (item.checked) {
          result = item.checked;
        }
      });

      return result;
    },
    validationErrorText: 'Please select at least one option.'
  }
];

module.exports = SetupForm;
