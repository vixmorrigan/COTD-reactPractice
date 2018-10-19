import React from "react";
import PropTypes from "prop-types";
import firebase from "firebase";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm";
import Login from "./Login";
import base, { firebaseApp } from "../base";

class Inventory extends React.Component {
  static propTypes = {
    fishes: PropTypes.object,
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    addFish: PropTypes.func,
    loadSampleFishes: PropTypes.func
  };

  state = {
    uid: null,
    owner: null
  };

  authHandler = async authData => {
    //1. Look up current store in firebase database
    const store = await base.fetch(this.props.storeId, { context: this });
    console.log(store);
    //2. claim it if there is no owner
    if (!store.owner) {
      //save store as own
      await base.post(`${this.props.storeId}/owner`, {
        data: authData.user.uid
      });
    }
    //3. Set state of inventory to reflect current user
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.uid
    });
  };

  authenticate = provider => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler);
  };

  render() {
    // Check if logged in already
    if (!this.state.uid) {
      return <Login authenticate={this.authenticate} />;
    } else {
      return (
        <div>
          <p>Sorry - you are not the store owner!</p>
        </div>
      );
    }
    return (
      <div className="inventory">
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(key => (
          <EditFishForm
            key={key}
            index={key}
            fish={this.props.fishes[key]}
            updateFish={this.props.updateFish}
            deleteFish={this.props.deleteFish}
          />
        ))}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSampleFishes}>
          Load Sample Fishes
        </button>
      </div>
    );
  }
}

export default Inventory;
