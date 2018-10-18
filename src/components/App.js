import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import Login from "./Login";
import sampleFishes from "../sample-fishes";
import Fish from "./Fish";
import base from "../base";

class App extends React.Component {
  state = {
    fishes: {},
    order: {}
  };

  static propTypes = {
    match: PropTypes.object
  };

  componentDidMount() {
    const { params } = this.props.match;
    //1. Reinstate our localstorage
    const localStorageRef = localStorage.getItem(params.storeId);
    console.log("Restoring");
    console.log("LocalStorageRef", JSON.parse(localStorageRef));

    if (localStorageRef) {
      this.setState({ order: JSON.parse(localStorageRef) });
    }

    this.ref = base.syncState(`${params.storeId}/fishes`, {
      context: this,
      state: "fishes"
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentDidUpdate() {
    console.log(this.state.order);
    localStorage.setItem(
      this.props.match.params.storeId,
      JSON.stringify(this.state.order)
    );
  }

  addFish = fish => {
    //1. Copy existing state
    const fishes = { ...this.state.fishes };

    //2. Add new fish to fishes variable
    fishes[`fish${Date.now()}`] = fish;
    console.log("Adding Fish... 🐠");

    //3. Set new fish object to state
    this.setState({ fishes });
  };

  updateFish = (key, updatedFish) => {
    //Take copy of current state of fishes
    const fishes = { ...this.state.fishes };
    //Update that state
    fishes[key] = updatedFish;
    //Set that to state
    this.setState({ fishes });
  };

  deleteFish = key => {
    //1.take copy of state
    const fishes = { ...this.state.fishes };
    //2.delete the fish
    fishes[key] = null;
    //3.update the state
    this.setState({ fishes });
  };

  loadSampleFishes = () => {
    this.setState({ fishes: sampleFishes });
  };

  addToOrder = key => {
    //1. Take copy of state
    const order = { ...this.state.order };

    //2. Either add to order or update number in order
    order[key] = order[key] + 1 || 1;
    //3. Call setState to update state object
    this.setState({ order });
  };

  removeOrder = key => {
    const order = { ...this.state.order };
    delete order[key];
    this.setState({ order });
  };

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key => (
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />
            ))}
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          removeOrder={this.removeOrder}
        />
        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes={this.loadSampleFishes}
          fishes={this.state.fishes}
          storeId={this.props.match.params.storeId}
        />
      </div>
    );
  }
}

export default App;
