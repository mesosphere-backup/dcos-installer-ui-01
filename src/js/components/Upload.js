import React from 'react';
import ReactDOM from 'react-dom';

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
    ReactDOM.findDOMNode(this.refs.uploadInput).click();
  }

  handleUpload(e) {
    this.setState({uploading: true});
    this.uploadFile(e.target.files[0]);
  }

  handleUploadFinish(e) {
    var result = e.target.result;
    if (this.props.extensions === '.csv') {
      result = this.processCSVResult(result);
    }

    this.props.onUploadFinish(result);
    this.setState({uploading: false});
  }

  processCSVResult(result) {
    return result.replace(/[\n\r]+/mg, '')
      .split(',')
      .map(function (csvValue) { return csvValue.trim(); })
      .filter(function (csvValue) { return csvValue.length > 0; })
      .join(', ');
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
      <span className="upload-link">
        <a className="is-clickable" onClick={this.handleUploadClick}>
          {displayText}
        </a>
        <input
          accept={this.props.extensions}
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
  extensions: React.PropTypes.string,
  onUploadFinish: React.PropTypes.func
};

module.exports = Upload;
