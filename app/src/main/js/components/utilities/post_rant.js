import React, { Component } from 'react';
import PropTypes from 'prop-types';
import rantscript from '../../consts/rantscript';
import SmartArea from '../utilities/smart_area';
import { ITEM } from '../../consts/types';

class PostRant extends Component {
  constructor() {
    super();
    this.state = {
      rant_content: '',
      tags: '',
      limitCrossed: null,
      disabled: false,
    };
  }

  onPost(text, image) {
    const { auth } = this.props;
    this.setState({ disabled: true });
    rantscript
      .postRant(text, this.state.tags, auth.user.authToken, image)
      .then((res) => {
        if (!res.success) {
          this.setState({ limitCrossed: res.error });
          return;
        }
        this.setState({
          posting: false,
          rant_content: '',
          tags: '',
          limitCrossed: null,
        });
        this.props.open(ITEM.RANT.NAME, res.rant_id);
      })
      .catch(() => {
        this.setState({ posting: false });
      });
  }

  render() {
    const { auth } = this.props;
    return (
      <div
        className="modal"
      >
        <div className="post_rant_container">
          <div className="post_rant">
            <SmartArea
              onPost={(text, image) => this.onPost(text, image)}
              value={this.state.rant_content}
              onChange={text => this.setState({ rant_content: text })}
              disabled={this.state.disabled || auth.user === null}
              placeholder="The rant starts here..."
              tags={this.state.tags}
              maxChar={5000}
              onTagsChange={tags => this.setState({ tags })}
            />
            <p>{this.state.limitCrossed || ''}</p>
          </div>
        </div>
      </div>
    );
  }
}


PostRant.propTypes = {
  auth: PropTypes.object.isRequired,
  open: PropTypes.func.isRequired,
};

export default PostRant;
