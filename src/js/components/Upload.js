import React from 'react';

const METHODS_TO_BIND = [
  'handleUploadClick',
  'handleUpload',
  'handleUploadFinish'
];

class Upload extends React.Component {
  constructor() {
    super();

    this.state = {
      uploading: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleUploadClick(event) {
    event.preventDefault();
    React.findDOMNode(this.refs.uploadInput).click();
  }

  handleUpload(e) {
    this.setState({uploading: true});
    this.uploadFile(e.target.files[0]);
  }

  handleUploadFinish(e) {
    this.props.onUploadFinish(e.target.result);
    this.setState({uploading: false});
  }

  uploadFile(file) {
    var reader = new FileReader();

    // Listen for file to be done uploading.
    reader.onload = this.handleUploadFinish;

    // Begin to read in the file.
    reader.readAsText(file);
  }

  render() {
    let displayText = this.props.displayText;
    if (this.state.uploading) {
      displayText = 'Uploading...';
    }

    return (
      <span>
        <a className="clickable" onClick={this.handleUploadClick}>
          {displayText}
        </a>
        <input
          ref="uploadInput"
          className="hidden"
          type="file"
          onChange={this.handleUpload} />
      </span>
    );
  }
}

Upload.defaultProps = {
  displayText: 'Upload .csv',
  onUploadFinish: function () {}
};

Upload.propTypes = {
  displayText: React.PropTypes.string,
  onUploadFinish: React.PropTypes.func
};

module.exports = Upload;
