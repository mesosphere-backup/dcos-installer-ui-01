import PreFlightStore from '../stores/PreFlightStore';
import DeployStore from '../stores/DeployStore';
import PostFlightStore from '../stores/PostFlightStore';

const STORE_MAP = {
  preflight: PreFlightStore,
  deploy: DeployStore,
  postflight: PostFlightStore
};

module.exports = STORE_MAP;
